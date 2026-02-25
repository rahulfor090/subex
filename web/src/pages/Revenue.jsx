import React, { useMemo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Briefcase, Home, Share2, Globe,
    ArrowUpRight, TrendingUp,
    Plus, Wallet, PieChart, Trash2, Loader2
} from 'lucide-react';
import {
    ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
    Tooltip, CartesianGrid, Cell, PieChart as RePieChart, Pie
} from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { apiFetch } from '../lib/api';

/* ─── Category meta ──────────────────────────────────────────── */
const CATEGORY_META = {
    salary: { label: 'Salary', icon: Briefcase, color: '#10b981' },
    rent: { label: 'Rent', icon: Home, color: '#06b6d4' },
    referral: { label: 'Referrals', icon: Share2, color: '#8b5cf6' },
    online: { label: 'Online', icon: Globe, color: '#f59e0b' },
};

/* ─── Formatters ─────────────────────────────────────────────── */
const fmt = (v, currency = 'USD') => {
    try {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency', currency, maximumFractionDigits: 0
        }).format(v);
    } catch {
        return `${currency} ${Number(v).toLocaleString()}`;
    }
};

/* ─── Tooltip ────────────────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 rounded-xl shadow-2xl">
                <p className="text-xs font-bold text-zinc-400 uppercase mb-1">{label}</p>
                <p className="text-lg font-black text-emerald-500">{fmt(payload[0].value)}</p>
            </div>
        );
    }
    return null;
};

/* ─── Revenue Card ───────────────────────────────────────────── */
const RevenueCard = ({ label, amount, currency, color, icon: Icon, delay, cycle }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5 }}
        className="p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:shadow-xl hover:shadow-emerald-500/5 transition-all group"
    >
        <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center transition-colors"
                style={{ backgroundColor: `${color}15`, color }}>
                <Icon size={22} />
            </div>
            <div className="flex items-center gap-1 text-emerald-500 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded-full capitalize">
                <ArrowUpRight size={12} />
                {cycle}
            </div>
        </div>
        <div>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">{label}</p>
            <h3 className="text-2xl font-black text-zinc-900 dark:text-white">{fmt(amount, currency)}</h3>
        </div>
    </motion.div>
);

/* ─── Empty State ────────────────────────────────────────────── */
const EmptyState = ({ onAdd }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-24 text-center"
    >
        <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 flex items-center justify-center mb-6">
            <Wallet size={36} className="text-emerald-500" />
        </div>
        <h2 className="text-2xl font-black text-zinc-900 dark:text-white mb-2">No income sources yet</h2>
        <p className="text-zinc-500 dark:text-zinc-400 mb-8 max-w-sm">
            Start tracking your income by adding your first source — salary, rent, referrals, or online earnings.
        </p>
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onAdd}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/25"
        >
            <Plus size={18} /> Add Income Source
        </motion.button>
    </motion.div>
);

