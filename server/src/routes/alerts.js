const express = require('express');
const router = express.Router();
const db = require('../models');
const { authenticate } = require('../middleware/auth');

// All alert routes require authentication
router.use(authenticate);

// GET /api/alerts?subscriptionId=:id - Get all alerts for a subscription
router.get('/', async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { subscriptionId } = req.query;

    const where = { user_id: userId };
    if (subscriptionId) {
      where.subscription_id = subscriptionId;
    }

    const alerts = await db.Alert.findAll({
      where,
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: alerts
    });
  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching alerts.'
    });
  }
});

// POST /api/alerts - Create a new alert
router.post('/', async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { subscriptionId, quantity, unit, alertOn, contact } = req.body;

    if (!subscriptionId || !quantity || !unit || !alertOn) {
      return res.status(400).json({
        success: false,
        message: 'subscriptionId, quantity, unit, and alertOn are required'
      });
    }

    // Verify the subscription belongs to this user
    const subscription = await db.Subscription.findOne({
      where: { subscription_id: subscriptionId, user_id: userId }
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }

    // Enforce max 3 alerts per subscription
    const existingCount = await db.Alert.count({
      where: { subscription_id: subscriptionId, user_id: userId }
    });

    if (existingCount >= 3) {
      return res.status(400).json({
        success: false,
        message: 'Maximum of 3 alerts allowed per subscription'
      });
    }

    const alert = await db.Alert.create({
      user_id: userId,
      subscription_id: subscriptionId,
      quantity,
      unit,
      alert_on: alertOn,
      contact: contact || null
    });

    // Calculate alert sending date
    let targetDateStr = null;
    if (alertOn === 'payment_date') {
      targetDateStr = subscription.next_payment_date; // YYYY-MM-DD string
    } else if (alertOn === 'contract_expiry') {
      targetDateStr = subscription.contract_expiry;
    }

    if (targetDateStr) {
        const date = new Date(targetDateStr);
        if (!isNaN(date.getTime())) {
            if (unit === 'day') {
                date.setDate(date.getDate() - quantity);
            } else if (unit === 'week') {
                date.setDate(date.getDate() - (quantity * 7));
            } else if (unit === 'month') {
                date.setMonth(date.getMonth() - quantity);
            }
            
            const alertSendDate = date.toISOString().split('T')[0];

            await db.SubExAlert.create({
                user_id: userId,
                subscription_id: subscriptionId,
                alert_id: alert.id,
                alert_send_date: alertSendDate
            });
        }
    }

    res.status(200).json({
      success: true,
      message: 'Alert created successfully',
      data: alert
    });
  } catch (error) {
    console.error('Create alert error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while creating the alert.'
    });
  }
});

// DELETE /api/alerts/:id - Delete an alert
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.user.user_id;
    const alertId = req.params.id;

    const alert = await db.Alert.findOne({
      where: { id: alertId, user_id: userId }
    });

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    await alert.destroy();

    res.status(200).json({
      success: true,
      message: 'Alert deleted successfully'
    });
  } catch (error) {
    console.error('Delete alert error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the alert.'
    });
  }
});

module.exports = router;
