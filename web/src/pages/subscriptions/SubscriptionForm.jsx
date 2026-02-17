import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, AlertCircle, Save } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/Header';

const SubscriptionForm = ({ mode = 'add' }) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { token } = useAuth();

    const [formData, setFormData] = useState({
        service_name: '',
        description: '',
        start_date: '',
        next_renewal_date: '',
        billing_cycle_number: 1,
        billing_cycle_period: 'monthly',
        auto_renew: true,
        cost: '',
        currency: 'USD',
        is_active: true,
        is_trial: false,
        website_url: '',
        category: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const [submitMessage, setSubmitMessage] = useState('');
    const [loading, setLoading] = useState(mode === 'edit');

    useEffect(() => {
        if (mode === 'edit' && id) {
            fetchSubscription();
        }
    }, [mode, id]);

    const fetchSubscription = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/subscriptions/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setFormData({
                    service_name: data.data.service_name || '',
                    description: data.data.description || '',
                    start_date: data.data.start_date || '',
                    next_renewal_date: data.data.next_renewal_date || '',
                    billing_cycle_number: data.data.billing_cycle_number || 1,
                    billing_cycle_period: data.data.billing_cycle_period || 'monthly',
                    auto_renew: data.data.auto_renew ?? true,
                    cost: data.data.cost || '',
                    currency: data.data.currency || 'USD',
                    is_active: data.data.is_active ?? true,
                    is_trial: data.data.is_trial ?? false,
                    website_url: data.data.website_url || '',
                    category: data.data.category || ''
                });
            }
        } catch (err) {
            console.error('Fetch subscription error:', err);
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.service_name.trim()) {
            newErrors.service_name = 'Service name is required';
        }
        if (!formData.start_date) {
            newErrors.start_date = 'Start date is required';
        }
        if (!formData.next_renewal_date) {
            newErrors.next_renewal_date = 'Next renewal date is required';
        }
        if (!formData.cost || parseFloat(formData.cost) <= 0) {
            newErrors.cost = 'Valid cost is required';
        }
        if (!formData.currency.trim()) {
            newErrors.currency = 'Currency is required';
        }
        if (!formData.billing_cycle_period) {
            newErrors.billing_cycle_period = 'Billing cycle period is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            const url = mode === 'edit'
                ? `http://localhost:3000/api/subscriptions/${id}`
                : 'http://localhost:3000/api/subscriptions';

            const method = mode === 'edit' ? 'PATCH' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setSubmitStatus('success');
                setSubmitMessage(mode === 'edit'
                    ? 'Subscription updated successfully!'
                    : 'Subscription created successfully!');

                setTimeout(() => {
                    navigate('/dashboard');
                }, 1500);
            } else {
                setSubmitStatus('error');
                setSubmitMessage(data.message || 'Operation failed. Please try again.');
            }
        } catch (error) {
            setSubmitStatus('error');
            setSubmitMessage('Unable to connect to server. Please try again later.');
            console.error('Submit error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-zinc-600 dark:text-zinc-400">Loading...</p>
                </div>
            </div>
        );
    }

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

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        {mode === 'edit' ? 'Edit' : 'Add'} <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-cyan-500">Subscription</span>
                    </h1>
                    <p className="text-lg text-zinc-600 dark:text-zinc-400">
                        {mode === 'edit' ? 'Update your subscription details' : 'Add a new subscription to track'}
                    </p>
                </motion.div>

                {/* Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-white dark:bg-zinc-900/50 backdrop-blur border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-xl"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Service Information */}
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Service Information</h2>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="service_name" className="block text-sm font-medium mb-2">
                                        Service Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="service_name"
                                        name="service_name"
                                        value={formData.service_name}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 rounded-lg bg-white dark:bg-zinc-800 border ${errors.service_name ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-700'
                                            } focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all`}
                                        placeholder="Netflix, Spotify, etc."
                                    />
                                    {errors.service_name && (
                                        <p className="mt-1 text-sm text-red-500">{errors.service_name}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="category" className="block text-sm font-medium mb-2">
                                        Category
                                    </label>
                                    <input
                                        type="text"
                                        id="category"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                                        placeholder="Entertainment, Productivity, etc."
                                    />
                                </div>

                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows="3"
                                        className="w-full px-4 py-3 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                                        placeholder="Additional details about this subscription"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="website_url" className="block text-sm font-medium mb-2">
                                        Website URL
                                    </label>
                                    <input
                                        type="url"
                                        id="website_url"
                                        name="website_url"
                                        value={formData.website_url}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                                        placeholder="https://example.com"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Billing Information */}
                        <div className="pt-6 border-t border-zinc-200 dark:border-zinc-700">
                            <h2 className="text-xl font-semibold mb-4">Billing Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="cost" className="block text-sm font-medium mb-2">
                                        Cost <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        id="cost"
                                        name="cost"
                                        value={formData.cost}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 rounded-lg bg-white dark:bg-zinc-800 border ${errors.cost ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-700'
                                            } focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all`}
                                        placeholder="9.99"
                                    />
                                    {errors.cost && (
                                        <p className="mt-1 text-sm text-red-500">{errors.cost}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="currency" className="block text-sm font-medium mb-2">
                                        Currency <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="currency"
                                        name="currency"
                                        value={formData.currency}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 rounded-lg bg-white dark:bg-zinc-800 border ${errors.currency ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-700'
                                            } focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all`}
                                        placeholder="USD"
                                    />
                                    {errors.currency && (
                                        <p className="mt-1 text-sm text-red-500">{errors.currency}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="billing_cycle_number" className="block text-sm font-medium mb-2">
                                        Billing Cycle Number
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        id="billing_cycle_number"
                                        name="billing_cycle_number"
                                        value={formData.billing_cycle_number}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="billing_cycle_period" className="block text-sm font-medium mb-2">
                                        Billing Cycle Period <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="billing_cycle_period"
                                        name="billing_cycle_period"
                                        value={formData.billing_cycle_period}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 rounded-lg bg-white dark:bg-zinc-800 border ${errors.billing_cycle_period ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-700'
                                            } focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all`}
                                    >
                                        <option value="daily">Daily</option>
                                        <option value="weekly">Weekly</option>
                                        <option value="monthly">Monthly</option>
                                        <option value="yearly">Yearly</option>
                                    </select>
                                    {errors.billing_cycle_period && (
                                        <p className="mt-1 text-sm text-red-500">{errors.billing_cycle_period}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="start_date" className="block text-sm font-medium mb-2">
                                        Start Date <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        id="start_date"
                                        name="start_date"
                                        value={formData.start_date}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 rounded-lg bg-white dark:bg-zinc-800 border ${errors.start_date ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-700'
                                            } focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all`}
                                    />
                                    {errors.start_date && (
                                        <p className="mt-1 text-sm text-red-500">{errors.start_date}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="next_renewal_date" className="block text-sm font-medium mb-2">
                                        Next Renewal Date <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        id="next_renewal_date"
                                        name="next_renewal_date"
                                        value={formData.next_renewal_date}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 rounded-lg bg-white dark:bg-zinc-800 border ${errors.next_renewal_date ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-700'
                                            } focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all`}
                                    />
                                    {errors.next_renewal_date && (
                                        <p className="mt-1 text-sm text-red-500">{errors.next_renewal_date}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Status Options */}
                        <div className="pt-6 border-t border-zinc-200 dark:border-zinc-700">
                            <h2 className="text-xl font-semibold mb-4">Status & Options</h2>
                            <div className="space-y-3">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="is_active"
                                        checked={formData.is_active}
                                        onChange={handleChange}
                                        className="w-5 h-5 rounded border-zinc-300 dark:border-zinc-700 text-emerald-500 focus:ring-2 focus:ring-emerald-500"
                                    />
                                    <span className="text-sm font-medium">Active Subscription</span>
                                </label>

                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="auto_renew"
                                        checked={formData.auto_renew}
                                        onChange={handleChange}
                                        className="w-5 h-5 rounded border-zinc-300 dark:border-zinc-700 text-emerald-500 focus:ring-2 focus:ring-emerald-500"
                                    />
                                    <span className="text-sm font-medium">Auto Renew</span>
                                </label>

                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="is_trial"
                                        checked={formData.is_trial}
                                        onChange={handleChange}
                                        className="w-5 h-5 rounded border-zinc-300 dark:border-zinc-700 text-emerald-500 focus:ring-2 focus:ring-emerald-500"
                                    />
                                    <span className="text-sm font-medium">Trial Period</span>
                                </label>
                            </div>
                        </div>

                        {/* Submit Status Messages */}
                        {submitStatus && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex items-center gap-3 p-4 rounded-lg ${submitStatus === 'success'
                                        ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                                        : 'bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400'
                                    }`}
                            >
                                {submitStatus === 'success' ? (
                                    <CheckCircle2 size={20} />
                                ) : (
                                    <AlertCircle size={20} />
                                )}
                                <span>{submitMessage}</span>
                            </motion.div>
                        )}

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] disabled:opacity-50 disabled:cursor-not-allowed border-none flex items-center justify-center gap-2"
                        >
                            <Save size={20} />
                            {isSubmitting ? 'Saving...' : mode === 'edit' ? 'Update Subscription' : 'Add Subscription'}
                        </Button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default SubscriptionForm;
