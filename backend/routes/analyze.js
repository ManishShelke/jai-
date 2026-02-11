const express = require('express');
const { analyzeResume } = require('../controllers/analyzeController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// POST /api/analyze - Protected route
router.post('/', authenticate, (req, res, next) => {
  // Get upload middleware from app
  const upload = req.app.get('upload');
  upload.single('resume')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    analyzeResume(req, res, next);
  });
});

module.exports = router;
