// controllers/planController.js
const db = require('../models');

// GET /api/admin/plans — list all plans
exports.getPlans = async (req, res) => {
    try {
        const plans = await db.Plan.findAll({
            order: [['created_at', 'DESC']]
        });

        res.status(200).json({
            success: true,
            data: plans
        });
    } catch (error) {
        console.error('Get plans error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch plans' });
    }
};

// GET /api/admin/plans/:id — get single plan
exports.getPlanById = async (req, res) => {
    try {
        const plan = await db.Plan.findByPk(req.params.id);

        if (!plan) {
            return res.status(404).json({ success: false, message: 'Plan not found' });
        }

        res.status(200).json({ success: true, data: plan });
    } catch (error) {
        console.error('Get plan error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch plan' });
    }
};

// POST /api/admin/plans — create plan
exports.createPlan = async (req, res) => {
    try {
        const { name, description, price, interval, features, max_users, is_active } = req.body;

        if (!name || price === undefined || !interval) {
            return res.status(400).json({
                success: false,
                message: 'Name, price, and interval are required'
            });
        }

        const plan = await db.Plan.create({
            name,
            description: description || null,
            price,
            interval,
            features: features || [],
            max_users: max_users || null,
            is_active: is_active !== undefined ? is_active : true
        });

        res.status(201).json({
            success: true,
            message: 'Plan created successfully',
            data: plan
        });
    } catch (error) {
        console.error('Create plan error:', error);
        res.status(500).json({ success: false, message: 'Failed to create plan' });
    }
};

// PUT /api/admin/plans/:id — update plan
exports.updatePlan = async (req, res) => {
    try {
        const plan = await db.Plan.findByPk(req.params.id);

        if (!plan) {
            return res.status(404).json({ success: false, message: 'Plan not found' });
        }

        const { name, description, price, interval, features, max_users, is_active } = req.body;

        await plan.update({
            name: name !== undefined ? name : plan.name,
            description: description !== undefined ? description : plan.description,
            price: price !== undefined ? price : plan.price,
            interval: interval !== undefined ? interval : plan.interval,
            features: features !== undefined ? features : plan.getDataValue('features'),
            max_users: max_users !== undefined ? max_users : plan.max_users,
            is_active: is_active !== undefined ? is_active : plan.is_active
        });

        res.status(200).json({
            success: true,
            message: 'Plan updated successfully',
            data: plan
        });
    } catch (error) {
        console.error('Update plan error:', error);
        res.status(500).json({ success: false, message: 'Failed to update plan' });
    }
};

// DELETE /api/admin/plans/:id — delete plan
exports.deletePlan = async (req, res) => {
    try {
        const plan = await db.Plan.findByPk(req.params.id);

        if (!plan) {
            return res.status(404).json({ success: false, message: 'Plan not found' });
        }

        await plan.destroy();

        res.status(200).json({
            success: true,
            message: 'Plan deleted successfully'
        });
    } catch (error) {
        console.error('Delete plan error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete plan' });
    }
};
