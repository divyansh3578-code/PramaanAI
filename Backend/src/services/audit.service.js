const AuditLog = require('../models/AuditLog');

async function log({ actor, action, entityType, entityId, metadata = {}, ip }) {
  return AuditLog.create({ actor, action, entityType, entityId, metadata, ip });
}

module.exports = { log };
