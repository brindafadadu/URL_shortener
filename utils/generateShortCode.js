const { nanoid } = require('nanoid');
const Url = require('../models/Url');

/**
 * Generates a unique short code for URLs
 * @param {number} length - Length of the short code (default: 6)
 * @returns {Promise<string>} - Unique short code
 */
const generateShortCode = async (length = 6) => {
  // Create a short code using nanoid
  const shortCode = nanoid(length);
  
  // Check if this code already exists in the database
  const existing = await Url.findOne({ urlCode: shortCode });
  
  // If code exists, recursively generate a new one
  if (existing) {
    return generateShortCode(length);
  }
  
  return shortCode;
};

module.exports = generateShortCode;