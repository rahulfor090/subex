// controllers/planController.js
const db = require('../models');
const { fn, col } = require('sequelize');

/**
 * GET /api/admin/plans
 * List all plans with subscriber count
 */
exports.getPlans = async (req, res) => {
    try {
        const plans = await db.Plan.findAll({
            order: [['price', 'ASC']],
            include: [{
                model: db.Subscription,
                as: 'subscriptions',
                attributes: []
            }],
            attributes: {
                include: [
                    [fn('COUNT', col('subscriptions.subscription_id')), 'subscriberCount']
                ]
            },
            group: ['Plan.plan_id']
        });

        res.status(200).json({
            success: true,
            data: plans
        });
    } catch (error) {
        console.error('Get plans error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch plans'
        });
    }
};

/**
 * GET /api/admin/plans/:id
 * Get single plan details
 */
exports.getPlanById = async (req, res) => {
    try {
        const plan = await db.Plan.findByPk(req.params.id, {
            include: [{
                model: db.Subscription,
                as: 'subscriptions',
                include: [{
                    model: db.User,
                    as: 'user',
                    attributes: ['user_id', 'first_name', 'last_name', 'email']
                }]
            }]
        });

        if (!plan) {
            return res.status(404).json({
                success: false,
                message: 'Plan not found'
            });
        }

        res.status(200).json({
            success: true,
            data: plan
        });
    } catch (error) {
        console.error('Get plan error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch plan details'
        });
    }
};

/**
 * POST /api/admin/plans
 * Create a new plan
 */
exports.createPlan = async (req, res) => {
    try {
        const { name, description, price, interval, features, is_active, max_users } = req.body;

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
            is_active: is_active !== undefined ? is_active : true,
            max_users: max_users || null
        });

        res.status(201).json({
            success: true,
            message: 'Plan created successfully',
            data: plan
        });
    } catch (error) {
        console.error('Create plan error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create plan'
        });
    }
};

/**
 * PATCH /api/admin/plans/:id
 * Update a plan
 */
exports.updatePlan = async (req, res) => {
    try {
        const plan = await db.Plan.findByPk(req.params.id);

        if (!plan) {
            return res.status(404).json({
                success: false,
                message: 'Plan not found'
            });
        }

        const { name, description, price, interval, features, is_active, max_users } = req.body;

        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (price !== undefined) updateData.price = price;
        if (interval !== undefined) updateData.interval = interval;
        if (features !== undefined) updateData.features = features;
        if (is_active !== undefined) updateData.is_active = is_active;
        if (max_users !== undefined) updateData.max_users = max_users;

        await plan.update(updateData);

        res.status(200).json({
            success: true,
            message: 'Plan updated successfully',
            data: plan
        });
    } catch (error) {
        console.error('Update plan error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update plan'
        });
    }
};

/**
 * DELETE /api/admin/plans/:id
 * Delete a plan (only if no active subscriptions)
 */
exports.deletePlan = async (req, res) => {
    try {
        const plan = await db.Plan.findByPk(req.params.id);

        if (!plan) {
            return res.status(404).json({
                success: false,
                message: 'Plan not found'
            });
        }

        // Check if plan has active subscriptions
        const activeSubscriptions = await db.Subscription.count({
            where: { plan_id: plan.plan_id, is_active: true }
        });

        if (activeSubscriptions > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete plan with ${activeSubscriptions} active subscription(s). Deactivate subscriptions first.`
            });
        }

        await plan.destroy();

        res.status(200).json({
            success: true,
            message: 'Plan deleted successfully'
        });
    } catch (error) {
        console.error('Delete plan error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete plan'
        });
    }
};
