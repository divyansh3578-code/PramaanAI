const router = require('express').Router();
const { create, list, get, me, updateMe } = require('../controllers/bidder.controller');
const asyncHandler = require('../utils/asyncHandler');
const { requireAuth, requireRole } = require('../middleware/auth');
router.use(requireAuth);

// Bidder self-service — must come before /:id so "me" isn't parsed as an ObjectId.
router.get('/me', asyncHandler(me));
router.patch('/me', asyncHandler(updateMe));

// Listing the full cohort is staff-only (officers/admins/auditors evaluating bids),
// not something a bidder account should be able to browse.
router.get('/', requireRole('ADMIN', 'PROCUREMENT_OFFICER', 'AUDITOR'), asyncHandler(list));
router.get('/:id', requireRole('ADMIN', 'PROCUREMENT_OFFICER', 'AUDITOR'), asyncHandler(get));
router.post('/', requireRole('ADMIN', 'PROCUREMENT_OFFICER'), asyncHandler(create));
module.exports = router;
