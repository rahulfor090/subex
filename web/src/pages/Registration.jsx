import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, CheckCircle2, AlertCircle,
    User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight
} from 'lucide-react';
import Logo from '../components/Logo';
import { apiFetch, API_BASE_URL } from '../lib/api';
import { Button } from '../components/ui/button';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AuthRobot from '../components/AuthRobot';
import { useNavDirection } from '../contexts/NavigationContext';

/* ─── Reusable themed input ─────────────────────────────────── */
const Field = ({ label, icon: Icon, error, className = '', ...props }) => (
    <div className={className}>
        {label && (
            <label htmlFor={props.id}
                className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2 flex items-center gap-2">
                {Icon && <Icon size={13} className="text-emerald-500 flex-shrink-0" />}
                {label}
            </label>
        )}
        <input
            {...props}
            className={`w-full px-4 py-3 rounded-xl text-sm text-zinc-900 dark:text-white
                bg-zinc-50 dark:bg-zinc-800/70
                border transition-all outline-none
                placeholder:text-zinc-400 dark:placeholder:text-zinc-600
                ${error
                    ? 'border-red-400 dark:border-red-500 focus:ring-red-400/20'
                    : 'border-zinc-200 dark:border-zinc-700 focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-emerald-500/15'}
                focus:ring-2 disabled:opacity-50`}
        />
        <AnimatePresence>
            {error && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle size={11} />{error}
                </motion.p>
            )}
        </AnimatePresence>
    </div>
);

/* ─── Section divider with icon ─────────────────────────────── */
const Section = ({ icon: Icon, children }) => (
    <div>
        <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/15">
                <Icon size={13} className="text-emerald-500" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">{children}</span>
            <div className="flex-1 h-px bg-zinc-100 dark:bg-zinc-800" />
        </div>
    </div>
);

