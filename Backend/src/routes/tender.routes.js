const router = require('express').Router();
const { create, list, get } = require('../controllers/tender.controller');
const asyncHandler = require('../utils/asyncHandler');
const { requireAuth, requireRole } = require('../middleware/auth');
router.use(requireAuth);
router.get('/', asyncHandler(list));
router.get('/:id', asyncHandler(get));
router.post('/', requireRole('ADMIN', 'PROCUREMENT_OFFICER'), asyncHandler(create));
module.exports = router;
