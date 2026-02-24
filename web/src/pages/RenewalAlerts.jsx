import React, { useState, useEffect } from 'react';
import { Bell, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';

const RenewalAlerts = () => {
    const { token } = useAuth();
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        fetchAlerts();
    }, [token]);

    const fetchAlerts = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/alerts`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success && data.data) {
                setAlerts(data.data);
            } else {
                setError(data.message || 'Failed to load alerts');
            }
        } catch (err) {
            console.error('Fetch alerts error:', err);
            setError('Unable to connect to server. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const deleteAlert = async (alertId) => {
        if (!window.confirm('Delete this alert?')) return;
        try {
            setDeletingId(alertId);
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/alerts/${alertId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setAlerts(prev => prev.filter(a => a.id !== alertId));
            } else {
                setError(data.message || 'Failed to delete alert');
            }
        } catch (err) {
            setError('Unable to delete alert');
        } finally {
            setDeletingId(null);
        }
    };

    const formatAlertTime = (unit, quantity) => {
        if (unit === 'day') return `${quantity} day${quantity > 1 ? 's' : ''}`;
        if (unit === 'week') return `${quantity} week${quantity > 1 ? 's' : ''}`;
        return `${quantity} month${quantity > 1 ? 's' : ''}`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin" size={40} />
            </div>
        );
    }

    if (error) {
        return (
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-3"
            >
                <AlertCircle className="text-red-500" />
                <div className="flex-1">{error}</div>
                <Button onClick={fetchAlerts} variant="outline" size="sm">
                    Retry
                </Button>
            </motion.div>
        );
    }

    if (alerts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-10 text-center space-y-4">
                <div className="bg-emerald-100 dark:bg-emerald-900/20 p-4 rounded-full">
                    <Bell size={48} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Renewal Alerts</h1>
                <p className="text-zinc-500 dark:text-zinc-400 max-w-md">
                    Stay on top of your upcoming payments. Renewal notifications will appear here.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">Renewal Alerts</h1>
                <p className="text-zinc-600 dark:text-zinc-400">Total alerts: {alerts.length}</p>
            </div>
            <div className="grid gap-4">
                {alerts.map((alert, idx) => (
                    <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 flex items-start justify-between hover:shadow-md transition-shadow"
                    >
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                                    <Bell size={20} className="text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                                        Alert for Subscription
                                    </h3>
                                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                        {formatAlertTime(alert.unit, alert.quantity)} before renewal
                                    </p>
                                </div>
                            </div>
                            <div className="mt-3 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                                <p className="text-sm text-zinc-700 dark:text-zinc-300">
                                    <span className="font-medium">Alert method:</span> {alert.contact || 'Email'}
                                </p>
                                {alert.note && (
                                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                                        {alert.note}
                                    </p>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={() => deleteAlert(alert.id)}
                            disabled={deletingId === alert.id}
                            className="ml-4 p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                        >
                            {deletingId === alert.id ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                <Trash2 size={20} />
                            )}
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default RenewalAlerts;
