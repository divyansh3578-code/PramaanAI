const path = require('path');
const Document = require('../models/Document');

function inferDocumentType(filename = '') {
  const name = filename.toLowerCase();
  if (name.includes('gst')) return 'GST';
  if (name.includes('udyam') || name.includes('msme')) return 'UDYAM';
  if (name.includes('pan')) return 'PAN';
  if (name.includes('itr') || name.includes('income')) return 'ITR';
  if (name.includes('oem')) return 'OEM';
  return 'OTHER';
}

async function saveDocument({ bidder, file, uploadedBy, documentType }) {
  return Document.create({
    bidder,
    originalName: file.originalname,
    storedName: path.basename(file.filename),
    path: file.path,
    mimeType: file.mimetype,
    size: file.size,
    documentType: documentType || inferDocumentType(file.originalname),
    uploadedBy
  });
}
module.exports = { saveDocument, inferDocumentType };
