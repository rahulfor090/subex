import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/Header';

const SubscriptionList = () => {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const fetchSubscriptions = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:3000/api/subscriptions', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setSubscriptions(data.data || []);
                setError(null);
            } else {
                setError(data.message || 'Failed to load subscriptions');
            }
        } catch (err) {
            setError('Unable to connect to server. Please try again later.');
            console.error('Fetch subscriptions error:', err);
        } finally {
            setLoading(false);
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
        <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-white antialiased overflow-x-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] pointer-events-none" />
            <div className="fixed inset-0 bg-white/90 dark:bg-black/[0.96] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] pointer-events-none" />

            <Header />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
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
                    <Button
                        onClick={() => navigate('/subscriptions/add')}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg px-6 h-12 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] border-none flex items-center gap-2"
                    >
                        <Plus size={20} />
                        Add a Subscription
                    </Button>
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
                                    onClick={() => navigate('/subscriptions/add')}
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
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-900 dark:text-white">
                                                Service Name
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-900 dark:text-white">
                                                Next Renewal
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-900 dark:text-white">
                                                Category
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-900 dark:text-white">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                        {subscriptions.map((subscription, index) => (
                                            <motion.tr
                                                key={subscription.subscription_id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                onClick={() => navigate(`/subscriptions/${subscription.subscription_id}`)}
                                                className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 cursor-pointer transition-colors"
                                            >
                                                <td className="px-6 py-4 text-sm font-medium text-zinc-900 dark:text-white">
                                                    {subscription.service_name}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                                                    {formatDate(subscription.next_renewal_date)}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                                                    {subscription.category || 'Uncategorized'}
                                                </td>
                                                <td className="px-6 py-4 text-sm">
                                                    <span
                                                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${subscription.is_active
                                                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                                                : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                                                            }`}
                                                    >
                                                        {subscription.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default SubscriptionList;
