// routes/admin/dashboard.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../../controllers/dashboardController');

// GET /api/admin/dashboard
router.get('/', dashboardController.getDashboardStats);

module.exports = router;
