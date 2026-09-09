const Bidder = require('../models/Bidder');
const HttpError = require('../utils/httpError');
const { log } = require('../services/audit.service');

const EDITABLE_FIELDS = [
  'legalName', 'pan', 'gstin', 'udyamNo', 'udyamScale', 'cin', 'gemSellerId', 'epfoCode',
  'email', 'phone', 'address', 'turnover', 'experienceYears', 'makeInIndiaClass', 'makeInIndiaPercent'
];

function pick(body) {
  const out = {};
  for (const key of EDITABLE_FIELDS) if (body[key] !== undefined) out[key] = body[key];
  return out;
}

async function create(req, res) {
  const data = pick(req.body);
  if (!data.legalName) throw new HttpError(400, 'legalName is required');
  const bidder = await Bidder.create(data);
  await log({ actor: req.user.sub, action: 'BIDDER_CREATED', entityType: 'Bidder', entityId: bidder._id, ip: req.ip });
  res.status(201).json({ success: true, bidder });
}

async function list(_req, res) { res.json({ success: true, bidders: await Bidder.find().sort({ createdAt: -1 }) }); }

async function get(req, res) {
  const bidder = await Bidder.findById(req.params.id).populate('documents');
  if (!bidder) throw new HttpError(404, 'Bidder not found');
  res.json({ success: true, bidder });
}

// A bidder-role user viewing/editing their own company profile.
async function me(req, res) {
  if (!req.user.bidderId) throw new HttpError(404, 'No bidder profile linked to this account');
  const bidder = await Bidder.findById(req.user.bidderId).populate('documents');
  if (!bidder) throw new HttpError(404, 'Bidder profile not found');
  res.json({ success: true, bidder });
}

async function updateMe(req, res) {
  if (!req.user.bidderId) throw new HttpError(404, 'No bidder profile linked to this account');
  const bidder = await Bidder.findByIdAndUpdate(req.user.bidderId, pick(req.body), { new: true });
  if (!bidder) throw new HttpError(404, 'Bidder profile not found');
  await log({ actor: req.user.sub, action: 'BIDDER_PROFILE_UPDATED', entityType: 'Bidder', entityId: bidder._id, ip: req.ip });
  res.json({ success: true, bidder });
}

module.exports = { create, list, get, me, updateMe };