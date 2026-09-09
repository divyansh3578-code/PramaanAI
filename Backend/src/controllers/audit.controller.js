const AuditLog = require('../models/AuditLog');
async function list(req, res) {
  const filter = {};
  if (req.query.entityType) filter.entityType = req.query.entityType;
  if (req.query.entityId) filter.entityId = req.query.entityId;
  const logs = await AuditLog.find(filter).populate('actor', 'name email role').sort({ timestamp: -1 }).limit(200);
  res.json({ success: true, logs });
}
module.exports = { list };
