const mongoose = require('mongoose');

const verificationSchema = new mongoose.Schema({
  bidder: { type: mongoose.Schema.Types.ObjectId, ref: 'Bidder', required: true },
  checks: [{
    source: String,
    status: { type: String, enum: ['PASS', 'FAIL', 'ERROR', 'NOT_FOUND'] },
    data: mongoose.Schema.Types.Mixed,
    checkedAt: { type: Date, default: Date.now }
  }],
  identityMatch: Boolean,
  anomalies: [mongoose.Schema.Types.Mixed]
}, { timestamps: true });

module.exports = mongoose.model('Verification', verificationSchema);
