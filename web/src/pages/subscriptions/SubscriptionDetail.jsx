import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../lib/api';
import { Button } from '../../components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, Edit, Trash2, AlertCircle, Loader2, CheckCircle2,
    ExternalLink, CreditCard, RefreshCw, Tag, Folder,
    Globe, FileText, DollarSign, Clock, Shield, StickyNote
} from 'lucide-react';


import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import CompanyLogo from '../../components/CompanyLogo';

// ─── Brand colour map ─────────────────────────────────────────────────────────
const BRAND_COLORS = {
    'netflix': { bg: '#E50914', text: '#fff' },
    'disney+': { bg: '#0C3572', text: '#fff' }, 'disney plus': { bg: '#0C3572', text: '#fff' }, 'disney': { bg: '#0C3572', text: '#fff' },
    'amazon prime': { bg: '#00A8E1', text: '#fff' }, 'prime video': { bg: '#00A8E1', text: '#fff' },
    'apple tv+': { bg: '#1C1C1E', text: '#fff' }, 'apple tv': { bg: '#1C1C1E', text: '#fff' },
    'hbo max': { bg: '#1B0533', text: '#fff' }, 'hbo': { bg: '#1B0533', text: '#fff' }, 'max': { bg: '#1B0533', text: '#fff' },
    'hulu': { bg: '#3DBB3D', text: '#fff' },
    'peacock': { bg: '#000000', text: '#fff' },
    'paramount+': { bg: '#0064FF', text: '#fff' }, 'paramount plus': { bg: '#0064FF', text: '#fff' },
    'crunchyroll': { bg: '#F47521', text: '#fff' },
    'youtube premium': { bg: '#FF0000', text: '#fff' }, 'youtube': { bg: '#FF0000', text: '#fff' },
    'spotify': { bg: '#1DB954', text: '#fff' },
    'apple music': { bg: '#FC3C44', text: '#fff' },
    'tidal': { bg: '#000000', text: '#fff' },
    'deezer': { bg: '#A238FF', text: '#fff' },
    'soundcloud': { bg: '#FF5500', text: '#fff' },
    'microsoft 365': { bg: '#D83B01', text: '#fff' }, 'microsoft': { bg: '#D83B01', text: '#fff' }, 'office 365': { bg: '#D83B01', text: '#fff' },
    'google one': { bg: '#4285F4', text: '#fff' }, 'google': { bg: '#4285F4', text: '#fff' },
    'notion': { bg: '#000000', text: '#fff' },
    'slack': { bg: '#4A154B', text: '#fff' },
    'zoom': { bg: '#2D8CFF', text: '#fff' },
    'dropbox': { bg: '#0061FF', text: '#fff' },
    'grammarly': { bg: '#15C39A', text: '#fff' },
    'icloud': { bg: '#3478F6', text: '#fff' },
    'adobe creative cloud': { bg: '#DA1F26', text: '#fff' }, 'adobe': { bg: '#DA1F26', text: '#fff' },
    'figma': { bg: '#000000', text: '#fff' },
    'canva': { bg: '#00C4CC', text: '#fff' },
    'xbox game pass': { bg: '#107C10', text: '#fff' }, 'xbox': { bg: '#107C10', text: '#fff' },
    'playstation plus': { bg: '#003087', text: '#fff' }, 'playstation': { bg: '#003087', text: '#fff' },
    'nintendo': { bg: '#E4000F', text: '#fff' },
    'ea play': { bg: '#FF4500', text: '#fff' }, 'ea': { bg: '#FF4500', text: '#fff' },
    'peloton': { bg: '#CC0000', text: '#fff' },
    'calm': { bg: '#3A3A8C', text: '#fff' },
    'headspace': { bg: '#F47D20', text: '#fff' },
    'strava': { bg: '#FC4C02', text: '#fff' },
    'github copilot': { bg: '#24292F', text: '#fff' }, 'github': { bg: '#24292F', text: '#fff' },
    'vercel': { bg: '#000000', text: '#fff' },
    'netlify': { bg: '#00C7B7', text: '#fff' },
    'digitalocean': { bg: '#0080FF', text: '#fff' },
    'aws': { bg: '#FF9900', text: '#232F3E' }, 'amazon web services': { bg: '#FF9900', text: '#232F3E' },
    'linear': { bg: '#5E6AD2', text: '#fff' },
    'shopify': { bg: '#96BF48', text: '#fff' },
    'hubspot': { bg: '#FF7A59', text: '#fff' },
    'discord': { bg: '#5865F2', text: '#fff' },
    'twitch': { bg: '#9146FF', text: '#fff' },
    'audible': { bg: '#F8991D', text: '#fff' },
    'scribd': { bg: '#1E7B88', text: '#fff' },
    'medium': { bg: '#000000', text: '#fff' },
    'duolingo': { bg: '#58CC02', text: '#fff' },
    'cloudflare': { bg: '#F48120', text: '#fff' },
    '1password': { bg: '#1A8CFF', text: '#fff' },
    'lastpass': { bg: '#D32D27', text: '#fff' },
    'nordvpn': { bg: '#4687C4', text: '#fff' },
    'apple': { bg: '#1d1d1f', text: '#fff' },
    'amazon': { bg: '#FF9900', text: '#232F3E' },
};

