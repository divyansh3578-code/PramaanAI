const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  tender: { type: mongoose.Schema.Types.ObjectId, ref: 'Tender', required: true },
  bidder: { type: mongoose.Schema.Types.ObjectId, ref: 'Bidder', required: true },
  submittedAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['SUBMITTED', 'PROCESSING', 'COMPLETED', 'FLAGGED'],
    default: 'SUBMITTED'
  },

  // Final officer decision recorded from the Evaluation Matrix dossier.
  actionStatus: {
    type: String,
    enum: ['NONE', 'APPROVED', 'QUERY_SENT', 'REVIEW_FLAGGED', 'BLACKLIST_CONFIRMED'],
    default: 'NONE'
  },
  actionConfirmedAt: {
    type: Date,
    default: null
  },
  actionConfirmedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Bid', bidSchema);