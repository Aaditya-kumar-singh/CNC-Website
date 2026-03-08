const express = require('express');
const downloadController = require('../controllers/download.controller');
const { protect } = require('../middlewares/auth.middleware');
const { downloadLimiter } = require('../middlewares/rateLimit.middleware');

const router = express.Router();

// Download link requires authentication and rate limit
router.get('/:designId', protect, downloadLimiter, downloadController.getDownloadLink);

module.exports = router;
