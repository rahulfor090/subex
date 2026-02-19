import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, Edit, Trash2, AlertCircle, Loader2, CheckCircle2,
    ExternalLink, Calendar, CreditCard, RefreshCw, Tag, Folder,
    Globe, FileText, DollarSign, Clock, Shield, StickyNote
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import CompanyLogo, { getDomain } from '../../components/CompanyLogo';

// ─── Brand colour map (matches ServicesBrowseModal) ──────────────────────────
const BRAND_COLORS = {
    'netflix': { bg: '#E50914', text: '#fff' },
    'disney+': { bg: '#0C3572', text: '#fff' },
    'disney plus': { bg: '#0C3572', text: '#fff' },
    'amazon prime': { bg: '#00A8E1', text: '#fff' },
    'prime video': { bg: '#00A8E1', text: '#fff' },
    'apple tv+': { bg: '#1C1C1E', text: '#fff' },
    'apple tv': { bg: '#1C1C1E', text: '#fff' },
    'hbo max': { bg: '#1B0533', text: '#fff' },
    'hbo': { bg: '#1B0533', text: '#fff' },
    'hulu': { bg: '#3DBB3D', text: '#fff' },
    'peacock': { bg: '#000000', text: '#fff' },
    'paramount+': { bg: '#0064FF', text: '#fff' },
    'crunchyroll': { bg: '#F47521', text: '#fff' },
    'youtube premium': { bg: '#FF0000', text: '#fff' },
    'youtube': { bg: '#FF0000', text: '#fff' },
    'mubi': { bg: '#0F2027', text: '#fff' },
    'spotify': { bg: '#1DB954', text: '#fff' },
    'apple music': { bg: '#FC3C44', text: '#fff' },
    'youtube music': { bg: '#FF0000', text: '#fff' },
    'tidal': { bg: '#000000', text: '#fff' },
    'amazon music': { bg: '#00A8E1', text: '#fff' },
    'deezer': { bg: '#A238FF', text: '#fff' },
    'soundcloud': { bg: '#FF5500', text: '#fff' },
    'microsoft 365': { bg: '#D83B01', text: '#fff' },
    'microsoft': { bg: '#D83B01', text: '#fff' },
    'office 365': { bg: '#D83B01', text: '#fff' },
    'google one': { bg: '#4285F4', text: '#fff' },
    'google': { bg: '#4285F4', text: '#fff' },
    'notion': { bg: '#000000', text: '#fff' },
    'slack': { bg: '#4A154B', text: '#fff' },
    'zoom': { bg: '#2D8CFF', text: '#fff' },
    'dropbox': { bg: '#0061FF', text: '#fff' },
    'grammarly': { bg: '#15C39A', text: '#fff' },
    'icloud': { bg: '#3478F6', text: '#fff' },
    'onedrive': { bg: '#094AB2', text: '#fff' },
    'adobe creative cloud': { bg: '#DA1F26', text: '#fff' },
    'adobe': { bg: '#DA1F26', text: '#fff' },
    'figma': { bg: '#000000', text: '#fff' },
    'canva': { bg: '#00C4CC', text: '#fff' },
    'xbox game pass': { bg: '#107C10', text: '#fff' },
    'xbox': { bg: '#107C10', text: '#fff' },
    'playstation plus': { bg: '#003087', text: '#fff' },
    'playstation': { bg: '#003087', text: '#fff' },
    'nintendo': { bg: '#E4000F', text: '#fff' },
    'ea play': { bg: '#FF4500', text: '#fff' },
    'ea': { bg: '#FF4500', text: '#fff' },
    'peloton': { bg: '#CC0000', text: '#fff' },
    'calm': { bg: '#3A3A8C', text: '#fff' },
    'headspace': { bg: '#F47D20', text: '#fff' },
    'strava': { bg: '#FC4C02', text: '#fff' },
    'github copilot': { bg: '#24292F', text: '#fff' },
    'github': { bg: '#24292F', text: '#fff' },
    'vercel': { bg: '#000000', text: '#fff' },
    'netlify': { bg: '#00C7B7', text: '#fff' },
    'digitalocean': { bg: '#0080FF', text: '#fff' },
    'aws': { bg: '#FF9900', text: '#232F3E' },
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
};

const getBrand = (name = '') => {
    const key = name.toLowerCase().trim();
    return BRAND_COLORS[key] || null;
};

// Hex → rgba helper
const hexToRgba = (hex, alpha = 1) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
};

// ─── Detail chip ─────────────────────────────────────────────────────────────
const Chip = ({ icon: Icon, label, value, accent }) => (
    <div className="flex flex-col gap-1.5 p-4 rounded-2xl bg-white/60 dark:bg-zinc-800/60 backdrop-blur border border-zinc-200/80 dark:border-zinc-700/80">
        <div className="flex items-center gap-2">
            <Icon size={13} className="text-zinc-400" />
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">{label}</span>
        </div>
        <p className="text-base font-bold text-zinc-900 dark:text-white truncate">{value || '—'}</p>
    </div>
);

