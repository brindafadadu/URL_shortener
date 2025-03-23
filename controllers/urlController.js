const validUrl = require('valid-url');
const Url = require('../models/Url');
const generateShortCode = require('../utils/generateShortCode');

// Shorten URL
// POST /api/url/shorten

exports.shortenUrl = async (req, res) => {
  const { longUrl } = req.body;
  const { alias } = req.query;
  const baseUrl = process.env.BASE_URL;

  // Check if base URL is valid
  if (!validUrl.isUri(baseUrl)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid base URL'
    });
  }

  // Check if long URL is valid
  if (!validUrl.isUri(longUrl)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid URL provided'
    });
  }

  try {
    // Check if URL already exists in the database
    let url = await Url.findOne({ longUrl });

    if (url) {
      // If alias is provided but it doesn't match current one, return error
      if (alias && url.urlCode !== alias) {
        return res.status(409).json({
          success: false,
          error: 'URL already exists with a different code'
        });
      }
      
      // Return current short URL
      return res.status(200).json(url);
    }

    let urlCode;
    
    // Handle custom alias if provided
    if (alias) {
      // Check if alias already exists
      const existingAlias = await Url.findOne({ urlCode: alias });
      if (existingAlias) {
        return res.status(409).json({
          success: false,
          error: 'Custom alias already in use'
        });
      }
      urlCode = alias;
    } else {
      // Generate unique short code
      urlCode = await generateShortCode();
    }

    // Create short URL
    const shortUrl = `${baseUrl}/${urlCode}`;

    // Create new URL entry
    url = new Url({
      longUrl,
      shortUrl,
      urlCode
    });

    await url.save();
    
    res.status(201).json(url);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

//  Redirect to original URL
//  GET /:code

exports.redirectToUrl = async (req, res) => {
  try {
    const { code } = req.params;
    
    // Find URL by code
    const url = await Url.findOne({ urlCode: code });

    if (!url) {
      return res.status(404).json({
        success: false,
        error: 'URL not found'
      });
    }

    // Check if URL has expired
    if (url.expiresAt && url.expiresAt < Date.now()) {
      return res.status(410).json({
        success: false,
        error: 'URL has expired'
      });
    }

    // Increment click count
    url.clicks++;
    await url.save();

    // Redirect to the long URL
    return res.redirect(url.longUrl);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Get URL stats
// GET /api/url/:code/stats

exports.getUrlStats = async (req, res) => {
  try {
    const { code } = req.params;
    
    // Find URL by code
    const url = await Url.findOne({ urlCode: code });

    if (!url) {
      return res.status(404).json({
        success: false,
        error: 'URL not found'
      });
    }

    // Return URL stats
    return res.status(200).json({
      urlCode: url.urlCode,
      longUrl: url.longUrl,
      shortUrl: url.shortUrl,
      clicks: url.clicks,
      createdAt: url.createdAt,
      expiresAt: url.expiresAt
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};