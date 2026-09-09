const mongoose = require('mongoose');

const riskSchema = new mongoose.Schema({
  bid: { type: mongoose.Schema.Types.ObjectId, ref: 'Bid', required: true },
  score: { type: Number, required: true },
  level: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], required: true },
  factors: [{ type: mongoose.Schema.Types.Mixed }]
}, { timestamps: true });

module.exports = mongoose.model('RiskAssessment', riskSchema);
