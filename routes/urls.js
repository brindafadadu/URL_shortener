const express = require('express');
const router = express.Router();
const urlController = require('../controller/urlController');

// Create a short URL
router.post('/shorten', urlController.shortenUrl);

// Get URL stats
router.get('/:code/stats', urlController.getUrlStats);

module.exports = router;