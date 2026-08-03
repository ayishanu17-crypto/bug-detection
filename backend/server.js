// 1. Load environment variables at the very top
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// 2. Connect to MongoDB Atlas using the URI from your .env file
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas successfully!');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Basic test route
app.get('/', (req, res) => {
  res.send('Bug Detector API is running...');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});