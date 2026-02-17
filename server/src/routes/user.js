const express = require('express');
const router = express.Router();
const db = require('../models');
const bcrypt = require('bcrypt');

// POST /api/users/register - Register a new user
router.post('/register', async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      phone_number,
      date_of_birth,
      address_line1,
      address_line2,
      city,
      state,
      country,
      zip_code,
      password
    } = req.body;

    // Validate required fields
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'First name, last name, email, and password are required'
      });
    }

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

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain uppercase, lowercase, number, and special character'
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
        phone_number: phone_number || null,
        date_of_birth: date_of_birth || null,
        address_line1: address_line1 || null,
        address_line2: address_line2 || null,
        city: city || null,
        state: state || null,
        country: country || null,
        zip_code: zip_code || null
      }, { transaction: t });

      // Create user authentication record
      await db.UserAuth.create({
        user_id: newUser.user_id,
        password_hash: password_hash
      }, { transaction: t });

      return newUser;
    });

    // Return success response (excluding sensitive data)
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: {
        user_id: result.user_id,
        first_name: result.first_name,
        last_name: result.last_name,
        email: result.email,
        created_at: result.created_at
      }
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

module.exports = router;
