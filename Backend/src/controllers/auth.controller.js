const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Bidder = require('../models/Bidder');
const HttpError = require('../utils/httpError');
const { signToken } = require('../utils/jwt');
const { log } = require('../services/audit.service');

function tokenFor(user) {
  return signToken({
    sub: user._id.toString(),
    role: user.role,
    email: user.email,
    name: user.name,
    ...(user.bidder ? { bidderId: user.bidder.toString() } : {})
  });
}

function publicUser(user) {
  return { id: user._id, name: user.name, email: user.email, role: user.role, bidderId: user.bidder || null };
}

async function register(req, res) {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) throw new HttpError(400, 'name, email and password are required');
  const exists = await User.findOne({ email });
  if (exists) throw new HttpError(409, 'Email already registered');
  const passwordHash = await bcrypt.hash(password, 12);
  const resolvedRole = role === 'BIDDER' ? 'BIDDER' : (role || 'PROCUREMENT_OFFICER');

  let bidder = null;
  if (resolvedRole === 'BIDDER') {
    // A bidder account is always backed by a Bidder company profile, created here on first
    // registration so the account can immediately upload documents and be evaluated.
    const { legalName, pan, gstin, udyamNo, udyamScale, cin, gemSellerId, epfoCode, phone } = req.body;
    if (!legalName) throw new HttpError(400, 'legalName is required to register a bidder account');
    bidder = await Bidder.create({ legalName, pan, gstin, udyamNo, udyamScale, cin, gemSellerId, epfoCode, phone, email });
  }

  const user = await User.create({
    name,
    email,
    passwordHash,
    role: resolvedRole,
    ...(bidder ? { bidder: bidder._id } : {})
  });
  await log({ actor: user._id, action: 'USER_REGISTERED', entityType: 'User', entityId: user._id, ip: req.ip });
  res.status(201).json({ success: true, token: tokenFor(user), user: publicUser(user) });
}

async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email, active: true });
  if (!user || !(await bcrypt.compare(password || '', user.passwordHash))) throw new HttpError(401, 'Invalid email or password');
  await log({ actor: user._id, action: 'USER_LOGIN', entityType: 'User', entityId: user._id, ip: req.ip });
  res.json({ success: true, token: tokenFor(user), user: publicUser(user) });
}

module.exports = { register, login };