// controllers/adminUserController.js — Production-grade user management
const { Op } = require('sequelize');
const db = require('../models');
const logger = require('../utils/logger');
const bcrypt = require('bcrypt');

// Sensitive fields to always exclude from responses
const EXCLUDED_FIELDS = ['password_hash'];

// POST /api/admin/users — create a new user (admin-initiated)
exports.createUser = async (req, res, next) => {
    try {
        const { first_name, last_name, email, password = 'Welcome@123', phone_number, role = 'user', status = 'active' } = req.body;

        // Check if email already exists
        const existing = await db.User.findOne({ where: { email }, paranoid: false });
        if (existing) {
            return res.status(409).json({ success: false, message: 'A user with this email already exists.' });
        }

        const result = await db.sequelize.transaction(async (t) => {
            const user = await db.User.create({
                first_name,
                last_name,
                email,
                phone_number: phone_number || null,
                role,
                status,
                is_email_verified: true
            }, { transaction: t });

            const passwordHash = await bcrypt.hash(password, 10);
            await db.UserAuth.create({
                user_id: user.user_id,
                password_hash: passwordHash
            }, { transaction: t });

            return user;
        });

        logger.audit('USER_CREATED', req.user.user_id, {
            targetUserId: result.user_id,
            targetEmail: email,
            role
        });

        // Fetch without sensitive fields
        const created = await db.User.findByPk(result.user_id, {
            attributes: { exclude: EXCLUDED_FIELDS }
        });

        res.status(201).json({
            success: true,
            message: 'User created successfully.',
            data: created
        });
    } catch (error) {
        logger.error('Admin createUser failed', { error: error.message });
        next(error);
    }
};

// GET /api/admin/users — paginated list with search, filters, soft-delete visibility
exports.getUsers = async (req, res, next) => {
    try {
        const { page = 1, limit = 20, search = '', role, status, includeDeleted = 'false' } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);

        const whereClause = {};

        if (search) {
            whereClause[Op.or] = [
                { first_name: { [Op.like]: `%${search}%` } },
                { last_name: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } }
            ];
        }

        if (role) whereClause.role = role;
        if (status) whereClause.status = status;

        const { count, rows } = await db.User.findAndCountAll({
            where: whereClause,
            attributes: { exclude: EXCLUDED_FIELDS },
            // paranoid: false shows soft-deleted users too
            paranoid: includeDeleted !== 'true',
            include: [
                {
                    model: db.Subscription,
                    as: 'subscriptions',
                    required: false,
                    include: [
                        {
                            model: db.Company,
                            as: 'company',
                            attributes: ['id', 'name', 'image'],
                            required: false
                        }
                    ]
                }
            ],
            limit: parseInt(limit),
            offset,
            order: [['created_at', 'DESC']]
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
        logger.error('Admin getUsers failed', { error: error.message });
        next(error);
    }
};

// GET /api/admin/users/:id — single user detail
exports.getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await db.User.findByPk(id, {
            attributes: { exclude: EXCLUDED_FIELDS },
            // Allow viewing soft-deleted users in detail
            paranoid: false,
            include: [
                {
                    model: db.Subscription,
                    as: 'subscriptions',
                    include: [
                        { model: db.Company, as: 'company', attributes: ['id', 'name', 'image'], required: false },
                        { model: db.Folder, as: 'folder', attributes: ['id', 'name'], required: false },
                        { model: db.Tag, as: 'tags', attributes: ['id', 'name'], through: { attributes: [] }, required: false }
                    ]
                },
                {
                    model: db.Transaction,
                    as: 'transactions',
                    required: false,
                    limit: 20,
                    order: [['transaction_date', 'DESC']]
                }
            ]
        });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        logger.error('Admin getUserById failed', { error: error.message, userId: req.params.id });
        next(error);
    }
};

