const { verifyToken } = require('../utils/jwt');
const db = require('../models');
const logger = require('../utils/logger');

/**
 * Authentication middleware
 * Verifies JWT from Authorization header, attaches user to req
 * Rejects suspended/banned users
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Please login to continue.'
      });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    // Fetch user, explicitly exclude sensitive fields
    const user = await db.User.findByPk(decoded.userId, {
      attributes: { exclude: ['password_hash'] }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found. Please login again.'
      });
    }

    // Reject suspended/banned users
    if (user.status === 'suspended' || user.status === 'banned') {
      logger.warn(`Blocked request from ${user.status} user`, { userId: user.user_id, status: user.status });
      return res.status(403).json({
        success: false,
        message: `Your account has been ${user.status}. Contact support.`
      });
    }

    // Attach sanitized user data to request
    req.user = {
      user_id: user.user_id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role || 'user',
      status: user.status || 'active'
    };

    next();
  } catch (error) {
    logger.error('Auth middleware error', { error: error.message });
    return res.status(401).json({
      success: false,
      message: error.message || 'Invalid token. Please login again.'
    });
  }
};

module.exports = { authenticate };
