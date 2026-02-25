import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../lib/api';
import { Button } from '../../components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, ArrowRight, CheckCircle2, AlertCircle,
    Save, Plus, X, Building2, IndianRupee, CalendarDays,
    Tag, Loader2, Check, Globe, CreditCard, Folder,
    Sparkles, ChevronDown, DollarSign, Search
} from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import CompanyLogo from '../../components/CompanyLogo';

// ─── Step definitions ────────────────────────────────────────────────────────
const STEPS = [
    { id: 1, title: 'Service', icon: Building2, color: 'from-violet-500 to-purple-600', desc: 'Pick the company' },
    { id: 2, title: 'Billing', icon: IndianRupee, color: 'from-emerald-500 to-cyan-500', desc: 'Amount & frequency' },
    { id: 3, title: 'Dates', icon: CalendarDays, color: 'from-orange-400 to-rose-500', desc: 'Renewal & payment' },
    { id: 4, title: 'Finish', icon: Sparkles, color: 'from-pink-500 to-fuchsia-600', desc: 'Organize & submit' },
];



// ─── Styled input ────────────────────────────────────────────────────────────
const Input = ({ label, error, icon: Icon, required, children, hint, ...props }) => (
    <div>
        {label && (
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                {label} {required && <span className="text-red-400">*</span>}
                {hint && <span className="ml-2 text-xs text-zinc-400 font-normal">{hint}</span>}
            </label>
        )}
        <div className="relative">
            {Icon && <Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />}
            {children || (
                <input
                    {...props}
                    className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 rounded-xl bg-white/80 dark:bg-zinc-800/80 border ${error ? 'border-red-400 ring-2 ring-red-400/20' : 'border-zinc-200 dark:border-zinc-700'
                        } focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-zinc-900 dark:text-white placeholder-zinc-400 text-sm backdrop-blur`}
                />
            )}
        </div>
        {error && <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1"><AlertCircle size={11} />{error}</p>}
    </div>
);

const Select = ({ label, error, required, children, hint, ...props }) => (
    <div>
        {label && (
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                {label} {required && <span className="text-red-400">*</span>}
                {hint && <span className="ml-2 text-xs text-zinc-400 font-normal">{hint}</span>}
            </label>
        )}
        <div className="relative">
            <select
                {...props}
                className={`w-full px-4 py-3 pr-10 rounded-xl bg-white/80 dark:bg-zinc-800/80 border ${error ? 'border-red-400' : 'border-zinc-200 dark:border-zinc-700'
                    } focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-zinc-900 dark:text-white appearance-none text-sm backdrop-blur`}
            >
                {children}
            </select>
            <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
        </div>
        {error && <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1"><AlertCircle size={11} />{error}</p>}
    </div>
);

const InlineCreate = ({ label, value, onChange, onAdd, onCancel, placeholder }) => (
    <motion.div
        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }} className="overflow-hidden"
    >
        <div className="mt-3 p-4 bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-900/20 dark:to-cyan-900/20 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl">
            <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-3 uppercase tracking-wide">New {label}</p>
            <div className="flex gap-2">
                <input
                    type="text" value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder={placeholder}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), onAdd())}
                    className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-emerald-200 dark:border-emerald-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-zinc-900 dark:text-white"
                    autoFocus
                />
                <button type="button" onClick={onAdd}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-semibold transition-colors shadow-md shadow-emerald-500/20">
                    Add
                </button>
                <button type="button" onClick={onCancel}
                    className="p-2 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-500 rounded-xl transition-colors border border-zinc-200 dark:border-zinc-700">
                    <X size={14} />
                </button>
            </div>
        </div>
    </motion.div>
);

// ─── Main Component ──────────────────────────────────────────────────────────
const SubscriptionForm = ({ mode = 'add' }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();
    const { token } = useAuth();

    const prefill = location.state?.prefill || {};

    const [step, setStep] = useState(1);
    const [direction, setDirection] = useState(1);

    const [formData, setFormData] = useState({
        company_id: '', description: '', type: 'subscription',
        recurring: true, frequency: 1, cycle: 'monthly',
        actual_amount: '', amount_paid: '', currency: 'INR', next_payment_date: '',
        contract_expiry: '', url_link: '', payment_method: '',
        folder_id: '', tag_ids: [], notes: ''
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

    const [searchTerm, setSearchTerm] = useState('');
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const [submitMessage, setSubmitMessage] = useState('');
    const [loading, setLoading] = useState(mode === 'edit');

    // ── Fetch ────────────────────────────────────────────────────
    useEffect(() => {
        fetchCompanies();
        fetchFolders();
        fetchTags();
        if (mode === 'edit' && id) fetchSubscription();
    }, [mode, id]);

    useEffect(() => {
        if (prefill.companyName && companies.length > 0) {
            const match = companies.find(c => c.name.toLowerCase() === prefill.companyName.toLowerCase());
            if (match) setFormData(p => ({ ...p, company_id: match.id }));
        }
    }, [companies, prefill.companyName]);

    const fetchCompanies = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/companies`, { headers: { Authorization: `Bearer ${token}` } });
            const d = await res.json();
            if (d.success) setCompanies(d.data);
        } catch { }
    };

    const fetchFolders = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/folders`, { headers: { Authorization: `Bearer ${token}` } });
            const d = await res.json();
            if (d.success) setFolders(d.data);
        } catch { }
    };

    const fetchTags = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/tags`, { headers: { Authorization: `Bearer ${token}` } });
            const d = await res.json();
            if (d.success) setTags(d.data);
        } catch { }
    };

    const fetchSubscription = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/subscriptions/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            const d = await res.json();
            if (res.ok && d.success) {
                setFormData({
                    company_id: d.data.company_id || '', description: d.data.description || '',
                    type: d.data.type || 'subscription', recurring: d.data.recurring ?? true,
                    frequency: d.data.frequency || 1, cycle: d.data.cycle || 'monthly',
                    actual_amount: d.data.actual_amount || '', amount_paid: d.data.amount_paid || '', currency: d.data.currency || 'INR',
                    next_payment_date: d.data.next_payment_date || '', contract_expiry: d.data.contract_expiry || '',
                    url_link: d.data.url_link || '', payment_method: d.data.payment_method || '',
                    folder_id: d.data.folder_id || '',
                    tag_ids: d.data.tags ? d.data.tags.map(t => t.id) : [],
                    notes: d.data.notes || ''
                });
            }
        } catch { }
        finally { setLoading(false); }
    };

    const createCompany = async () => {
        if (!newCompanyName.trim()) return;
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/companies`, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ name: newCompanyName }) });
            const d = await res.json();
            if (d.success) { await fetchCompanies(); setFormData(p => ({ ...p, company_id: d.data.id })); setNewCompanyName(''); setShowCompanyForm(false); }
        } catch { }
    };

    const createFolder = async () => {
        if (!newFolderName.trim()) return;
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/folders`, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ name: newFolderName }) });
            const d = await res.json();
            if (d.success) { await fetchFolders(); setFormData(p => ({ ...p, folder_id: d.data.id })); setNewFolderName(''); setShowFolderForm(false); }
        } catch { }
    };

    const createTag = async () => {
        if (!newTagName.trim()) return;
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/tags`, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ name: newTagName }) });
            const d = await res.json();
            if (d.success) { await fetchTags(); setFormData(p => ({ ...p, tag_ids: [...p.tag_ids, d.data.id] })); setNewTagName(''); setShowTagForm(false); }
        } catch { }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
        if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
    };

    const handleTagToggle = (tagId) => {
        setFormData(p => ({
            ...p,
            tag_ids: p.tag_ids.includes(tagId) ? p.tag_ids.filter(t => t !== tagId) : [...p.tag_ids, tagId]
        }));
    };

    const validateStep = (s) => {
        const e = {};
        if (s === 1 && !formData.company_id) e.company_id = 'Please select or create a company';
        if (s === 2) {
            if (!formData.actual_amount || parseFloat(formData.actual_amount) <= 0) e.actual_amount = 'Enter a valid amount';
            if (!formData.currency.trim()) e.currency = 'Currency is required';
        }
        if (s === 3 && mode === 'add') {
            if (formData.next_payment_date && formData.contract_expiry && formData.next_payment_date !== formData.contract_expiry) {
                e.next_payment_date = 'Must match Contract Expiry';
                e.contract_expiry = 'Must match Next Payment Date';
            }
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const goNext = () => { if (!canProceed) return; setDirection(1); setStep(s => s + 1); };
    const goBack = () => { setDirection(-1); setStep(s => s - 1); };

    // Memoize validation to avoid recalculating on every render
    const canProceed = React.useMemo(() => {
        const e = {};
        if (step === 1 && !formData.company_id) e.company_id = 'Please select or create a company';
        if (step === 2) {
            if (!formData.actual_amount || parseFloat(formData.actual_amount) <= 0) e.actual_amount = 'Enter a valid amount';
            if (!formData.currency.trim()) e.currency = 'Currency is required';
        }
        if (step === 3 && mode === 'add') {
            if (formData.next_payment_date && formData.contract_expiry && formData.next_payment_date !== formData.contract_expiry) {
                e.next_payment_date = 'Must match Contract Expiry';
                e.contract_expiry = 'Must match Next Payment Date';
            }
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    }, [step, formData, mode]);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setSubmitStatus(null);
        try {
            const url = mode === 'edit' ? `${import.meta.env.VITE_BACKEND_URL}/api/subscriptions/${id}` : `${import.meta.env.VITE_BACKEND_URL}/api/subscriptions`;
            const res = await fetch(url, {
                method: mode === 'edit' ? 'PATCH' : 'POST',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const d = await res.json();
            if (res.ok && d.success) {
                setSubmitStatus('success');
                setSubmitMessage(mode === 'edit' ? 'Subscription updated!' : 'Subscription added successfully!');
                setTimeout(() => navigate('/dashboard/subscriptions'), 1600);
            } else {
                setSubmitStatus('error');
                setSubmitMessage(d.message || 'Something went wrong.');
            }
        } catch { setSubmitStatus('error'); setSubmitMessage('Unable to connect to server.'); }
        finally { setIsSubmitting(false); }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-400 flex items-center justify-center shadow-xl animate-pulse">
                <Loader2 size={28} className="animate-spin text-white" />
            </div>
            <p className="text-zinc-500">Loading subscription…</p>
        </div>
    );

    const selectedCompany = companies.find(c => c.id == formData.company_id);
    const selectedFolder = folders.find(f => f.id == formData.folder_id);
    const selectedTags = tags.filter(t => formData.tag_ids.includes(t.id));
    const currentStep = STEPS[step - 1];

    const slideVar = {
        enter: d => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: d => ({ x: d > 0 ? -60 : 60, opacity: 0 }),
    };

    return (
        <div className="max-w-2xl mx-auto pb-16">
            {/* ── Back link ──────────────────────────────────────────── */}
            <button onClick={() => navigate('/dashboard/subscriptions')}
                className="flex items-center gap-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors text-sm mb-8 group">
                <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
                Back to Subscriptions
            </button>

            {/* ── Page title ─────────────────────────────────────────── */}
            <div className="mb-10 text-center">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-4"
                >
                    Step {step} of {STEPS.length} — {currentStep.desc}
                </motion.div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                    {mode === 'edit' ? 'Edit' : 'Add'}{' '}
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-cyan-400">
                        Subscription
                    </span>
                </h1>
            </div>

            {/* ── Step indicator ─────────────────────────────────────── */}
            <div className="flex items-center mb-10 px-2">
                {STEPS.map((s, i) => {
                    const done = step > s.id;
                    const active = step === s.id;
                    const Icon = s.icon;
                    return (
                        <React.Fragment key={s.id}>
                            <div className="flex flex-col items-center">
                                <motion.div
                                    layout
                                    className={`relative w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 ${done ? `bg-gradient-to-br ${s.color} shadow-lg` :
                                        active ? `bg-gradient-to-br ${s.color} shadow-xl ring-4 ring-emerald-400/20` :
                                            'bg-zinc-100 dark:bg-zinc-800'
                                        }`}
                                >
                                    {done
                                        ? <Check size={16} className="text-white" />
                                        : <Icon size={16} className={active ? 'text-white' : 'text-zinc-400'} />
                                    }
                                </motion.div>
                                <span className={`text-xs mt-2 font-semibold hidden sm:block ${active ? 'text-zinc-900 dark:text-white' : done ? 'text-emerald-500' : 'text-zinc-400'
                                    }`}>{s.title}</span>
                            </div>
                            {i < STEPS.length - 1 && (
                                <div className="flex-1 mx-3 h-0.5 rounded-full overflow-hidden bg-zinc-200 dark:bg-zinc-700 relative top-[-10px] sm:top-[-0px]">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: step > s.id ? '100%' : '0%' }}
                                        transition={{ duration: 0.4 }}
                                        className={`h-full bg-gradient-to-r ${s.color}`}
                                    />
                                </div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>

            {/* ── Step Card ──────────────────────────────────────────── */}
            <div className="relative bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xl shadow-zinc-200/50 dark:shadow-zinc-900/50 overflow-hidden">
                {/* Top gradient stripe */}
                <div className={`h-1 w-full bg-gradient-to-r ${currentStep.color}`} />

                <div className="p-8">
                    {/* Error Alert */}
                    <AnimatePresence>
                        {Object.keys(errors).length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3"
                            >
                                <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" size={18} />
                                <div className="flex-1">
                                    <p className="font-semibold text-red-700 dark:text-red-300 text-sm mb-1">
                                        Fix these errors to continue:
                                    </p>
                                    <ul className="text-red-600 dark:text-red-400 text-xs space-y-0.5">
                                        {Object.entries(errors).map(([key, msg]) => (
                                            <li key={key}>• {msg}</li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={step}
                            custom={direction}
                            variants={slideVar}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.22, ease: 'easeInOut' }}
                        >
                            {/* ═══ STEP 1 — Service ══════════════════════════════ */}
                            {step === 1 && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Which service?</h2>
                                        <p className="text-sm text-zinc-500 mt-1">Select from your saved companies or add a new one.</p>
                                    </div>

                                    {/* Search Bar */}
                                    <div className="relative">
                                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                                        <input
                                            type="text"
                                            placeholder="Search companies..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-sm"
                                        />
                                    </div>

                                    {/* Company grid */}
                                    {companies.length > 0 ? (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-64 overflow-y-auto pr-1 pb-1 custom-scrollbar">
                                            {companies
                                                .filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
                                                .map(c => {
                                                    const sel = formData.company_id == c.id;
                                                    return (
                                                        <button key={c.id} type="button"
                                                            onClick={() => setFormData(p => ({ ...p, company_id: c.id }))}
                                                            className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 text-center group ${sel
                                                                ? 'border-emerald-400 bg-gradient-to-b from-emerald-50 to-cyan-50 dark:from-emerald-900/30 dark:to-cyan-900/30 shadow-lg shadow-emerald-500/10'
                                                                : 'border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 hover:border-zinc-300 dark:hover:border-zinc-600 hover:shadow-md'
                                                                }`}
                                                        >
                                                            {sel && (
                                                                <div className="absolute top-2 right-2 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                                                                    <Check size={10} className="text-white" />
                                                                </div>
                                                            )}
                                                            <CompanyLogo name={c.name} size="md" />
                                                            <span className={`text-xs font-semibold truncate w-full ${sel ? 'text-emerald-700 dark:text-emerald-300' : 'text-zinc-700 dark:text-zinc-300'}`}>
                                                                {c.name}
                                                            </span>
                                                        </button>
                                                    );
                                                })}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-zinc-400">
                                            <Building2 size={32} className="mx-auto mb-2 opacity-30" />
                                            <p className="text-sm">No companies yet. Create one below.</p>
                                        </div>
                                    )}

                                    {errors.company_id && (
                                        <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={11} />{errors.company_id}</p>
                                    )}

                                    <button type="button" onClick={() => setShowCompanyForm(v => !v)}
                                        className="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors">
                                        <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                            <Plus size={12} />
                                        </div>
                                        Add new company
                                    </button>

                                    <AnimatePresence>
                                        {showCompanyForm && (
                                            <InlineCreate label="company" value={newCompanyName} onChange={setNewCompanyName}
                                                onAdd={createCompany} onCancel={() => setShowCompanyForm(false)} placeholder="e.g. Netflix, Spotify…" />
                                        )}
                                    </AnimatePresence>

                                    <Input label="Description" hint="optional"
                                        className="w-full px-4 py-3 rounded-xl bg-white/80 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-zinc-900 dark:text-white placeholder-zinc-400 text-sm backdrop-blur resize-none">
                                        <textarea name="description" value={formData.description} onChange={handleChange} rows={2}
                                            className="w-full px-4 py-3 rounded-xl bg-white/80 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-zinc-900 dark:text-white placeholder-zinc-400 text-sm backdrop-blur resize-none"
                                            placeholder="What is this subscription for?" />
                                    </Input>
                                </div>
                            )}

                            {/* ═══ STEP 2 — Billing ══════════════════════════════ */}
                            {step === 2 && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Billing details</h2>
                                        <p className="text-sm text-zinc-500 mt-1">How much and how often do you pay?</p>
                                    </div>

                                    {/* Amount + Currency side by side */}
                                    <div className="flex gap-3">
                                        <div className="flex-1">
                                            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                                                Actual Amount <span className="text-red-400">*</span>
                                            </label>
                                            <div className="relative">
                                                <DollarSign size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                                                <input type="number" step="0.01" min="0" name="actual_amount" value={formData.actual_amount}
                                                    onChange={handleChange} placeholder="0.00"
                                                    className={`w-full pl-9 pr-4 py-3 rounded-xl bg-white/80 dark:bg-zinc-800/80 border ${errors.actual_amount ? 'border-red-400 ring-2 ring-red-400/20' : 'border-zinc-200 dark:border-zinc-700'} focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-zinc-900 dark:text-white text-sm backdrop-blur`} />
                                            </div>
                                            {errors.actual_amount && <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1"><AlertCircle size={11} />{errors.actual_amount}</p>}
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                                                Amount Paid
                                            </label>
                                            <div className="relative">
                                                <IndianRupee size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                                                <input type="number" step="0.01" min="0" name="amount_paid" value={formData.amount_paid}
                                                    onChange={handleChange} placeholder="0.00"
                                                    className={`w-full pl-9 pr-4 py-3 rounded-xl bg-white/80 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-zinc-900 dark:text-white text-sm backdrop-blur`} />
                                            </div>
                                        </div>
                                        <div className="w-28">
                                            <Select label="Currency" required name="currency" value={formData.currency} onChange={handleChange}>
                                                {['INR', 'USD', 'EUR', 'GBP', 'JPY', 'AED', 'SGD', 'AUD', 'CAD', 'CHF'].map(c => (
                                                    <option key={c} value={c}>{c}</option>
                                                ))}
                                            </Select>
                                        </div>
                                    </div>

                                    {/* Billing cycle visual pills */}
                                    <div>
                                        <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">Billing Cycle</label>
                                        <div className="grid grid-cols-4 gap-2">
                                            {['daily', 'weekly', 'monthly', 'yearly'].map(c => (
                                                <button key={c} type="button"
                                                    onClick={() => setFormData(p => ({ ...p, cycle: c }))}
                                                    className={`py-2.5 rounded-xl text-sm font-semibold capitalize transition-all ${formData.cycle === c
                                                        ? 'bg-gradient-to-br from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/25'
                                                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                                                        }`}>
                                                    {c}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <Input label="Every" type="number" min="1" name="frequency"
                                            value={formData.frequency} onChange={handleChange} hint="billing period" />
                                        <Select label="Type" name="type" value={formData.type} onChange={handleChange}>
                                            <option value="subscription">Subscription</option>
                                            <option value="trial">Trial</option>
                                            <option value="lifetime">Lifetime</option>
                                            <option value="revenue">Revenue</option>
                                        </Select>
                                    </div>

                                    {/* Recurring toggle */}
                                    <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-700/50">
                                        <div>
                                            <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Recurring</p>
                                            <p className="text-xs text-zinc-400 mt-0.5">Auto-renews each billing period</p>
                                        </div>
                                        <button type="button"
                                            onClick={() => setFormData(p => ({ ...p, recurring: !p.recurring }))}
                                            className={`w-12 h-6 rounded-full p-0.5 transition-all duration-200 focus:outline-none ${formData.recurring ? 'bg-emerald-500 shadow-md shadow-emerald-500/30' : 'bg-zinc-200 dark:bg-zinc-700'}`}>
                                            <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ${formData.recurring ? 'translate-x-6' : 'translate-x-0'}`} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* ═══ STEP 3 — Dates & Payment ══════════════════════ */}
                            {step === 3 && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Dates & Payment</h2>
                                        <p className="text-sm text-zinc-500 mt-1">When does it renew and how do you pay?</p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Input label="Next Payment Date" type="date" name="next_payment_date"
                                            value={formData.next_payment_date} onChange={handleChange} error={errors.next_payment_date} />
                                        <Input label="Contract Expiry" type="date" name="contract_expiry"
                                            value={formData.contract_expiry} onChange={handleChange} error={errors.contract_expiry} />
                                    </div>

                                    {/* Payment method pills */}
                                    <div>
                                        <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">Payment Method</label>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                            {[
                                                { value: '', label: 'Not specified', emoji: '💳' },
                                                { value: 'creditcard', label: 'Credit Card', emoji: '💳' },
                                                { value: 'debitcard', label: 'Debit Card', emoji: '🏦' },
                                                { value: 'paypal', label: 'PayPal', emoji: '🅿️' },
                                                { value: 'upi', label: 'UPI', emoji: '📱' },
                                                { value: 'netbanking', label: 'Net Banking', emoji: '🏛️' },
                                                { value: 'crypto', label: 'Crypto', emoji: '₿' },
                                                { value: 'free', label: 'Free', emoji: '🎁' },
                                            ].map(m => (
                                                <button key={m.value} type="button"
                                                    onClick={() => setFormData(p => ({ ...p, payment_method: m.value }))}
                                                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all border-2 ${formData.payment_method === m.value
                                                        ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
                                                        : 'border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-600'
                                                        }`}>
                                                    <span>{m.emoji}</span>
                                                    <span className="truncate">{m.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Website URL</label>
                                        <div className="relative">
                                            <Globe size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                                            <input type="url" name="url_link" value={formData.url_link} onChange={handleChange}
                                                className="w-full pl-9 pr-4 py-3 rounded-xl bg-white/80 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-zinc-900 dark:text-white placeholder-zinc-400 text-sm backdrop-blur"
                                                placeholder="https://example.com" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ═══ STEP 4 — Organize & Review ═══════════════════ */}
                            {step === 4 && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Organize & Review</h2>
                                        <p className="text-sm text-zinc-500 mt-1">Tag it, file it, then submit.</p>
                                    </div>

                                    {/* Folder */}
                                    <div>
                                        <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                                            <Folder size={13} className="inline mr-1.5 text-zinc-400" />Folder
                                        </label>
                                        <div className="flex gap-2">
                                            <select name="folder_id" value={formData.folder_id} onChange={handleChange}
                                                className="flex-1 px-4 py-3 pr-10 rounded-xl bg-white/80 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-zinc-900 dark:text-white text-sm appearance-none backdrop-blur">
                                                <option value="">No folder</option>
                                                {folders.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                                            </select>
                                            <button type="button" onClick={() => setShowFolderForm(v => !v)}
                                                className="px-4 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 rounded-xl border border-zinc-200 dark:border-zinc-700 transition-colors">
                                                <Plus size={18} />
                                            </button>
                                        </div>
                                        <AnimatePresence>
                                            {showFolderForm && (
                                                <InlineCreate label="folder" value={newFolderName} onChange={setNewFolderName}
                                                    onAdd={createFolder} onCancel={() => setShowFolderForm(false)} placeholder="Folder name" />
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Tags */}
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                                                <Tag size={13} className="inline mr-1.5 text-zinc-400" />Tags
                                            </label>
                                            <button type="button" onClick={() => setShowTagForm(v => !v)}
                                                className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 transition-colors">
                                                <Plus size={12} /> New tag
                                            </button>
                                        </div>
                                        <AnimatePresence>
                                            {showTagForm && (
                                                <InlineCreate label="tag" value={newTagName} onChange={setNewTagName}
                                                    onAdd={createTag} onCancel={() => setShowTagForm(false)} placeholder="Tag name" />
                                            )}
                                        </AnimatePresence>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {tags.map(t => (
                                                <button key={t.id} type="button" onClick={() => handleTagToggle(t.id)}
                                                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${formData.tag_ids.includes(t.id)
                                                        ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-md shadow-emerald-500/20'
                                                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                                                        }`}>
                                                    {t.name}
                                                </button>
                                            ))}
                                            {tags.length === 0 && <p className="text-sm text-zinc-400 italic">No tags yet.</p>}
                                        </div>
                                    </div>

                                    {/* Notes */}
                                    <div>
                                        <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Notes</label>
                                        <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3}
                                            className="w-full px-4 py-3 rounded-xl bg-white/80 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-zinc-900 dark:text-white placeholder-zinc-400 text-sm backdrop-blur resize-none"
                                            placeholder="Anything to remember about this subscription…" />
                                    </div>

                                    {/* ── Review summary card ─────────────────── */}
                                    <div className="rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-700">
                                        {/* Card header with logo */}
                                        <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 dark:from-zinc-800 dark:to-zinc-900 p-5 flex items-center gap-4">
                                            {selectedCompany && <CompanyLogo name={selectedCompany.name} size="lg" />}
                                            <div>
                                                <p className="text-xs text-zinc-400 uppercase tracking-widest mb-0.5">Review</p>
                                                <p className="text-white font-bold text-lg">{selectedCompany?.name || '—'}</p>
                                                {formData.description && <p className="text-zinc-400 text-sm">{formData.description}</p>}
                                            </div>
                                            <div className="ml-auto text-right">
                                                <p className="text-2xl font-black text-white">{formData.actual_amount || '—'}</p>
                                                <p className="text-zinc-400 text-sm">{formData.currency} / {formData.cycle}</p>
                                            </div>
                                        </div>

                                        {/* Detail grid */}
                                        <div className="grid grid-cols-2 divide-x divide-y divide-zinc-100 dark:divide-zinc-800">
                                            {[
                                                { label: 'Type', val: formData.type },
                                                { label: 'Recurring', val: formData.recurring ? 'Yes' : 'No' },
                                                { label: 'Next Due', val: formData.next_payment_date || '—' },
                                                { label: 'Payment', val: formData.payment_method || 'Not set' },
                                                { label: 'Folder', val: selectedFolder?.name || 'None' },
                                                { label: 'Tags', val: selectedTags.length ? selectedTags.map(t => t.name).join(', ') : 'None' },
                                            ].map(({ label, val }) => (
                                                <div key={label} className="px-5 py-3">
                                                    <p className="text-xs text-zinc-400 uppercase tracking-wide mb-0.5">{label}</p>
                                                    <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-200 capitalize truncate">{val}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Submit status */}
                                    <AnimatePresence>
                                        {submitStatus && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                                                className={`flex items-center gap-3 p-4 rounded-2xl ${submitStatus === 'success'
                                                    ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400'
                                                    : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400'
                                                    }`}>
                                                {submitStatus === 'success'
                                                    ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                                                <span className="text-sm font-medium">{submitMessage}</span>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* ── Nav row ────────────────────────────────────────────── */}
            <div className="flex items-center justify-between mt-6">
                <button
                    type="button"
                    onClick={step === 1 ? () => navigate('/dashboard/subscriptions') : goBack}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-600 font-semibold text-sm transition-all disabled:opacity-40"
                >
                    <ArrowLeft size={15} />
                    {step === 1 ? 'Cancel' : 'Back'}
                </button>

                {/* Step dots */}
                <div className="flex gap-1.5">
                    {STEPS.map(s => (
                        <div key={s.id} className={`rounded-full transition-all duration-300 ${step === s.id ? 'w-5 h-2 bg-emerald-500' : step > s.id ? 'w-2 h-2 bg-emerald-400' : 'w-2 h-2 bg-zinc-200 dark:bg-zinc-700'
                            }`} />
                    ))}
                </div>

                {step < STEPS.length ? (
                    <button type="button" onClick={goNext} disabled={!canProceed}
                        title={!canProceed ? 'Fill in required fields to continue' : 'Go to next step'}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105 transition-all active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
                        Next <ArrowRight size={15} />
                    </button>
                ) : (
                    <button type="button" onClick={handleSubmit} disabled={isSubmitting}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105 transition-all active:scale-100 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed">
                        {isSubmitting
                            ? <><Loader2 size={15} className="animate-spin" /> Saving…</>
                            : <><Save size={15} /> {mode === 'edit' ? 'Update' : 'Add Subscription'}</>
                        }
                    </button>
                )}
            </div>
        </div>
    );
};

export default SubscriptionForm;
