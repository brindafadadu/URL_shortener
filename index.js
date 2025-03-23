const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const urlRoutes = require('./routes/urls');
const urlController = require('./controllers/urlController');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize app
const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set up routes
app.use('/api/url', urlRoutes);

// Redirect route - needs to be at the top level
app.get('/:code', urlController.redirectToUrl);

// Basic home route
app.get('/', (req, res) => {
  res.send('URL Shortener API - See README for documentation');
});

// Define port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});