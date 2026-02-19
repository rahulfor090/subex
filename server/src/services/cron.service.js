const db = require('../models');
const { SubExAlert, User, Subscription, Company } = db;
const { Op } = db.Sequelize;
const emailService = require('./email.service');

class CronService {
    constructor() {
        this.isRunning = false;
    }

    /**
     * Process all due alerts
     * Idempotent & Thread-safe (mostly)
     */
    async processDueAlerts() {
        // 1. Job Locking (In-Memory)
        if (this.isRunning) {
            console.warn('[Cron] Job already running. Skipping.');
            return { success: false, message: 'Job already running' };
        }

        this.isRunning = true;
        const stats = { processed: 0, sent: 0, failed: 0 };

        try {
            console.log('[Cron] Starting alert processing...');

            // 2. Fetch Due Alerts (Using DB Time)
            const dueAlerts = await SubExAlert.findAll({
                where: {
                    alert_send_date: {
                        [Op.lte]: db.sequelize.fn('CURRENT_DATE')
                    },
                    [Op.or]: [
                        { status: 'pending' },
                        { 
                            status: 'failed',
                            retry_count: { [Op.lt]: 3 }
                        }
                    ]
                },
                include: [
                    {
                        model: User,
                        as: 'user',
                        attributes: ['first_name', 'email']
                    },
                    {
                        model: Subscription,
                        as: 'subscription',
                        include: [{ model: Company, as: 'company' }]
                    }
                ]
            });

            // 3. Health Check / Empty State
            if (dueAlerts.length === 0) {
                console.log('[Cron] No alerts due today.');
                return { 
                    success: true, 
                    ...stats, 
                    message: "No alerts due" 
                };
            }

            console.log(`[Cron] Found ${dueAlerts.length} alerts to process.`);

            // 4. Process Loop
            for (const alert of dueAlerts) {
                // Idempotency: Try to lock the row by updating status to 'processing'
                // We purposefully check status again in the update query to avoid race conditions
                const [updatedRows] = await SubExAlert.update(
                    { status: 'processing' },
                    {
                        where: {
                            id: alert.id,
                            status: ['pending', 'failed'] // Ensure we only pick valid states
                        }
                    }
                );

                // If no rows updated, it means another worker picked it up or it changed state
                if (updatedRows === 0) {
                    continue;
                }

                stats.processed++;

                try {
                    // Send Email
                    if (alert.user && alert.subscription) {
                        await emailService.sendSubscriptionReminderEmail(
                            alert.user, 
                            alert.subscription, 
                            alert
                        );

                        // Mark as Sent
                        await alert.update({
                            status: 'sent',
                            sent_at: new Date()
                        });
                        stats.sent++;
                        console.log(`[Cron] Alert ${alert.id} sent to ${alert.user.email}`);
                    } else {
                        throw new Error('Missing user or subscription data');
                    }

                } catch (error) {
                    stats.failed++;
                    console.error(`[Cron] Failed to process alert ${alert.id}:`, error.message);

                    // Handle Failure & Retry Count
                    await alert.update({
                        status: 'failed',
                        retry_count: db.sequelize.literal('retry_count + 1')
                    });
                }
            }

            console.log('[Cron] Job completed.', stats);
            return { success: true, ...stats };

        } catch (error) {
            console.error('[Cron] Critical Job Error:', error);
            throw error;
        } finally {
            this.isRunning = false;
        }
    }
}

module.exports = new CronService();
