// routes/admin/users.js
const express = require('express');
const router = express.Router();
const adminUserController = require('../../controllers/adminUserController');

// GET /api/admin/users
router.get('/', adminUserController.getUsers);

// GET /api/admin/users/:id
router.get('/:id', adminUserController.getUserById);

// PATCH /api/admin/users/:id
router.patch('/:id', adminUserController.updateUser);

// DELETE /api/admin/users/:id
router.delete('/:id', adminUserController.deleteUser);

module.exports = router;
