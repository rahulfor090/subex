const express = require('express');
require('dotenv').config();
const session = require('express-session');
const passport = require('./config/passport');
const db = require('./models');
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const subscriptionRoutes = require('./routes/subscription');
const companyRoutes = require('./routes/company');
const folderRoutes = require('./routes/folder');
const tagRoutes = require('./routes/tag');

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

// Session middleware (required for Passport OAuth 1.0a handshake)
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback_secret',
  resave: true,                 // Must be true — passport writes token to session
  saveUninitialized: true,      // Must be true — session must be saved BEFORE Twitter redirect
  cookie: {
    secure: false,              // false for http://localhost
    maxAge: 5 * 60 * 1000,     // 5 minutes — enough for OAuth handshake
    sameSite: 'lax'             // 'lax' allows cookie to be sent when Twitter redirects back
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

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

// Global error handlers (moved before routes to catch early errors)
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise);
  console.error('❌ Reason:', reason);
  console.error('❌ Stack:', reason.stack);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error.message);

  // OAuth/network errors from passport-twitter should NOT kill the server
  // These happen when Twitter rejects a request (bad keys, network issue, etc.)
  const isOAuthError = error.message?.includes('oauth') ||
    error.stack?.includes('oauth.js') ||
    error.stack?.includes('passport-oauth') ||
    error.stack?.includes('passport-twitter');

  if (isOAuthError) {
    console.error('⚠️  OAuth error (server will stay alive):', error.message);
    return; // Don't exit — let the request fail gracefully
  }

  // For truly fatal errors, exit
  console.error('❌ Stack:', error.stack);
  process.exit(1);
});

// Routes
try {
  console.log('📝 Registering routes...');
  app.use('/api/users', userRoutes);
  console.log('✅ User routes registered');
  app.use('/api/auth', authRoutes);
  console.log('✅ Auth routes registered');
  app.use('/api/subscriptions', subscriptionRoutes);
  console.log('✅ Subscription routes registered');
  app.use('/api/companies', companyRoutes);
  console.log('✅ Company routes registered');
  app.use('/api/folders', folderRoutes);
  console.log('✅ Folder routes registered');
  app.use('/api/tags', tagRoutes);
  console.log('✅ Tag routes registered');
  console.log('✅ All routes registered successfully');
} catch (error) {
  console.error('❌ Error registering routes:', error);
  console.error('❌ Stack:', error.stack);
  process.exit(1);
}

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
console.log('🚀 Starting server...');
const server = app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log('✅ Server started successfully - waiting for requests...');
});

// Keep server alive
server.on('close', () => {
  console.log('❌ Server closed!');
});

// Force process to stay alive (debugging mysterious exit)
const keepAlive = setInterval(() => {
  // This keeps the event loop active
}, 60000); // Check every minute

// Cleanup on exit
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down gracefully...');
  clearInterval(keepAlive);
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM, shutting down...');
  clearInterval(keepAlive);
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

module.exports = app;