const getBrand = (name = '') => BRAND_COLORS[name.toLowerCase().trim()] || null;

const hexToRgba = (hex = '#000000', alpha = 1) => {
    const clean = hex.replace('#', '');
    const r = parseInt(clean.slice(0, 2), 16) || 0;
    const g = parseInt(clean.slice(2, 4), 16) || 0;
    const b = parseInt(clean.slice(4, 6), 16) || 0;
    return `rgba(${r},${g},${b},${alpha})`;
};

// ─── Detail chip ─────────────────────────────────────────────────────────────
const Chip = ({ icon: Icon, label, value }) => (
    <div className="flex flex-col gap-1.5 p-4 rounded-2xl bg-white/70 dark:bg-zinc-800/60 backdrop-blur border border-zinc-200/80 dark:border-zinc-700/60 shadow-sm">
        <div className="flex items-center gap-1.5">
            <Icon size={12} className="text-zinc-400" />
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{label}</span>
        </div>
        <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">{value || '—'}</p>
    </div>
);

// ─── Main ─────────────────────────────────────────────────────────────────────
const SubscriptionDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { token } = useAuth();

    const [subscription, setSubscription] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteStatus, setDeleteStatus] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [duplicateStatus, setDuplicateStatus] = useState(null);
    const [duplicateMessage, setDuplicateMessage] = useState('');

    useEffect(() => { fetchSubscription(); }, [id]);

    const fetchSubscription = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/subscriptions/${id}`, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
            });
            const data = await res.json();
            if (res.ok && data.success) { setSubscription(data.data); setError(null); }
            else setError(data.message || 'Failed to load subscription');
        } catch { setError('Unable to connect to server.'); }
        finally { setLoading(false); }
    };

    const handleDelete = async () => {
        try {
            setDeleteStatus('loading');
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/subscriptions/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setDeleteStatus('success');
                setTimeout(() => navigate('/dashboard/subscriptions'), 1500);
            } else { setDeleteStatus('error'); setError(data.message || 'Delete failed'); }
        } catch { setDeleteStatus('error'); setError('Unable to connect to server.'); }
    };
    const fmt = (ds) => {
        if (!ds) return 'N/A';
        return new Date(ds).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    };

    const fmtCurrency = (amt, cur) => {
        if (!amt) return 'N/A';
        try { return new Intl.NumberFormat('en-US', { style: 'currency', currency: cur || 'USD', maximumFractionDigits: 2 }).format(amt); }
        catch { return `${cur} ${amt}`; }
    };

    const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '—';

    const daysUntil = (ds) => {
        if (!ds) return null;
        return Math.ceil((new Date(ds) - new Date()) / 86400000);
    };

    // ── Loading ───────────────────────────────────────────────────────────────
    if (loading) return (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-400 flex items-center justify-center shadow-xl">
                <Loader2 size={24} className="animate-spin text-white" />
            </div>
            <p className="text-zinc-400 text-sm">Loading subscription…</p>
        </div>
    );

    if (error && !subscription) return (
        <div className="max-w-lg mx-auto mt-16 p-5 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-4">
            <AlertCircle className="text-red-500 flex-shrink-0" />
            <p className="text-red-700 dark:text-red-300 font-medium">{error}</p>
        </div>
    );

    if (!subscription) return null;

    const companyName = subscription.company?.name || '';
    const brand = getBrand(companyName);
    const brandColor = brand?.bg || '#10b981';
    const brandText = brand?.text || '#fff';
    const isLight = brandText !== '#fff';

    const days = daysUntil(subscription.next_payment_date);

    return (
        <div className="max-w-3xl mx-auto pb-16">

            {/* Back */}
            <button onClick={() => navigate('/dashboard/subscriptions')}
                className="flex items-center gap-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors text-sm mb-6 group">
                <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
                Back to Subscriptions
            </button>

            {/* ── Hero banner ──────────────────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="relative rounded-3xl overflow-hidden mb-5 shadow-2xl"
                style={{ background: `linear-gradient(135deg, ${brandColor} 0%, ${hexToRgba(brandColor, 0.8)} 100%)` }}
            >
                {/* Decorative orbs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
                    <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full"
                        style={{ background: hexToRgba(isLight ? '#000' : '#fff', 0.12) }} />
                    <div className="absolute -bottom-20 -left-10 w-56 h-56 rounded-full"
                        style={{ background: hexToRgba(isLight ? '#000' : '#fff', 0.07) }} />
                </div>

                {/* Content */}
                <div className="relative z-10 p-7 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <CompanyLogo name={companyName} size="xl" rounded="rounded-2xl" className="shadow-2xl flex-shrink-0" />

                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap gap-2 mb-2">
                            <span className="text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                                style={{ background: hexToRgba(isLight ? '#000' : '#fff', 0.18), color: brandText }}>
                                {cap(subscription.type)}
                            </span>
                            {subscription.recurring && (
                                <span className="text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                                    style={{ background: hexToRgba(isLight ? '#000' : '#fff', 0.18), color: brandText }}>
                                    Recurring
                                </span>
                            )}
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-none mb-2"
                            style={{ color: brandText }}>
                            {companyName || 'Unknown'}
                        </h1>
                        {subscription.description && (
                            <p className="text-sm font-medium mb-3 opacity-75" style={{ color: brandText }}>
                                {subscription.description}
                            </p>
                        )}
                        <p className="text-3xl font-black" style={{ color: brandText }}>
                            {fmtCurrency(subscription.actual_amount, subscription.currency)}
                            <span className="text-sm font-semibold opacity-60 ml-2">/ {subscription.cycle}</span>
                        </p>
                        {subscription.amount_paid && (
                            <p className="text-md font-medium" style={{ color: brandText }}>
                                Paid: {fmtCurrency(subscription.amount_paid, subscription.currency)}
                            </p>
                        )}
                    </div>

                    {/* Days badge */}
                    {days !== null && (
                        <div className="flex-shrink-0 text-center px-5 py-4 rounded-2xl"
                            style={{ background: hexToRgba(isLight ? '#000' : '#fff', 0.15) }}>
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-0.5" style={{ color: brandText }}>
                                {days < 0 ? 'Overdue' : days === 0 ? 'Due' : 'Due in'}
                            </p>
                            <p className="text-4xl font-black leading-none" style={{ color: brandText }}>
                                {Math.abs(days)}
                            </p>
                            <p className="text-[10px] font-medium opacity-60" style={{ color: brandText }}>days</p>
                        </div>
                    )}
                </div>

                {/* Action bar */}
                <div className="relative z-10 px-7 sm:px-10 pb-6 flex flex-wrap items-center gap-2">
                    <button
                        onClick={() => navigate(`/dashboard/subscriptions/edit/${id}`)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all hover:scale-105 active:scale-100 shadow-md"
                        style={{ background: hexToRgba(isLight ? '#000' : '#fff', 0.18), color: brandText, border: `1.5px solid ${hexToRgba(brandText, 0.25)}` }}>
                        <Edit size={14} /> Edit
                    </button>
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all hover:scale-105 active:scale-100"
                        style={{ background: 'rgba(239,68,68,0.25)', color: '#fca5a5', border: '1.5px solid rgba(239,68,68,0.35)' }}>
                        <Trash2 size={14} /> Delete
                    </button>

                    <div className="ml-auto flex items-center gap-2 flex-wrap justify-end">
                        {subscription.actual_amount && subscription.amount_paid && parseFloat(subscription.actual_amount) > parseFloat(subscription.amount_paid) && (
                            <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm"
                                style={{ background: hexToRgba(isLight ? '#000' : '#fff', 0.15), color: brandText, border: `1.5px solid ${hexToRgba(brandText, 0.2)}` }}>
                                You saved {fmtCurrency(subscription.actual_amount - subscription.amount_paid, subscription.currency)} this much money
                            </div>
                        )}
                        {subscription.url_link && (
                            <a href={subscription.url_link} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all hover:scale-105 active:scale-100"
                                style={{ background: hexToRgba(isLight ? '#000' : '#fff', 0.13), color: brandText, border: `1.5px solid ${hexToRgba(brandText, 0.2)}` }}>
                                <Globe size={14} /> Visit <ExternalLink size={11} />
                            </a>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* ── Delete confirm ────────────────────────────────────────────── */}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-4">
                        <div className="p-5 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                            <p className="text-red-700 dark:text-red-300 font-semibold mb-4">
                                ⚠️ Delete <strong>{companyName}</strong>? This cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button onClick={handleDelete} disabled={deleteStatus === 'loading'}
                                    className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl text-sm transition-colors disabled:opacity-50 flex items-center gap-2">
                                    {deleteStatus === 'loading' ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                                    {deleteStatus === 'loading' ? 'Deleting…' : 'Yes, delete'}
                                </button>
                                <button onClick={() => setShowDeleteConfirm(false)}
                                    className="px-5 py-2.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 font-semibold rounded-xl text-sm transition-colors">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Delete success ────────────────────────────────────────────── */}
            <AnimatePresence>
                {deleteStatus === 'success' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 mb-4">
                        <CheckCircle2 size={18} />
                        <span className="font-medium">Deleted! Redirecting…</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Error banner ─────────────────────────────────────────────── */}
            {error && (
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 mb-4">
                    <AlertCircle size={16} />
                    <span className="text-sm font-medium">{error}</span>
                </div>
            )}

            {/* ── Details grid ─────────────────────────────────────────────── */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">

                <Chip icon={DollarSign} label="Actual Amount" value={fmtCurrency(subscription.actual_amount, subscription.currency)} />
                <Chip icon={DollarSign} label="Amount Paid" value={subscription.amount_paid ? fmtCurrency(subscription.amount_paid, subscription.currency) : '—'} />
                <Chip icon={RefreshCw} label="Billing" value={`Every ${subscription.frequency || 1} ${subscription.cycle}`} />
                <Chip icon={Shield} label="Recurring" value={subscription.recurring ? 'Yes' : 'No'} />
                <Chip icon={Clock} label="Next Due" value={fmt(subscription.next_payment_date)} />
                <Chip icon={Clock} label="Expires" value={fmt(subscription.contract_expiry)} />
                <Chip icon={CreditCard} label="Payment" value={cap(subscription.payment_method) || 'Not set'} />
            </motion.div>


            {/* ── Folder + Tags ─────────────────────────────────────────────── */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}

                className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div className="p-5 rounded-2xl bg-white/70 dark:bg-zinc-800/60 backdrop-blur border border-zinc-200/80 dark:border-zinc-700/60 shadow-sm">
                    <div className="flex items-center gap-1.5 mb-3">
                        <Folder size={12} className="text-zinc-400" />
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Folder</span>
                    </div>
                    <p className="text-sm font-bold text-zinc-900 dark:text-white">
                        {subscription.folder?.name || <span className="text-zinc-400 font-normal italic">No folder</span>}
                    </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/70 dark:bg-zinc-800/60 backdrop-blur border border-zinc-200/80 dark:border-zinc-700/60 shadow-sm">
                    <div className="flex items-center gap-1.5 mb-3">
                        <Tag size={12} className="text-zinc-400" />
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Tags</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {subscription.tags?.length > 0 ? subscription.tags.map(tag => (
                            <span key={tag.id} className="px-3 py-1 rounded-full text-xs font-semibold"
                                style={{
                                    background: hexToRgba(brandColor, 0.1),
                                    color: brandColor,
                                    border: `1px solid ${hexToRgba(brandColor, 0.25)}`,
                                }}>
                                {tag.name}
                            </span>
                        )) : <span className="text-zinc-400 text-sm italic">No tags</span>}
                    </div>
                </div>
            </motion.div>

            {/* ── Notes / Description ───────────────────────────────────────── */}
            {(subscription.description || subscription.notes) && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="space-y-3">
                    {subscription.description && (
                        <div className="p-5 rounded-2xl bg-white/70 dark:bg-zinc-800/60 backdrop-blur border border-zinc-200/80 dark:border-zinc-700/60 shadow-sm">
                            <div className="flex items-center gap-1.5 mb-2">
                                <FileText size={12} className="text-zinc-400" />
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Description</span>
                            </div>
                            <p className="text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed">{subscription.description}</p>
                        </div>
                    )}
                    {subscription.notes && (
                        <div className="p-5 rounded-2xl bg-white/70 dark:bg-zinc-800/60 backdrop-blur border border-zinc-200/80 dark:border-zinc-700/60 shadow-sm">
                            <div className="flex items-center gap-1.5 mb-2">
                                <StickyNote size={12} className="text-zinc-400" />
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Notes</span>
                            </div>
                            <p className="text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed whitespace-pre-wrap">{subscription.notes}</p>
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
};

export default SubscriptionDetail;