/* ─── Registration page ──────────────────────────────────────── */
const Registration = () => {
    const navigate = useNavigate();
    const { navigateTo } = useNavDirection();
    const { signup } = useAuth();
    const robotRef = useRef(null);
    const [isPushing, setIsPushing] = useState(false);

    // Robot push animation → then navigate back to login
    const handleSwitchToLogin = () => {
        if (isPushing) return;
        setIsPushing(true);
        if (robotRef.current) {
            robotRef.current.push(-1, () => navigateTo('/login', -1));
        } else {
            navigateTo('/login', -1);
        }
        setTimeout(() => setIsPushing(false), 1000);
    };

    const [formData, setFormData] = useState({
        first_name: '', last_name: '', email: '',
        phone_number: '', password: '', confirm_password: '',
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const [submitMessage, setSubmitMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [pwFocused, setPwFocused] = useState(false);

    useEffect(() => { robotRef.current?.coverEyes(showPassword || showConfirm); }, [showPassword, showConfirm]);
    useEffect(() => { robotRef.current?.setTyping(pwFocused); }, [pwFocused]);

    /* Password strength 0–4 */
    const strength = (() => {
        const p = formData.password;
        if (!p) return 0;
        return [p.length >= 8, /[A-Z]/.test(p), /[0-9]/.test(p), /[@$!%*?&]/.test(p)]
            .filter(Boolean).length;
    })();
    const strengthMeta = [
        null,
        { label: 'Weak', color: '#ef4444', tailwind: 'bg-red-500' },
        { label: 'Fair', color: '#f59e0b', tailwind: 'bg-amber-500' },
        { label: 'Good', color: '#0891b2', tailwind: 'bg-cyan-500' },
        { label: 'Strong', color: '#10b981', tailwind: 'bg-emerald-500' },
    ][strength];

    const validate = () => {
        const e = {};
        if (!formData.first_name.trim()) e.first_name = 'First name is required';
        if (!formData.last_name.trim()) e.last_name = 'Last name is required';
        if (!formData.email.trim()) e.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Enter a valid email';
        if (formData.phone_number && !/^[\d\s\-\+\(\)]+$/.test(formData.phone_number))
            e.phone_number = 'Enter a valid phone number';
        if (!formData.password) e.password = 'Password is required';
        else if (formData.password.length < 8) e.password = 'Minimum 8 characters';
        else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.password))
            e.password = 'Needs uppercase, lowercase, number & special char';
        if (!formData.confirm_password) e.confirm_password = 'Please confirm your password';
        else if (formData.password !== formData.confirm_password) e.confirm_password = 'Passwords do not match';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(p => ({ ...p, [name]: value }));
        if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            // Prepare request body matching API documentation
            const requestBody = {
                name: `${formData.first_name} ${formData.last_name}`.trim(),
                email: formData.email,
                phone: formData.phone_number || undefined,
                password: formData.password
            };

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: `${formData.first_name} ${formData.last_name}`.trim(),
                    email: formData.email,
                    phone: formData.phone_number || undefined,
                    password: formData.password,
                }),
            });
            const data = await response.json();

            if (response.ok) {
                setSubmitStatus('success');
                setSubmitMessage('Account created! Welcome to SubEx 🎉');
                robotRef.current?.react('success');
                if (data.accessToken) {
                    // Fetch user details using the token
                    const userResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, {
                        headers: {
                            'Authorization': `Bearer ${data.accessToken}`
                        }
                    });
                    const ud = await userResponse.json();
                    if (ud.success) signup(data.accessToken, ud.data);
                }
                setFormData({ first_name: '', last_name: '', email: '', phone_number: '', password: '', confirm_password: '' });
                setTimeout(() => navigateTo('/dashboard', 1), 1500);
            } else {
                robotRef.current?.react('error');
                setSubmitStatus('error');
                setSubmitMessage(data.message || 'Registration failed. Please try again.');
                setTimeout(() => robotRef.current?.react('idle'), 2600);
            }
        } catch {
            robotRef.current?.react('error');
            setSubmitStatus('error');
            setSubmitMessage('Unable to connect to server. Please try again later.');
            setTimeout(() => robotRef.current?.react('idle'), 2600);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white antialiased overflow-x-hidden">

            {/* ── Background blobs ── */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-[120px] animate-blob" />
                <div className="absolute top-[40%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 dark:bg-cyan-500/15 rounded-full blur-[100px] animate-blob animation-delay-2000" />
                <div className="absolute bottom-[-10%] right-[20%] w-[40%] h-[40%] bg-emerald-400/5 dark:bg-emerald-400/10 rounded-full blur-[140px] animate-blob animation-delay-4000" />
                <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.025]
                    [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
            </div>

            <div className="relative z-10 min-h-screen flex flex-col px-4">
                {/* Top nav */}
                <div className="flex items-center justify-between py-6 max-w-6xl mx-auto w-full">
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => navigateTo('/', -1)}
                        className="flex items-center gap-2 px-4 py-2 rounded-full text-zinc-500 dark:text-zinc-400 
                                   hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-500/5 
                                   dark:hover:bg-emerald-500/10 transition-all duration-300 group cursor-pointer"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1.5 transition-transform duration-500 ease-out" />
                        <span className="text-sm font-bold tracking-tight">Back to Home</span>
                    </motion.button>

                    <div className="scale-110">
                        <Logo />
                    </div>

                    <motion.button
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        type="button"
                        onClick={handleSwitchToLogin}
                        disabled={isPushing}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-black uppercase tracking-wider
                                   text-zinc-600 dark:text-zinc-300 border-2 border-zinc-100 dark:border-zinc-800/50
                                   hover:border-emerald-500/40 dark:hover:border-emerald-500/40 hover:bg-emerald-500/5 
                                   dark:hover:bg-emerald-500/5 transition-all duration-300 group disabled:opacity-60
                                   shadow-sm hover:shadow-emerald-500/10 hover:-translate-y-0.5 cursor-pointer"
                    >
                        Sign in
                        <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform duration-500 ease-out text-emerald-500" />
                    </motion.button>
                </div>

                {/* Content */}
                <div className="flex-1 flex items-center justify-center py-8 pb-12">
                    <div className="w-full max-w-5xl flex flex-col lg:flex-row items-start gap-12 lg:gap-16">

                        {/* ── Robot (sticky) ── */}
                        <motion.div
                            initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.55, ease: 'easeOut' }}
                            className="flex flex-col items-center gap-3 flex-shrink-0 lg:sticky lg:top-8 lg:pt-4"
                        >
                            <AuthRobot ref={robotRef} size={200} />

                            <motion.p
                                className="text-sm font-medium text-center text-zinc-500 dark:text-zinc-400 max-w-[188px]"
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 3.2, repeat: Infinity }}
                            >
                                {showPassword || showConfirm
                                    ? "Privacy locked in 🔒"
                                    : pwFocused
                                        ? "Make it strong! 💪"
                                        : "Let's set you up! 🚀"}
                            </motion.p>

                            {/* Benefits mini-card */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.35 }}
                                className="mt-3 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800
                                    bg-white dark:bg-zinc-900 shadow-sm w-[200px]"
                            >
                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3">Why SubEx?</p>
                                {['Track all subscriptions', 'Smart renewal alerts', 'Spending insights', 'One-click cancel'].map((t, i) => (
                                    <motion.div key={t}
                                        initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 + i * 0.08 }}
                                        className="flex items-center gap-2 mb-2 last:mb-0">
                                        <CheckCircle2 size={12} className="text-emerald-500 flex-shrink-0" />
                                        <span className="text-xs text-zinc-600 dark:text-zinc-400">{t}</span>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </motion.div>

                        {/* ── Form ── */}
                        <motion.div
                            initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.55, ease: 'easeOut', delay: 0.08 }}
                            className="flex-1 w-full"
                        >
                            <div className="mb-7">
                                <h1 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white mb-2">
                                    Create Your{' '}
                                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-cyan-500">
                                        Account
                                    </span>
                                </h1>
                                <p className="text-zinc-500 dark:text-zinc-400">
                                    Join thousands managing their subscriptions smarter
                                </p>
                            </div>

                            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800
                                rounded-2xl p-8 shadow-xl dark:shadow-zinc-950/50">
                                <form onSubmit={handleSubmit} className="space-y-7">

                                    {/* Personal */}
                                    <div>
                                        <Section icon={User}>Personal Information</Section>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <Field label="First Name" id="first_name" name="first_name"
                                                icon={User} value={formData.first_name}
                                                onChange={handleChange} placeholder="John"
                                                error={errors.first_name} />
                                            <Field label="Last Name" id="last_name" name="last_name"
                                                value={formData.last_name} onChange={handleChange}
                                                placeholder="Doe" error={errors.last_name} />
                                        </div>
                                    </div>

                                    {/* Contact */}
                                    <div>
                                        <Section icon={Mail}>Contact Details</Section>
                                        <div className="space-y-4">
                                            <Field label="Email Address" id="email" name="email"
                                                icon={Mail} type="email"
                                                value={formData.email} onChange={handleChange}
                                                placeholder="john.doe@example.com" error={errors.email} />
                                            <Field label="Phone Number (optional)" id="phone_number"
                                                name="phone_number" icon={Phone} type="tel"
                                                value={formData.phone_number} onChange={handleChange}
                                                placeholder="+91 98765 43210" error={errors.phone_number} />
                                        </div>
                                    </div>

                                    {/* Security */}
                                    <div>
                                        <Section icon={Lock}>Account Security</Section>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {/* Password */}
                                            <div>
                                                <label htmlFor="password"
                                                    className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2 flex items-center gap-2">
                                                    <Lock size={13} className="text-emerald-500" />
                                                    Password
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        id="password" name="password"
                                                        type={showPassword ? 'text' : 'password'}
                                                        value={formData.password} onChange={handleChange}
                                                        onFocus={() => setPwFocused(true)}
                                                        onBlur={() => setPwFocused(false)}
                                                        placeholder="Min 8 characters"
                                                        className={`w-full px-4 py-3 pr-11 rounded-xl text-sm text-zinc-900 dark:text-white
                                                            bg-zinc-50 dark:bg-zinc-800/70
                                                            border transition-all outline-none
                                                            placeholder:text-zinc-400 dark:placeholder:text-zinc-600
                                                            ${errors.password
                                                                ? 'border-red-400 dark:border-red-500 focus:ring-red-400/20'
                                                                : 'border-zinc-200 dark:border-zinc-700 focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-emerald-500/15'}
                                                            focus:ring-2`}
                                                    />
                                                    <button type="button" onClick={() => setShowPassword(v => !v)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-white transition-colors">
                                                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                                    </button>
                                                </div>

                                                {/* Strength bar */}
                                                {formData.password && (
                                                    <div className="mt-2 space-y-1">
                                                        <div className="flex gap-1">
                                                            {[1, 2, 3, 4].map(i => (
                                                                <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors duration-300
                                                                    ${i <= strength ? strengthMeta?.tailwind : 'bg-zinc-200 dark:bg-zinc-700'}`} />
                                                            ))}
                                                        </div>
                                                        {strengthMeta && (
                                                            <p className="text-xs font-semibold" style={{ color: strengthMeta.color }}>
                                                                {strengthMeta.label}
                                                            </p>
                                                        )}
                                                    </div>
                                                )}

                                                <AnimatePresence>
                                                    {errors.password && (
                                                        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                                            className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                                                            <AlertCircle size={11} />{errors.password}
                                                        </motion.p>
                                                    )}
                                                </AnimatePresence>
                                            </div>

                                            {/* Confirm password */}
                                            <div>
                                                <label htmlFor="confirm_password"
                                                    className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                                                    Confirm Password
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        id="confirm_password" name="confirm_password"
                                                        type={showConfirm ? 'text' : 'password'}
                                                        value={formData.confirm_password} onChange={handleChange}
                                                        onFocus={() => setPwFocused(true)}
                                                        onBlur={() => setPwFocused(false)}
                                                        placeholder="Repeat password"
                                                        className={`w-full px-4 py-3 pr-11 rounded-xl text-sm text-zinc-900 dark:text-white
                                                            bg-zinc-50 dark:bg-zinc-800/70
                                                            border transition-all outline-none
                                                            placeholder:text-zinc-400 dark:placeholder:text-zinc-600
                                                            ${errors.confirm_password
                                                                ? 'border-red-400 dark:border-red-500 focus:ring-red-400/20'
                                                                : 'border-zinc-200 dark:border-zinc-700 focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-emerald-500/15'}
                                                            focus:ring-2`}
                                                    />
                                                    <button type="button" onClick={() => setShowConfirm(v => !v)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-white transition-colors">
                                                        {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                                                    </button>
                                                </div>

                                                {/* Match indicator */}
                                                {formData.confirm_password && formData.password && (
                                                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                                        className={`mt-1.5 text-xs font-medium flex items-center gap-1 ${formData.password === formData.confirm_password
                                                            ? 'text-emerald-600 dark:text-emerald-400'
                                                            : 'text-red-500'}`}
                                                    >
                                                        {formData.password === formData.confirm_password
                                                            ? <><CheckCircle2 size={11} /> Passwords match</>
                                                            : <><AlertCircle size={11} /> Does not match</>}
                                                    </motion.p>
                                                )}

                                                <AnimatePresence>
                                                    {errors.confirm_password && (
                                                        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                                            className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                                                            <AlertCircle size={11} />{errors.confirm_password}
                                                        </motion.p>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status banner */}
                                    <AnimatePresence>
                                        {submitStatus && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -8, height: 0 }}
                                                animate={{ opacity: 1, y: 0, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className={`flex items-center gap-3 p-3.5 rounded-xl text-sm font-medium
                                                    ${submitStatus === 'success'
                                                        ? 'bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/25 text-emerald-700 dark:text-emerald-400'
                                                        : 'bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/25 text-red-600 dark:text-red-400'}`}
                                            >
                                                {submitStatus === 'success'
                                                    ? <CheckCircle2 size={16} className="flex-shrink-0" />
                                                    : <AlertCircle size={16} className="flex-shrink-0" />}
                                                {submitMessage}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Submit */}
                                    <motion.button
                                        type="submit"
                                        disabled={isSubmitting}
                                        whileHover={{ scale: isSubmitting ? 1 : 1.015 }}
                                        whileTap={{ scale: 0.985 }}
                                        className="w-full h-12 rounded-xl font-bold text-sm text-white
                                            disabled:opacity-50 disabled:cursor-not-allowed"
                                        style={{
                                            background: 'linear-gradient(135deg,#10b981,#06b6d4)',
                                            boxShadow: '0 0 24px rgba(16,185,129,0.35)',
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 36px rgba(16,185,129,0.55)'}
                                        onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 24px rgba(16,185,129,0.35)'}
                                    >
                                        {isSubmitting ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <motion.span animate={{ rotate: 360 }}
                                                    transition={{ duration: 0.75, repeat: Infinity, ease: 'linear' }}
                                                    className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full" />
                                                Creating account…
                                            </span>
                                        ) : submitStatus === 'success'
                                            ? '🎉 Welcome to SubEx!'
                                            : 'Create Account →'}
                                    </motion.button>

                                    {/* Divider */}
                                    <div className="relative py-2">
                                        <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-zinc-300 dark:via-zinc-700 to-transparent" />
                                        <div className="relative flex justify-center">
                                            <span className="px-3 text-xs font-medium text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-900">
                                                or continue with
                                            </span>
                                        </div>
                                    </div>

                                    {/* OAuth buttons */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <motion.button
                                            type="button"
                                            onClick={() => window.location.href = `${API_BASE_URL}/api/auth/google`}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="flex items-center justify-center gap-2 h-11 rounded-xl
                                                bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700
                                                hover:bg-zinc-50 dark:hover:bg-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600
                                                transition-all font-medium text-sm text-zinc-700 dark:text-white"
                                        >
                                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                                <path fill="#EA4335" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                                <path fill="#4285F4" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                                <path fill="#FBBC05" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                            </svg>
                                            Google
                                        </motion.button>

                                        <motion.button
                                            type="button"
                                            onClick={() => window.location.href = `${API_BASE_URL}/api/auth/twitter`}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="flex items-center justify-center gap-2 h-11 rounded-xl
                                                bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700
                                                hover:bg-zinc-50 dark:hover:bg-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600
                                                transition-all font-medium text-sm text-zinc-700 dark:text-white"
                                        >
                                            <svg className="w-5 h-5" fill="#000000" viewBox="0 0 24 24">
                                                <path d="M23.953 4.57a10 10 0 002.856-3.515 10 10 0 01-2.856.974 4.992 4.992 0 00-8.694 4.552 14.153 14.153 0 01-10.287-5.186 4.992 4.992 0 001.546 6.657 4.981 4.981 0 01-2.265-.567v.062a4.992 4.992 0 003.997 4.895 4.994 4.994 0 01-2.254.085 4.993 4.993 0 004.663 3.468A10.006 10.006 0 010 19.54a14.144 14.144 0 007.666 2.247c9.199 0 14.207-7.594 14.207-14.178 0-.216-.004-.432-.013-.647a10.119 10.119 0 002.486-2.565z" />
                                            </svg>
                                            <span className="dark:hidden">Twitter</span>
                                            <span className="hidden dark:inline">X</span>
                                        </motion.button>
                                    </div>

                                    <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
                                        Already have an account?{' '}
                                        <button
                                            type="button"
                                            onClick={handleSwitchToLogin}
                                            disabled={isPushing}
                                            className="relative inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-black tracking-wide 
                                                       hover:text-emerald-500 transition-colors group disabled:opacity-60 cursor-pointer"
                                        >
                                            <span className="relative">Sign in here</span>
                                            <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-500 ease-out" />
                                            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-emerald-500 to-cyan-500 
                                                             group-hover:w-full transition-all duration-500 ease-out rounded-full" />
                                        </button>
                                    </p>
                                    <p className="text-center text-xs text-zinc-400 dark:text-zinc-600">
                                        By registering you agree to our{' '}
                                        <button type="button" onClick={() => navigateTo('/terms', 1)}
                                            className="underline hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors">Terms</button>
                                        {' '}and{' '}
                                        <button type="button" onClick={() => navigateTo('/privacy-policy', 1)}
                                            className="underline hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors">Privacy Policy</button>
                                    </p>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Registration;
