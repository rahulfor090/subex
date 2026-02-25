import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, ArrowRight, Briefcase, Home, Share2, Globe,
    CheckCircle2, AlertCircle, ChevronRight, RotateCcw
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { apiFetch } from '../../lib/api';

/* ─── Constants ─────────────────────────────────────────────── */
const CURRENCIES = [
    // South Asia
    { code: 'INR', label: '🇮🇳 INR — Indian Rupee' },
    { code: 'PKR', label: '🇵🇰 PKR — Pakistani Rupee' },
    { code: 'BDT', label: '🇧🇩 BDT — Bangladeshi Taka' },
    { code: 'LKR', label: '🇱🇰 LKR — Sri Lankan Rupee' },
    { code: 'NPR', label: '🇳🇵 NPR — Nepalese Rupee' },
    // Major Global
    { code: 'USD', label: '🇺🇸 USD — US Dollar' },
    { code: 'EUR', label: '🇪🇺 EUR — Euro' },
    { code: 'GBP', label: '🇬🇧 GBP — British Pound' },
    { code: 'JPY', label: '🇯🇵 JPY — Japanese Yen' },
    { code: 'CAD', label: '🇨🇦 CAD — Canadian Dollar' },
    { code: 'AUD', label: '🇦🇺 AUD — Australian Dollar' },
    { code: 'CHF', label: '🇨🇭 CHF — Swiss Franc' },
    { code: 'CNY', label: '🇨🇳 CNY — Chinese Yuan' },
    { code: 'HKD', label: '🇭🇰 HKD — Hong Kong Dollar' },
    { code: 'SGD', label: '🇸🇬 SGD — Singapore Dollar' },
    { code: 'NZD', label: '🇳🇿 NZD — New Zealand Dollar' },
    { code: 'KRW', label: '🇰🇷 KRW — South Korean Won' },
    { code: 'SEK', label: '🇸🇪 SEK — Swedish Krona' },
    { code: 'NOK', label: '🇳🇴 NOK — Norwegian Krone' },
    { code: 'DKK', label: '🇩🇰 DKK — Danish Krone' },
    // Middle East & Africa
    { code: 'AED', label: '🇦🇪 AED — UAE Dirham' },
    { code: 'SAR', label: '🇸🇦 SAR — Saudi Riyal' },
    { code: 'QAR', label: '🇶🇦 QAR — Qatari Riyal' },
    { code: 'KWD', label: '🇰🇼 KWD — Kuwaiti Dinar' },
    { code: 'ZAR', label: '🇿🇦 ZAR — South African Rand' },
    { code: 'EGP', label: '🇪🇬 EGP — Egyptian Pound' },
    // Americas
    { code: 'BRL', label: '🇧🇷 BRL — Brazilian Real' },
    { code: 'MXN', label: '🇲🇽 MXN — Mexican Peso' },
    { code: 'ARS', label: '🇦🇷 ARS — Argentine Peso' },
    // SE Asia
    { code: 'THB', label: '🇹🇭 THB — Thai Baht' },
    { code: 'MYR', label: '🇲🇾 MYR — Malaysian Ringgit' },
    { code: 'IDR', label: '🇮🇩 IDR — Indonesian Rupiah' },
    { code: 'PHP', label: '🇵🇭 PHP — Philippine Peso' },
    { code: 'VND', label: '🇻🇳 VND — Vietnamese Dong' },
];
const CATEGORIES = [
    {
        key: 'salary',
        label: 'Salary',
        description: 'Regular employment income',
        icon: Briefcase,
        color: '#10b981',
        bg: '#10b98115',
    },
    {
        key: 'rent',
        label: 'Rent',
        description: 'Property rental income',
        icon: Home,
        color: '#06b6d4',
        bg: '#06b6d415',
        subcategories: ['Home', 'Apartment', 'Car', 'Commercial', 'Storage', 'Other'],
    },
    {
        key: 'referral',
        label: 'Referrals',
        description: 'Referral & affiliate income',
        icon: Share2,
        color: '#8b5cf6',
        bg: '#8b5cf615',
    },
    {
        key: 'online',
        label: 'Online',
        description: 'Digital & online income sources',
        icon: Globe,
        color: '#f59e0b',
        bg: '#f59e0b15',
        subcategories: ['Freelancing', 'Digital Marketing', 'Content Creation', 'E-commerce', 'SaaS', 'Consulting', 'Other'],
    },
];