// ─── Main component ──────────────────────────────────────────────────────────
const SubscriptionDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { token } = useAuth();

    const [subscription, setSubscription] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteStatus, setDeleteStatus] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => { fetchSubscription(); }, [id]);

    const fetchSubscription = async () => {
        try {
            setLoading(true);
            const res = await fetch(`http://localhost:3000/api/subscriptions/${id}`, {
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
            const res = await fetch(`http://localhost:3000/api/subscriptions/${id}`, {
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

    const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

    const daysUntil = (ds) => {
        if (!ds) return null;
        const diff = Math.ceil((new Date(ds) - new Date()) / 86400000);
        return diff;
    };

    // ── Loading ──────────────────────────────────────────────────
    if (loading) return (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-400 flex items-center justify-center shadow-xl animate-pulse">
                <Loader2 size={28} className="animate-spin text-white" />
            </div>
            <p className="text-zinc-500">Loading subscription…</p>
        </div>
    );

    if (error && !subscription) return (
        <div className="max-w-lg mx-auto mt-16 p-6 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-4">
            <AlertCircle className="text-red-500 flex-shrink-0" />
            <p className="text-red-700 dark:text-red-300 font-medium">{error}</p>
        </div>
    );

    if (!subscription) return null;

    const companyName = subscription.company?.name || '';
    const brand = getBrand(companyName);
    const brandColor = brand?.bg || '#10b981';
    const brandText = brand?.textColor || '#fff';

    const days = daysUntil(subscription.next_payment_date);

    return (
        <div className="max-w-3xl mx-auto pb-16">
            {/* ── Back ──────────────────────────────────────────────── */}
            <button onClick={() => navigate('/dashboard/subscriptions')}
                className="flex items-center gap-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors text-sm mb-6 group">
                <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
                Back to Subscriptions
            </button>

            {/* ── Hero banner ───────────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative rounded-3xl overflow-hidden mb-6 shadow-2xl"
                style={{
                    background: `linear-gradient(135deg, ${brandColor} 0%, ${hexToRgba(brandColor, 0.75)} 100%)`,
                }}
            >
                {/* Decorative blobs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-20"
                        style={{ background: hexToRgba(brandText === '#fff' ? '#ffffff' : '#000000', 0.3) }} />
                    <div className="absolute -bottom-20 -left-10 w-56 h-56 rounded-full opacity-10"
                        style={{ background: hexToRgba(brandText === '#fff' ? '#ffffff' : '#000000', 0.5) }} />
                </div>

                <div className="relative z-10 p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    {/* Large logo */}
                    <div className="flex-shrink-0">
                        <CompanyLogo name={companyName} size="xl" rounded="rounded-2xl" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                                style={{ background: hexToRgba(brandText === '#fff' ? '#000' : '#fff', 0.15), color: brandText }}>
                                {cap(subscription.type)}
                            </span>
                            {subscription.recurring && (
                                <span className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                                    style={{ background: hexToRgba(brandText === '#fff' ? '#000' : '#fff', 0.15), color: brandText }}>
                                    Recurring
                                </span>
                            )}
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-1"
                            style={{ color: brandText }}>
                            {companyName || 'Unknown'}
                        </h1>
                        {subscription.description && (
                            <p className="text-sm font-medium opacity-80 mb-3" style={{ color: brandText }}>
                                {subscription.description}
                            </p>
                        )}
                        <p className="text-4xl font-black tracking-tight" style={{ color: brandText }}>
                            {fmtCurrency(subscription.value, subscription.currency)}
                            <span className="text-base font-semibold opacity-70 ml-2">/ {subscription.cycle}</span>
                        </p>
                    </div>

                    {/* Next due badge */}
                    {days !== null && (
                        <div className="flex-shrink-0 text-center px-5 py-4 rounded-2xl"
                            style={{ background: hexToRgba(brandText === '#fff' ? '#000' : '#fff', 0.15) }}>
                            <p className="text-xs font-bold uppercase tracking-widest opacity-70 mb-1" style={{ color: brandText }}>
                                {days < 0 ? 'Overdue' : days === 0 ? 'Due today' : 'Due in'}
                            </p>
                            <p className="text-3xl font-black leading-none" style={{ color: brandText }}>
                                {Math.abs(days)}
                            </p>
                            <p className="text-xs font-medium opacity-70" style={{ color: brandText }}>days</p>
                        </div>
                    )}
                </div>

                {/* Action bar */}
                <div className="relative z-10 px-8 sm:px-10 pb-6 flex gap-3">
                    <button
                        onClick={() => navigate(`/dashboard/subscriptions/edit/${id}`)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all hover:scale-105 active:scale-100 shadow-lg"
                        style={{ background: hexToRgba(brandText === '#fff' ? '#fff' : '#000', 0.2), color: brandText, border: `1.5px solid ${hexToRgba(brandText, 0.3)}` }}>
                        <Edit size={15} /> Edit
                    </button>
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all hover:scale-105 active:scale-100"
                        style={{ background: hexToRgba('#ef4444', 0.25), color: '#fca5a5', border: '1.5px solid rgba(239,68,68,0.3)' }}>
                        <Trash2 size={15} /> Delete
                    </button>
                    {subscription.url_link && (
                        <a href={subscription.url_link} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all hover:scale-105 active:scale-100 ml-auto"
                            style={{ background: hexToRgba(brandText === '#fff' ? '#fff' : '#000', 0.15), color: brandText, border: `1.5px solid ${hexToRgba(brandText, 0.2)}` }}>
                            <Globe size={15} /> Visit Site <ExternalLink size={12} />
                        </a>
                    )}
                </div>
            </motion.div>

            {/* ── Delete confirm ─────────────────────────────────────── */}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-4">
                        <div className="p-5 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                            <p className="text-red-700 dark:text-red-300 font-semibold mb-4">
                                ⚠️ Are you sure you want to delete <strong>{companyName}</strong>? This cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button onClick={handleDelete} disabled={deleteStatus === 'loading'}
                                    className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl text-sm transition-colors disabled:opacity-50 flex items-center gap-2">
                                    {deleteStatus === 'loading' ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                                    {deleteStatus === 'loading' ? 'Deleting…' : 'Yes, delete it'}
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

            {/* ── Delete success ─────────────────────────────────────── */}
            <AnimatePresence>
                {deleteStatus === 'success' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 mb-4">
                        <CheckCircle2 size={18} />
                        <span className="font-medium">Deleted! Redirecting…</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Details grid ──────────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 }}
                className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4"
            >
                <Chip icon={DollarSign} label="Amount" value={fmtCurrency(subscription.value, subscription.currency)} />
                <Chip icon={RefreshCw} label="Billing" value={`Every ${subscription.frequency} ${subscription.cycle}`} />
                <Chip icon={Shield} label="Recurring" value={subscription.recurring ? 'Yes' : 'No'} />
                <Chip icon={Calendar} label="Next Due" value={fmt(subscription.next_payment_date)} />
                <Chip icon={Clock} label="Expires" value={fmt(subscription.contract_expiry)} />
                <Chip icon={CreditCard} label="Payment" value={cap(subscription.payment_method) || 'Not set'} />
            </motion.div>

            {/* ── Folder + Tags ──────────────────────────────────────── */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div className="p-5 rounded-2xl bg-white/60 dark:bg-zinc-800/60 backdrop-blur border border-zinc-200/80 dark:border-zinc-700/80">
                    <div className="flex items-center gap-2 mb-3">
                        <Folder size={13} className="text-zinc-400" />
                        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Folder</span>
                    </div>
                    <p className="text-base font-bold text-zinc-900 dark:text-white">
                        {subscription.folder?.name || <span className="text-zinc-400 font-normal">No folder</span>}
                    </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/60 dark:bg-zinc-800/60 backdrop-blur border border-zinc-200/80 dark:border-zinc-700/80">
                    <div className="flex items-center gap-2 mb-3">
                        <Tag size={13} className="text-zinc-400" />
                        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Tags</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {subscription.tags?.length > 0 ? (
                            subscription.tags.map(tag => (
                                <span key={tag.id}
                                    className="px-3 py-1 rounded-full text-xs font-semibold"
                                    style={{
                                        background: hexToRgba(brandColor, 0.12),
                                        color: brandColor,
                                        border: `1px solid ${hexToRgba(brandColor, 0.25)}`,
                                    }}>
                                    {tag.name}
                                </span>
                            ))
                        ) : (
                            <span className="text-zinc-400 text-sm">No tags</span>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* ── Notes / Description ───────────────────────────────── */}
            {(subscription.description || subscription.notes) && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.24 }}
                    className="space-y-3">
                    {subscription.description && (
                        <div className="p-5 rounded-2xl bg-white/60 dark:bg-zinc-800/60 backdrop-blur border border-zinc-200/80 dark:border-zinc-700/80">
                            <div className="flex items-center gap-2 mb-2">
                                <FileText size={13} className="text-zinc-400" />
                                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Description</span>
                            </div>
                            <p className="text-zinc-800 dark:text-zinc-200 text-sm leading-relaxed">{subscription.description}</p>
                        </div>
                    )}
                    {subscription.notes && (
                        <div className="p-5 rounded-2xl bg-white/60 dark:bg-zinc-800/60 backdrop-blur border border-zinc-200/80 dark:border-zinc-700/80">
                            <div className="flex items-center gap-2 mb-2">
                                <StickyNote size={13} className="text-zinc-400" />
                                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Notes</span>
                            </div>
                            <p className="text-zinc-800 dark:text-zinc-200 text-sm leading-relaxed whitespace-pre-wrap">{subscription.notes}</p>
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
};

export default SubscriptionDetail;