// PUT /api/admin/users/:id — update user (general fields, validated by Joi)
exports.updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { role, status, first_name, last_name, email } = req.body;

        const user = await db.User.findByPk(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        // Prevent self-demotion
        if (user.user_id.toString() === req.user.user_id.toString() && role && role !== 'super_admin') {
            return res.status(403).json({
                success: false,
                message: 'You cannot change your own role to a lower level.'
            });
        }

        const oldRole = user.role;
        const oldStatus = user.status;

        await user.update({
            role: role !== undefined ? role : user.role,
            status: status !== undefined ? status : user.status,
            first_name: first_name !== undefined ? first_name : user.first_name,
            last_name: last_name !== undefined ? last_name : user.last_name,
            email: email !== undefined ? email : user.email
        });

        // Audit log role/status changes
        if (role && role !== oldRole) {
            logger.audit('USER_ROLE_CHANGED', req.user.user_id, {
                targetUserId: id,
                oldRole,
                newRole: role
            });
        }
        if (status && status !== oldStatus) {
            logger.audit('USER_STATUS_CHANGED', req.user.user_id, {
                targetUserId: id,
                oldStatus,
                newStatus: status
            });
        }

        // Return sanitized user (re-fetch without password)
        const updatedUser = await db.User.findByPk(id, {
            attributes: { exclude: EXCLUDED_FIELDS }
        });

        res.status(200).json({
            success: true,
            message: 'User updated successfully.',
            data: updatedUser
        });
    } catch (error) {
        logger.error('Admin updateUser failed', { error: error.message, userId: req.params.id });
        next(error);
    }
};

// PATCH /api/admin/users/:id/role — dedicated role update (Joi-validated)
exports.updateUserRole = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { role } = req.body; // Already validated by Joi — only 'user' or 'admin'

        const user = await db.User.findByPk(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        // Prevent self-demotion
        if (user.user_id.toString() === req.user.user_id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You cannot change your own role.'
            });
        }

        const oldRole = user.role;
        await user.update({ role });

        logger.audit('USER_ROLE_CHANGED', req.user.user_id, {
            targetUserId: id,
            targetEmail: user.email,
            oldRole,
            newRole: role
        });

        res.status(200).json({
            success: true,
            message: `User role updated to "${role}".`,
            data: { user_id: user.user_id, email: user.email, role }
        });
    } catch (error) {
        logger.error('Admin updateUserRole failed', { error: error.message, userId: req.params.id });
        next(error);
    }
};

// DELETE /api/admin/users/:id — SOFT delete (paranoid mode)
exports.deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await db.User.findByPk(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        // Prevent self-deletion
        if (user.user_id.toString() === req.user.user_id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You cannot delete your own account.'
            });
        }

        // Soft delete — sets deleted_at timestamp, does NOT remove from DB
        await user.destroy();

        logger.audit('USER_SOFT_DELETED', req.user.user_id, {
            targetUserId: id,
            targetEmail: user.email
        });

        res.status(200).json({
            success: true,
            message: 'User deleted successfully. This action can be reversed.'
        });
    } catch (error) {
        logger.error('Admin deleteUser failed', { error: error.message, userId: req.params.id });
        next(error);
    }
};

// POST /api/admin/users/:id/restore — restore a soft-deleted user
exports.restoreUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Must use paranoid: false to find soft-deleted records
        const user = await db.User.findOne({
            where: { user_id: id },
            paranoid: false
        });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        if (!user.deleted_at) {
            return res.status(400).json({ success: false, message: 'User is not deleted.' });
        }

        // Restore — clears deleted_at
        await user.restore();

        logger.audit('USER_RESTORED', req.user.user_id, {
            targetUserId: id,
            targetEmail: user.email
        });

        res.status(200).json({
            success: true,
            message: 'User restored successfully.',
            data: { user_id: user.user_id, email: user.email, status: user.status }
        });
    } catch (error) {
        logger.error('Admin restoreUser failed', { error: error.message, userId: req.params.id });
        next(error);
    }
};
