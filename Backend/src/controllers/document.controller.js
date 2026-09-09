const fs = require('fs');
const Bidder = require('../models/Bidder');
const Document = require('../models/Document');
const { saveDocument } = require('../services/document.service');
const { log } = require('../services/audit.service');
const HttpError = require('../utils/httpError');

// A bidder-role user may only touch documents on their own linked bidder profile;
// staff (ADMIN/PROCUREMENT_OFFICER/AUDITOR) may access any bidder's documents.
function assertCanAccessBidder(req, bidderId) {
  if (req.user.role === 'BIDDER' && req.user.bidderId !== String(bidderId)) {
    throw new HttpError(403, "Cannot access another bidder's documents");
  }
}

async function upload(req, res) {
  if (!req.file) throw new HttpError(400, 'A document file is required');
  assertCanAccessBidder(req, req.params.bidderId);
  const bidder = await Bidder.findById(req.params.bidderId);
  if (!bidder) throw new HttpError(404, 'Bidder not found');
  const doc = await saveDocument({ bidder: bidder._id, file: req.file, uploadedBy: req.user.sub, documentType: req.body.documentType });
  bidder.documents.push(doc._id);
  await bidder.save();
  await log({ actor: req.user.sub, action: 'DOCUMENT_UPLOADED', entityType: 'Document', entityId: doc._id, metadata: { bidderId: bidder._id, filename: doc.originalName }, ip: req.ip });
  res.status(201).json({ success: true, document: doc });
}

async function listForBidder(req, res) {
  assertCanAccessBidder(req, req.params.bidderId);
  const documents = await Document.find({ bidder: req.params.bidderId }).sort({ createdAt: -1 });
  res.json({ success: true, documents });
}

async function remove(req, res) {
  const doc = await Document.findById(req.params.id);
  if (!doc) throw new HttpError(404, 'Document not found');
  assertCanAccessBidder(req, doc.bidder);
  await Bidder.findByIdAndUpdate(doc.bidder, { $pull: { documents: doc._id } });
  fs.unlink(doc.path, () => {});
  await doc.deleteOne();
  await log({ actor: req.user.sub, action: 'DOCUMENT_DELETED', entityType: 'Document', entityId: doc._id, metadata: { bidderId: doc.bidder, filename: doc.originalName }, ip: req.ip });
  res.json({ success: true, deletedId: doc._id });
}

module.exports = { upload, listForBidder, remove };
