const mongoose = require('mongoose');

const grievanceSchema = new mongoose.Schema({
  referenceNo: { type: String, required: true, unique: true },
  type: { type: String, enum: ['RTI', 'GRIEVANCE'], required: true },
  subject: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['OPEN', 'ACKNOWLEDGED', 'RESOLVED', 'CLOSED'], default: 'OPEN' },
  response: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Grievance', grievanceSchema);
