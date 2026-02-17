import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit, Trash2, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/Header';

const SubscriptionDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { token } = useAuth();
    const [subscription, setSubscription] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteStatus, setDeleteStatus] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        fetchSubscription();
    }, [id]);

    const fetchSubscription = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:3000/api/subscriptions/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setSubscription(data.data);
                setError(null);
            } else {
                setError(data.message || 'Failed to load subscription details');
            }
        } catch (err) {
            setError('Unable to connect to server. Please try again later.');
            console.error('Fetch subscription error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            setDeleteStatus('loading');
            const response = await fetch(`http://localhost:3000/api/subscriptions/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setDeleteStatus('success');
                setTimeout(() => {
                    navigate('/dashboard');
                }, 1500);
            } else {
                setDeleteStatus('error');
                setError(data.message || 'Failed to delete subscription');
            }
        } catch (err) {
            setDeleteStatus('error');
            setError('Unable to connect to server. Please try again later.');
            console.error('Delete subscription error:', err);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount, currency) => {
        if (!amount) return 'N/A';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency || 'USD'
        }).format(amount);
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-white antialiased overflow-x-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] pointer-events-none" />
            <div className="fixed inset-0 bg-white/90 dark:bg-black/[0.96] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] pointer-events-none" />

            <Header />

            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                {/* Back Button */}
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors mb-8"
                >
                    <ArrowLeft size={20} />
                    <span>Back to Subscriptions</span>
                </motion.button>

                {/* Loading State */}
                {loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-center py-20"
                    >
                        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                        <span className="ml-3 text-lg text-zinc-600 dark:text-zinc-400">Loading subscription...</span>
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

                {/* Subscription Details */}
                {!loading && !error && subscription && (
                    <>
                        {/* Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4"
                        >
                            <div>
                                <h1 className="text-4xl md:text-5xl font-bold mb-2">
                                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-cyan-500">
                                        {subscription.service_name}
                                    </span>
                                </h1>
                                <span
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${subscription.is_active
                                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                            : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                                        }`}
                                >
                                    {subscription.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            <div className="flex gap-3">
                                <Button
                                    onClick={() => navigate(`/subscriptions/edit/${id}`)}
                                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg px-6 h-12 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] border-none flex items-center gap-2"
                                >
                                    <Edit size={18} />
                                    Edit
                                </Button>
                                <Button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg px-6 h-12 shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] border-none flex items-center gap-2"
                                >
                                    <Trash2 size={18} />
                                    Delete
                                </Button>
                            </div>
                        </motion.div>

                        {/* Delete Confirmation */}
                        {showDeleteConfirm && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 mb-6"
                            >
                                <p className="text-red-600 dark:text-red-400 mb-4 font-medium">
                                    Are you sure you want to delete this subscription? This action cannot be undone.
                                </p>
                                <div className="flex gap-3">
                                    <Button
                                        onClick={handleDelete}
                                        disabled={deleteStatus === 'loading'}
                                        className="bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg px-6 h-10 border-none"
                                    >
                                        {deleteStatus === 'loading' ? 'Deleting...' : 'Yes, Delete'}
                                    </Button>
                                    <Button
                                        onClick={() => setShowDeleteConfirm(false)}
                                        className="bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-900 dark:text-white font-semibold rounded-lg px-6 h-10 border-none"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {/* Delete Success */}
                        {deleteStatus === 'success' && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-3 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 mb-6"
                            >
                                <CheckCircle2 size={20} />
                                <span>Subscription deleted successfully! Redirecting...</span>
                            </motion.div>
                        )}

                        {/* Details Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="bg-white dark:bg-zinc-900/50 backdrop-blur border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-xl"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <DetailItem label="Service Name" value={subscription.service_name} />
                                <DetailItem label="Category" value={subscription.category || 'Uncategorized'} />
                                <DetailItem label="Cost" value={formatCurrency(subscription.cost, subscription.currency)} />
                                <DetailItem label="Currency" value={subscription.currency} />
                                <DetailItem label="Start Date" value={formatDate(subscription.start_date)} />
                                <DetailItem label="Next Renewal" value={formatDate(subscription.next_renewal_date)} />
                                <DetailItem label="Billing Cycle" value={`Every ${subscription.billing_cycle_number} ${subscription.billing_cycle_period}`} />
                                <DetailItem label="Auto Renew" value={subscription.auto_renew ? 'Yes' : 'No'} />
                                <DetailItem label="Trial" value={subscription.is_trial ? 'Yes' : 'No'} />
                                {subscription.website_url && (
                                    <DetailItem
                                        label="Website"
                                        value={
                                            <a
                                                href={subscription.website_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-emerald-500 hover:text-emerald-600 underline"
                                            >
                                                {subscription.website_url}
                                            </a>
                                        }
                                    />
                                )}
                            </div>
                            {subscription.description && (
                                <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-700">
                                    <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-2">Description</h3>
                                    <p className="text-zinc-900 dark:text-white">{subscription.description}</p>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </div>
        </div>
    );
};

const DetailItem = ({ label, value }) => (
    <div>
        <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-1">{label}</h3>
        <p className="text-lg text-zinc-900 dark:text-white">{value}</p>
    </div>
);

export default SubscriptionDetail;
