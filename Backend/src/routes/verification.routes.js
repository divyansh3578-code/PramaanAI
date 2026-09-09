const router = require('express').Router();

const {
  start,
  runAll,
  getByBid,
  matrix,
  connectorsStatus,
  confirmAction
} = require('../controllers/verification.controller');

const asyncHandler = require('../utils/asyncHandler');
const { requireAuth, requireRole } = require('../middleware/auth');

router.use(requireAuth);

router.post(
  '/start',
  requireRole('ADMIN', 'PROCUREMENT_OFFICER'),
  asyncHandler(start)
);

router.post(
  '/run-all',
  requireRole('ADMIN', 'PROCUREMENT_OFFICER'),
  asyncHandler(runAll)
);

router.post(
  '/confirm-action',
  requireRole('ADMIN', 'PROCUREMENT_OFFICER'),
  asyncHandler(confirmAction)
);

router.get(
  '/matrix',
  requireRole('ADMIN', 'PROCUREMENT_OFFICER', 'AUDITOR'),
  asyncHandler(matrix)
);

router.get(
  '/connectors/status',
  asyncHandler(connectorsStatus)
);

router.get(
  '/bid/:bidId',
  asyncHandler(getByBid)
);

module.exports = router;