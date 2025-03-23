const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const urlRoutes = require('./routes/urls');
const urlController = require('./controllers/urlController');

dotenv.config(); // Load environment variables

connectDB(); // Connect to database

const app = express(); // Initialize app

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Setting up routes
app.use('/api/url', urlRoutes);

// Redirect route - needs to be at the top level
app.get('/:code', urlController.redirectToUrl);

// Basic home route
app.get('/', (req, res) => {
  res.send('URL Shortener API is open, see README for usage');
});

// Define port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});