const router = require('express').Router();
const { list } = require('../controllers/audit.controller');
const asyncHandler = require('../utils/asyncHandler');
const { requireAuth, requireRole } = require('../middleware/auth');
router.use(requireAuth, requireRole('ADMIN', 'AUDITOR'));
router.get('/', asyncHandler(list));
module.exports = router;
