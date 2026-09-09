const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['ADMIN', 'PROCUREMENT_OFFICER', 'AUDITOR', 'BIDDER'], default: 'PROCUREMENT_OFFICER' },
  // Only set when role === 'BIDDER'. Links this login to the Bidder company profile
  // it self-registered, so req.user.bidderId can be embedded in the JWT.
  bidder: { type: mongoose.Schema.Types.ObjectId, ref: 'Bidder', default: null },
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
