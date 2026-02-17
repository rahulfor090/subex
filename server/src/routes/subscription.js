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
    console.log('Fetching subscriptions for user:', userId);

    const subscriptions = await db.Subscription.findAll({
      where: { user_id: userId },
      include: [
        {
          model: db.Company,
          as: 'company',
          attributes: ['id', 'name', 'image'],
          required: false
        },
        {
          model: db.Folder,
          as: 'folder',
          attributes: ['id', 'name'],
          required: false
        },
        {
          model: db.Tag,
          as: 'tags',
          attributes: ['id', 'name'],
          through: { attributes: [] },
          required: false
        }
      ],
      order: [['created_at', 'DESC']]
    });

    console.log('Found subscriptions:', subscriptions.length);

    res.status(200).json({
      success: true,
      data: subscriptions
    });
  } catch (error) {
    console.error('Get subscriptions error:', error);
    console.error('Error stack:', error.stack);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching subscriptions.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
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
      },
      include: [
        {
          model: db.Company,
          as: 'company',
          attributes: ['id', 'name', 'image']
        },
        {
          model: db.Folder,
          as: 'folder',
          attributes: ['id', 'name']
        },
        {
          model: db.Tag,
          as: 'tags',
          attributes: ['id', 'name'],
          through: { attributes: [] }
        }
      ]
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
      company_id,
      description,
      type,
      recurring,
      frequency,
      cycle,
      value,
      currency,
      next_payment_date,
      contract_expiry,
      url_link,
      payment_method,
      folder_id,
      tag_ids,
      notes
    } = req.body;

    // Validate required fields
    if (!company_id || !value || !currency || !cycle) {
      return res.status(400).json({
        success: false,
        message: 'Company, value, currency, and cycle are required'
      });
    }

    // Create subscription
    const subscription = await db.Subscription.create({
      user_id: userId,
      company_id,
      description: description || null,
      type: type || 'subscription',
      recurring: recurring !== undefined ? recurring : true,
      frequency: frequency || 1,
      cycle,
      value,
      currency,
      next_payment_date: next_payment_date || null,
      contract_expiry: contract_expiry || null,
      url_link: url_link || null,
      payment_method: payment_method || null,
      folder_id: folder_id || null,
      notes: notes || null
    });

    // Add tags if provided
    if (tag_ids && Array.isArray(tag_ids) && tag_ids.length > 0) {
      const tags = await db.Tag.findAll({
        where: { id: tag_ids }
      });
      await subscription.setTags(tags);
    }

    // Fetch the created subscription with associations
    const createdSubscription = await db.Subscription.findOne({
      where: { subscription_id: subscription.subscription_id },
      include: [
        {
          model: db.Company,
          as: 'company',
          attributes: ['id', 'name', 'image']
        },
        {
          model: db.Folder,
          as: 'folder',
          attributes: ['id', 'name']
        },
        {
          model: db.Tag,
          as: 'tags',
          attributes: ['id', 'name'],
          through: { attributes: [] }
        }
      ]
    });

    res.status(200).json({
      success: true,
      message: 'Subscription created successfully',
      data: createdSubscription
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
      company_id,
      description,
      type,
      recurring,
      frequency,
      cycle,
      value,
      currency,
      next_payment_date,
      contract_expiry,
      url_link,
      payment_method,
      folder_id,
      tag_ids,
      notes
    } = req.body;

    // Helper function to sanitize date values
    const sanitizeDate = (dateValue) => {
      if (!dateValue || dateValue === '' || dateValue === 'Invalid date') {
        return null;
      }
      // Check if it's a valid date
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) {
        return null;
      }
      return dateValue;
    };

    await subscription.update({
      company_id: company_id !== undefined ? company_id : subscription.company_id,
      description: description !== undefined ? (description || null) : subscription.description,
      type: type !== undefined ? type : subscription.type,
      recurring: recurring !== undefined ? recurring : subscription.recurring,
      frequency: frequency !== undefined ? frequency : subscription.frequency,
      cycle: cycle !== undefined ? cycle : subscription.cycle,
      value: value !== undefined ? value : subscription.value,
      currency: currency !== undefined ? currency : subscription.currency,
      next_payment_date: next_payment_date !== undefined ? sanitizeDate(next_payment_date) : subscription.next_payment_date,
      contract_expiry: contract_expiry !== undefined ? sanitizeDate(contract_expiry) : subscription.contract_expiry,
      url_link: url_link !== undefined ? (url_link || null) : subscription.url_link,
      payment_method: payment_method !== undefined ? payment_method : subscription.payment_method,
      folder_id: folder_id !== undefined ? folder_id : subscription.folder_id,
      notes: notes !== undefined ? (notes || null) : subscription.notes
    });

    // Update tags if provided
    if (tag_ids !== undefined && Array.isArray(tag_ids)) {
      const tags = await db.Tag.findAll({
        where: { id: tag_ids }
      });
      await subscription.setTags(tags);
    }

    // Fetch updated subscription with associations
    const updatedSubscription = await db.Subscription.findOne({
      where: { subscription_id: subscription.subscription_id },
      include: [
        {
          model: db.Company,
          as: 'company',
          attributes: ['id', 'name', 'image']
        },
        {
          model: db.Folder,
          as: 'folder',
          attributes: ['id', 'name']
        },
        {
          model: db.Tag,
          as: 'tags',
          attributes: ['id', 'name'],
          through: { attributes: [] }
        }
      ]
    });

    res.status(200).json({
      success: true,
      message: 'Subscription updated successfully',
      data: updatedSubscription
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
