import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, Loader2, Bell } from 'lucide-react';
import { useAuth } from "../contexts/AuthContext";


const UNIT_OPTIONS = [
    { value: 'day', label: 'Day Before' },
    { value: 'week', label: 'Week Before' },
    { value: 'month', label: 'Month Before' },
];
const ALERT_ON_OPTIONS = [
    { value: 'payment_date', label: 'Payment/Expiry Date' },
    { value: 'contract_expiry', label: 'Contract Expiry' },
];

const defaultForm = { quantity: 1, unit: 'day', alertOn: 'payment_date', contact: '' };

const AlertModal = ({ subscription, onClose }) => {
    const { token, user } = useAuth();
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(defaultForm);
    const [error, setError] = useState(null);
    const [showContactDropdown, setShowContactDropdown] = useState(false);

    // Handle clicking outside to close
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.contact-input-container')) {
                setShowContactDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        fetchAlerts();
    }, []);

    const fetchAlerts = async () => {
        try {
            setLoading(true);
            const res = await fetch(
                `http://localhost:3000/api/alerts?subscriptionId=${subscription.subscription_id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const data = await res.json();
            if (data.success) setAlerts(data.data || []);
        } catch {
            setError('Failed to load alerts.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!form.contact.trim()) {
            setError('Contact is required.');
            return;
        }
        try {
            setSaving(true);
            setError(null);
            const res = await fetch('http://localhost:3000/api/alerts', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    subscriptionId: subscription.subscription_id,
                    quantity: form.quantity,
                    unit: form.unit,
                    alertOn: form.alertOn,
                    contact: form.contact,
                }),
            });
            const data = await res.json();
            if (data.success) {
                await fetchAlerts();
                setForm(defaultForm);
                setShowForm(false);
            } else {
                setError(data.message || 'Failed to create alert.');
            }
        } catch {
            setError('Failed to create alert.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            setDeletingId(id);
            const res = await fetch(`http://localhost:3000/api/alerts/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) {
                setAlerts((prev) => prev.filter((a) => a.id !== id));
            } else {
                setError(data.message || 'Failed to delete alert.');
            }
        } catch {
            setError('Failed to delete alert.');
        } finally {
            setDeletingId(null);
        }
    };

    const alertOnLabel = (val) =>
        ALERT_ON_OPTIONS.find((o) => o.value === val)?.label || val;

    const timePeriodLabel = (q, u) => {
        const unit = u.charAt(0).toUpperCase() + u.slice(1);
        return `${q} ${unit}${q !== 1 ? 's' : ''} Before`;
    };

    const getQuantityOptions = (unit) => {
        if (unit === 'day') return Array.from({ length: 30 }, (_, i) => i + 1);
        return Array.from({ length: 7 }, (_, i) => i + 1);
    };

    const quantityOptions = getQuantityOptions(form.unit);

    return (
        <AnimatePresence>
            {/* Backdrop */}
            <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
                key="modal"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
                <div
                    className="pointer-events-auto w-full max-w-xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-700 overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-700">
                        <div className="flex items-center gap-2">
                            <Bell size={18} className="text-amber-500" />
                            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                                Alerts —{' '}
                                <span className="text-amber-500">
                                    {subscription.company?.name || 'Subscription'}
                                </span>
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="px-6 py-4 space-y-4">
                        {/* Error */}
                        {error && (
                            <div className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                                {error}
                            </div>
                        )}

                        {/* Alerts Table */}
                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="animate-spin text-amber-500" size={24} />
                            </div>
                        ) : alerts.length === 0 && !showForm ? (
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center py-6">
                                No alerts set. Add one below.
                            </p>
                        ) : alerts.length > 0 ? (
                            <div className="rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700">
                                <table className="w-full text-sm">
                                    <thead className="bg-zinc-100 dark:bg-zinc-800/60">
                                        <tr>
                                            <th className="px-4 py-3 text-left font-semibold text-zinc-700 dark:text-zinc-300">
                                                Time Period
                                            </th>
                                            <th className="px-4 py-3 text-left font-semibold text-zinc-700 dark:text-zinc-300">
                                                Alert On
                                            </th>
                                            <th className="px-4 py-3 text-left font-semibold text-zinc-700 dark:text-zinc-300">
                                                Contact
                                            </th>
                                            <th className="px-4 py-3" />
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
                                        {alerts.map((alert) => (
                                            <tr
                                                key={alert.id}
                                                className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors"
                                            >
                                                <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">
                                                    {timePeriodLabel(alert.quantity, alert.unit)}
                                                </td>
                                                <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">
                                                    {alertOnLabel(alert.alert_on)}
                                                </td>
                                                <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300 truncate max-w-[140px]">
                                                    {alert.contact || '—'}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <button
                                                        onClick={() => handleDelete(alert.id)}
                                                        disabled={deletingId === alert.id}
                                                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                                                    >
                                                        {deletingId === alert.id ? (
                                                            <Loader2 size={14} className="animate-spin" />
                                                        ) : (
                                                            <Trash2 size={14} />
                                                        )}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : null}

                        {/* New Alert Form */}
                        {showForm && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/40 p-4 space-y-3"
                            >
                                <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                                    Custom Alert
                                </p>
                                <div className="flex flex-wrap gap-2 items-center">
                                    {/* Quantity */}
                                    <div className="relative">
                                        <select
                                            value={form.quantity}
                                            onChange={(e) =>
                                                setForm((f) => ({ ...f, quantity: Number(e.target.value) }))
                                            }
                                            className="appearance-none bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-600 rounded-lg px-3 py-2 pr-8 text-sm text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 max-h-40"
                                        >
                                            {quantityOptions.map((q) => (
                                                <option key={q} value={q}>
                                                    {q}
                                                </option>
                                            ))}
                                        </select>
                                        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 text-xs">▼</span>
                                    </div>

                                    {/* Unit */}
                                    <div className="relative">
                                        <select
                                            value={form.unit}
                                            onChange={(e) =>
                                                setForm((f) => ({ ...f, unit: e.target.value, quantity: 1 }))
                                            }
                                            className="appearance-none bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-600 rounded-lg px-3 py-2 pr-8 text-sm text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                        >
                                            {UNIT_OPTIONS.map((o) => (
                                                <option key={o.value} value={o.value}>
                                                    {o.label}
                                                </option>
                                            ))}
                                        </select>
                                        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 text-xs">▼</span>
                                    </div>

                                    {/* Alert On */}
                                    <div className="relative">
                                        <select
                                            value={form.alertOn}
                                            onChange={(e) =>
                                                setForm((f) => ({ ...f, alertOn: e.target.value }))
                                            }
                                            className="appearance-none bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-600 rounded-lg px-3 py-2 pr-8 text-sm text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                        >
                                            {ALERT_ON_OPTIONS.map((o) => (
                                                <option key={o.value} value={o.value}>
                                                    {o.label}
                                                </option>
                                            ))}
                                        </select>
                                        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 text-xs">▼</span>
                                    </div>

                                    {/* Contact */}
                                    <div className="relative flex-1 min-w-[140px] contact-input-container">
                                        <input
                                            type="text"
                                            placeholder="Email or phone"
                                            value={form.contact}
                                            onChange={(e) =>
                                                setForm((f) => ({ ...f, contact: e.target.value }))
                                            }
                                            onFocus={() => setShowContactDropdown(true)}
                                            className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-600 rounded-lg px-3 py-2 text-sm text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                                        />

                                        {/* Email Suggestion Dropdown */}
                                        <AnimatePresence>
                                            {showContactDropdown && user?.email && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -4 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -4 }}
                                                    className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-lg overflow-hidden z-20"
                                                >
                                                    <div className="px-3 py-2 text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-100 dark:border-zinc-800/50">
                                                        Suggestion
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            setForm(f => ({ ...f, contact: user.email }));
                                                            setShowContactDropdown(false);
                                                        }}
                                                        className="w-full px-3 py-2 text-left text-sm text-zinc-700 dark:text-zinc-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-2"
                                                    >
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                        {user.email}
                                                    </button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Remove form */}
                                    <button
                                        onClick={() => { setShowForm(false); setForm(defaultForm); setError(null); }}
                                        className="p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/30">
                        {/* New Alert button — hidden when 3 alerts exist or form is open */}
                        {!showForm && alerts.length < 3 ? (
                            <button
                                onClick={() => { setShowForm(true); setError(null); }}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
                            >
                                <Plus size={15} />
                                New Alert
                            </button>
                        ) : (
                            <div />
                        )}

                        <div className="flex gap-2">
                            {showForm && (
                                <button
                                    onClick={handleCreate}
                                    disabled={saving}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-amber-500 hover:bg-amber-600 text-white transition-colors disabled:opacity-50"
                                >
                                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                                    Save Alert
                                </button>
                            )}
                            <button
                                onClick={onClose}
                                className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default AlertModal;
