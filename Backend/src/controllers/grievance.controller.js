const crypto = require('crypto');
const Grievance = require('../models/Grievance');
const { log } = require('../services/audit.service');
const HttpError = require('../utils/httpError');

function makeReferenceNo(type) {
  const year = new Date().getFullYear();
  const suffix = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `${type === 'RTI' ? 'RTI' : 'GRV'}-${year}-${suffix}`;
}

async function create(req, res) {
  const { type, subject, description } = req.body;
  if (!['RTI', 'GRIEVANCE'].includes(type)) throw new HttpError(400, 'type must be RTI or GRIEVANCE');
  if (!subject || !description) throw new HttpError(400, 'subject and description are required');
  const grievance = await Grievance.create({
    referenceNo: makeReferenceNo(type),
    type,
    subject,
    description,
    submittedBy: req.user.sub
  });
  await log({ actor: req.user.sub, action: 'GRIEVANCE_FILED', entityType: 'Grievance', entityId: grievance._id, metadata: { type, referenceNo: grievance.referenceNo }, ip: req.ip });
  res.status(201).json({ success: true, grievance });
}

// Staff-only: browse the full ledger. A bidder/citizen can't list everyone else's filings.
async function list(req, res) {
  const filter = {};
  if (req.query.type) filter.type = req.query.type;
  if (req.query.status) filter.status = req.query.status;
  const grievances = await Grievance.find(filter).populate('submittedBy', 'name email role').sort({ createdAt: -1 }).limit(200);
  res.json({ success: true, grievances });
}

// A citizen/bidder checking on their own filed applications.
async function mine(req, res) {
  const grievances = await Grievance.find({ submittedBy: req.user.sub }).sort({ createdAt: -1 });
  res.json({ success: true, grievances });
}

async function respond(req, res) {
  const grievance = await Grievance.findById(req.params.id);
  if (!grievance) throw new HttpError(404, 'Grievance not found');
  grievance.response = req.body.response || grievance.response;
  grievance.status = req.body.status || 'RESOLVED';
  await grievance.save();
  await log({ actor: req.user.sub, action: 'GRIEVANCE_RESPONDED', entityType: 'Grievance', entityId: grievance._id, metadata: { status: grievance.status }, ip: req.ip });
  res.json({ success: true, grievance });
}

module.exports = { create, list, mine, respond };
