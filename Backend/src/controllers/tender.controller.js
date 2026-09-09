const Tender = require('../models/Tender');
const HttpError = require('../utils/httpError');
const { log } = require('../services/audit.service');

async function create(req, res) {
  const { title, referenceNo, description, deadline, requirements = [] } = req.body;
  if (!title || !referenceNo) throw new HttpError(400, 'title and referenceNo are required');
  const tender = await Tender.create({ title, referenceNo, description, deadline, requirements, createdBy: req.user.sub });
  await log({ actor: req.user.sub, action: 'TENDER_CREATED', entityType: 'Tender', entityId: tender._id, metadata: { referenceNo } , ip: req.ip });
  res.status(201).json({ success: true, tender });
}

async function list(_req, res) { res.json({ success: true, tenders: await Tender.find().sort({ createdAt: -1 }) }); }
async function get(req, res) {
  const tender = await Tender.findById(req.params.id);
  if (!tender) throw new HttpError(404, 'Tender not found');
  res.json({ success: true, tender });
}
module.exports = { create, list, get };
