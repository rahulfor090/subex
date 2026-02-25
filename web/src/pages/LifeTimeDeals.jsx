import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Infinity as InfinityIcon, Sparkles, Plus, Search,
    Filter, ArrowUpRight, DollarSign, Tag, Calendar,
    ExternalLink, CheckCircle2, MoreVertical, ShieldCheck
} from 'lucide-react';

/* ─── Mock Data ─────────────────────────────────────────────── */
const LTD_DEALS = [
    {
        id: 1,
        name: 'Cursor',
        category: 'Development',
        price: 199,
        date: '2023-11-12',
        color: '#10b981',
        description: 'Elite AI-powered code editor with unlimited Claude 3.5 Sonnet usage.',
        tags: ['AI', 'IDE', 'Enterprise']
    },
    {
        id: 2,
        name: 'Jasper',
        category: 'Marketing',
        price: 499,
        date: '2024-01-05',
        color: '#8b5cf6',
        description: 'Business-scale AI content platform for teams with custom brand voice.',
        tags: ['Content', 'Marketing']
    },
    {
        id: 3,
        name: 'Figma',
        category: 'Design',
        price: 999,
        date: '2023-08-20',
        color: '#f59e0b',
        description: 'Lifetime professional license for high-fidelity design & prototyping.',
        tags: ['Design', 'UI/UX']
    },
    {
        id: 4,
        name: 'SubEx Pro',
        category: 'Productivity',
        price: 149,
        date: '2024-02-14',
        color: '#06b6d4',
        description: 'Founder tier access to all current and future financial management tools.',
        tags: ['Finance', 'SaaS']
    },
];

/* ─── Helpers ─────────────────────────────────────────────────── */
const fmt = (v) => new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0
}).format(v);

/* ─── Components ─────────────────────────────────────────────── */
const DealCard = ({ deal, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.5 }}
        className="group relative flex flex-col p-6 rounded-[32px] border border-zinc-200 dark:border-zinc-800 
                   bg-white dark:bg-zinc-900/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 
                   transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10 cursor-default"
    >
        {/* Deal Header */}
        <div className="flex items-start justify-between mb-6">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110"
                style={{ backgroundColor: `${deal.color}15`, color: deal.color }}>
                <InfinityIcon size={28} />
            </div>
            <div className="flex gap-2">
                <button className="p-2 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 
                                 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors">
                    <ExternalLink size={16} />
                </button>
            </div>
        </div>

        {/* Content */}
        <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
                <ShieldCheck size={14} className="text-emerald-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Lifetime Verified</span>
            </div>
            <h3 className="text-xl font-black text-zinc-900 dark:text-white group-hover:text-emerald-500 transition-colors mb-2">
                {deal.name}
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-4 leading-relaxed">
                {deal.description}
            </p>

            <div className="flex flex-wrap gap-1.5 mb-6">
                {deal.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-tight">
                        #{tag}
                    </span>
                ))}
            </div>
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex flex-col">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Investment</span>
                <span className="text-lg font-black text-zinc-900 dark:text-white">{fmt(deal.price)}</span>
            </div>
            <div className="text-right">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Acquired</span>
                <p className="text-xs font-bold text-zinc-600 dark:text-zinc-300 flex items-center gap-1 justify-end">
                    <Calendar size={12} />
                    {new Date(deal.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </p>
            </div>
        </div>
    </motion.div>
);

const LifeTimeDeals = () => {
    const totalSavings = useMemo(() => LTD_DEALS.reduce((acc, curr) => acc + curr.price, 0) * 4.5, []);

    return (
        <div className="space-y-8 pb-12">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-[40px] bg-zinc-900 dark:bg-black p-8 md:p-12 border border-zinc-800 group shadow-2xl">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-grid-white/[0.03] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
                <div className="absolute top-0 right-0 p-8 text-emerald-500/10 group-hover:text-emerald-500/20 transition-colors duration-700">
                    <InfinityIcon size={240} strokeWidth={0.5} />
                </div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="max-w-xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-4">
                            <Sparkles size={14} /> Founders Circle
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4 leading-[1.1]">
                            Life Time <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">Deals Dashboard</span>
                        </h1>
                        <p className="text-zinc-400 font-medium leading-relaxed">
                            Stop the recurring drain. View all your perpetual licenses and calculated lifetime value in one premium hub.
                        </p>
                    </div>

                    <div className="flex flex-col items-center md:items-end">
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] mb-1">Estimated Value Saved</p>
                        <h2 className="text-5xl md:text-6xl font-black text-white tabular-nums tracking-tighter">
                            {fmt(totalSavings)} <span className="text-emerald-500">+</span>
                        </h2>
                        <p className="text-xs font-bold text-emerald-500/60 mt-2 uppercase tracking-widest">Vs Recurring Subscriptions</p>
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-zinc-900/50 p-4 rounded-3xl border border-zinc-200 dark:border-zinc-800">
                <div className="relative flex-1 max-w-md w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search deals, tags or categories..."
                        className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-zinc-100/50 dark:bg-zinc-800/50 border-none outline-none text-sm font-medium
                                   focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-zinc-400"
                    />
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-sm font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                        <Filter size={16} /> Filters
                    </button>
                    <button className="flex-1 sm:flex-none flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/20">
                        <Plus size={18} /> Add Deal
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {LTD_DEALS.map((deal, i) => (
                    <DealCard key={deal.id} deal={deal} index={i} />
                ))}

                {/* Empty State / Add Placeholder */}
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col items-center justify-center p-8 rounded-[32px] border-2 border-dashed border-zinc-200 dark:border-zinc-800 
                               hover:border-emerald-500/50 hover:bg-emerald-500/[0.02] transition-all group min-h-[300px]"
                >
                    <div className="w-16 h-16 rounded-3xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform group-hover:bg-emerald-500 group-hover:text-white duration-500">
                        <Plus size={24} />
                    </div>
                    <p className="font-black text-zinc-400 dark:text-zinc-600 group-hover:text-emerald-500 transition-colors">Add New LTD</p>
                </motion.button>
            </div>
        </div>
    );
};

export default LifeTimeDeals;
