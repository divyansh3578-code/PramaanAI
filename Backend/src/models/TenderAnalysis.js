const mongoose = require('mongoose');

const RequirementSchema = new mongoose.Schema(
  {
    reqId: { type: String, required: true },
    category: {
      type: String,
      enum: ['financial', 'experience', 'safety', 'legal', 'eligibility'],
      required: true,
    },
    mandatory: { type: Boolean, default: true },
    method: { type: String, enum: ['regex', 'llm'], required: true },
    confidence: { type: Number, min: 0, max: 1, required: true },
    statement: { type: String, required: true },
    source: { type: String },
  },
  { _id: false },
);

const NeedsReviewSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    resolved: { type: Boolean, default: false },
  },
  { _id: false },
);

const TenderAnalysisSchema = new mongoose.Schema(
  {
    tenderRef: { type: String, required: true, index: true },
    fileName: String,
    sourceType: String,
    pages: Number,
    docTypeGuess: String,
    llmFallback: String,
    requirements: { type: [RequirementSchema], default: [] },
    needsReview: { type: [NeedsReviewSchema], default: [] },
    publishedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['draft', 'published'], default: 'published' },
  },
  { timestamps: true },
);

module.exports = mongoose.model('TenderAnalysis', TenderAnalysisSchema);