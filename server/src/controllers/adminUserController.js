// controllers/adminUserController.js
const db = require('../models');
const { Op } = require('sequelize');

/**
 * GET /api/admin/users
 * Paginated user list with search and subscription info
 */
exports.getUsers = async (req, res) => {
    const { page = 1, limit = 20, search = '', role = '' } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    try {
        const whereClause = {};

        // Search filter
        if (search) {
            whereClause[Op.or] = [
                { first_name: { [Op.like]: `%${search}%` } },
                { last_name: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } }
            ];
        }

        // Role filter
        if (role) {
            whereClause.role = role;
        }

        const { count, rows } = await db.User.findAndCountAll({
            where: whereClause,
            limit: parseInt(limit),
            offset,
            order: [['created_at', 'DESC']],
            attributes: { exclude: [] },
            include: [{
                model: db.Subscription,
                as: 'subscriptions',
                required: false,
                include: [{
                    model: db.Plan,
                    as: 'plan',
                    required: false
                }]
            }]
        });

        res.status(200).json({
            success: true,
            data: {
                users: rows,
                totalUsers: count,
                totalPages: Math.ceil(count / parseInt(limit)),
                currentPage: parseInt(page)
            }
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users'
        });
    }
};

/**
 * GET /api/admin/users/:id
 * Detailed user view with subscriptions and transactions
 */
exports.getUserById = async (req, res) => {
    try {
        const user = await db.User.findByPk(req.params.id, {
            include: [
                {
                    model: db.Subscription,
                    as: 'subscriptions',
                    include: [{
                        model: db.Plan,
                        as: 'plan',
                        required: false
                    }]
                },
                {
                    model: db.Transaction,
                    as: 'transactions',
                    order: [['transaction_date', 'DESC']],
                    limit: 20
                }
            ]
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user details'
        });
    }
};

/**
 * PATCH /api/admin/users/:id
 * Update user role or status
 */
exports.updateUser = async (req, res) => {
    try {
        const user = await db.User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const { role, is_email_verified, first_name, last_name } = req.body;

        // Prevent demoting yourself
        if (req.user.user_id === user.user_id && role && role !== 'super_admin') {
            return res.status(400).json({
                success: false,
                message: 'You cannot change your own role'
            });
        }

        const updateData = {};
        if (role !== undefined) updateData.role = role;
        if (is_email_verified !== undefined) updateData.is_email_verified = is_email_verified;
        if (first_name !== undefined) updateData.first_name = first_name;
        if (last_name !== undefined) updateData.last_name = last_name;

        await user.update(updateData);

        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: user
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update user'
        });
    }
};

/**
 * DELETE /api/admin/users/:id
 * Delete a user and all related records
 */
exports.deleteUser = async (req, res) => {
    try {
        const user = await db.User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Prevent self-deletion
        if (req.user.user_id === user.user_id) {
            return res.status(400).json({
                success: false,
                message: 'You cannot delete your own account'
            });
        }

        // Delete in a transaction to ensure data integrity
        await db.sequelize.transaction(async (t) => {
            await db.Transaction.destroy({ where: { user_id: user.user_id }, transaction: t });
            await db.Subscription.destroy({ where: { user_id: user.user_id }, transaction: t });
            await db.UserAuth.destroy({ where: { user_id: user.user_id }, transaction: t });
            await user.destroy({ transaction: t });
        });

        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete user'
        });
    }
};
