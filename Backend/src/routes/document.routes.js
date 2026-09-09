const router = require('express').Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { upload, listForBidder, remove } = require('../controllers/document.controller');
const asyncHandler = require('../utils/asyncHandler');
const { requireAuth } = require('../middleware/auth');
const { uploadDir } = require('../config/env');
fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => cb(null, `${crypto.randomUUID()}${path.extname(file.originalname)}`)
});
const uploadMiddleware = multer({ storage, limits: { fileSize: 15 * 1024 * 1024 } });
router.use(requireAuth);
router.get('/bidder/:bidderId', asyncHandler(listForBidder));
router.post('/bidder/:bidderId', uploadMiddleware.single('document'), asyncHandler(upload));
router.delete('/:id', asyncHandler(remove));
module.exports = router;
