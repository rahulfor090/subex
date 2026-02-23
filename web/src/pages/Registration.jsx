import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, CheckCircle2, AlertCircle,
    User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight
} from 'lucide-react';
import Logo from '../components/Logo';
import { useNavigate } from 'react-router-dom';
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
        robotRef.current?.push(-1, () => navigateTo('/login', -1));
        setTimeout(() => setIsPushing(false), 950);
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
            const res = await fetch('http://localhost:3000/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: `${formData.first_name} ${formData.last_name}`.trim(),
                    email: formData.email,
                    phone: formData.phone_number || undefined,
                    password: formData.password,
                }),
            });
            const data = await res.json();

            if (res.ok) {
                setSubmitStatus('success');
                setSubmitMessage('Account created! Welcome to SubEx 🎉');
                robotRef.current?.react('success');
                if (data.accessToken) {
                    const ur = await fetch('http://localhost:3000/api/auth/me', {
                        headers: { Authorization: `Bearer ${data.accessToken}` }
                    });
                    const ud = await ur.json();
                    if (ud.success) signup(data.accessToken, ud.data);
                }
                setFormData({ first_name: '', last_name: '', email: '', phone_number: '', password: '', confirm_password: '' });
                setTimeout(() => navigate('/'), 2000);
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
                <div className="flex items-center justify-between py-5 max-w-6xl mx-auto w-full">
                    <motion.button
                        initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                        onClick={() => navigateTo('/', -1)}
                        className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors group">
                        <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                        <span className="text-sm font-medium">Back to Home</span>
                    </motion.button>

                    <Logo />

                    <motion.button
                        type="button"
                        onClick={handleSwitchToLogin}
                        disabled={isPushing}
                        whileHover={isPushing ? {} : { scale: 1.04 }}
                        whileTap={isPushing ? {} : { scale: 0.97 }}
                        className="flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium group disabled:opacity-60"
                    >
                        Sign in
                        <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </motion.button>
                </div>

                {/* Content */}
                <div className="flex-1 flex items-start justify-center py-4 pb-12">
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

                                    <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
                                        Already have an account?{' '}
                                        <button
                                            type="button"
                                            onClick={handleSwitchToLogin}
                                            disabled={isPushing}
                                            className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-semibold transition-colors group disabled:opacity-60"
                                        >
                                            Sign in here
                                            <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                                        </button>
                                    </p>
                                    <p className="text-center text-xs text-zinc-400 dark:text-zinc-600">
                                        By registering you agree to our{' '}
                                        <button type="button" onClick={() => navigate('/terms')}
                                            className="underline hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors">Terms</button>
                                        {' '}and{' '}
                                        <button type="button" onClick={() => navigate('/privacy')}
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
