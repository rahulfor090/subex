import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp, TrendingDown, IndianRupee, CreditCard,
    AlertTriangle, ArrowUpRight, Plus, ChevronRight,
    Clock, CheckCircle2, Loader2, Sparkles, Bell
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import CompanyLogo from '../components/CompanyLogo';
import SpendingChart from '../components/dashboard/SpendingChart';
import CategoryPieChart from '../components/dashboard/CategoryPieChart';

// ─── Helpers ───────────────────────────────────────────────────────────────
const fmt = (amount) => {
    try {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency', currency: 'INR', maximumFractionDigits: 0
        }).format(amount);
    } catch { return `₹${amount}`; }
};

const daysUntil = (ds) => {
    if (!ds) return null;
    return Math.ceil((new Date(ds) - new Date()) / 86400000);
};

const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
};

// ─── Stat Card ─────────────────────────────────────────────────────────────
const StatCard = ({ label, value, sub, icon: Icon, accent = false, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.4 }}
        className={`rounded-xl border p-5 ${accent
                ? 'bg-emerald-600 border-emerald-600 text-white'
                : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white'
            }`}
    >
        <div className="flex items-center justify-between mb-3">
            <p className={`text-xs font-medium uppercase tracking-wider ${accent ? 'text-emerald-100' : 'text-zinc-400'}`}>
                {label}
            </p>
            <Icon size={15} className={accent ? 'text-emerald-200' : 'text-zinc-300 dark:text-zinc-600'} />
        </div>
        <p className="text-2xl font-bold tracking-tight">{value}</p>
        {sub && (
            <p className={`text-xs mt-1.5 ${accent ? 'text-emerald-100' : 'text-zinc-400'}`}>{sub}</p>
        )}
    </motion.div>
);

