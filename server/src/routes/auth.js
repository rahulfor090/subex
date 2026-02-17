const express = require('express');
const router = express.Router();
const db = require('../models');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const { generateToken } = require('../utils/jwt');
const { authenticate } = require('../middleware/auth');

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
    const accessToken = generateToken(result.user_id, result.role || 'user');

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
    const accessToken = generateToken(user.user_id, user.role || 'user');

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

    res.status(200).json({
      success: true,
      data: {
        userId: user.user_id.toString(),
        name: `${user.first_name} ${user.last_name}`.trim(),
        email: user.email,
        phone: user.phone_number,
        role: user.role || 'user'
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

module.exports = router;
