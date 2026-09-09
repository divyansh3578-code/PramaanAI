const mongoose = require('mongoose');

const bidderSchema = new mongoose.Schema({
  legalName: { type: String, required: true, trim: true },
  pan: { type: String, trim: true, uppercase: true },
  gstin: { type: String, trim: true, uppercase: true },
  udyamNo: { type: String, trim: true, uppercase: true },
  // Self-declared MSME scale category (drives the EMD-exemption note shown in the UI).
  udyamScale: { type: String, enum: ['Micro', 'Small', 'Medium', 'Not MSME', null], default: null },
  cin: { type: String, trim: true, uppercase: true },
  gemSellerId: { type: String, trim: true, uppercase: true },
  epfoCode: { type: String, trim: true, uppercase: true },
  email: String,
  phone: String,
  address: String,
  turnover: { type: Number, default: 0 },
  experienceYears: { type: Number, default: 0 },
  // Self-declared Make-in-India content, entered by the bidder/officer — not verified by any connector.
  makeInIndiaClass: { type: String, enum: ['Class-1', 'Class-2', null], default: null },
  makeInIndiaPercent: { type: Number, default: null },
  documents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document' }]
}, { timestamps: true });

module.exports = mongoose.model('Bidder', bidderSchema);