import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp, TrendingDown, DollarSign, CreditCard,
    Calendar, AlertTriangle, ArrowUpRight, Plus, ChevronRight,
    Zap, Clock, CheckCircle2, Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import CompanyLogo from '../components/CompanyLogo';
import SpendingChart from '../components/dashboard/SpendingChart';
import CategoryPieChart from '../components/dashboard/CategoryPieChart';

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmt = (amount, currency = 'INR') => {
    try {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
    } catch { return `${currency} ${amount}`; }
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

// ─── Stat Card ───────────────────────────────────────────────────────────────
const StatCard = ({ label, value, sub, icon: Icon, trend, color, delay = 0 }) => {
    const colors = {
        emerald: { bg: 'from-emerald-500/10 to-cyan-500/5', icon: 'text-emerald-500', border: 'border-emerald-500/20' },
        violet: { bg: 'from-violet-500/10 to-purple-500/5', icon: 'text-violet-500', border: 'border-violet-500/20' },
        amber: { bg: 'from-amber-500/10 to-orange-500/5', icon: 'text-amber-500', border: 'border-amber-500/20' },
        rose: { bg: 'from-rose-500/10 to-pink-500/5', icon: 'text-rose-500', border: 'border-rose-500/20' },
    };
    const c = colors[color] || colors.emerald;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className={`relative overflow-hidden bg-white dark:bg-zinc-900 rounded-2xl border ${c.border} p-5 shadow-sm hover:shadow-lg transition-all duration-300 group`}
        >
            {/* Background gradient blob */}
            <div className={`absolute inset-0 bg-gradient-to-br ${c.bg} opacity-50 group-hover:opacity-100 transition-opacity duration-300`} />

            <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                    <div className={`p-2.5 rounded-xl bg-white dark:bg-zinc-800 shadow-sm ${c.icon}`}>
                        <Icon size={18} />
                    </div>
                    {trend !== undefined && (
                        <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${trend >= 0 ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400'}`}>
                            {trend >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                            {Math.abs(trend)}%
                        </div>
                    )}
                </div>
                <p className="text-2xl font-black text-zinc-900 dark:text-white mb-1">{value}</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">{label}</p>
                {sub && <p className="text-xs text-zinc-400 mt-1">{sub}</p>}
            </div>
        </motion.div>
    );
};

// ─── Upcoming item ────────────────────────────────────────────────────────────
const UpcomingItem = ({ sub }) => {
    const days = daysUntil(sub.next_payment_date);
    const urgent = days !== null && days <= 7;
    const overdue = days !== null && days < 0;

    return (
        <div className="flex items-center gap-3 py-3 border-b border-zinc-100 dark:border-zinc-800 last:border-0 group">
            <CompanyLogo name={sub.company?.name || ''} size="sm" rounded="rounded-xl" />
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">{sub.company?.name || 'Unknown'}</p>
                <p className="text-xs text-zinc-400 truncate">
                    {sub.cycle} · {sub.currency} {sub.actual_amount}
                </p>
            </div>
            {days !== null && (
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${overdue ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                    urgent ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' :
                        'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
                    }`}>
                    {overdue ? `${Math.abs(days)}d ago` : days === 0 ? 'Today' : `${days}d`}
                </span>
            )}
        </div>
    );
};

// ─── Recent activity row ──────────────────────────────────────────────────────
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

// ─── Main ─────────────────────────────────────────────────────────────────────
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

    // ── Derived stats ─────────────────────────────────────────────────────────
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
        .slice(0, 6);
    const overdueCount = subs.filter(s => {
        const d = daysUntil(s.next_payment_date);
        return d !== null && d < 0;
    }).length;

    if (loading) return (
        <div className="flex items-center justify-center py-32 gap-3 text-zinc-400">
            <Loader2 size={22} className="animate-spin text-emerald-500" />
            <span>Loading your dashboard…</span>
        </div>
    );

    return (
        <div className="space-y-8">
            {/* ── Greeting ───────────────────────────────────────────── */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-zinc-900 dark:text-white">
                        {greeting()}, {user?.name?.split(' ')[0] || 'there'} 👋
                    </h1>
                    <p className="text-zinc-400 text-sm mt-1">
                        You have <strong className="text-zinc-700 dark:text-zinc-200">{subs.length}</strong> subscriptions tracked
                        {overdueCount > 0 && <>, <span className="text-red-500 font-bold">{overdueCount} overdue</span></>}
                    </p>
                </div>
                <button
                    onClick={() => navigate('/dashboard/subscriptions/add')}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105 active:scale-100 transition-all text-sm">
                    <Plus size={16} />
                    Add Subscription
                </button>
            </motion.div>

            {/* ── Stats grid ─────────────────────────────────────────── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Monthly Spend" value={fmt(monthly)} icon={DollarSign} color="emerald" delay={0.05} />
                <StatCard label="Annual Spend" value={fmt(annual)} icon={TrendingUp} color="violet" delay={0.1} />
                <StatCard label="Active Subs" value={active} icon={CheckCircle2} color="amber" delay={0.15} />
                <StatCard label="Upcoming (7d)" value={upcoming.filter(s => { const d = daysUntil(s.next_payment_date); return d !== null && d >= 0 && d <= 7; }).length} icon={AlertTriangle} color="rose" delay={0.2}
                    sub={overdueCount > 0 ? `${overdueCount} overdue` : undefined} />
            </div>

            {/* ── Charts ─────────────────────────────────────────────── */}
            {subs.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                        className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h2 className="text-base font-bold text-zinc-900 dark:text-white">Spending Projection</h2>
                                <p className="text-xs text-zinc-400 mt-0.5">Next 6 months forecast</p>
                            </div>
                            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/20">
                                <Zap size={16} className="text-emerald-500" />
                            </div>
                        </div>
                        <SpendingChart subscriptions={subs} />
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h2 className="text-base font-bold text-zinc-900 dark:text-white">By Category</h2>
                                <p className="text-xs text-zinc-400 mt-0.5">Subscription distribution</p>
                            </div>
                        </div>
                        <CategoryPieChart subscriptions={subs} />
                    </motion.div>
                </div>
            )}

            {/* ── Bottom section ─────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Upcoming renewals */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                    className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                            <Clock size={16} className="text-amber-500" />
                            Upcoming Renewals
                        </h2>
                        <button onClick={() => navigate('/dashboard/subscriptions')}
                            className="text-xs text-emerald-500 hover:text-emerald-600 font-semibold flex items-center gap-1">
                            View all <ArrowUpRight size={12} />
                        </button>
                    </div>
                    {upcoming.length === 0 ? (
                        <p className="text-sm text-zinc-400 py-8 text-center">No upcoming renewals</p>
                    ) : (
                        upcoming.map(s => <UpcomingItem key={s.subscription_id} sub={s} />)
                    )}
                </motion.div>

                {/* Recent subscriptions table */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                    className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
                        <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                            <CreditCard size={16} className="text-violet-500" />
                            Recent Subscriptions
                        </h2>
                        <button onClick={() => navigate('/dashboard/subscriptions')}
                            className="text-xs text-emerald-500 hover:text-emerald-600 font-semibold flex items-center gap-1">
                            View all <ArrowUpRight size={12} />
                        </button>
                    </div>

                    {subs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                                <CreditCard size={28} className="text-zinc-300 dark:text-zinc-600" />
                            </div>
                            <p className="text-zinc-400 font-medium">No subscriptions yet</p>
                            <button onClick={() => navigate('/dashboard/subscriptions/add')}
                                className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl transition-colors">
                                Add your first one
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-zinc-100 dark:border-zinc-800">
                                        <th className="px-5 py-3 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider">Service</th>
                                        <th className="px-5 py-3 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider">Cycle</th>
                                        <th className="px-5 py-3 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider">Amount</th>
                                        <th className="px-5 py-3 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider">Type</th>
                                        <th className="px-5 py-3"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                    {subs.slice(0, 8).map(s => (
                                        <ActivityRow key={s.subscription_id} sub={s}
                                            onClick={() => navigate(`/dashboard/subscriptions/${s.subscription_id}`)} />
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
