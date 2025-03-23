const { nanoid } = require('nanoid');
const Url = require('../models/Url');

/**
 * Generates a unique short code for URLs
 * @param {number} length - Length of the short code (default: 6)
 * @returns {Promise<string>} - Unique short code
 */

const generateShortCode = async (length = 6) => {
  
  const shortCode = nanoid(length); //Generate randome code using nanoid
  

  const existing = await Url.findOne({ urlCode: shortCode }); //Check if this coe already exists
  
  
  if (existing) {
    return generateShortCode(length); //If code exists, generate a new one
  }
  
  return shortCode;
};

module.exports = generateShortCode;