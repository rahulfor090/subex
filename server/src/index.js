const express = require('express');
require('dotenv').config();
const db = require('./models');
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const subscriptionRoutes = require('./routes/subscription');

// Admin routes
const adminDashboardRoutes = require('./routes/admin/dashboard');
const adminUserRoutes = require('./routes/admin/users');
const adminPlanRoutes = require('./routes/admin/plans');
const adminTransactionRoutes = require('./routes/admin/transactions');

// Middleware
const { authenticate } = require('./middleware/auth');
const { requireRole } = require('./middleware/superAdmin');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Vite default port
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test database connection on startup
const testConnection = async () => {
  try {
    await db.sequelize.authenticate();
    console.log('✅ Database connected successfully!');

    // Sync models (alter: true adds new columns without dropping data)
    await db.sequelize.sync({ alter: true });
    console.log('✅ Database synced successfully!');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

testConnection();

// Public Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

// Admin Routes (protected with authentication + super_admin role)
app.use('/api/admin/dashboard', authenticate, requireRole('super_admin', 'admin'), adminDashboardRoutes);
app.use('/api/admin/users', authenticate, requireRole('super_admin'), adminUserRoutes);
app.use('/api/admin/plans', authenticate, requireRole('super_admin', 'admin'), adminPlanRoutes);
app.use('/api/admin/transactions', authenticate, requireRole('super_admin', 'admin'), adminTransactionRoutes);

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

// Global error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
});

module.exports = app;
