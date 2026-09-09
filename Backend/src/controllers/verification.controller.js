const Bidder = require('../models/Bidder');
const Bid = require('../models/Bid');
const Tender = require('../models/Tender');
const Verification = require('../models/Verification');
const Compliance = require('../models/Compliance');
const RiskAssessment = require('../models/RiskAssessment');
const { verifyBidder } = require('../services/verification.service');
const { evaluateTender } = require('../services/compliance.service');
const { assessRisk } = require('../services/risk.service');
const { log } = require('../services/audit.service');
const HttpError = require('../utils/httpError');
const { verifyGST } = require('../connectors/gst.connector');
const { verifyUdyam } = require('../connectors/udyam.connector');
const { verifyMCA } = require('../connectors/mca.connector');
const { verifyEPFO } = require('../connectors/epfo.connector');

async function runVerificationForBid(tender, bidder, existingBid) {
  const verification = await verifyBidder(bidder);
  const complianceData = evaluateTender(tender, bidder, verification);
  const bid = existingBid || await Bid.create({ tender: tender._id, bidder: bidder._id, status: 'PROCESSING' });
  const compliance = await Compliance.create({ bid: bid._id, ...complianceData });
  const riskData = assessRisk({ compliance: complianceData, verification, bidder });
  const risk = await RiskAssessment.create({ bid: bid._id, ...riskData });
  bid.status = risk.level === 'HIGH' ? 'FLAGGED' : 'COMPLETED';
  await bid.save();
  return { bid, verification, compliance, risk };
}

async function start(req, res) {
  const bidder = await Bidder.findById(req.body.bidderId);
  const tender = await Tender.findById(req.body.tenderId);
  if (!bidder || !tender) throw new HttpError(404, 'Bidder or tender not found');
  const { bid, verification, compliance, risk } = await runVerificationForBid(tender, bidder, null);
  await log({ actor: req.user.sub, action: 'VERIFICATION_COMPLETED', entityType: 'Bid', entityId: bid._id, metadata: { verificationId: verification._id, complianceId: compliance._id, riskId: risk._id }, ip: req.ip });
  res.status(201).json({ success: true, bid, verification, compliance, risk });
}

// Runs (or re-runs) statutory verification for every bidder against one tender in a
// single batch — mirrors the seed script's loop, exposed as an API for the officer console.
async function runAll(req, res) {
  const tender = (req.body.tenderId && await Tender.findById(req.body.tenderId)) || await Tender.findOne().sort({ createdAt: -1 });
  if (!tender) throw new HttpError(404, 'No tender found to run verification against');
  const bidders = await Bidder.find();
  const results = [];
  for (const bidder of bidders) {
    const existingBid = await Bid.findOne({ tender: tender._id, bidder: bidder._id });
    if (existingBid && !req.body.rerun) { results.push({ bidderId: bidder._id, skipped: true }); continue; }
    const { bid, compliance, risk } = await runVerificationForBid(tender, bidder, existingBid);
    results.push({ bidderId: bidder._id, bidId: bid._id, result: compliance.result, riskLevel: risk.level });
  }
  await log({ actor: req.user.sub, action: 'VERIFICATION_RUN_ALL', entityType: 'Tender', entityId: tender._id, metadata: { count: results.length }, ip: req.ip });
  res.json({ success: true, tenderId: tender._id, results });
}

async function getByBid(req, res) {
  const bid = await Bid.findById(req.params.bidId).populate('tender bidder');
  if (!bid) throw new HttpError(404, 'Bid not found');
  const [verification, compliance, risk] = await Promise.all([
    Verification.findOne({ bidder: bid.bidder._id }).sort({ createdAt: -1 }),
    Compliance.findOne({ bid: bid._id }).sort({ createdAt: -1 }),
    RiskAssessment.findOne({ bid: bid._id }).sort({ createdAt: -1 })
  ]);
  res.json({ success: true, bid, verification, compliance, risk });
}

const ELIGIBILITY = { PASS_LOW: 'ELIGIBLE', REVIEW: 'SCRUTINY', HIGH_RISK: 'HIGH-RISK', FAIL: 'DISQUALIFIED' };

