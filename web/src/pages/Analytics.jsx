import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart2,
    TrendingUp,
    PieChart as PieChartIcon,
    DollarSign,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    Activity
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import SpendingChart from '../components/dashboard/SpendingChart';
import CategoryPieChart from '../components/dashboard/CategoryPieChart';
import CostByCompanyChart from '../components/dashboard/CostByCompanyChart';

const AnalyticsCard = ({ title, icon: Icon, children, className = "" }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm ${className}`}
    >
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                <Icon size={20} className="text-emerald-500" />
                {title}
            </h2>
        </div>
        {children}
    </motion.div>
);

const StatItem = ({ label, value, subtext, trend }) => (
    <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
        <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium mb-1">{label}</p>
        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">{value}</h3>
        {subtext && (
            <p className={`text-xs flex items-center gap-1 ${trend === 'up' ? 'text-red-500' :
                trend === 'down' ? 'text-emerald-500' :
                    'text-zinc-400'
                }`}>
                {trend === 'up' && <ArrowUpRight size={12} />}
                {trend === 'down' && <ArrowDownRight size={12} />}
                {subtext}
            </p>
        )}
    </div>
);

const Analytics = () => {
    const { token } = useAuth();
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/subscriptions', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (data.success && data.data) {
                    setSubscriptions(data.data);
                }
            } catch (error) {
                console.error('Error fetching analytics data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [token]);

    const stats = useMemo(() => {
        if (!subscriptions.length) return {};

        const totalMonthly = subscriptions.reduce((acc, sub) => {
            let cost = parseFloat(sub.value || 0);
            if (sub.cycle === 'yearly') cost /= 12;
            if (sub.cycle === 'weekly') cost *= 4;
            return acc + cost;
        }, 0);

        const totalYearly = totalMonthly * 12;
        const avgCost = totalMonthly / subscriptions.length;

        // Find most expensive
        const mostExpensive = [...subscriptions].sort((a, b) => parseFloat(b.value) - parseFloat(a.value))[0];

        return {
            monthly: totalMonthly,
            yearly: totalYearly,
            average: avgCost,
            mostExpensive
        };
    }, [subscriptions]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">Analytics & Insights</h1>
                <p className="text-zinc-500 dark:text-zinc-400">Deep dive into your subscription spending habits.</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatItem
                    label="Monthly Spend"
                    value={`₹${stats.monthly?.toFixed(2) || '0.00'}`}
                    subtext="Estimated recurring"
                    trend="up" // Placeholder logic
                />
                <StatItem
                    label="Yearly Projection"
                    value={`₹${stats.yearly?.toFixed(2) || '0.00'}`}
                    subtext="If current subs remain active"
                />
                <StatItem
                    label="Average Cost"
                    value={`₹${stats.average?.toFixed(2) || '0.00'}`}
                    subtext="Per subscription"
                />
                <StatItem
                    label="Highest Expense"
                    value={stats.mostExpensive ? `₹${stats.mostExpensive.value}` : '₹0.00'}
                    subtext={stats.mostExpensive?.company?.name || '-'}
                />
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AnalyticsCard title="Spending Trend" icon={TrendingUp}>
                    <div className="h-[350px] w-full">
                        <SpendingChart subscriptions={subscriptions} />
                    </div>
                </AnalyticsCard>

                <AnalyticsCard title="Cost by Company (Top 10)" icon={BarChart2}>
                    <div className="h-[350px] w-full">
                        <CostByCompanyChart subscriptions={subscriptions} />
                    </div>
                </AnalyticsCard>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <AnalyticsCard title="Category Distribution" icon={PieChartIcon} className="lg:col-span-1">
                    <div className="h-[300px] w-full">
                        <CategoryPieChart subscriptions={subscriptions} />
                    </div>
                </AnalyticsCard>

                <AnalyticsCard title="Insights" icon={Activity} className="lg:col-span-2">
                    <div className="space-y-4">
                        <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20">
                            <h3 className="font-semibold text-emerald-800 dark:text-emerald-400 mb-2">💡 Saving Tip</h3>
                            <p className="text-sm text-emerald-700 dark:text-emerald-300">
                                You have {subscriptions.filter(s => s.cycle === 'monthly').length} monthly subscriptions.
                                Switching some to yearly billing can often save 10-20%.
                            </p>
                        </div>

                        <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20">
                            <h3 className="font-semibold text-blue-800 dark:text-blue-400 mb-2">📅 Upcoming Heavy Week</h3>
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                                You have 3 payments due in the next 7 days totaling ₹3,500.00.
                            </p>
                        </div>
                    </div>
                </AnalyticsCard>
            </div>
        </div>
    );
};

export default Analytics;
