const mongoose = require('mongoose');

const complianceSchema = new mongoose.Schema({
  bid: { type: mongoose.Schema.Types.ObjectId, ref: 'Bid', required: true },
  result: { type: String, enum: ['PASS', 'FAIL', 'REVIEW'], required: true },
  score: { type: Number, required: true },
  checks: [{
    field: String,
    passed: Boolean,
    mandatory: Boolean,
    weight: Number,
    expected: mongoose.Schema.Types.Mixed,
    actual: mongoose.Schema.Types.Mixed,
    reason: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('Compliance', complianceSchema);