function deriveStatus(compliance, risk) {
  if (compliance.result === 'FAIL') return ELIGIBILITY.FAIL;
  if (risk.level === 'HIGH') return ELIGIBILITY.HIGH_RISK;
  if (compliance.result === 'REVIEW') return ELIGIBILITY.REVIEW;
  return ELIGIBILITY.PASS_LOW;
}

function checkFrom(verification, source) {
  return verification?.checks?.find(c => c.source === source) || { status: 'NOT_FOUND' };
}

// Reshapes a Bid + its latest Verification/Compliance/RiskAssessment into the row
// shape the Evaluation Matrix dashboard (BidderMatrixTable / BidderRow / Dossier) expects.
function toMatrixRow(bid, bidder, verification, compliance, risk, slNo) {
  const status = deriveStatus(compliance, risk);
  const gst = checkFrom(verification, 'GST');
  const mca = checkFrom(verification, 'MCA');
  const udyamCheck = checkFrom(verification, 'UDYAM');
  const epfo = checkFrom(verification, 'EPFO');
  const failedChecks = compliance.checks.filter(c => !c.passed);
  const discrepancy = verification?.anomalies?.[0]?.message
    || failedChecks[0]?.reason
    || 'No material discrepancy — all registry checks reconciled';

  return {
    id: `BID-${String(slNo).padStart(3, '0')}`,
    bidId: bid._id,
    slNo,
    name: bidder.legalName,
    flagged: status === ELIGIBILITY.FAIL || status === ELIGIBILITY.HIGH_RISK,
    pan: bidder.pan || '',
    gstin: bidder.gstin || '',
    cin: bidder.cin || '',
    gemId: bidder.gemSellerId || '',
    dossierId: `CPCL-VIG-${new Date(bid.createdAt).getFullYear()}-${String(slNo).padStart(3, '0')}`,
    confidence: risk.score,
    eligibility: { status, score: compliance.score },
    gst: { ok: gst.status === 'PASS', label: gst.status === 'PASS' ? 'Filed & Active' : gst.status === 'NOT_FOUND' ? 'Not on file' : 'Return Lapse', note: gst.data?.status || '' },
    mca: { ok: mca.status === 'PASS', label: mca.status === 'PASS' ? 'Active (ROC Verified)' : mca.status === 'NOT_FOUND' ? 'Not on file' : 'Struck Off (S.248)' },
    udyam: { scale: bidder.udyamScale || 'Not MSME', emd: bidder.udyamScale && bidder.udyamScale !== 'Not MSME' ? 'EMD Exempt' : null },
    epfoEsic: { ok: epfo.status === 'PASS', label: epfo.status === 'PASS' ? 'ECR Current' : epfo.status === 'NOT_FOUND' ? 'Not on file' : 'ECR Lapsed' },
    makeInIndia: { cls: bidder.makeInIndiaClass || 'Class-2', pct: bidder.makeInIndiaPercent || 0 },
    discrepancy,
  action: {
  tone:
    status === ELIGIBILITY.PASS_LOW
      ? 'approve'
      : status === ELIGIBILITY.REVIEW
        ? 'query'
        : status === ELIGIBILITY.HIGH_RISK
          ? 'review'
          : 'blacklist',

  label:
    status === ELIGIBILITY.PASS_LOW
      ? 'Approve Stage-1'
      : status === ELIGIBILITY.REVIEW
        ? 'Send Query'
        : status === ELIGIBILITY.HIGH_RISK
          ? 'Flag for Review'
          : 'Confirm Blacklist',

  status: bid.actionStatus || 'NONE',
  confirmedAt: bid.actionConfirmedAt || null,
  confirmedBy: bid.actionConfirmedBy || null
},
    checklist: compliance.checks.map(c => ({ label: c.field, status: c.passed ? 'pass' : c.mandatory ? 'fail' : 'warning', note: c.passed ? 'Verified' : c.mandatory ? 'Discrepancy Found' : 'Advisory Note' })),
    contradictions: (verification?.anomalies || []).map(a => ({ title: `${a.type.replace(/_/g, ' ')} — `, description: a.message })),
    udyamStatus: udyamCheck.status
  };
}