// ─── Upcoming renewal row ───────────────────────────────────────────────────
const RenewalRow = ({ sub }) => {
    const days = daysUntil(sub.next_payment_date);
    const overdue = days !== null && days < 0;
    const urgent = days !== null && days <= 3 && days >= 0;
    const soon = days !== null && days <= 7 && days > 3;

    return (
        <div className="flex items-center gap-3 py-3 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
            <CompanyLogo name={sub.company?.name || ''} size="sm" rounded="rounded-lg" />
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">{sub.company?.name || 'Unknown'}</p>
                <p className="text-xs text-zinc-400 truncate">
                    {sub.cycle} · {sub.currency} {sub.actual_amount}
                </p>
                <p className="text-xs text-zinc-400 truncate">{fmt(sub.value)} · {sub.cycle}</p>
            </div>
            {days !== null && (
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${overdue ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' :
                        urgent ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400' :
                            soon ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' :
                                'text-zinc-400'
                    }`}>
                    {overdue ? `${Math.abs(days)}d ago` : days === 0 ? 'Today' : `${days}d`}
                </span>
            )}
        </div>
    );
};
const ActivityRow = ({ sub, onClick }) => (
    <tr onClick={onClick}
        className="group hover:bg-zinc-50 dark:hover:bg-zinc-800/40 cursor-pointer transition-colors">
        <td className="px-5 py-3.5">
            <div className="flex items-center gap-3">
                <CompanyLogo name={sub.company?.name || ''} size="sm" rounded="rounded-xl" />
                <div>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-white">{sub.company?.name || 'Unknown'}</p>
                    {sub.description && <p className="text-xs text-zinc-400 truncate max-w-[160px]">{sub.description}</p>}
                </div>
            </div>
        </td>
        <td className="px-5 py-3.5 text-sm text-zinc-500 dark:text-zinc-400 capitalize">{sub.cycle}</td>
        <td className="px-5 py-3.5 text-sm font-semibold text-zinc-900 dark:text-white">
            {fmt(sub.amount_paid || sub.actual_amount, sub.currency)}
        </td>
        <td className="px-5 py-3.5">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${sub.type === 'subscription' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' :
                sub.type === 'trial' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                    'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400'
                }`}>
                {sub.type}
            </span>
        </td>
        <td className="px-5 py-3.5 text-right">
            <ChevronRight size={14} className="text-zinc-300 group-hover:text-emerald-500 transition-colors ml-auto" />
        </td>
    </tr>
);
const Dashboard = () => {
    const navigate = useNavigate();
    const { user, token } = useAuth();
    const [subs, setSubs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/subscriptions`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(r => r.json())
            .then(d => { if (d.success) setSubs(d.data || []); })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [token]);

    // ── Derived stats ──────────────────────────────────────────────────────
    const monthly = subs.reduce((acc, s) => {
        const v = parseFloat(s.actual_amount) || 0;
        if (s.cycle === 'monthly') return acc + v;
        if (s.cycle === 'yearly') return acc + v / 12;
        if (s.cycle === 'weekly') return acc + v * 4.33;
        if (s.cycle === 'quarterly') return acc + v / 3;
        return acc;
    }, 0);

    const annual = monthly * 12;
    const active = subs.filter(s => s.type === 'subscription').length;

    const upcoming = [...subs]
        .filter(s => s.next_payment_date)
        .sort((a, b) => new Date(a.next_payment_date) - new Date(b.next_payment_date))
        .slice(0, 5);

    const overdueCount = subs.filter(s => {
        const d = daysUntil(s.next_payment_date);
        return d !== null && d < 0;
    }).length;

    const dueIn7 = upcoming.filter(s => {
        const d = daysUntil(s.next_payment_date);
        return d !== null && d >= 0 && d <= 7;
    }).length;

    // Estimated annual savings from annual/quarterly billing vs. monthly
    const annualSavings = subs.reduce((acc, s) => {
        const v = parseFloat(s.value) || 0;
        if (s.cycle === 'yearly') return acc + v * 0.20;
        if (s.cycle === 'quarterly') return acc + (v * 4) * 0.08;
        return acc;
    }, 0);

    // ── Loading ─────────────────────────────────────────────────────────────
    if (loading) return (
        <div className="flex flex-col items-center justify-center py-40 gap-3">
            <Loader2 size={24} className="text-emerald-500 animate-spin" />
            <p className="text-sm text-zinc-400">Loading your dashboard…</p>
        </div>
    );

    return (
        <div className="space-y-8 max-w-6xl">

            {/* ── Header row ─────────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex items-center justify-between gap-4"
            >
                <div>
                    <h1 className="text-xl font-semibold text-zinc-900 dark:text-white">
                        {greeting()}, {user?.name?.split(' ')[0] || 'there'}
                    </h1>
                    <p className="text-sm text-zinc-400 mt-0.5">
                        {subs.length} subscription{subs.length !== 1 ? 's' : ''} tracked
                        {overdueCount > 0 && <> · <span className="text-red-500">{overdueCount} overdue</span></>}
                        {dueIn7 > 0 && <> · <span className="text-amber-500">{dueIn7} due this week</span></>}
                    </p>
                </div>
                <button
                    onClick={() => navigate('/dashboard/subscriptions/add')}
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-semibold rounded-lg hover:bg-zinc-700 dark:hover:bg-zinc-100 transition-colors"
                >
                    <Plus size={15} />
                    Add
                </button>
            </motion.div>

            {/* ── Stat cards ─────────────────────────────────────── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <StatCard
                    label="Monthly" icon={IndianRupee}
                    value={fmt(monthly)} accent delay={0.04}
                />
                <StatCard
                    label="Annual" icon={TrendingUp}
                    value={fmt(annual)}
                    sub={`${active} active plan${active !== 1 ? 's' : ''}`}
                    delay={0.08}
                />
                <StatCard
                    label="Saving / yr" icon={TrendingDown}
                    value={annualSavings > 0 ? fmt(annualSavings) : '₹0'}
                    sub={annualSavings > 0 ? 'vs monthly billing' : 'Switch to annual plans'}
                    delay={0.12}
                />
                <StatCard
                    label="Due this week" icon={AlertTriangle}
                    value={dueIn7}
                    sub={overdueCount > 0 ? `${overdueCount} overdue` : 'All clear'}
                    delay={0.16}
                />
            </div>

            {/* ── Charts ─────────────────────────────────────────── */}
            {subs.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Spending chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6"
                    >
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <p className="text-sm font-semibold text-zinc-900 dark:text-white">Spending projection</p>
                                <p className="text-xs text-zinc-400 mt-0.5">Next 6 months</p>
                            </div>
                        </div>
                        <SpendingChart subscriptions={subs} />
                    </motion.div>

                    {/* Category breakdown */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.24 }}
                        className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6"
                    >
                        <p className="text-sm font-semibold text-zinc-900 dark:text-white mb-1">By category</p>
                        <p className="text-xs text-zinc-400 mb-5">Subscription breakdown</p>
                        <CategoryPieChart subscriptions={subs} />
                    </motion.div>
                </div>
            )}

            {/* ── Bottom row ─────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                {/* Upcoming renewals */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.28 }}
                    className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-sm font-semibold text-zinc-900 dark:text-white">Upcoming renewals</p>
                        <button
                            onClick={() => navigate('/dashboard/subscriptions')}
                            className="text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 flex items-center gap-1 transition-colors"
                        >
                            View all <ArrowUpRight size={11} />
                        </button>
                    </div>

                    {upcoming.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <CheckCircle2 size={24} className="text-emerald-400 mb-2" />
                            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">All clear</p>
                            <p className="text-xs text-zinc-400 mt-0.5">No upcoming renewals</p>
                        </div>
                    ) : (
                        upcoming.map(s => <RenewalRow key={s.subscription_id} sub={s} />)
                    )}
                </motion.div>

                {/* Subscriptions table */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.32 }}
                    className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden"
                >
                    <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
                        <p className="text-sm font-semibold text-zinc-900 dark:text-white">Recent subscriptions</p>
                        <button
                            onClick={() => navigate('/dashboard/subscriptions')}
                            className="text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 flex items-center gap-1 transition-colors"
                        >
                            View all <ArrowUpRight size={11} />
                        </button>
                    </div>

                    {subs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                            <Sparkles size={24} className="text-zinc-300 dark:text-zinc-600" />
                            <div>
                                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">No subscriptions yet</p>
                                <p className="text-xs text-zinc-400 mt-0.5">Start by adding your first one</p>
                            </div>
                            <button
                                onClick={() => navigate('/dashboard/subscriptions/add')}
                                className="mt-1 px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-semibold rounded-lg hover:bg-zinc-700 dark:hover:bg-zinc-100 transition-colors"
                            >
                                Add subscription
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-zinc-100 dark:border-zinc-800">
                                        <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Service</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Cycle</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Amount</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Type</th>
                                        <th className="px-4 py-3" />
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                    {subs.slice(0, 8).map((s, i) => (
                                        <motion.tr
                                            key={s.subscription_id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.34 + i * 0.03 }}
                                            onClick={() => navigate(`/dashboard/subscriptions/${s.subscription_id}`)}
                                            className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 cursor-pointer transition-colors group"
                                        >
                                            <td className="px-6 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    <CompanyLogo name={s.company?.name || ''} size="sm" rounded="rounded-lg" />
                                                    <span className="font-medium text-zinc-900 dark:text-white">
                                                        {s.company?.name || 'Unknown'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3.5 text-zinc-400 capitalize">{s.cycle}</td>
                                            <td className="px-4 py-3.5 font-semibold text-zinc-900 dark:text-white tabular-nums">
                                                {fmt(s.value)}
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.type === 'subscription'
                                                        ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                                                        : s.type === 'trial'
                                                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                                                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                                                    }`}>
                                                    {s.type}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3.5 text-right">
                                                <ChevronRight size={14} className="text-zinc-300 group-hover:text-zinc-500 transition-colors ml-auto" />
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;
