const router = require('express').Router();
const { register, login } = require('../controllers/auth.controller');
const asyncHandler = require('../utils/asyncHandler');
router.post('/register', asyncHandler(register));
router.post('/login', asyncHandler(login));
module.exports = router;
