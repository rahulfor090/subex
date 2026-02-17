const express = require('express');
const router = express.Router();
const db = require('../models');
const { authenticate } = require('../middleware/auth');

// All subscription routes require authentication
router.use(authenticate);

// GET /api/subscriptions - List all subscriptions for the authenticated user
router.get('/', async (req, res) => {
  try {
    const userId = req.user.user_id;

    const subscriptions = await db.Subscription.findAll({
      where: { user_id: userId },
      order: [['next_renewal_date', 'ASC']]
    });

    res.status(200).json({
      success: true,
      data: subscriptions
    });
  } catch (error) {
    console.error('Get subscriptions error:', error);
    
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching subscriptions.'
    });
  }
});

// GET /api/subscriptions/:id - Get a specific subscription
router.get('/:id', async (req, res) => {
  try {
    const userId = req.user.user_id;
    const subscriptionId = req.params.id;

    const subscription = await db.Subscription.findOne({
      where: {
        subscription_id: subscriptionId,
        user_id: userId
      }
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }

    res.status(200).json({
      success: true,
      data: subscription
    });
  } catch (error) {
    console.error('Get subscription error:', error);
    
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching the subscription.'
    });
  }
});

// POST /api/subscriptions - Create a new subscription
router.post('/', async (req, res) => {
  try {
    const userId = req.user.user_id;
    const {
      service_name,
      description,
      start_date,
      next_renewal_date,
      billing_cycle_number,
      billing_cycle_period,
      auto_renew,
      cost,
      currency,
      is_active,
      is_trial,
      website_url,
      category
    } = req.body;

    // Validate required fields
    if (!service_name || !start_date || !next_renewal_date || !cost || !currency || !billing_cycle_period) {
      return res.status(400).json({
        success: false,
        message: 'Service name, start date, next renewal date, cost, currency, and billing cycle period are required'
      });
    }

    // Create subscription
    const subscription = await db.Subscription.create({
      user_id: userId,
      service_name,
      description: description || null,
      start_date,
      next_renewal_date,
      billing_cycle_number: billing_cycle_number || 1,
      billing_cycle_period,
      auto_renew: auto_renew !== undefined ? auto_renew : true,
      cost,
      currency,
      is_active: is_active !== undefined ? is_active : true,
      is_trial: is_trial !== undefined ? is_trial : false,
      website_url: website_url || null,
      category: category || null
    });

    res.status(200).json({
      success: true,
      message: 'Subscription created successfully',
      data: subscription
    });
  } catch (error) {
    console.error('Create subscription error:', error);
    
    // Handle Sequelize validation errors
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors.map(e => e.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'An error occurred while creating the subscription.'
    });
  }
});

// PATCH /api/subscriptions/:id - Update a subscription
router.patch('/:id', async (req, res) => {
  try {
    const userId = req.user.user_id;
    const subscriptionId = req.params.id;

    // Find the subscription
    const subscription = await db.Subscription.findOne({
      where: {
        subscription_id: subscriptionId,
        user_id: userId
      }
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }

    // Update fields
    const {
      service_name,
      description,
      start_date,
      next_renewal_date,
      billing_cycle_number,
      billing_cycle_period,
      auto_renew,
      cost,
      currency,
      is_active,
      is_trial,
      website_url,
      category
    } = req.body;

    await subscription.update({
      service_name: service_name !== undefined ? service_name : subscription.service_name,
      description: description !== undefined ? description : subscription.description,
      start_date: start_date !== undefined ? start_date : subscription.start_date,
      next_renewal_date: next_renewal_date !== undefined ? next_renewal_date : subscription.next_renewal_date,
      billing_cycle_number: billing_cycle_number !== undefined ? billing_cycle_number : subscription.billing_cycle_number,
      billing_cycle_period: billing_cycle_period !== undefined ? billing_cycle_period : subscription.billing_cycle_period,
      auto_renew: auto_renew !== undefined ? auto_renew : subscription.auto_renew,
      cost: cost !== undefined ? cost : subscription.cost,
      currency: currency !== undefined ? currency : subscription.currency,
      is_active: is_active !== undefined ? is_active : subscription.is_active,
      is_trial: is_trial !== undefined ? is_trial : subscription.is_trial,
      website_url: website_url !== undefined ? website_url : subscription.website_url,
      category: category !== undefined ? category : subscription.category
    });

    res.status(200).json({
      success: true,
      message: 'Subscription updated successfully',
      data: subscription
    });
  } catch (error) {
    console.error('Update subscription error:', error);
    
    // Handle Sequelize validation errors
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors.map(e => e.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'An error occurred while updating the subscription.'
    });
  }
});

// DELETE /api/subscriptions/:id - Cancel/Delete a subscription
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.user.user_id;
    const subscriptionId = req.params.id;

    // Find the subscription
    const subscription = await db.Subscription.findOne({
      where: {
        subscription_id: subscriptionId,
        user_id: userId
      }
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }

    // Delete the subscription
    await subscription.destroy();

    res.status(200).json({
      success: true,
      message: 'Subscription cancelled successfully'
    });
  } catch (error) {
    console.error('Delete subscription error:', error);
    
    res.status(500).json({
      success: false,
      message: 'An error occurred while cancelling the subscription.'
    });
  }
});

module.exports = router;