// GET /api/verification/matrix?tenderId=... — full evaluation cohort for the Stage-1 dashboard.
async function matrix(req, res) {
  const tender = req.query.tenderId
    ? await Tender.findById(req.query.tenderId)
    : await Tender.findOne().sort({ createdAt: -1 });
  if (!tender) return res.json({ success: true, tender: null, bidders: [] });

  const bids = await Bid.find({ tender: tender._id }).populate('bidder').sort({ createdAt: 1 });
  const rows = [];
  let slNo = 0;
  for (const bid of bids) {
    if (!bid.bidder) continue;
    slNo += 1;
    const [verification, compliance, risk] = await Promise.all([
      Verification.findOne({ bidder: bid.bidder._id }).sort({ createdAt: -1 }),
      Compliance.findOne({ bid: bid._id }).sort({ createdAt: -1 }),
      RiskAssessment.findOne({ bid: bid._id }).sort({ createdAt: -1 })
    ]);
    if (!compliance || !risk) continue;
    rows.push(toMatrixRow(bid, bid.bidder, verification, compliance, risk, slNo));
  }
  res.json({ success: true, tender: { id: tender._id, referenceNo: tender.referenceNo, title: tender.title }, bidders: rows });
}

// GET /api/verification/connectors/status — live probe of the four government registry
// connectors, used by the ConnectorGrid dashboard widget to show real latency/status.
async function connectorsStatus(_req, res) {
  const probes = [
    { name: 'GSTN', fn: verifyGST, sample: { gstin: '33AAACS5678B1Z5', legalName: 'Probe', pan: 'AAACS5678B' } },
    { name: 'UDYAM', fn: verifyUdyam, sample: { udyamNo: 'UDYAM-TN-00-0012345', legalName: 'Probe' } },
    { name: 'MCA21', fn: verifyMCA, sample: { pan: 'AAACS5678B', legalName: 'Probe' } },
    { name: 'EPFO-ESIC', fn: verifyEPFO, sample: { epfoCode: 'TNMAS0001234000', legalName: 'Probe' } }
  ];

  const connectors = await Promise.all(probes.map(async (p) => {
    const startedAt = Date.now();
    try {
      const result = await p.fn(p.sample);
      return { name: p.name, status: result.status === 'FAIL' ? 'Degraded' : 'Active', latencyMs: Date.now() - startedAt };
    } catch {
      return { name: p.name, status: 'Down', latencyMs: Date.now() - startedAt };
    }
  }));

  res.json({ success: true, connectors });
}

async function confirmAction(req, res) {
  const { bidId, action } = req.body;

  if (!bidId || !action) {
    throw new HttpError(400, 'bidId and action are required');
  }

  const allowedActions = [
    'APPROVED',
    'QUERY_SENT',
    'REVIEW_FLAGGED',
    'BLACKLIST_CONFIRMED'
  ];

  if (!allowedActions.includes(action)) {
    throw new HttpError(400, 'Invalid action');
  }

  const bid = await Bid.findById(bidId).populate('bidder tender');

  if (!bid) {
    throw new HttpError(404, 'Bid not found');
  }

  bid.actionStatus = action;
  bid.actionConfirmedAt = new Date();
  bid.actionConfirmedBy = req.user.sub;

  await bid.save();

  await log({
    actor: req.user.sub,
    action: `BID_ACTION_${action}`,
    entityType: 'Bid',
    entityId: bid._id,
    metadata: {
      bidderId: bid.bidder?._id,
      bidderName: bid.bidder?.legalName,
      tenderId: bid.tender?._id,
      action
    },
    ip: req.ip
  });

  res.json({
    success: true,
    message: 'Bid action recorded successfully',
    bid: {
      id: bid._id,
      actionStatus: bid.actionStatus,
      actionConfirmedAt: bid.actionConfirmedAt,
      actionConfirmedBy: bid.actionConfirmedBy
    }
  });
}
module.exports = {
  start,
  runAll,
  getByBid,
  matrix,
  connectorsStatus,
  confirmAction
};
