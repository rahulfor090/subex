const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../models');
const emailService = require('./email.service');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

class AuthService {
  /**
   * Register a new user
   */
  async register(userData) {
    try {
      const { first_name, last_name, email, password, phone_number } = userData;

      // Check if user already exists
      const existingUser = await db.User.findOne({ where: { email } });
      if (existingUser) {
        return {
          success: false,
          message: 'Email already registered'
        };
      }

      // Check if phone number already exists
      if (phone_number) {
        const existingPhone = await db.User.findOne({ where: { phone_number } });
        if (existingPhone) {
          return {
            success: false,
            message: 'Phone number already registered'
          };
        }
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(password, salt);

      // Create user
      const user = await db.User.create({
        first_name,
        last_name,
        email,
        phone_number,
        is_email_verified: false
      });

      // Create user authentication record
      await db.UserAuth.create({
        user_id: user.user_id,
        password_hash,
        failed_login_attempts: 0,
        account_locked: false
      });

      // Generate JWT token
      const token = jwt.sign(
        {
          user_id: user.user_id,
          email: user.email
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      // Send welcome email (non-blocking)
      emailService.sendWelcomeEmail(user).catch(err => {
        console.error('Failed to send welcome email:', err);
      });

      return {
        success: true,
        message: 'User registered successfully',
        data: {
          token,
          user: {
            user_id: user.user_id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            phone_number: user.phone_number
          }
        }
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: 'Registration failed: ' + error.message
      };
    }
  }

  /**
   * Login user
   */
  async login(email, password) {
    try {
      // Find user by email
      const user = await db.User.findOne({ where: { email } });
      if (!user) {
        return {
          success: false,
          message: 'Invalid email or password'
        };
      }

      // Get user authentication record
      const userAuth = await db.UserAuth.findOne({ where: { user_id: user.user_id } });
      if (!userAuth) {
        return {
          success: false,
          message: 'Authentication record not found'
        };
      }

      // Check if account is locked
      if (userAuth.account_locked) {
        return {
          success: false,
          message: 'Account is locked due to multiple failed login attempts. Please contact support.'
        };
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, userAuth.password_hash);
      if (!isPasswordValid) {
        // Increment failed login attempts
        await userAuth.increment('failed_login_attempts');

        // Lock account after 5 failed attempts
        if (userAuth.failed_login_attempts >= 4) { // Will be 5 after increment
          await userAuth.update({ account_locked: true });
          return {
            success: false,
            message: 'Account locked due to multiple failed login attempts'
          };
        }

        return {
          success: false,
          message: 'Invalid email or password'
        };
      }

      // Reset failed login attempts on successful login
      await userAuth.update({
        failed_login_attempts: 0,
        last_login: new Date()
      });

      // Generate JWT token
      const token = jwt.sign(
        {
          user_id: user.user_id,
          email: user.email
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      return {
        success: true,
        message: 'Login successful',
        data: {
          token,
          user: {
            user_id: user.user_id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            phone_number: user.phone_number,
            is_email_verified: user.is_email_verified
          }
        }
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Login failed: ' + error.message
      };
    }
  }

  /**
   * Verify JWT token
   */
  verifyToken(token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return {
        success: true,
        data: decoded
      };
    } catch (error) {
      return {
        success: false,
        message: 'Invalid or expired token'
      };
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(user_id) {
    try {
      const user = await db.User.findByPk(user_id);
      if (!user) {
        return {
          success: false,
          message: 'User not found'
        };
      }

      return {
        success: true,
        data: {
          user_id: user.user_id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          phone_number: user.phone_number,
          is_email_verified: user.is_email_verified
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error fetching user: ' + error.message
      };
    }
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email) {
    try {
      // Find user by email
      const user = await db.User.findOne({ where: { email } });
      if (!user) {
        // Don't reveal if email exists or not for security
        return {
          success: true,
          message: 'If an account with that email exists, a password reset link has been sent.'
        };
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

      // Save hashed token to database
      const userAuth = await db.UserAuth.findOne({ where: { user_id: user.user_id } });
      if (!userAuth) {
        return {
          success: false,
          message: 'Authentication record not found'
        };
      }

      await userAuth.update({
        password_reset_token: hashedToken,
        password_reset_expires: expiresAt
      });

      // Send password reset email
      await emailService.sendPasswordResetEmail(user, resetToken);

      return {
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.'
      };
    } catch (error) {
      console.error('Password reset request error:', error);
      return {
        success: false,
        message: 'Failed to process password reset request'
      };
    }
  }

  /**
   * Verify reset token
   */
  async verifyResetToken(token) {
    try {
      const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

      const userAuth = await db.UserAuth.findOne({
        where: {
          password_reset_token: hashedToken,
          password_reset_expires: {
            [db.Sequelize.Op.gt]: new Date()
          }
        }
      });

      if (!userAuth) {
        return {
          success: false,
          message: 'Invalid or expired reset token'
        };
      }

      return {
        success: true,
        message: 'Token is valid'
      };
    } catch (error) {
      console.error('Token verification error:', error);
      return {
        success: false,
        message: 'Failed to verify token'
      };
    }
  }

  /**
   * Reset password
   */
  async resetPassword(token, newPassword) {
    try {
      const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

      const userAuth = await db.UserAuth.findOne({
        where: {
          password_reset_token: hashedToken,
          password_reset_expires: {
            [db.Sequelize.Op.gt]: new Date()
          }
        }
      });

      if (!userAuth) {
        return {
          success: false,
          message: 'Invalid or expired reset token'
        };
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(newPassword, salt);

      // Update password and clear reset token
      await userAuth.update({
        password_hash,
        password_reset_token: null,
        password_reset_expires: null,
        failed_login_attempts: 0,
        account_locked: false
      });

      return {
        success: true,
        message: 'Password has been reset successfully'
      };
    } catch (error) {
      console.error('Password reset error:', error);
      return {
        success: false,
        message: 'Failed to reset password'
      };
    }
  }
}

module.exports = new AuthService();
