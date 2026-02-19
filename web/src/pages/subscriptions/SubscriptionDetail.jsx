import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit, Trash2, AlertCircle, Loader2, CheckCircle2, ExternalLink, Copy } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';


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

    const handleDuplicate = async () => {
        try {
            setDuplicateStatus('loading');
            setDuplicateMessage('');

            // Prepare the duplicate subscription data
            const duplicateData = {
                company_id: subscription.company?.id,
                description: subscription.description,
                type: subscription.type,
                recurring: subscription.recurring,
                frequency: subscription.frequency,
                cycle: subscription.cycle,
                value: subscription.value,
                currency: subscription.currency,
                next_payment_date: subscription.next_payment_date,
                contract_expiry: subscription.contract_expiry,
                url_link: subscription.url_link,
                payment_method: subscription.payment_method,
                folder_id: subscription.folder?.id || null,
                tag_ids: subscription.tags ? subscription.tags.map(tag => tag.id) : [],
                notes: subscription.notes
            };

            const response = await fetch('http://localhost:3000/api/subscriptions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(duplicateData)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setDuplicateStatus('success');
                setDuplicateMessage('Subscription duplicated successfully! Redirecting...');
                setTimeout(() => {
                    navigate(`/dashboard/subscriptions/${data.data.subscription_id}`);
                }, 1500);
            } else {
                setDuplicateStatus('error');
                setDuplicateMessage(data.message || 'Failed to duplicate subscription');
            }
        } catch (err) {
            setDuplicateStatus('error');
            setDuplicateMessage('Unable to connect to server. Please try again later.');
            console.error('Duplicate subscription error:', err);
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
            currency: currency || 'INR'
        }).format(amount);
    };

    const capitalizeFirst = (str) => {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    return (
        <div className="space-y-8">

            <div className="relative z-10 max-w-4xl mx-auto">
                {/* Back Button */}
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => navigate('/dashboard/subscriptions')}
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
                                        {subscription.company?.name || 'Unknown Company'}
                                    </span>
                                </h1>
                                <span
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${subscription.type === 'subscription' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' :
                                        subscription.type === 'trial' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20' :
                                            subscription.type === 'lifetime' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20' :
                                                'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20'
                                        }`}
                                >
                                    {capitalizeFirst(subscription.type)}
                                </span>
                            </div>
                            <div className="flex gap-3">
                                <Button
                                    onClick={handleDuplicate}
                                    disabled={duplicateStatus === 'loading'}
                                    className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg px-6 h-12 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] border-none flex items-center gap-2"
                                >
                                    <Copy size={18} />
                                    {duplicateStatus === 'loading' ? 'Duplicating...' : 'Duplicate'}
                                </Button>
                                <Button
                                    onClick={() => navigate(`/dashboard/subscriptions/edit/${id}`)}
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

                        {/* Duplicate Status Messages */}
                        {duplicateStatus === 'success' && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-3 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 mb-6"
                            >
                                <CheckCircle2 size={20} />
                                <span>{duplicateMessage}</span>
                            </motion.div>
                        )}
                        {duplicateStatus === 'error' && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 mb-6"
                            >
                                <AlertCircle size={20} />
                                <span>{duplicateMessage}</span>
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
                                <DetailItem label="Company" value={subscription.company?.name || 'Unknown'} />
                                <DetailItem label="Type" value={capitalizeFirst(subscription.type)} />
                                <DetailItem label="Value" value={formatCurrency(subscription.value, subscription.currency)} />
                                <DetailItem label="Currency" value={subscription.currency} />
                                <DetailItem label="Recurring" value={subscription.recurring ? 'Yes' : 'No'} />
                                <DetailItem label="Frequency" value={subscription.frequency} />
                                <DetailItem label="Cycle" value={capitalizeFirst(subscription.cycle)} />
                                <DetailItem label="Payment Method" value={subscription.payment_method ? capitalizeFirst(subscription.payment_method) : 'Not Specified'} />
                                <DetailItem label="Next Payment" value={formatDate(subscription.next_payment_date)} />
                                <DetailItem label="Contract Expiry" value={formatDate(subscription.contract_expiry)} />
                                <DetailItem label="Folder" value={subscription.folder?.name || 'No Folder'} />

                                {/* Tags */}
                                <div className="md:col-span-2">
                                    <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-2">Tags</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {subscription.tags && subscription.tags.length > 0 ? (
                                            subscription.tags.map(tag => (
                                                <span
                                                    key={tag.id}
                                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                                >
                                                    {tag.name}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-zinc-500">No tags</span>
                                        )}
                                    </div>
                                </div>

                                {/* URL Link */}
                                {subscription.url_link && (
                                    <div className="md:col-span-2">
                                        <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-1">URL Link</h3>
                                        <a
                                            href={subscription.url_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-emerald-500 hover:text-emerald-600 underline flex items-center gap-1"
                                        >
                                            {subscription.url_link}
                                            <ExternalLink size={14} />
                                        </a>
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            {subscription.description && (
                                <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-700">
                                    <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-2">Description</h3>
                                    <p className="text-zinc-900 dark:text-white">{subscription.description}</p>
                                </div>
                            )}

                            {/* Notes */}
                            {subscription.notes && (
                                <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-700">
                                    <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-2">Notes</h3>
                                    <p className="text-zinc-900 dark:text-white whitespace-pre-wrap">{subscription.notes}</p>
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
