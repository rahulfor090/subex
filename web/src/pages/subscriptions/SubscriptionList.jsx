import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../lib/api';
import { motion } from 'framer-motion';
import { Plus, AlertCircle, Loader2, Bell, Globe, Pencil } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/Header';
import AlertModal from '../../components/AlertModal';
import ServicesBrowseModal from '../../components/ServicesBrowseModal';
import CompanyLogo from '../../components/CompanyLogo';

const SubscriptionList = () => {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [alertSubscription, setAlertSubscription] = useState(null);
    const [showBrowse, setShowBrowse] = useState(false);

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const fetchSubscriptions = async () => {
        try {
            setLoading(true);
            console.log('Fetching subscriptions with token:', token ? 'Token exists' : 'No token');

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/subscriptions`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('Response status:', response.status);
            const data = await response.json();
            console.log('Response data:', data);

            if (response.ok && data.success) {
                setSubscriptions(data.data || []);
                setError(null);
            } else {
                console.error('API Error:', data);
                setError(data.message || 'Failed to load subscriptions');
            }
        } catch (err) {
            console.error('Fetch subscriptions error:', err);
            setError('Unable to connect to server. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const deleteSubscription = async (e, subscriptionId) => {
        e.stopPropagation();
        if (!window.confirm('Are you sure you want to delete this subscription?')) return;
        try {
            setDeletingId(subscriptionId);
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/subscriptions/${subscriptionId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (response.ok && data.success) {
                setSubscriptions(prev => prev.filter(s => s.subscription_id !== subscriptionId));
            } else {
                setError(data.message || 'Failed to delete subscription');
            }
        } catch (err) {
            setError('Unable to connect to server. Please try again later.');
        } finally {
            setDeletingId(null);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="space-y-8">

            <div className="relative z-10 mx-auto">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4"
                >
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-2">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-cyan-500">
                                Subscriptions
                            </span>
                        </h1>
                        <p className="text-lg text-zinc-600 dark:text-zinc-400">
                            Manage all your subscriptions in one place
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setShowBrowse(true)}
                            className="flex items-center gap-2 h-12 px-5 border-zinc-300 dark:border-zinc-700"
                        >
                            <Globe size={18} className="text-emerald-500" />
                            Browse Services
                        </Button>
                        <Button
                            onClick={() => navigate('/dashboard/subscriptions/add')}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg px-6 h-12 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] border-none flex items-center gap-2"
                        >
                            <Plus size={20} />
                            Add Subscription
                        </Button>
                    </div>
                </motion.div>

                {/* Loading State */}
                {loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-center py-20"
                    >
                        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                        <span className="ml-3 text-lg text-zinc-600 dark:text-zinc-400">Loading subscriptions...</span>
                    </motion.div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 mb-6"
                    >
                        <AlertCircle size={20} />
                        <span>{error}</span>
                    </motion.div>
                )}

                {/* Subscriptions List */}
                {!loading && !error && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="bg-white dark:bg-zinc-900/50 backdrop-blur border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xl"
                    >
                        {subscriptions.length === 0 ? (
                            <div className="text-center py-16 px-4">
                                <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-4">
                                    No subscriptions yet
                                </p>
                                <p className="text-zinc-500 dark:text-zinc-500 mb-6">
                                    Start by adding your first subscription
                                </p>
                                <Button
                                    onClick={() => navigate('/dashboard/subscriptions/add')}
                                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg px-6 h-12 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] border-none"
                                >
                                    <Plus size={20} className="mr-2" />
                                    Add Your First Subscription
                                </Button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-zinc-100 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-700">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-900 dark:text-white">Company</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-900 dark:text-white">Listed Price</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-900 dark:text-white">Purchase Price</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-900 dark:text-white">Savings</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-900 dark:text-white">Renewal Date</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-900 dark:text-white">Grace Period</th>
                                            <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-900 dark:text-white">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                        {subscriptions.map((subscription, index) => {
                                            const listed = parseFloat(subscription.listed_price) || 0;
                                            const purchased = parseFloat(subscription.purchase_price) || 0;
                                            const savings = listed > 0 && purchased > 0 && listed > purchased ? listed - purchased : null;
                                            return (
                                                <motion.tr
                                                    key={subscription.subscription_id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    onClick={() => navigate(`/dashboard/subscriptions/${subscription.subscription_id}`)}
                                                    className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 cursor-pointer transition-colors"
                                                >
                                                    {/* Company */}
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <CompanyLogo name={subscription.company?.name || ''} size="sm" rounded="rounded-xl" />
                                                            <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                                                                {subscription.company?.name || 'Unknown'}
                                                            </span>
                                                        </div>
                                                    </td>

                                                    {/* Listed Price */}
                                                    <td className="px-6 py-4 text-sm text-zinc-700 dark:text-zinc-300 font-medium">
                                                        {subscription.listed_price
                                                            ? `${subscription.currency} ${subscription.listed_price}`
                                                            : <span className="text-zinc-400">—</span>}
                                                    </td>

                                                    {/* Purchase Price */}
                                                    <td className="px-6 py-4 text-sm text-zinc-700 dark:text-zinc-300 font-medium">
                                                        {subscription.purchase_price
                                                            ? `${subscription.currency} ${subscription.purchase_price}`
                                                            : <span className="text-zinc-400">—</span>}
                                                    </td>

                                                    {/* Savings */}
                                                    <td className="px-6 py-4 text-sm">
                                                        {savings !== null
                                                            ? <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                                                💰 {subscription.currency} {savings.toFixed(2)}
                                                            </span>
                                                            : <span className="text-zinc-400">—</span>}
                                                    </td>

                                                    {/* Renewal Date */}
                                                    <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                                                        {formatDate(subscription.next_payment_date)}
                                                    </td>

                                                    {/* Grace Period */}
                                                    <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                                                        {subscription.grace_period ? formatDate(subscription.grace_period) : <span className="text-zinc-400">—</span>}
                                                    </td>

                                                    {/* Actions */}
                                                    <td className="px-6 py-4 text-sm" onClick={e => e.stopPropagation()}>
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={e => { e.stopPropagation(); navigate(`/dashboard/subscriptions/edit/${subscription.subscription_id}`); }}
                                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-colors"
                                                            >
                                                                <Pencil size={13} />
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={e => { e.stopPropagation(); setAlertSubscription(subscription); }}
                                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
                                                            >
                                                                <Bell size={13} />
                                                                Alerts
                                                            </button>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </motion.div>
                )}
            </div>

            {/* Alert Modal */}
            {alertSubscription && (
                <AlertModal
                    subscription={alertSubscription}
                    onClose={() => setAlertSubscription(null)}
                />
            )}

            {/* Browse Services Modal */}
            {showBrowse && (
                <ServicesBrowseModal
                    onClose={() => setShowBrowse(false)}
                    onSelect={(service) => {
                        navigate('/dashboard/subscriptions/add', {
                            state: { prefill: { companyName: service.name, category: service.category } }
                        });
                    }}
                />
            )}
        </div>
    );
};

export default SubscriptionList;
