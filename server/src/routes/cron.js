const express = require('express');
const router = express.Router();
const CronService = require('../services/cron.service');

// Middleware to secure the cron endpoint
// Middleware to secure the cron endpoint
const secureCron = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const queryKey = req.query.key;
    const secretKey = process.env.CRON_SECRET_KEY;

    // Check Header (Bearer) OR Query Parameter
    const isValidHeader = authHeader && authHeader.startsWith('Bearer ') && authHeader.split(' ')[1] === secretKey;
    const isValidQuery = queryKey === secretKey;

    if (!isValidHeader && !isValidQuery) {
        return res.status(401).json({ success: false, message: 'Unauthorized: Invalid Cron Secret' });
    }
    next();
};

// GET /api/cron/send-reminders
router.get('/send-reminders', secureCron, async (req, res) => {
    try {
        const result = await CronService.processDueAlerts();
        
        // Always return 200 unless critical failure, to keep cron service happy
        // If logic failed (e.g. locked), result.success will catch it but HTTP status remains 200
        res.status(200).json(result);
    } catch (error) {
        console.error('Cron Route Error:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
});

module.exports = router;
