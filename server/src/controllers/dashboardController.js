// controllers/dashboardController.js
const db = require('../models');
const { Op, fn, col, literal } = require('sequelize');

/**
 * GET /api/admin/dashboard
 * Returns key metrics and recent activity for the admin dashboard
 */
exports.getDashboardStats = async (req, res) => {
    try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // Run all queries in parallel for performance
        const [
            totalUsers,
            newUsersThisMonth,
            activeSubscriptions,
            totalRevenue,
            recentTransactions,
            subscriptionsByStatus,
            monthlyRevenue
        ] = await Promise.all([
            // Total users
            db.User.count(),

            // New users this month
            db.User.count({
                where: { created_at: { [Op.gte]: startOfMonth } }
            }),

            // Active subscriptions
            db.Subscription.count({
                where: { is_active: true }
            }),

            // Total revenue (sum of successful transactions)
            db.Transaction.sum('amount', {
                where: { status: 'success' }
            }),

            // Recent 10 transactions
            db.Transaction.findAll({
                limit: 10,
                order: [['transaction_date', 'DESC']],
                include: [{
                    model: db.User,
                    as: 'user',
                    attributes: ['user_id', 'first_name', 'last_name', 'email']
                }]
            }),

            // Subscriptions grouped by active/inactive
            db.Subscription.findAll({
                attributes: [
                    'is_active',
                    [fn('COUNT', col('subscription_id')), 'count']
                ],
                group: ['is_active'],
                raw: true
            }),

            // Monthly revenue for last 6 months
            db.Transaction.findAll({
                attributes: [
                    [fn('DATE_FORMAT', col('transaction_date'), '%Y-%m'), 'month'],
                    [fn('SUM', col('amount')), 'revenue'],
                    [fn('COUNT', col('transaction_id')), 'count']
                ],
                where: {
                    status: 'success',
                    transaction_date: {
                        [Op.gte]: new Date(now.getFullYear(), now.getMonth() - 5, 1)
                    }
                },
                group: [literal("DATE_FORMAT(transaction_date, '%Y-%m')")],
                order: [[literal("month"), 'ASC']],
                raw: true
            })
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                newUsersThisMonth,
                activeSubscriptions,
                totalRevenue: totalRevenue || 0,
                recentTransactions,
                subscriptionsByStatus,
                monthlyRevenue
            }
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard statistics'
        });
    }
};
