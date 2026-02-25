import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    Briefcase, Laptop, TrendingUp, Coins,
    ArrowUpRight, ArrowDownRight, IndianRupee,
    Plus, DollarSign, Wallet, PieChart
} from 'lucide-react';
import {
    ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
    Tooltip, CartesianGrid, Cell, PieChart as RePieChart, Pie
} from 'recharts';

/* ─── Mock Data ─────────────────────────────────────────────── */
const REVENUE_DATA = [
    { source: 'Primary Job', amount: 85000, color: '#10b981', icon: Briefcase },
    { source: 'Freelancing', amount: 25000, color: '#06b6d4', icon: Laptop },
    { source: 'Side Project', amount: 12000, color: '#8b5cf6', icon: Coins },
    { source: 'Investments', amount: 8500, color: '#f59e0b', icon: Wallet },
];

const TREND_DATA = [
    { name: 'Jan', revenue: 110000 },
    { name: 'Feb', revenue: 115000 },
    { name: 'Mar', revenue: 108000 },
    { name: 'Apr', revenue: 122000 },
    { name: 'May', revenue: 125000 },
    { name: 'Jun', revenue: 130500 },
];

/* ─── Helpers ─────────────────────────────────────────────────── */
const fmt = (v) => new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0
}).format(v);

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

/* ─── Components ─────────────────────────────────────────────── */
const RevenueCard = ({ source, amount, color, icon: Icon, delay }) => (
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
            <div className="flex items-center gap-1 text-emerald-500 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded-full">
                <ArrowUpRight size={12} />
                +12%
            </div>
        </div>
        <div>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">{source}</p>
            <h3 className="text-2xl font-black text-zinc-900 dark:text-white">{fmt(amount)}</h3>
        </div>
    </motion.div>
);

const Revenue = () => {
    const totalRevenue = useMemo(() => REVENUE_DATA.reduce((acc, curr) => acc + curr.amount, 0), []);

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
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/25"
                >
                    <Plus size={18} />
                    Add Income Source
                </motion.button>
            </div>

            {/* Top Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {REVENUE_DATA.map((item, i) => (
                    <RevenueCard key={item.source} {...item} delay={i * 0.1} />
                ))}
            </div>

            {/* Main Visualizations */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Trend Chart */}
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
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs font-bold text-zinc-600 dark:text-zinc-300">
                                <TrendingUp size={14} className="text-emerald-500" />
                                8.2% vs last month
                            </div>
                        </div>
                    </div>

                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={TREND_DATA} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#888888" opacity={0.1} />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#888888', fontSize: 12, fontWeight: 600 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#888888', fontSize: 12, fontWeight: 600 }}
                                    tickFormatter={(v) => `₹${v / 1000}k`}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#10b981"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#revenueGradient)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Breakdown Card */}
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
                        <ResponsiveContainer width="100%" height={250}>
                            <RePieChart>
                                <Pie
                                    data={REVENUE_DATA}
                                    dataKey="amount"
                                    nameKey="source"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={90}
                                    stroke="none"
                                    paddingAngle={8}
                                >
                                    {REVENUE_DATA.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-white dark:bg-zinc-950 px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-xl">
                                                    <p className="text-xs font-bold dark:text-white">{payload[0].name}: {fmt(payload[0].value)}</p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                            </RePieChart>
                        </ResponsiveContainer>

                        <div className="mt-6 w-full space-y-3">
                            {REVENUE_DATA.map((item) => (
                                <div key={item.source} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{item.source}</span>
                                    </div>
                                    <span className="text-sm font-bold text-zinc-900 dark:text-white">
                                        {Math.round((item.amount / totalRevenue) * 100)}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Income Streams Table-like list */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-8 rounded-[32px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
            >
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black text-zinc-900 dark:text-white">Income Streams</h2>
                    <button className="text-sm font-bold text-emerald-500 hover:text-emerald-600 transition-colors">View All Streams</button>
                </div>

                <div className="space-y-4">
                    {REVENUE_DATA.map((stream, i) => (
                        <div key={stream.source} className="group flex items-center justify-between p-4 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all cursor-default">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${stream.color}10`, color: stream.color }}>
                                    <stream.icon size={20} />
                                </div>
                                <div>
                                    <p className="font-bold text-zinc-900 dark:text-white">{stream.source}</p>
                                    <p className="text-xs text-zinc-400 font-medium">Monthly Recurring Deposit</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-12">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-bold text-zinc-900 dark:text-white">{Math.round((stream.amount / totalRevenue) * 100)}%</p>
                                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tighter text-center">Share</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-zinc-900 dark:text-white">{fmt(stream.amount)}</p>
                                    <p className="text-xs text-emerald-500 font-bold flex items-center justify-end gap-1">
                                        <TrendingUp size={10} /> +2.4%
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default Revenue;
