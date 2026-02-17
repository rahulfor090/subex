// controllers/transactionController.js
const db = require('../models');
const { Op } = require('sequelize');

/**
 * GET /api/admin/transactions
 * Paginated transaction list with filters
 */
exports.getTransactions = async (req, res) => {
    const { page = 1, limit = 20, search = '', status = '', startDate = '', endDate = '' } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    try {
        const whereClause = {};

        // Status filter
        if (status) {
            whereClause.status = status;
        }

        // Date range filter
        if (startDate || endDate) {
            whereClause.transaction_date = {};
            if (startDate) whereClause.transaction_date[Op.gte] = new Date(startDate);
            if (endDate) whereClause.transaction_date[Op.lte] = new Date(endDate + 'T23:59:59');
        }

        // Build include clause for user search
        const includeClause = [{
            model: db.User,
            as: 'user',
            attributes: ['user_id', 'first_name', 'last_name', 'email'],
            ...(search ? {
                where: {
                    [Op.or]: [
                        { first_name: { [Op.like]: `%${search}%` } },
                        { last_name: { [Op.like]: `%${search}%` } },
                        { email: { [Op.like]: `%${search}%` } }
                    ]
                }
            } : {})
        }, {
            model: db.Subscription,
            as: 'subscription',
            required: false,
            attributes: ['subscription_id', 'service_name']
        }];

        const { count, rows } = await db.Transaction.findAndCountAll({
            where: whereClause,
            limit: parseInt(limit),
            offset,
            order: [['transaction_date', 'DESC']],
            include: includeClause
        });

        res.status(200).json({
            success: true,
            data: {
                transactions: rows,
                totalTransactions: count,
                totalPages: Math.ceil(count / parseInt(limit)),
                currentPage: parseInt(page)
            }
        });
    } catch (error) {
        console.error('Get transactions error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch transactions'
        });
    }
};

/**
 * GET /api/admin/transactions/:id
 * Single transaction detail
 */
exports.getTransactionById = async (req, res) => {
    try {
        const transaction = await db.Transaction.findByPk(req.params.id, {
            include: [
                {
                    model: db.User,
                    as: 'user',
                    attributes: ['user_id', 'first_name', 'last_name', 'email']
                },
                {
                    model: db.Subscription,
                    as: 'subscription',
                    required: false
                }
            ]
        });

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
        }

        res.status(200).json({
            success: true,
            data: transaction
        });
    } catch (error) {
        console.error('Get transaction error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch transaction details'
        });
    }
};
