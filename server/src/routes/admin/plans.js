// routes/admin/plans.js
const express = require('express');
const router = express.Router();
const planController = require('../../controllers/planController');

// GET /api/admin/plans
router.get('/', planController.getPlans);

// GET /api/admin/plans/:id
router.get('/:id', planController.getPlanById);

// POST /api/admin/plans
router.post('/', planController.createPlan);

// PATCH /api/admin/plans/:id
router.patch('/:id', planController.updatePlan);

// DELETE /api/admin/plans/:id
router.delete('/:id', planController.deletePlan);

module.exports = router;
