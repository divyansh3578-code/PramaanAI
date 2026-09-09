const mongoose = require('mongoose');

const requirementSchema = new mongoose.Schema({
  field: { type: String, required: true },
  operator: { type: String, enum: ['EQ', 'NEQ', 'GT', 'GTE', 'LT', 'LTE', 'EXISTS'], required: true },
  value: mongoose.Schema.Types.Mixed,
  mandatory: { type: Boolean, default: true },
  weight: { type: Number, default: 10 }
}, { _id: true });

const tenderSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  referenceNo: { type: String, required: true, unique: true },
  description: String,
  deadline: Date,
  requirements: [requirementSchema],
  // NIC e-Procurement node this tender was published through (e.g. "SR-TN-MAA-04"),
  // shown on the Tender Notices page next to the approved budget.
  nicNode: { type: String, trim: true },
  approvedBudget: { type: Number, default: 0 },
  status: { type: String, enum: ['DRAFT', 'PUBLISHED', 'CLOSED', 'CANCELLED'], default: 'PUBLISHED' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Tender', tenderSchema);
