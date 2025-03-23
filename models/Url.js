const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  urlCode: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  longUrl: {
    type: String,
    required: true,
    trim: true
  },
  shortUrl: {
    type: String,
    required: true
  },
  clicks: {
    type: Number,
    required: true,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: () => {
      // Default expiration: 1 year from creation
      const date = new Date();
      date.setFullYear(date.getFullYear() + 1);
      return date;
    }
  }
});

// Create a compound index on longUrl for faster lookups when checking duplicates
urlSchema.index({ longUrl: 1 });

module.exports = mongoose.model('Url', urlSchema);