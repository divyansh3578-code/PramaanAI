const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  bidder: { type: mongoose.Schema.Types.ObjectId, ref: 'Bidder', required: true },
  originalName: { type: String, required: true },
  storedName: { type: String, required: true },
  path: { type: String, required: true },
  mimeType: String,
  size: Number,
  documentType: { type: String, enum: ['GST', 'UDYAM', 'PAN', 'ITR', 'OEM', 'ESIC', 'EPFO', 'OTHER'], default: 'OTHER' },
  extractedData: mongoose.Schema.Types.Mixed,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema);
