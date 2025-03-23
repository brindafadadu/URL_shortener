const express = require('express');
const router = express.Router();
const urlController = require('../controllers/urlController');

// Create a short URL
router.post('/shorten', urlController.shortenUrl);

// Get URL statistics
router.get('/:code/stats', urlController.getUrlStats);

module.exports = router;