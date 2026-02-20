const express = require('express');
const router = express.Router();
const db = require('../models');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticate } = require('../middleware/auth');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads/avatars');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer config — disk storage, images only, max 5MB
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `avatar_${req.user.user_id}_${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('Only image files are allowed (jpg, png, gif, webp)'));
  }
});

// POST /api/users/register
router.post('/register', async (req, res) => {
  try {
    const { first_name, last_name, email, phone_number, date_of_birth, address_line1, address_line2, city, state, country, zip_code, password } = req.body;

    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ success: false, message: 'First name, last name, email, and password are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long' });
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(password)) {
      return res.status(400).json({ success: false, message: 'Password must contain uppercase, lowercase, number, and special character' });
    }

    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists' });
    }

    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const result = await db.sequelize.transaction(async (t) => {
      const newUser = await db.User.create({
        first_name, last_name, email,
        phone_number: phone_number || null,
        date_of_birth: date_of_birth || null,
        address_line1: address_line1 || null,
        address_line2: address_line2 || null,
        city: city || null,
        state: state || null,
        country: country || null,
        zip_code: zip_code || null
      }, { transaction: t });

      await db.UserAuth.create({ user_id: newUser.user_id, password_hash }, { transaction: t });
      return newUser;
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: { user_id: result.user_id, first_name: result.first_name, last_name: result.last_name, email: result.email, created_at: result.created_at }
    });

  } catch (error) {
    console.error('Registration error:', error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ success: false, message: 'Validation error', errors: error.errors.map(e => e.message) });
    }
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ success: false, message: 'An account with this email or phone number already exists' });
    }
    res.status(500).json({ success: false, message: 'An error occurred during registration. Please try again later.' });
  }
});

// POST /api/users/avatar — Upload / replace profile picture
router.post('/avatar', authenticate, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const user = await db.User.findByPk(req.user.user_id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Delete old avatar if stored locally
    if (user.profile_picture && user.profile_picture.startsWith('/uploads/')) {
      const oldPath = path.join(__dirname, '../..', user.profile_picture);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    await user.update({ profile_picture: avatarUrl });

    res.status(200).json({ success: true, message: 'Profile picture updated successfully', profilePicture: avatarUrl });
  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to upload profile picture' });
  }
});

// DELETE /api/users/avatar — Remove profile picture
router.delete('/avatar', authenticate, async (req, res) => {
  try {
    const user = await db.User.findByPk(req.user.user_id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (user.profile_picture && user.profile_picture.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, '../..', user.profile_picture);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await user.update({ profile_picture: null });
    res.status(200).json({ success: true, message: 'Profile picture removed' });
  } catch (error) {
    console.error('Avatar delete error:', error);
    res.status(500).json({ success: false, message: 'Failed to remove profile picture' });
  }
});

// PUT /api/users/profile — Update name / phone
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { name, phone } = req.body;

    const user = await db.User.findByPk(req.user.user_id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const updates = {};
    if (name && name.trim()) {
      const parts = name.trim().split(' ');
      updates.first_name = parts[0];
      updates.last_name = parts.slice(1).join(' ') || parts[0];
    }
    if (phone !== undefined) updates.phone_number = phone || null;

    await user.update(updates);

    const fullName = `${user.first_name} ${user.last_name}`.trim();
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: { name: fullName, phone: user.phone_number }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
});

module.exports = router;

