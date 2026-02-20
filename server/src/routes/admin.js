// routes/admin.js — Admin panel API routes (production-hardened)
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { validate } = require('../middleware/validator');
const {
    updateUserRoleSchema,
    updateUserSchema,
    createPlanSchema,
    updatePlanSchema,
    createUserSchema
} = require('../validators/schemas');

// Controllers
const dashboardController = require('../controllers/dashboardController');
const adminUserController = require('../controllers/adminUserController');
const planController = require('../controllers/planController');
const transactionController = require('../controllers/transactionController');

// All admin routes require auth + super_admin role
router.use(authenticate, authorize('super_admin'));

// ── Dashboard ──
router.get('/dashboard/stats', dashboardController.getStats);
router.get('/dashboard/charts', dashboardController.getCharts);

// ── Users ──
router.get('/users', adminUserController.getUsers);
router.get('/users/:id', adminUserController.getUserById);
router.post('/users', validate(createUserSchema), adminUserController.createUser);
router.put('/users/:id', validate(updateUserSchema), adminUserController.updateUser);
router.patch('/users/:id/role', validate(updateUserRoleSchema), adminUserController.updateUserRole);
router.delete('/users/:id', adminUserController.deleteUser);
router.post('/users/:id/restore', adminUserController.restoreUser);

// ── Plans ──
router.get('/plans', planController.getPlans);
router.get('/plans/:id', planController.getPlanById);
router.post('/plans', validate(createPlanSchema), planController.createPlan);
router.put('/plans/:id', validate(updatePlanSchema), planController.updatePlan);
router.delete('/plans/:id', planController.deletePlan);

// ── Transactions ──
router.get('/transactions', transactionController.getTransactions);
router.get('/transactions/:id', transactionController.getTransactionById);

// ── System Health ──
const db = require('../models');
const logger = require('../utils/logger');

router.get('/system/health', async (req, res) => {
    try {
        const startTime = Date.now();
        await db.sequelize.authenticate();
        const dbResponseTime = Date.now() - startTime;

        const [results] = await db.sequelize.query(`
      SELECT 
        (SELECT COUNT(*) FROM users) as users_count,
        (SELECT COUNT(*) FROM subscriptions) as subscriptions_count,
        (SELECT COUNT(*) FROM companies) as companies_count
    `);

        res.status(200).json({
            success: true,
            data: {
                server: {
                    status: 'healthy',
                    uptime: process.uptime(),
                    memoryUsage: process.memoryUsage(),
                    nodeVersion: process.version,
                    platform: process.platform
                },
                database: {
                    status: 'connected',
                    responseTime: `${dbResponseTime}ms`,
                    dialect: 'mysql',
                    tables: results[0]
                },
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        logger.error('System health check failed', { error: error.message });
        res.status(500).json({
            success: true,
            data: {
                server: { status: 'healthy', uptime: process.uptime() },
                database: { status: 'disconnected', error: error.message },
                timestamp: new Date().toISOString()
            }
        });
    }
});

module.exports = router;
