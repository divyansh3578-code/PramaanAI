const router = require('express').Router();
const { create, list, mine, respond } = require('../controllers/grievance.controller');
const asyncHandler = require('../utils/asyncHandler');
const { requireAuth, requireRole } = require('../middleware/auth');
router.use(requireAuth);

// A signed-in citizen/officer/bidder may file, and check on their own filings.
router.post('/', asyncHandler(create));
router.get('/mine', asyncHandler(mine));

// Staff-only oversight of the full ledger.
router.get('/', requireRole('ADMIN', 'PROCUREMENT_OFFICER', 'AUDITOR'), asyncHandler(list));
router.patch('/:id', requireRole('ADMIN', 'PROCUREMENT_OFFICER'), asyncHandler(respond));
module.exports = router;
