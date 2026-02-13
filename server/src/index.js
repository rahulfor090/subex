const express = require('express');
require('dotenv').config();
const db = require('./models');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test database connection on startup
const testConnection = async () => {
  try {
    await db.sequelize.authenticate();
    console.log('✅ Database connected successfully!');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

testConnection();

// Basic health check route
app.get('/', (req, res) => {
  res.json({
    message: 'SubEx Server is running!',
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// Database health check route
app.get('/health/db', async (req, res) => {
  try {
    await db.sequelize.authenticate();
    const [results] = await db.sequelize.query('SELECT 1 as test');
    res.json({
      message: 'Database connection is healthy',
      status: 'OK',
      test: results[0]
    });
  } catch (error) {
    res.status(500).json({
      message: 'Database connection failed',
      status: 'ERROR',
      error: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
});

module.exports = app;
