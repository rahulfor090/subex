// controllers/transactionController.js
const { Op } = require('sequelize');
const db = require('../models');

// GET /api/admin/transactions — paginated list with filters
exports.getTransactions = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            status,
            startDate,
            endDate,
            search = ''
        } = req.query;

        const offset = (parseInt(page) - 1) * parseInt(limit);
        const whereClause = {};

        // Filter by status
        if (status) {
            whereClause.status = status;
        }

        // Filter by date range
        if (startDate || endDate) {
            whereClause.transaction_date = {};
            if (startDate) {
                whereClause.transaction_date[Op.gte] = new Date(startDate);
            }
            if (endDate) {
                whereClause.transaction_date[Op.lte] = new Date(endDate);
            }
        }

        const { count, rows } = await db.Transaction.findAndCountAll({
            where: whereClause,
            include: [
                {
                    model: db.User,
                    as: 'user',
                    attributes: ['user_id', 'first_name', 'last_name', 'email'],
                    required: false,
                    where: search ? {
                        [Op.or]: [
                            { first_name: { [Op.like]: `%${search}%` } },
                            { last_name: { [Op.like]: `%${search}%` } },
                            { email: { [Op.like]: `%${search}%` } }
                        ]
                    } : undefined
                },
                {
                    model: db.Subscription,
                    as: 'subscription',
                    attributes: ['subscription_id', 'type', 'value', 'currency'],
                    required: false,
                    include: [
                        { model: db.Company, as: 'company', attributes: ['id', 'name'], required: false }
                    ]
                }
            ],
            limit: parseInt(limit),
            offset,
            order: [['transaction_date', 'DESC']]
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
        res.status(500).json({ success: false, message: 'Failed to fetch transactions' });
    }
};

// GET /api/admin/transactions/:id — single transaction detail
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
                    required: false,
                    include: [
                        { model: db.Company, as: 'company', attributes: ['id', 'name'], required: false }
                    ]
                }
            ]
        });

        if (!transaction) {
            return res.status(404).json({ success: false, message: 'Transaction not found' });
        }

        res.status(200).json({ success: true, data: transaction });
    } catch (error) {
        console.error('Get transaction error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch transaction' });
    }
};
