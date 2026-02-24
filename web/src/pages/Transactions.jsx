import React, { useState, useEffect } from 'react';
import { FileText, Loader2, AlertCircle, Download, IndianRupee, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';

const Transactions = () => {
    const { token } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTransactions();
    }, [token]);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            setError(null);
            // Fetch subscriptions to get associated transactions
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/subscriptions`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success && data.data) {
                // For now, create mock transactions from subscriptions
                // In a real app, subscriptions would include transaction history
                const mockTransactions = data.data.map((sub, idx) => ({
                    transaction_id: sub.subscription_id + idx,
                    description: `${sub.company?.name || 'Subscription'} Payment`,
                    amount: sub.value || 0,
                    status: 'completed',
                    transaction_date: sub.created_at || new Date().toISOString(),
                    gateway_transaction_id: `TXN${sub.subscription_id}${idx}`,
                    subscription_id: sub.subscription_id
                }));
                setTransactions(mockTransactions);
            } else {
                setError(data.message || 'Failed to load transactions');
            }
        } catch (err) {
            console.error('Fetch transactions error:', err);
            setError('Unable to connect to server. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'success':
            case 'completed':
                return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'failed':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            default:
                return 'bg-zinc-100 text-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-400';
        }
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
                <Button onClick={fetchTransactions} variant="outline" size="sm">
                    Retry
                </Button>
            </motion.div>
        );
    }

    if (transactions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-10 text-center space-y-4">
                <div className="bg-purple-100 dark:bg-purple-900/20 p-4 rounded-full">
                    <FileText size={48} className="text-purple-600 dark:text-purple-400" />
                </div>
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Transaction History</h1>
                <p className="text-zinc-500 dark:text-zinc-400 max-w-md">
                    View your past payments and download invoices here.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">Transaction History</h1>
                <p className="text-zinc-600 dark:text-zinc-400">Total transactions: {transactions.length}</p>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-zinc-200 dark:border-zinc-800">
                            <th className="text-left py-3 px-4 font-semibold text-zinc-700 dark:text-zinc-300">Date</th>
                            <th className="text-left py-3 px-4 font-semibold text-zinc-700 dark:text-zinc-300">Description</th>
                            <th className="text-left py-3 px-4 font-semibold text-zinc-700 dark:text-zinc-300">Amount</th>
                            <th className="text-left py-3 px-4 font-semibold text-zinc-700 dark:text-zinc-300">Status</th>
                            <th className="text-left py-3 px-4 font-semibold text-zinc-700 dark:text-zinc-300">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((transaction, idx) => (
                            <motion.tr
                                key={transaction.transaction_id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                            >
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-2 text-zinc-900 dark:text-white">
                                        <Calendar size={16} className="text-zinc-400" />
                                        {formatDate(transaction.transaction_date)}
                                    </div>
                                </td>
                                <td className="py-3 px-4">
                                    <div>
                                        <p className="font-medium text-zinc-900 dark:text-white">
                                            {transaction.description || 'Payment'}
                                        </p>
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                            ID: {transaction.gateway_transaction_id || transaction.transaction_id}
                                        </p>
                                    </div>
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-1 font-semibold text-zinc-900 dark:text-white">
                                        <IndianRupee size={16} />
                                        {formatAmount(transaction.amount)}
                                    </div>
                                </td>
                                <td className="py-3 px-4">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(transaction.status)}`}>
                                        {transaction.status || 'Unknown'}
                                    </span>
                                </td>
                                <td className="py-3 px-4">
                                    <button
                                        className="p-2 text-zinc-400 hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                                        title="Download invoice"
                                    >
                                        <Download size={18} />
                                    </button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Transactions;
