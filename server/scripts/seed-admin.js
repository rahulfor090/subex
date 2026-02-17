// scripts/seed-admin.js
// Seeds the database with a super admin user and sample plans/transactions
require('dotenv').config();
const bcrypt = require('bcrypt');
const db = require('../src/models');

const seedDatabase = async () => {
    try {
        // Connect and sync
        await db.sequelize.authenticate();
        console.log('✅ Database connected');
        await db.sequelize.sync({ alter: true });
        console.log('✅ Database synced');

        // 1. Create Super Admin User
        const adminEmail = process.env.SUPER_ADMIN_EMAIL || 'admin@subex.com';
        const adminPassword = 'Admin@123456';

        let adminUser = await db.User.findOne({ where: { email: adminEmail } });

        if (!adminUser) {
            adminUser = await db.User.create({
                first_name: 'Super',
                last_name: 'Admin',
                email: adminEmail,
                role: 'super_admin',
                is_email_verified: true
            });

            await db.UserAuth.create({
                user_id: adminUser.user_id,
                password_hash: await bcrypt.hash(adminPassword, 10)
            });

            console.log(`✅ Super admin created: ${adminEmail} / ${adminPassword}`);
        } else {
            // Ensure existing user has super_admin role
            await adminUser.update({ role: 'super_admin' });
            console.log(`ℹ️  Admin user already exists: ${adminEmail} (role updated to super_admin)`);
        }

        // 2. Create Sample Plans
        const plansData = [
            {
                name: 'Free',
                description: 'Perfect for getting started. Basic features with limited access.',
                price: 0.00,
                interval: 'monthly',
                features: ['Up to 5 subscriptions', 'Basic analytics', 'Email support'],
                is_active: true,
                max_users: null
            },
            {
                name: 'Pro',
                description: 'For power users who want more. Advanced features and priority support.',
                price: 499.00,
                interval: 'monthly',
                features: ['Unlimited subscriptions', 'Advanced analytics', 'Priority support', 'Export data', 'Custom categories'],
                is_active: true,
                max_users: null
            },
            {
                name: 'Enterprise',
                description: 'For teams and organizations. Full feature access with dedicated support.',
                price: 4999.00,
                interval: 'yearly',
                features: ['Everything in Pro', 'Team management', 'API access', 'Dedicated support', 'Custom integrations', 'SLA guarantee'],
                is_active: true,
                max_users: null
            }
        ];

        for (const planData of plansData) {
            const existing = await db.Plan.findOne({ where: { name: planData.name } });
            if (!existing) {
                await db.Plan.create(planData);
                console.log(`✅ Plan created: ${planData.name}`);
            } else {
                console.log(`ℹ️  Plan already exists: ${planData.name}`);
            }
        }

        // 3. Create some sample users (if they don't exist)
        const sampleUsers = [
            { first_name: 'Rahul', last_name: 'Sharma', email: 'rahul@example.com', role: 'user' },
            { first_name: 'Priya', last_name: 'Patel', email: 'priya@example.com', role: 'user' },
            { first_name: 'Amit', last_name: 'Kumar', email: 'amit@example.com', role: 'admin' },
            { first_name: 'Sneha', last_name: 'Gupta', email: 'sneha@example.com', role: 'user' },
            { first_name: 'Vikram', last_name: 'Singh', email: 'vikram@example.com', role: 'user' }
        ];

        const createdUsers = [];
        for (const userData of sampleUsers) {
            let user = await db.User.findOne({ where: { email: userData.email } });
            if (!user) {
                user = await db.User.create(userData);
                await db.UserAuth.create({
                    user_id: user.user_id,
                    password_hash: await bcrypt.hash('Password@123', 10)
                });
                console.log(`✅ Sample user created: ${userData.email}`);
            } else {
                console.log(`ℹ️  User already exists: ${userData.email}`);
            }
            createdUsers.push(user);
        }

        // 4. Create sample subscriptions
        const plans = await db.Plan.findAll();
        const proPlan = plans.find(p => p.name === 'Pro');
        const freePlan = plans.find(p => p.name === 'Free');
        const entPlan = plans.find(p => p.name === 'Enterprise');

        if (proPlan && freePlan) {
            const subsData = [
                { user_id: createdUsers[0].user_id, service_name: 'Netflix', plan_id: proPlan.plan_id, cost: 499, currency: 'INR', billing_cycle_period: 'monthly', start_date: '2025-01-15', next_renewal_date: '2026-03-15', is_active: true },
                { user_id: createdUsers[1].user_id, service_name: 'Spotify', plan_id: freePlan.plan_id, cost: 0, currency: 'INR', billing_cycle_period: 'monthly', start_date: '2025-06-01', next_renewal_date: '2026-03-01', is_active: true },
                { user_id: createdUsers[2].user_id, service_name: 'Adobe CC', plan_id: entPlan ? entPlan.plan_id : proPlan.plan_id, cost: 4999, currency: 'INR', billing_cycle_period: 'yearly', start_date: '2025-03-10', next_renewal_date: '2026-03-10', is_active: true },
                { user_id: createdUsers[3].user_id, service_name: 'YouTube Premium', plan_id: proPlan.plan_id, cost: 499, currency: 'INR', billing_cycle_period: 'monthly', start_date: '2025-09-01', next_renewal_date: '2026-03-01', is_active: false },
            ];

            for (const subData of subsData) {
                const existing = await db.Subscription.findOne({
                    where: { user_id: subData.user_id, service_name: subData.service_name }
                });
                if (!existing) {
                    await db.Subscription.create(subData);
                    console.log(`✅ Subscription created: ${subData.service_name} for user ${subData.user_id}`);
                }
            }
        }

        // 5. Create sample transactions
        const subscriptions = await db.Subscription.findAll();
        const transactionsData = [
            { user_id: createdUsers[0].user_id, subscription_id: subscriptions[0]?.subscription_id, amount: 499.00, currency: 'INR', status: 'success', payment_method: 'UPI', transaction_date: '2025-12-15', description: 'Netflix monthly subscription' },
            { user_id: createdUsers[0].user_id, subscription_id: subscriptions[0]?.subscription_id, amount: 499.00, currency: 'INR', status: 'success', payment_method: 'UPI', transaction_date: '2026-01-15', description: 'Netflix monthly subscription' },
            { user_id: createdUsers[0].user_id, subscription_id: subscriptions[0]?.subscription_id, amount: 499.00, currency: 'INR', status: 'success', payment_method: 'Credit Card', transaction_date: '2026-02-15', description: 'Netflix monthly subscription' },
            { user_id: createdUsers[1].user_id, subscription_id: subscriptions[1]?.subscription_id, amount: 0.00, currency: 'INR', status: 'success', payment_method: 'Free', transaction_date: '2026-01-01', description: 'Spotify free plan' },
            { user_id: createdUsers[2].user_id, subscription_id: subscriptions[2]?.subscription_id, amount: 4999.00, currency: 'INR', status: 'success', payment_method: 'Net Banking', transaction_date: '2025-03-10', description: 'Adobe CC yearly subscription' },
            { user_id: createdUsers[2].user_id, subscription_id: subscriptions[2]?.subscription_id, amount: 4999.00, currency: 'INR', status: 'pending', payment_method: 'Net Banking', transaction_date: '2026-03-10', description: 'Adobe CC yearly renewal' },
            { user_id: createdUsers[3].user_id, subscription_id: subscriptions[3]?.subscription_id, amount: 499.00, currency: 'INR', status: 'failed', payment_method: 'UPI', transaction_date: '2026-02-01', description: 'YouTube Premium payment failed' },
            { user_id: createdUsers[4].user_id, subscription_id: null, amount: 999.00, currency: 'INR', status: 'refunded', payment_method: 'Credit Card', transaction_date: '2026-01-20', description: 'Refund for cancelled subscription' },
        ];

        for (const txData of transactionsData) {
            if (txData.subscription_id || txData.subscription_id === null) {
                const existing = await db.Transaction.findOne({
                    where: { user_id: txData.user_id, transaction_date: txData.transaction_date, amount: txData.amount }
                });
                if (!existing) {
                    await db.Transaction.create(txData);
                    console.log(`✅ Transaction created: ${txData.description}`);
                }
            }
        }

        console.log('\n🎉 Database seeding completed!');
        console.log(`\n📌 Login with: ${adminEmail} / ${adminPassword}`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedDatabase();
