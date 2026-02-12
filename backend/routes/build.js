const express = require('express');
const { buildResumeController } = require('../controllers/buildController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// POST /api/build - Protected route
router.post('/', authenticate, buildResumeController);

module.exports = router;