/* ─── Main Component ─────────────────────────────────────────── */
const Revenue = () => {
    const navigate = useNavigate();
    const { token } = useAuth();

    const [revenues, setRevenues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);

    /* ── Fetch ── */
    useEffect(() => {
        const fetchRevenues = async () => {
            try {
                const res = await apiFetch('/api/revenue', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success) setRevenues(data.data);
            } catch (err) {
                console.error('Failed to load revenue:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchRevenues();
    }, [token]);

    /* ── Delete ── */
    const handleDelete = async (id) => {
        if (!window.confirm('Delete this income source?')) return;
        setDeletingId(id);
        try {
            const res = await apiFetch(`/api/revenue/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) setRevenues(prev => prev.filter(r => r.revenue_id !== id));
        } catch (err) {
            console.error('Delete error:', err);
        } finally {
            setDeletingId(null);
        }
    };

    /* ── Derived values ── */
    const totalRevenue = useMemo(
        () => revenues.reduce((acc, r) => acc + parseFloat(r.amount), 0),
        [revenues]
    );

    /* Group by category for pie chart */
    const pieData = useMemo(() => {
        const grouped = {};
        revenues.forEach(r => {
            const meta = CATEGORY_META[r.source_category];
            if (!grouped[r.source_category]) {
                grouped[r.source_category] = { source: meta.label, amount: 0, color: meta.color };
            }
            grouped[r.source_category].amount += parseFloat(r.amount);
        });
        return Object.values(grouped);
    }, [revenues]);

    /* Build a simple 6-month trend (mock distribution of real total) */
    const trendData = useMemo(() => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const base = totalRevenue || 0;
        return months.map((name, i) => ({
            name,
            revenue: Math.round(base * (0.85 + i * 0.03))
        }));
    }, [totalRevenue]);

    /* ── Loading ── */
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 size={32} className="text-emerald-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white mb-2">
                        Revenue <span className="text-emerald-500">Analytics</span>
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400">Track and manage your diverse income sources</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/dashboard/revenue/add')}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/25"
                >
                    <Plus size={18} />
                    Add Income Source
                </motion.button>
            </div>

            {/* Empty State */}
            {revenues.length === 0 && (
                <EmptyState onAdd={() => navigate('/dashboard/revenue/add')} />
            )}

            {revenues.length > 0 && (
                <>
                    {/* Source Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {revenues.map((r, i) => {
                            const meta = CATEGORY_META[r.source_category] || {
                                label: r.source_category,
                                icon: Wallet,
                                color: '#94a3b8'
                            };
                            return (
                                <RevenueCard
                                    key={r.revenue_id}
                                    label={r.source_subcategory || meta.label}
                                    amount={r.amount}
                                    currency={r.currency}
                                    color={meta.color}
                                    icon={meta.icon}
                                    cycle={r.cycle}
                                    delay={i * 0.1}
                                />
                            );
                        })}
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Trend Chart */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="lg:col-span-2 p-8 rounded-[32px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <p className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-1">Total Monthly Revenue</p>
                                    <h2 className="text-3xl font-black text-zinc-900 dark:text-white">{fmt(totalRevenue)}</h2>
                                </div>
                                <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs font-bold text-zinc-600 dark:text-zinc-300">
                                    <TrendingUp size={14} className="text-emerald-500" />
                                    Projected trend
                                </div>
                            </div>
                            <div className="h-[350px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={trendData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#888888" opacity={0.1} />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false}
                                            tick={{ fill: '#888888', fontSize: 12, fontWeight: 600 }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false}
                                            tick={{ fill: '#888888', fontSize: 12, fontWeight: 600 }}
                                            tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area type="monotone" dataKey="revenue" stroke="#10b981"
                                            strokeWidth={4} fillOpacity={1} fill="url(#revenueGradient)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>

                        {/* Breakdown Pie */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="p-8 rounded-[32px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm flex flex-col"
                        >
                            <div className="mb-6">
                                <p className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-1">Source Breakdown</p>
                                <h2 className="text-2xl font-black text-zinc-900 dark:text-white">Revenue Mix</h2>
                            </div>

                            <div className="flex-1 flex flex-col items-center justify-center min-h-[250px]">
                                {pieData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={220}>
                                        <RePieChart>
                                            <Pie data={pieData} dataKey="amount" nameKey="source"
                                                cx="50%" cy="50%" innerRadius={65} outerRadius={88}
                                                stroke="none" paddingAngle={8}>
                                                {pieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                content={({ active, payload }) => {
                                                    if (active && payload && payload.length) {
                                                        return (
                                                            <div className="bg-white dark:bg-zinc-950 px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-xl">
                                                                <p className="text-xs font-bold dark:text-white">
                                                                    {payload[0].name}: {fmt(payload[0].value)}
                                                                </p>
                                                            </div>
                                                        );
                                                    }
                                                    return null;
                                                }}
                                            />
                                        </RePieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex items-center justify-center h-[220px]">
                                        <PieChart size={48} className="text-zinc-300 dark:text-zinc-700" />
                                    </div>
                                )}

                                <div className="mt-4 w-full space-y-3">
                                    {pieData.map((item) => (
                                        <div key={item.source} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{item.source}</span>
                                            </div>
                                            <span className="text-sm font-bold text-zinc-900 dark:text-white">
                                                {totalRevenue > 0 ? `${Math.round((item.amount / totalRevenue) * 100)}%` : '0%'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Income Streams List */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="p-8 rounded-[32px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black text-zinc-900 dark:text-white">Income Streams</h2>
                            <span className="text-sm font-bold text-zinc-400">{revenues.length} source{revenues.length !== 1 ? 's' : ''}</span>
                        </div>

                        <div className="space-y-4">
                            {revenues.map((r) => {
                                const meta = CATEGORY_META[r.source_category] || {
                                    label: r.source_category,
                                    icon: Wallet,
                                    color: '#94a3b8'
                                };
                                const Icon = meta.icon;
                                const share = totalRevenue > 0 ? Math.round((parseFloat(r.amount) / totalRevenue) * 100) : 0;

                                return (
                                    <div key={r.revenue_id}
                                        className="group flex items-center justify-between p-4 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                                                style={{ backgroundColor: `${meta.color}10`, color: meta.color }}>
                                                <Icon size={20} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-zinc-900 dark:text-white">
                                                    {r.source_subcategory || meta.label}
                                                </p>
                                                <p className="text-xs text-zinc-400 font-medium capitalize">
                                                    {meta.label} · {r.cycle}{r.recurring ? ' · Recurring' : ''}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-8">
                                            <div className="text-right hidden sm:block">
                                                <p className="text-sm font-bold text-zinc-900 dark:text-white">{share}%</p>
                                                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tighter text-center">Share</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-black text-zinc-900 dark:text-white">{fmt(r.amount, r.currency)}</p>
                                                <p className="text-xs text-emerald-500 font-bold flex items-center justify-end gap-1 capitalize">
                                                    <TrendingUp size={10} /> {r.cycle}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleDelete(r.revenue_id)}
                                                disabled={deletingId === r.revenue_id}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-xl hover:bg-red-500/10 text-zinc-400 hover:text-red-500"
                                            >
                                                {deletingId === r.revenue_id
                                                    ? <Loader2 size={16} className="animate-spin" />
                                                    : <Trash2 size={16} />
                                                }
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                </>
            )}
        </div>
    );
};

export default Revenue;
