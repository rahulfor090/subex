import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    CreditCard,
    Calendar,
    Plus,
    Activity,
    PieChart as PieChartIcon,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import SpendingChart from '../components/dashboard/SpendingChart';
import CategoryPieChart from '../components/dashboard/CategoryPieChart';

// Animation Variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 100 }
    }
};

// Enhanced StatCard
const StatCard = ({ title, value, change, trend, icon: Icon, color }) => (
    <motion.div
        variants={itemVariants}
        className="group relative overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 hover:shadow-xl transition-all duration-300"
    >
        <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-${color}-500 transform group-hover:scale-110 duration-500`}>
            <Icon size={80} />
        </div>

        <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl bg-${color}-50 dark:bg-${color}-500/10 text-${color}-600 dark:text-${color}-400 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={24} />
                </div>
                {change && (
                    <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${trend === 'up'
                            ? 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'
                            : trend === 'down'
                                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                                : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                        }`}>
                        {trend === 'up' && <ArrowUpRight size={14} />}
                        {trend === 'down' && <ArrowDownRight size={14} />}
                        {change}
                    </div>
                )}
            </div>

            <h3 className="text-zinc-500 dark:text-zinc-400 font-medium text-sm mb-1">{title}</h3>
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">{value}</h2>
        </div>
    </motion.div>
);

const Dashboard = () => {
    const navigate = useNavigate();
    const { token, user } = useAuth(); // Assuming user object has name
    const [stats, setStats] = useState({
        totalSubscriptions: 0,
        monthlyCost: 0,
        upcomingPayments: 0
    });
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
                    const subs = data.data;
                    setSubscriptions(subs);

                    // Calculate stats
                    const total = subs.length;
                    const monthly = subs.reduce((acc, sub) => {
                        let cost = parseFloat(sub.value || 0);
                        if (sub.cycle === 'yearly') cost /= 12;
                        if (sub.cycle === 'weekly') cost *= 4;
                        return acc + cost;
                    }, 0);

                    const now = new Date();
                    const nextWeek = new Date();
                    nextWeek.setDate(now.getDate() + 7);

                    const upcoming = subs.filter(sub => {
                        const date = new Date(sub.next_payment_date);
                        return date >= now && date <= nextWeek;
                    });

                    setStats({
                        totalSubscriptions: total,
                        monthlyCost: monthly.toFixed(2),
                        upcomingPayments: upcoming.length
                    });
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token]);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-zinc-200 dark:border-zinc-800 rounded-full"></div>
                    <div className="w-16 h-16 border-4 border-emerald-500 rounded-full animate-spin absolute top-0 left-0 border-t-transparent"></div>
                </div>
            </div>
        );
    }

    const recentSubscriptions = [...subscriptions].slice(0, 5);

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-8 pb-10"
        >
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-emerald-600 dark:text-emerald-400 font-medium mb-1"
                    >
                        {getGreeting()}, {user?.name || 'User'} 👋
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white tracking-tight"
                    >
                        Financial Overview
                    </motion.h1>
                </div>
                <div className="flex gap-3">
                    <Button
                        onClick={() => navigate('/dashboard/subscriptions/add')}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 active:scale-95 transition-all duration-200 h-11 px-6 text-sm font-semibold rounded-xl"
                    >
                        <Plus className="mr-2" size={18} />
                        New Subscription
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Monthly Spend"
                    value={`$${stats.monthlyCost}`}
                    change="+2.5% from last month" // Placeholder for now
                    trend="up"
                    icon={DollarSign}
                    color="emerald"
                />
                <StatCard
                    title="Active Subscriptions"
                    value={stats.totalSubscriptions}
                    change={`${stats.totalSubscriptions} Active services`}
                    trend="neutral"
                    icon={CreditCard}
                    color="blue"
                />
                <StatCard
                    title="Upcoming Payments"
                    value={stats.upcomingPayments}
                    change="Next 7 days"
                    trend="up" // indicating urgency/count
                    icon={Calendar}
                    color="purple"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div
                    variants={itemVariants}
                    className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                                <TrendingUp size={20} className="text-emerald-500" />
                                Spending Forecast
                            </h2>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Projected expenses for the next 6 months</p>
                        </div>
                    </div>
                    <SpendingChart subscriptions={subscriptions} />
                </motion.div>

                <motion.div
                    variants={itemVariants}
                    className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                                <PieChartIcon size={20} className="text-blue-500" />
                                Distribution
                            </h2>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">By category</p>
                        </div>
                    </div>
                    <CategoryPieChart subscriptions={subscriptions} />
                </motion.div>
            </div>

            {/* Recent Activity Section */}
            <motion.div
                variants={itemVariants}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm overflow-hidden"
            >
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                            <Activity size={20} className="text-emerald-500" />
                            Recent Activity
                        </h2>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Latest added subscriptions</p>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate('/dashboard/subscriptions')}
                        className="text-zinc-500 hover:text-emerald-600 dark:hover:text-emerald-400"
                    >
                        View All
                    </Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-zinc-100 dark:border-zinc-800">
                                <th className="text-left py-4 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Company</th>
                                <th className="text-left py-4 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Billing Date</th>
                                <th className="text-left py-4 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Category</th>
                                <th className="text-right py-4 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Amount</th>
                                <th className="text-right py-4 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                            {recentSubscriptions.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-12 text-zinc-500">
                                        No recent activity to show.
                                    </td>
                                </tr>
                            ) : (
                                recentSubscriptions.map((sub, i) => (
                                    <motion.tr
                                        key={sub.subscription_id || i}
                                        whileHover={{ backgroundColor: "rgba(16, 185, 129, 0.03)" }}
                                        className="group transition-colors cursor-pointer"
                                        onClick={() => navigate(`/dashboard/subscriptions/${sub.subscription_id}`)}
                                    >
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500/10 to-cyan-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-sm shadow-sm group-hover:shadow-md transition-all duration-300">
                                                    {sub.company?.name?.[0]?.toUpperCase() || 'S'}
                                                </div>
                                                <span className="font-semibold text-zinc-900 dark:text-white">{sub.company?.name || 'Unknown'}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-sm text-zinc-600 dark:text-zinc-400 font-medium">
                                            {formatDate(sub.next_payment_date)}
                                        </td>
                                        <td className="py-4 px-4">
                                            {sub.tags && sub.tags.length > 0 ? (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                                                    {sub.tags[0].name}
                                                </span>
                                            ) : (
                                                <span className="text-zinc-400 text-sm">-</span>
                                            )}
                                        </td>
                                        <td className="py-4 px-4 text-right font-bold text-zinc-900 dark:text-white">
                                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: sub.currency || 'USD' }).format(sub.value)}
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                                Active
                                            </span>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Dashboard;