const CYCLES = ['daily', 'weekly', 'monthly', 'yearly'];
const STEP_LABELS = ['Source', 'Income Details', 'Finish'];

/* ─── Summary row helper ─────────────────────────────────────── */
const SummaryRow = ({ label, value }) => (
    <div className="flex items-start justify-between gap-4">
        <span className="text-sm text-zinc-500 dark:text-zinc-400 shrink-0">{label}</span>
        <span className="text-sm font-semibold text-zinc-900 dark:text-white text-right">{value}</span>
    </div>
);

/* ─── Step indicator ─────────────────────────────────────────── */
const StepBar = ({ current }) => (
    <div className="flex items-center gap-2 mb-10">
        {STEP_LABELS.map((label, i) => (
            <React.Fragment key={label}>
                <div className="flex items-center gap-2">
                    <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${i < current
                            ? 'bg-emerald-500 text-white'
                            : i === current
                                ? 'bg-emerald-500 text-white ring-4 ring-emerald-500/20'
                                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
                            }`}
                    >
                        {i < current ? <CheckCircle2 size={16} /> : i + 1}
                    </div>
                    <span
                        className={`text-sm font-semibold hidden sm:block ${i === current ? 'text-zinc-900 dark:text-white' : 'text-zinc-400'
                            }`}
                    >
                        {label}
                    </span>
                </div>
                {i < STEP_LABELS.length - 1 && (
                    <div
                        className={`flex-1 h-0.5 rounded ${i < current ? 'bg-emerald-500' : 'bg-zinc-200 dark:bg-zinc-700'
                            }`}
                    />
                )}
            </React.Fragment>
        ))}
    </div>
);

/* ─── Category card ──────────────────────────────────────────── */
const CategoryCard = ({ cat, selected, onClick }) => {
    const Icon = cat.icon;
    const isSelected = selected === cat.key;
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => onClick(cat.key)}
            className={`relative w-full text-left p-5 rounded-2xl border-2 transition-all ${isSelected
                ? 'border-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/10'
                : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 bg-white dark:bg-zinc-800/50'
                }`}
        >
            <div className="flex items-start gap-4">
                <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: cat.bg, color: cat.color }}
                >
                    <Icon size={22} />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-bold text-zinc-900 dark:text-white">{cat.label}</p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">{cat.description}</p>
                </div>
                {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-1">
                        <CheckCircle2 size={12} className="text-white" />
                    </div>
                )}
            </div>
        </motion.button>
    );
};

/* ─── Main Component ─────────────────────────────────────────── */
const AddIncomeSource = () => {
    const navigate = useNavigate();
    const { token } = useAuth();

    const [step, setStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const [submitMessage, setSubmitMessage] = useState('');

    const [form, setForm] = useState({
        source_category: '',
        source_subcategory: '',
        description: '',
        amount: '',
        currency: 'INR',
        cycle: 'monthly',
        recurring: true,
    });

    const [errors, setErrors] = useState({});

    const selectedCat = CATEGORIES.find(c => c.key === form.source_category);

    const set = (key, value) => {
        setForm(prev => ({ ...prev, [key]: value }));
        if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }));
    };

    const validateStep0 = () => {
        const e = {};
        if (!form.source_category) e.source_category = 'Please select an income source type';
        if (selectedCat?.subcategories?.length && !form.source_subcategory) {
            e.source_subcategory = 'Please select or enter a subcategory';
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const validateStep1 = () => {
        const e = {};
        if (!form.amount || parseFloat(form.amount) <= 0) e.amount = 'Enter a valid amount';
        if (!form.currency.trim()) e.currency = 'Currency is required';
        if (!form.cycle) e.cycle = 'Billing cycle is required';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const next = () => {
        if (step === 0 && !validateStep0()) return;
        if (step === 1 && !validateStep1()) return;
        setStep(s => s + 1);
    };

    const back = () => setStep(s => s - 1);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setSubmitStatus(null);
        try {
            const response = await apiFetch('/api/revenue', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    source_category: form.source_category,
                    source_subcategory: form.source_subcategory || null,
                    description: form.description || null,
                    amount: parseFloat(form.amount),
                    currency: form.currency,
                    cycle: form.cycle,
                    recurring: form.recurring,
                }),
            });
            const data = await response.json();
            if (response.ok && data.success) {
                setSubmitStatus('success');
                setSubmitMessage('Income source added successfully!');
                setTimeout(() => navigate('/dashboard/revenue'), 1500);
            } else {
                setSubmitStatus('error');
                setSubmitMessage(data.message || 'Something went wrong. Please try again.');
            }
        } catch {
            setSubmitStatus('error');
            setSubmitMessage('Unable to connect to server. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const variants = {
        enter: { opacity: 0, x: 40 },
        center: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -40 },
    };

    return (
        <div className="pb-12">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Back button */}
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => navigate('/dashboard/revenue')}
                    className="flex items-center gap-2 text-zinc-500 hover:text-emerald-500 transition-colors mb-8"
                >
                    <ArrowLeft size={20} />
                    <span>Back to Revenue</span>
                </motion.button>

                {/* Page header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl font-black tracking-tight mb-2">
                        Add{' '}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-cyan-500">
                            Income Source
                        </span>
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400">
                        Track a new stream of income in a few simple steps.
                    </p>
                </motion.div>

                {/* Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-zinc-900/60 backdrop-blur border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-xl"
                >
                    <StepBar current={step} />

                    <AnimatePresence mode="wait">

                        {/* ── Step 0: Source ───────────────────────── */}
                        {step === 0 && (
                            <motion.div
                                key="step0"
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.25 }}
                                className="space-y-4"
                            >
                                <h2 className="text-xl font-bold mb-1">Choose Income Source</h2>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                                    What type of income are you adding?
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {CATEGORIES.map(cat => (
                                        <CategoryCard
                                            key={cat.key}
                                            cat={cat}
                                            selected={form.source_category}
                                            onClick={v => {
                                                set('source_category', v);
                                                set('source_subcategory', '');
                                            }}
                                        />
                                    ))}
                                </div>

                                {errors.source_category && (
                                    <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                                        <AlertCircle size={14} /> {errors.source_category}
                                    </p>
                                )}

                                {/* Subcategory – only for Rent & Online */}
                                {selectedCat?.subcategories && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="mt-4 space-y-2"
                                    >
                                        <label className="block text-sm font-semibold">
                                            Subcategory <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {selectedCat.subcategories.map(sub => (
                                                <button
                                                    key={sub}
                                                    type="button"
                                                    onClick={() => set('source_subcategory', sub)}
                                                    className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${form.source_subcategory === sub
                                                        ? 'bg-emerald-500 text-white'
                                                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                                                        }`}
                                                >
                                                    {sub}
                                                </button>
                                            ))}
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Or type a custom subcategory…"
                                            value={form.source_subcategory}
                                            onChange={e => set('source_subcategory', e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
                                        />
                                        {errors.source_subcategory && (
                                            <p className="text-sm text-red-500 flex items-center gap-1">
                                                <AlertCircle size={14} /> {errors.source_subcategory}
                                            </p>
                                        )}
                                    </motion.div>
                                )}
                            </motion.div>
                        )}

                        {/* ── Step 1: Income Details ────────────────── */}
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.25 }}
                                className="space-y-5"
                            >
                                <h2 className="text-xl font-bold mb-1">Income Details</h2>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                                    How much do you earn and how often?
                                </p>

                                {/* Amount + Currency */}
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-semibold mb-1.5">
                                            Amount <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            placeholder="0.00"
                                            value={form.amount}
                                            onChange={e => set('amount', e.target.value)}
                                            className={`w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border ${errors.amount ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-700'
                                                } focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all`}
                                        />
                                        {errors.amount && (
                                            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                                <AlertCircle size={12} /> {errors.amount}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-1.5">
                                            Currency <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={form.currency}
                                            onChange={e => set('currency', e.target.value)}
                                            className={`w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border ${errors.currency ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-700'
                                                } focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm appearance-none cursor-pointer`}
                                        >
                                            {CURRENCIES.map(c => (
                                                <option key={c.code} value={c.code}>{c.label}</option>
                                            ))}
                                        </select>
                                        {errors.currency && (
                                            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                                <AlertCircle size={12} /> {errors.currency}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Billing Cycle */}
                                <div>
                                    <label className="block text-sm font-semibold mb-1.5">
                                        Billing Cycle <span className="text-red-500">*</span>
                                    </label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {CYCLES.map(c => (
                                            <button
                                                key={c}
                                                type="button"
                                                onClick={() => set('cycle', c)}
                                                className={`py-2.5 rounded-xl text-sm font-semibold capitalize transition-all ${form.cycle === c
                                                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                                                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                                                    }`}
                                            >
                                                {c}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Recurring */}
                                <div>
                                    <label className="block text-sm font-semibold mb-1.5">Recurring</label>
                                    <div className="flex gap-3">
                                        {[true, false].map(v => (
                                            <button
                                                key={String(v)}
                                                type="button"
                                                onClick={() => set('recurring', v)}
                                                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${form.recurring === v
                                                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                                                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                                                    }`}
                                            >
                                                {v ? 'Yes' : 'No'}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Description optional */}
                                <div>
                                    <label className="block text-sm font-semibold mb-1.5">
                                        Description{' '}
                                        <span className="text-zinc-400 font-normal">(optional)</span>
                                    </label>
                                    <textarea
                                        rows={3}
                                        placeholder="Add any notes about this income source…"
                                        value={form.description}
                                        onChange={e => set('description', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none text-sm"
                                    />
                                </div>
                            </motion.div>
                        )}

                        {/* ── Step 2: Finish ────────────────────────── */}
                        {step === 2 && (
                            <motion.div
                                key="step2"
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.25 }}
                                className="space-y-6"
                            >
                                <h2 className="text-xl font-bold mb-1">Review &amp; Save</h2>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                                    Confirm your income source details before saving.
                                </p>

                                {/* Summary Card */}
                                <div className="bg-zinc-50 dark:bg-zinc-800/60 rounded-2xl p-6 space-y-4 border border-zinc-200 dark:border-zinc-700">
                                    {selectedCat && (
                                        <div className="flex items-center gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-700">
                                            <div
                                                className="w-12 h-12 rounded-xl flex items-center justify-center"
                                                style={{ backgroundColor: selectedCat.bg, color: selectedCat.color }}
                                            >
                                                <selectedCat.icon size={22} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-zinc-900 dark:text-white">{selectedCat.label}</p>
                                                {form.source_subcategory && (
                                                    <p className="text-sm text-zinc-500">{form.source_subcategory}</p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    <SummaryRow
                                        label="Amount"
                                        value={`${form.currency} ${parseFloat(form.amount || 0).toLocaleString()}`}
                                    />
                                    <SummaryRow
                                        label="Billing Cycle"
                                        value={<span className="capitalize">{form.cycle}</span>}
                                    />
                                    <SummaryRow label="Recurring" value={form.recurring ? 'Yes' : 'No'} />
                                    {form.description && (
                                        <SummaryRow label="Description" value={form.description} />
                                    )}
                                </div>

                                {/* Status feedback */}
                                {submitStatus && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex items-center gap-3 p-4 rounded-xl border ${submitStatus === 'success'
                                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                                            : 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400'
                                            }`}
                                    >
                                        {submitStatus === 'success' ? (
                                            <CheckCircle2 size={18} />
                                        ) : (
                                            <AlertCircle size={18} />
                                        )}
                                        <span className="text-sm font-medium">{submitMessage}</span>
                                    </motion.div>
                                )}

                                {/* Submit button */}
                                <motion.button
                                    whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
                                    whileTap={{ scale: isSubmitting ? 1 : 0.99 }}
                                    onClick={handleSubmit}
                                    disabled={isSubmitting || submitStatus === 'success'}
                                    className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-base shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Saving…
                                        </>
                                    ) : submitStatus === 'success' ? (
                                        <>
                                            <CheckCircle2 size={18} />
                                            Saved! Redirecting…
                                        </>
                                    ) : (
                                        'Save Income Source'
                                    )}
                                </motion.button>

                                {submitStatus === 'error' && (
                                    <button
                                        onClick={() => setSubmitStatus(null)}
                                        className="w-full py-2 text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 flex items-center justify-center gap-1 transition-colors"
                                    >
                                        <RotateCcw size={14} /> Try again
                                    </button>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Navigation buttons */}
                    {step < 2 && (
                        <div className={`flex mt-8 ${step > 0 ? 'justify-between' : 'justify-end'}`}>
                            {step > 0 && (
                                <button
                                    onClick={back}
                                    className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
                                >
                                    <ArrowLeft size={16} /> Back
                                </button>
                            )}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={next}
                                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm shadow-lg shadow-emerald-500/20 transition-all"
                            >
                                {step === 1 ? 'Review' : 'Next'}
                                {step === 1 ? <ChevronRight size={16} /> : <ArrowRight size={16} />}
                            </motion.button>
                        </div>
                    )}

                    {step === 2 && (
                        <button
                            onClick={back}
                            className="flex items-center gap-2 mt-4 px-5 py-3 rounded-xl text-sm font-semibold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
                        >
                            <ArrowLeft size={16} /> Edit Details
                        </button>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default AddIncomeSource;
