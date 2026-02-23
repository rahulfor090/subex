const express = require('express');
const router = express.Router();
const db = require('../models');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const { generateToken } = require('../utils/jwt');
const { authenticate } = require('../middleware/auth');
const passport = require('../config/passport');

// GET /api/auth/google - Initiate Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// GET /api/auth/google/callback - Google OAuth callback
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login?error=oauth_failed` }),
  (req, res) => {
    try {
      const token = generateToken(req.user.user_id);
      // Redirect to frontend with token in URL
      res.redirect(`${process.env.FRONTEND_URL}/oauth-callback?token=${token}`);
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
    }
  }
);

// GET /api/auth/twitter - Initiate Twitter OAuth
router.get('/twitter', (req, res, next) => {
  // Guard: check keys are configured
  if (!process.env.TWITTER_CONSUMER_KEY || process.env.TWITTER_CONSUMER_KEY === 'YOUR_TWITTER_CONSUMER_KEY_HERE') {
    return res.redirect(`${process.env.FRONTEND_URL}/login?error=twitter_not_configured`);
  }
  passport.authenticate('twitter', (err) => {
    if (err) {
      console.error('Twitter OAuth initiation error:', err.message);
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
    }
  })(req, res, next);
});

// GET /api/auth/twitter/callback - Twitter OAuth callback
router.get(
  '/twitter/callback',
  (req, res, next) => {
    passport.authenticate('twitter', { session: false }, (err, user) => {
      if (err || !user) {
        console.error('Twitter OAuth callback error:', err?.message || 'No user returned');
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
      }
      req.user = user;
      next();
    })(req, res, next);
  },
  (req, res) => {
    try {
      const token = generateToken(req.user.user_id);
      res.redirect(`${process.env.FRONTEND_URL}/oauth-callback?token=${token}`);
    } catch (error) {
      console.error('Twitter token generation error:', error);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
    }
  }
);

// POST /api/auth/signup - Register a new user
router.post('/signup', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password
    } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    // Split name into first and last name
    const nameParts = name.trim().split(' ');
    const first_name = nameParts[0];
    const last_name = nameParts.slice(1).join(' ') || nameParts[0];

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long'
      });
    }

    // Check if user with this email already exists
    const existingUser = await db.User.findOne({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists'
      });
    }

    // Hash the password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Create user and auth record in a transaction
    const result = await db.sequelize.transaction(async (t) => {
      // Create new user
      const newUser = await db.User.create({
        first_name,
        last_name,
        email,
        phone_number: phone || null
      }, { transaction: t });

      // Create user authentication record
      await db.UserAuth.create({
        user_id: newUser.user_id,
        password_hash: password_hash
      }, { transaction: t });

      return newUser;
    });

    // Generate JWT token for automatic login
    const accessToken = generateToken(result.user_id);

    // Send welcome email (non-blocking)
    const emailService = require('../services/email.service');
    emailService.sendWelcomeEmail(result).catch(err => {
      console.error('Failed to send welcome email:', err);
    });

    // Return success response with accessToken
    res.status(200).json({
      success: true,
      message: 'User registered successfully',
      accessToken
    });

  } catch (error) {
    console.error('Registration error:', error);

    // Handle Sequelize validation errors
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors.map(e => e.message)
      });
    }

    // Handle unique constraint errors
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        success: false,
        message: 'An account with this email or phone number already exists'
      });
    }

    // Generic error response
    res.status(500).json({
      success: false,
      message: 'An error occurred during registration. Please try again later.'
    });
  }
});

// POST /api/auth/login - User login
router.post('/login', async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    // Validate required fields
    if (!emailOrPhone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email/phone and password are required'
      });
    }

    // Find user by email or phone number
    const user = await db.User.findOne({
      where: {
        [Op.or]: [
          { email: emailOrPhone },
          { phone_number: emailOrPhone }
        ]
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Get user authentication record
    const userAuth = await db.UserAuth.findOne({
      where: { user_id: user.user_id }
    });

    if (!userAuth) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if account is locked
    if (userAuth.account_locked && userAuth.account_locked_until) {
      const now = new Date();
      const lockUntil = new Date(userAuth.account_locked_until);

      if (now < lockUntil) {
        const remainingSeconds = Math.ceil((lockUntil - now) / 1000);
        return res.status(423).json({
          success: false,
          message: `Account is locked. Please try again in ${remainingSeconds} seconds.`,
          locked: true,
          remainingSeconds
        });
      } else {
        // Lock period has expired, unlock the account
        await userAuth.update({
          account_locked: false,
          account_locked_until: null,
          failed_login_attempts: 0
        });
      }
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, userAuth.password_hash);

    if (!isPasswordValid) {
      // Increment failed login attempts
      const newFailedAttempts = (userAuth.failed_login_attempts || 0) + 1;

      if (newFailedAttempts >= 5) {
        // Lock the account for 60 seconds
        const lockUntil = new Date(Date.now() + 60 * 1000);

        await userAuth.update({
          failed_login_attempts: newFailedAttempts,
          account_locked: true,
          account_locked_until: lockUntil
        });

        return res.status(423).json({
          success: false,
          message: 'Account locked due to too many failed login attempts. Please try again in 60 seconds.',
          locked: true,
          remainingSeconds: 60
        });
      } else {
        await userAuth.update({
          failed_login_attempts: newFailedAttempts
        });

        const remainingAttempts = 5 - newFailedAttempts;
        return res.status(401).json({
          success: false,
          message: `Invalid credentials. ${remainingAttempts} attempt${remainingAttempts !== 1 ? 's' : ''} remaining.`,
          remainingAttempts
        });
      }
    }

    // Successful login - update last login and reset failed attempts
    await userAuth.update({
      last_login: new Date(),
      failed_login_attempts: 0,
      account_locked: false,
      account_locked_until: null
    });

    // Generate JWT token
    const accessToken = generateToken(user.user_id);

    // Return success response with accessToken
    res.status(200).json({
      success: true,
      accessToken
    });

  } catch (error) {
    console.error('Login error:', error);

    res.status(500).json({
      success: false,
      message: 'An error occurred during login. Please try again later.'
    });
  }
});

// POST /api/auth/logout - User logout
router.post('/logout', authenticate, async (req, res) => {
  try {
    // The authenticate middleware has already verified the token
    // In a more advanced implementation, you could add the token to a blacklist here

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);

    res.status(500).json({
      success: false,
      message: 'An error occurred during logout. Please try again later.'
    });
  }
});

// GET /api/auth/me - Get current user details
router.get('/me', authenticate, async (req, res) => {
  try {
    // req.user is set by the authenticate middleware
    const user = await db.User.findByPk(req.user.user_id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if this user has a password set (OAuth users may not)
    const userAuth = await db.UserAuth.findOne({ where: { user_id: user.user_id } });
    const hasPassword = !!(userAuth && userAuth.password_hash);

    // Also get auth details for password_updated_at
   
    res.status(200).json({
      success: true,
      data: {
        userId: user.user_id.toString(),
        name: `${user.first_name} ${user.last_name}`.trim(),
        email: user.email,
        phone: user.phone_number,
        hasPassword,
        role: user.role || 'user',
        profilePicture: user.profile_picture || null,
        date_of_birth: user.date_of_birth || null,
        address_line1: user.address_line1 || null,
        address_line2: user.address_line2 || null,
        city: user.city || null,
        state: user.state || null,
        country: user.country || null,
        zip_code: user.zip_code || null,
        passwordUpdatedAt: userAuth?.password_updated_at || null
      }
    });
  } catch (error) {
    console.error('Get user error:', error);

    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching user details.'
    });
  }
});

// POST /api/auth/set-password - Set password for first time (OAuth users)
router.post('/set-password', authenticate, async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required'
      });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long' });
    }
    if (!/[A-Z]/.test(password)) {
      return res.status(400).json({ success: false, message: 'Password must contain at least one uppercase letter' });
    }
    if (!/[a-z]/.test(password)) {
      return res.status(400).json({ success: false, message: 'Password must contain at least one lowercase letter' });
    }
    if (!/[0-9]/.test(password)) {
      return res.status(400).json({ success: false, message: 'Password must contain at least one number' });
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>\/?]/.test(password)) {
      return res.status(400).json({ success: false, message: 'Password must contain at least one special character' });
    }

    const userId = req.user.user_id;

    // Check if user already has a password
    let userAuth = await db.UserAuth.findOne({ where: { user_id: userId } });

    if (userAuth && userAuth.password_hash) {
      return res.status(400).json({
        success: false,
        message: 'Password is already set. Use the forgot password flow to change it.'
      });
    }

    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    if (userAuth) {
      // Update existing auth record
      await userAuth.update({ password_hash });
    } else {
      // Create new auth record (shouldn't happen normally, but be safe)
      await db.UserAuth.create({
        user_id: userId,
        password_hash
      });
    }

    res.status(200).json({
      success: true,
      message: 'Password set successfully'
    });
  } catch (error) {
    console.error('Set password error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while setting your password.'
    });
  }
});

/**
 * POST /api/auth/forgot-password
 * Request password reset
 */
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Import auth service
    const authService = require('../services/auth.service');
    const result = await authService.requestPasswordReset(email);

    return res.status(200).json(result);
  } catch (error) {
    console.error('Forgot password route error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * GET /api/auth/verify-reset-token/:token
 * Verify if reset token is valid
 */
router.get('/verify-reset-token/:token', async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token is required'
      });
    }

    const authService = require('../services/auth.service');
    const result = await authService.verifyResetToken(token);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('Verify reset token route error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * POST /api/auth/reset-password
 * Reset password using token
 */
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: 'Token and password are required'
      });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long'
      });
    }

    // Check for uppercase letter
    if (!/[A-Z]/.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain at least one uppercase letter'
      });
    }

    // Check for lowercase letter
    if (!/[a-z]/.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain at least one lowercase letter'
      });
    }

    // Check for number
    if (!/[0-9]/.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain at least one number'
      });
    }

    // Check for special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain at least one special character'
      });
    }

    const authService = require('../services/auth.service');
    const result = await authService.resetPassword(token, password);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('Reset password route error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});


// POST /api/auth/change-password - Change user password
router.post('/change-password', authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.user_id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current and new password are required'
      });
    }

    // Validate new password strength
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters long'
      });
    }

    // Get user auth record
    const userAuth = await db.UserAuth.findOne({
      where: { user_id: userId }
    });

    if (!userAuth) {
      return res.status(404).json({
        success: false,
        message: 'User authentication record not found'
      });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, userAuth.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect current password'
      });
    }

    // Hash new password
    const saltRounds = 10;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await userAuth.update({
      password_hash: newPasswordHash,
      password_updated_at: new Date()
    });

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while changing password'
    });
  }
});

module.exports = router;
