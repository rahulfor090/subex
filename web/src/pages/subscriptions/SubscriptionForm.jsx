import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../lib/api';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, AlertCircle, Save, Plus, X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/Header';

const SubscriptionForm = ({ mode = 'add' }) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { token } = useAuth();

    const [formData, setFormData] = useState({
        company_id: '',
        description: '',
        type: 'subscription',
        recurring: true,
        frequency: 1,
        cycle: 'monthly',
        value: '',
        currency: 'USD',
        next_payment_date: '',
        contract_expiry: '',
        url_link: '',
        payment_method: '',
        folder_id: '',
        tag_ids: [],
        notes: ''
    });

    const [companies, setCompanies] = useState([]);
    const [folders, setFolders] = useState([]);
    const [tags, setTags] = useState([]);

    const [showCompanyForm, setShowCompanyForm] = useState(false);
    const [showFolderForm, setShowFolderForm] = useState(false);
    const [showTagForm, setShowTagForm] = useState(false);

    const [newCompanyName, setNewCompanyName] = useState('');
    const [newFolderName, setNewFolderName] = useState('');
    const [newTagName, setNewTagName] = useState('');

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const [submitMessage, setSubmitMessage] = useState('');
    const [loading, setLoading] = useState(mode === 'edit');

    useEffect(() => {
        fetchCompanies();
        fetchFolders();
        fetchTags();

        if (mode === 'edit' && id) {
            fetchSubscription();
        }
    }, [mode, id]);

    const fetchCompanies = async () => {
        try {
            const response = await apiFetch('/api/companies', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) setCompanies(data.data);
        } catch (err) {
            console.error('Fetch companies error:', err);
        }
    };

    const fetchFolders = async () => {
        try {
            const response = await apiFetch('/api/folders', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) setFolders(data.data);
        } catch (err) {
            console.error('Fetch folders error:', err);
        }
    };

    const fetchTags = async () => {
        try {
            const response = await apiFetch('/api/tags', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) setTags(data.data);
        } catch (err) {
            console.error('Fetch tags error:', err);
        }
    };

    const fetchSubscription = async () => {
        try {
            const response = await apiFetch(`/api/subscriptions/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setFormData({
                    company_id: data.data.company_id || '',
                    description: data.data.description || '',
                    type: data.data.type || 'subscription',
                    recurring: data.data.recurring ?? true,
                    frequency: data.data.frequency || 1,
                    cycle: data.data.cycle || 'monthly',
                    value: data.data.value || '',
                    currency: data.data.currency || 'USD',
                    next_payment_date: data.data.next_payment_date || '',
                    contract_expiry: data.data.contract_expiry || '',
                    url_link: data.data.url_link || '',
                    payment_method: data.data.payment_method || '',
                    folder_id: data.data.folder_id || '',
                    tag_ids: data.data.tags ? data.data.tags.map(t => t.id) : [],
                    notes: data.data.notes || ''
                });
            }
        } catch (err) {
            console.error('Fetch subscription error:', err);
        } finally {
            setLoading(false);
        }
    };

    const createCompany = async () => {
        if (!newCompanyName.trim()) return;

        try {
            const response = await apiFetch('/api/companies', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: newCompanyName })
            });

            const data = await response.json();
            if (data.success) {
                await fetchCompanies();
                setFormData(prev => ({ ...prev, company_id: data.data.id }));
                setNewCompanyName('');
                setShowCompanyForm(false);
            }
        } catch (err) {
            console.error('Create company error:', err);
        }
    };

    const createFolder = async () => {
        if (!newFolderName.trim()) return;

        try {
            const response = await apiFetch('/api/folders', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: newFolderName })
            });

            const data = await response.json();
            if (data.success) {
                await fetchFolders();
                setFormData(prev => ({ ...prev, folder_id: data.data.id }));
                setNewFolderName('');
                setShowFolderForm(false);
            }
        } catch (err) {
            console.error('Create folder error:', err);
        }
    };

    const createTag = async () => {
        if (!newTagName.trim()) return;

        try {
            const response = await apiFetch('/api/tags', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: newTagName })
            });

            const data = await response.json();
            if (data.success) {
                await fetchTags();
                setFormData(prev => ({
                    ...prev,
                    tag_ids: [...prev.tag_ids, data.data.id]
                }));
                setNewTagName('');
                setShowTagForm(false);
            }
        } catch (err) {
            console.error('Create tag error:', err);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.company_id) {
            newErrors.company_id = 'Company is required';
        }
        if (!formData.value || parseFloat(formData.value) <= 0) {
            newErrors.value = 'Valid value is required';
        }
        if (!formData.currency.trim()) {
            newErrors.currency = 'Currency is required';
        }
        if (!formData.cycle) {
            newErrors.cycle = 'Cycle is required';
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

    const handleTagToggle = (tagId) => {
        setFormData(prev => ({
            ...prev,
            tag_ids: prev.tag_ids.includes(tagId)
                ? prev.tag_ids.filter(id => id !== tagId)
                : [...prev.tag_ids, tagId]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            const path = mode === 'edit'
                ? `/api/subscriptions/${id}`
                : '/api/subscriptions';
            const method = mode === 'edit' ? 'PATCH' : 'POST';

            const response = await apiFetch(path, {
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
                        {mode === 'edit' ? 'Edit' : 'Add'} <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-cyan-500 dark:from-emerald-400 dark:to-cyan-500">Subscription</span>
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
                        {/* Company */}
                        <div>
                            <label htmlFor="company_id" className="block text-sm font-medium mb-2">
                                Company <span className="text-red-500">*</span>
                            </label>
                            <div className="flex gap-2">
                                <select
                                    id="company_id"
                                    name="company_id"
                                    value={formData.company_id}
                                    onChange={handleChange}
                                    className={`flex-1 px-4 py-3 rounded-lg bg-white dark:bg-zinc-800 border ${errors.company_id ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-700'
                                        } focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all`}
                                >
                                    <option value="">Select Company</option>
                                    {companies.map(company => (
                                        <option key={company.id} value={company.id}>{company.name}</option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    onClick={() => setShowCompanyForm(!showCompanyForm)}
                                    className="px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>
                            {errors.company_id && (
                                <p className="mt-1 text-sm text-red-500">{errors.company_id}</p>
                            )}

                            {/* Inline Company Form */}
                            {showCompanyForm && (
                                <div className="mt-2 p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newCompanyName}
                                            onChange={(e) => setNewCompanyName(e.target.value)}
                                            placeholder="Company name"
                                            className="flex-1 px-3 py-2 rounded bg-white dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-600"
                                        />
                                        <button
                                            type="button"
                                            onClick={createCompany}
                                            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded"
                                        >
                                            Add
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowCompanyForm(false)}
                                            className="px-4 py-2 bg-zinc-500 hover:bg-zinc-600 text-white rounded"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Description */}
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

                        {/* Type & Recurring */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="type" className="block text-sm font-medium mb-2">
                                    Type
                                </label>
                                <select
                                    id="type"
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                                >
                                    <option value="subscription">Subscription</option>
                                    <option value="trial">Trial</option>
                                    <option value="lifetime">Lifetime</option>
                                    <option value="revenue">Revenue</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Recurring
                                </label>
                                <select
                                    name="recurring"
                                    value={formData.recurring ? 'Yes' : 'No'}
                                    onChange={(e) => setFormData(prev => ({ ...prev, recurring: e.target.value === 'Yes' }))}
                                    className="w-full px-4 py-3 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                                >
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </div>
                        </div>

                        {/* Frequency & Cycle */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="frequency" className="block text-sm font-medium mb-2">
                                    Frequency
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    id="frequency"
                                    name="frequency"
                                    value={formData.frequency}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                                />
                            </div>

                            <div>
                                <label htmlFor="cycle" className="block text-sm font-medium mb-2">
                                    Cycle <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="cycle"
                                    name="cycle"
                                    value={formData.cycle}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 rounded-lg bg-white dark:bg-zinc-800 border ${errors.cycle ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-700'
                                        } focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all`}
                                >
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">Monthly</option>
                                    <option value="yearly">Yearly</option>
                                </select>
                                {errors.cycle && (
                                    <p className="mt-1 text-sm text-red-500">{errors.cycle}</p>
                                )}
                            </div>
                        </div>

                        {/* Value & Currency */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="value" className="block text-sm font-medium mb-2">
                                    Value <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    id="value"
                                    name="value"
                                    value={formData.value}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 rounded-lg bg-white dark:bg-zinc-800 border ${errors.value ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-700'
                                        } focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all`}
                                    placeholder="0.00"
                                />
                                {errors.value && (
                                    <p className="mt-1 text-sm text-red-500">{errors.value}</p>
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
                        </div>

                        {/* Next Payment Date & Contract Expiry */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="next_payment_date" className="block text-sm font-medium mb-2">
                                    Next Payment Date
                                </label>
                                <input
                                    type="date"
                                    id="next_payment_date"
                                    name="next_payment_date"
                                    value={formData.next_payment_date}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                                />
                            </div>

                            <div>
                                <label htmlFor="contract_expiry" className="block text-sm font-medium mb-2">
                                    Contract Expiry
                                </label>
                                <input
                                    type="date"
                                    id="contract_expiry"
                                    name="contract_expiry"
                                    value={formData.contract_expiry}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                                />
                            </div>
                        </div>

                        {/* URL Link */}
                        <div>
                            <label htmlFor="url_link" className="block text-sm font-medium mb-2">
                                URL Link
                            </label>
                            <input
                                type="url"
                                id="url_link"
                                name="url_link"
                                value={formData.url_link}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                                placeholder="https://example.com"
                            />
                        </div>

                        {/* Payment Method */}
                        <div>
                            <label htmlFor="payment_method" className="block text-sm font-medium mb-2">
                                Payment Method
                            </label>
                            <select
                                id="payment_method"
                                name="payment_method"
                                value={formData.payment_method}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                            >
                                <option value="">Not Specified</option>
                                <option value="creditcard">Credit Card</option>
                                <option value="free">Free</option>
                                <option value="paypal">PayPal</option>
                            </select>
                        </div>

                        {/* Folder */}
                        <div>
                            <label htmlFor="folder_id" className="block text-sm font-medium mb-2">
                                Folder
                            </label>
                            <div className="flex gap-2">
                                <select
                                    id="folder_id"
                                    name="folder_id"
                                    value={formData.folder_id}
                                    onChange={handleChange}
                                    className="flex-1 px-4 py-3 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                                >
                                    <option value="">No Folder</option>
                                    {folders.map(folder => (
                                        <option key={folder.id} value={folder.id}>{folder.name}</option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    onClick={() => setShowFolderForm(!showFolderForm)}
                                    className="px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>

                            {/* Inline Folder Form */}
                            {showFolderForm && (
                                <div className="mt-2 p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newFolderName}
                                            onChange={(e) => setNewFolderName(e.target.value)}
                                            placeholder="Folder name"
                                            className="flex-1 px-3 py-2 rounded bg-white dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-600"
                                        />
                                        <button
                                            type="button"
                                            onClick={createFolder}
                                            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded"
                                        >
                                            Add
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowFolderForm(false)}
                                            className="px-4 py-2 bg-zinc-500 hover:bg-zinc-600 text-white rounded"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Tags */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium">
                                    Tags
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setShowTagForm(!showTagForm)}
                                    className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded text-sm flex items-center gap-1"
                                >
                                    <Plus size={16} /> Add Tag
                                </button>
                            </div>

                            {/* Inline Tag Form */}
                            {showTagForm && (
                                <div className="mb-3 p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newTagName}
                                            onChange={(e) => setNewTagName(e.target.value)}
                                            placeholder="Tag name"
                                            className="flex-1 px-3 py-2 rounded bg-white dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-600"
                                        />
                                        <button
                                            type="button"
                                            onClick={createTag}
                                            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded"
                                        >
                                            Add
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowTagForm(false)}
                                            className="px-4 py-2 bg-zinc-500 hover:bg-zinc-600 text-white rounded"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-wrap gap-2">
                                {tags.map(tag => (
                                    <button
                                        key={tag.id}
                                        type="button"
                                        onClick={() => handleTagToggle(tag.id)}
                                        className={`px-3 py-1 rounded-full text-sm transition-colors ${formData.tag_ids.includes(tag.id)
                                            ? 'bg-emerald-500 text-white'
                                            : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
                                            }`}
                                    >
                                        {tag.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Notes */}
                        <div>
                            <label htmlFor="notes" className="block text-sm font-medium mb-2">
                                Notes
                            </label>
                            <textarea
                                id="notes"
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                rows="4"
                                className="w-full px-4 py-3 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                                placeholder="Additional notes..."
                            />
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
