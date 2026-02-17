const { verifyToken } = require('../utils/jwt');
const db = require('../models');

/**
 * Authentication middleware to verify JWT token
 * Extracts token from Authorization header and verifies it
 * Attaches user data to request object
 */
const authenticate = async (req, res, next) => {
  try {
    console.log('🔐 Auth middleware started');
    
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    console.log('🔐 Auth header:', authHeader ? 'exists' : 'missing');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('🔐 No valid auth header');
      return res.status(401).json({
        success: false,
        message: 'No token provided. Please login to continue.'
      });
    }

    // Extract token (remove 'Bearer ' prefix)
    const token = authHeader.substring(7);
    console.log('🔐 Token extracted, length:', token.length);

    // Verify token
    console.log('🔐 Verifying token...');
    const decoded = verifyToken(token);
    console.log('🔐 Token verified, userId:', decoded.userId);

    // Get user from database
    console.log('🔐 Fetching user from database...');
    const user = await db.User.findByPk(decoded.userId);
    console.log('🔐 User found:', user ? 'yes' : 'no');

    if (!user) {
      console.log('🔐 User not found in database');
      return res.status(401).json({
        success: false,
        message: 'User not found. Please login again.'
      });
    }

    // Attach user to request object
    req.user = {
      user_id: user.user_id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name
    };
    
    console.log('🔐 Auth successful, user_id:', req.user.user_id);
    next();
  } catch (error) {
    console.error('🔐 Auth error:', error.message);
    console.error('🔐 Auth error stack:', error.stack);
    return res.status(401).json({
      success: false,
      message: error.message || 'Invalid token. Please login again.'
    });
  }
};

module.exports = { authenticate };
