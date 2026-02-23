// controllers/dashboardController.js
const { Op, fn, col, literal } = require('sequelize');
const db = require('../models');

// GET /api/admin/dashboard/stats
exports.getStats = async (req, res) => {
    try {
        const totalUsers = await db.User.count();
        const activeUsers = await db.User.count({ where: { status: 'active' } });
        const totalSubscriptions = await db.Subscription.count();
        const totalTransactions = await db.Transaction.count();

        // Total revenue (completed transactions)
        const revenueResult = await db.Transaction.findOne({
            attributes: [
                [fn('COALESCE', fn('SUM', col('amount')), 0), 'totalRevenue']
            ],
            where: { status: 'completed' }
        });

        const totalRevenue = parseFloat(revenueResult?.getDataValue('totalRevenue') || 0);

        // New users this month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const newUsersThisMonth = await db.User.count({
            where: {
                created_at: { [Op.gte]: startOfMonth }
            }
        });

        // Active plans count
        const activePlans = await db.Plan.count({ where: { is_active: true } });

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                activeUsers,
                totalSubscriptions,
                totalTransactions,
                totalRevenue,
                newUsersThisMonth,
                activePlans
            }
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats' });
    }
};

// GET /api/admin/dashboard/charts
exports.getCharts = async (req, res) => {
    try {
        // Monthly revenue for last 12 months
        const monthlyRevenue = await db.sequelize.query(`
      SELECT 
        DATE_FORMAT(transaction_date, '%Y-%m') as month,
        COALESCE(SUM(amount), 0) as revenue,
        COUNT(*) as count
      FROM transactions 
      WHERE status = 'completed' 
        AND transaction_date >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
      GROUP BY DATE_FORMAT(transaction_date, '%Y-%m')
      ORDER BY month ASC
    `, { type: db.sequelize.QueryTypes.SELECT });

        // Monthly user growth for last 12 months
        const userGrowth = await db.sequelize.query(`
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        COUNT(*) as new_users
      FROM users 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month ASC
    `, { type: db.sequelize.QueryTypes.SELECT });

        // Subscription type distribution
        const subscriptionTypes = await db.Subscription.findAll({
            attributes: [
                'type',
                [fn('COUNT', col('subscription_id')), 'count']
            ],
            group: ['type']
        });

        // Recent activity — last 10 users
        const recentUsers = await db.User.findAll({
            attributes: ['user_id', 'first_name', 'last_name', 'email', 'role', 'status', 'created_at'],
            order: [['created_at', 'DESC']],
            limit: 10
        });

        res.status(200).json({
            success: true,
            data: {
                monthlyRevenue,
                userGrowth,
                subscriptionTypes,
                recentUsers
            }
        });
    } catch (error) {
        console.error('Dashboard charts error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch chart data' });
    }
};
