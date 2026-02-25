const express = require('express');
const router = express.Router();
const db = require('../models');
const { authenticate } = require('../middleware/auth');

// All revenue routes require authentication
router.use(authenticate);

// GET /api/revenue - List all income sources for the authenticated user
router.get('/', async (req, res) => {
    try {
        const userId = req.user.user_id;

        const revenues = await db.Revenue.findAll({
            where: { user_id: userId },
            order: [['created_at', 'DESC']]
        });

        res.status(200).json({
            success: true,
            data: revenues
        });
    } catch (error) {
        console.error('Get revenue error:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching revenue sources.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// GET /api/revenue/:id - Get a specific income source
router.get('/:id', async (req, res) => {
    try {
        const userId = req.user.user_id;
        const revenue = await db.Revenue.findOne({
            where: { revenue_id: req.params.id, user_id: userId }
        });

        if (!revenue) {
            return res.status(404).json({ success: false, message: 'Income source not found' });
        }

        res.status(200).json({ success: true, data: revenue });
    } catch (error) {
        console.error('Get revenue item error:', error);
        res.status(500).json({ success: false, message: 'An error occurred.' });
    }
});

// POST /api/revenue - Create a new income source
router.post('/', async (req, res) => {
    try {
        const userId = req.user.user_id;
        const {
            source_category,
            source_subcategory,
            description,
            amount,
            currency,
            cycle,
            recurring
        } = req.body;

        // Validate required fields
        if (!source_category || !amount || !currency || !cycle) {
            return res.status(400).json({
                success: false,
                message: 'source_category, amount, currency, and cycle are required'
            });
        }

        const revenue = await db.Revenue.create({
            user_id: userId,
            source_category,
            source_subcategory: source_subcategory || null,
            description: description || null,
            amount,
            currency,
            cycle,
            recurring: recurring !== undefined ? recurring : true
        });

        res.status(200).json({
            success: true,
            message: 'Income source created successfully',
            data: revenue
        });
    } catch (error) {
        console.error('Create revenue error:', error);
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.errors.map(e => e.message)
            });
        }
        res.status(500).json({ success: false, message: 'An error occurred while creating the income source.' });
    }
});

// PATCH /api/revenue/:id - Update an income source
router.patch('/:id', async (req, res) => {
    try {
        const userId = req.user.user_id;
        const revenue = await db.Revenue.findOne({
            where: { revenue_id: req.params.id, user_id: userId }
        });

        if (!revenue) {
            return res.status(404).json({ success: false, message: 'Income source not found' });
        }

        const {
            source_category,
            source_subcategory,
            description,
            amount,
            currency,
            cycle,
            recurring
        } = req.body;

        await revenue.update({
            source_category: source_category ?? revenue.source_category,
            source_subcategory: source_subcategory !== undefined ? (source_subcategory || null) : revenue.source_subcategory,
            description: description !== undefined ? (description || null) : revenue.description,
            amount: amount ?? revenue.amount,
            currency: currency ?? revenue.currency,
            cycle: cycle ?? revenue.cycle,
            recurring: recurring !== undefined ? recurring : revenue.recurring
        });

        res.status(200).json({
            success: true,
            message: 'Income source updated successfully',
            data: revenue
        });
    } catch (error) {
        console.error('Update revenue error:', error);
        res.status(500).json({ success: false, message: 'An error occurred while updating the income source.' });
    }
});

// DELETE /api/revenue/:id - Delete an income source
router.delete('/:id', async (req, res) => {
    try {
        const userId = req.user.user_id;
        const revenue = await db.Revenue.findOne({
            where: { revenue_id: req.params.id, user_id: userId }
        });

        if (!revenue) {
            return res.status(404).json({ success: false, message: 'Income source not found' });
        }

        await revenue.destroy();
        res.status(200).json({ success: true, message: 'Income source deleted successfully' });
    } catch (error) {
        console.error('Delete revenue error:', error);
        res.status(500).json({ success: false, message: 'An error occurred while deleting the income source.' });
    }
});

module.exports = router;
