  import React, { useState, useEffect, useRef } from 'react';
  import { motion, AnimatePresence } from 'framer-motion';
  import { ArrowLeft, CheckCircle2, AlertCircle, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
  import Logo from '../components/Logo';
  import { apiFetch, apiJSON, API_BASE_URL } from '../lib/api';
  import { Button } from '../components/ui/button';
  import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AuthRobot from '../components/AuthRobot';
import { useNavDirection } from '../contexts/NavigationContext';

const Login = () => {
    const navigate = useNavigate();
    const { navigateTo } = useNavDirection();
    const { login } = useAuth();
    const robotRef = useRef(null);
    const [isPushing, setIsPushing] = useState(false);

    // Robot push animation → then navigate
    const handleSwitchToRegister = () => {
        if (isPushing) return;
        setIsPushing(true);
        robotRef.current?.push(1, () => navigateTo('/registration', 1));
        // Reset after full animation finishes
        setTimeout(() => setIsPushing(false), 950);
    };

    const [formData, setFormData] = useState({ identifier: '', password: '' });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const [submitMessage, setSubmitMessage] = useState('');
    const [isLocked, setIsLocked] = useState(false);
    const [remainingSeconds, setRemainingSeconds] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);

    // Lock countdown
    useEffect(() => {
        if (remainingSeconds > 0) {
            const t = setTimeout(() => setRemainingSeconds(s => s - 1), 1000);
            return () => clearTimeout(t);
        } else if (isLocked && remainingSeconds === 0) {
            setIsLocked(false);
            setSubmitStatus(null);
            setSubmitMessage('');
        }
    }, [remainingSeconds, isLocked]);

    useEffect(() => { robotRef.current?.setTyping(passwordFocused); }, [passwordFocused]);
    useEffect(() => { robotRef.current?.coverEyes(showPassword); }, [showPassword]);

    const validate = () => {
        const e = {};
        if (!formData.identifier.trim()) e.identifier = 'Email or phone number is required';
        if (!formData.password) e.password = 'Password is required';
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
        if (!validate() || isLocked) return;
        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            // Prepare request body matching API documentation
            const requestBody = {
                emailOrPhone: formData.identifier,
                password: formData.password
            };

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ emailOrPhone: formData.identifier, password: formData.password }),
            });
            const data = await res.json();

            if (res.ok) {
                setSubmitStatus('success');
                setSubmitMessage('Login successful! Welcome back.');
                robotRef.current?.react('success');
                if (data.accessToken) {
                    const userResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, {
                        headers: {
                            'Authorization': `Bearer ${data.accessToken}`
                        }
                    });
                    const ud = await ur.json();
                    if (ud.success) login(data.accessToken, ud.data);
                }
                setTimeout(() => navigate('/'), 1200);
            } else if (res.status === 423) {
                robotRef.current?.react('error');
                setSubmitStatus('error');
                setSubmitMessage(data.message);
                setIsLocked(true);
                setRemainingSeconds(data.remainingSeconds || 60);
            } else {
                robotRef.current?.react('error');
                setSubmitStatus('error');
                setSubmitMessage(data.message || 'Login failed. Please try again.');
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
        <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white antialiased overflow-hidden">

            {/* ── Background blobs — same as hero section ── */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-[120px] animate-blob" />
                <div className="absolute top-[30%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/10 dark:bg-cyan-500/15 rounded-full blur-[100px] animate-blob animation-delay-2000" />
                <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-emerald-400/5 dark:bg-emerald-400/10 rounded-full blur-[140px] animate-blob animation-delay-4000" />
                {/* Grid overlay */}
                <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.025]
                    [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
            </div>

            <div className="relative z-10 min-h-screen flex flex-col px-4">
                {/* Top nav */}
                <div className="flex items-center justify-between py-5 max-w-6xl mx-auto w-full">
                    <motion.button
                        initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                        onClick={() => navigateTo('/', -1)}
                        className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors group"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                        <span className="text-sm font-medium">Back to Home</span>
                    </motion.button>

                    {/* Logo */}
                    <Logo />

                    <motion.button
                        type="button"
                        onClick={handleSwitchToRegister}
                        disabled={isPushing}
                        whileHover={isPushing ? {} : { scale: 1.04 }}
                        whileTap={isPushing ? {} : { scale: 0.97 }}
                        className="flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium group disabled:opacity-60"
                    >
                        Create account
                        <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </motion.button>
                </div>

                {/* Center layout */}
                <div className="flex-1 flex items-center justify-center py-8">
                    <div className="w-full max-w-5xl flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                        {/* ── Robot column ── */}
                        <motion.div
                            initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.55, ease: 'easeOut' }}
                            className="flex flex-col items-center gap-2 flex-shrink-0"
                        >
                            <AuthRobot ref={robotRef} size={210} />

                            <motion.p
                                className="text-sm font-medium text-center text-zinc-500 dark:text-zinc-400 max-w-[190px]"
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 3.2, repeat: Infinity }}
                                >
                        {/* Divider */}
                        <div className="relative flex items-center">
                            <div className="flex-grow border-t border-zinc-200 dark:border-zinc-700" />
                            <span className="mx-3 text-xs text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">or</span>
                            <div className="flex-grow border-t border-zinc-200 dark:border-zinc-700" />
                        </div>

                        {/* Google OAuth Button */}
                        <button
                            type="button"
                            onClick={() => window.location.href = `${API_BASE_URL}/api/auth/google`}
                            className="w-full h-12 flex items-center justify-center gap-3 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 hover:border-zinc-400 dark:hover:border-zinc-500 rounded-lg font-semibold text-zinc-700 dark:text-zinc-200 transition-all hover:shadow-md"
                        >
                            {/* Google Logo SVG */}
                            <svg width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                                <path fill="none" d="M0 0h48v48H0z" />
                            </svg>
                            Continue with Google
                        </button>

                        {/* Twitter / X OAuth Button */}
                        <button
                            type="button"
                            onClick={() => window.location.href = `${API_BASE_URL}/api/auth/twitter`}
                            className="w-full h-12 flex items-center justify-center gap-3 bg-black dark:bg-zinc-900 border border-zinc-700 hover:border-zinc-500 rounded-lg font-semibold text-white transition-all hover:shadow-md hover:bg-zinc-900"
                        >
                            {/* X (Twitter) Logo SVG */}
                            <svg width="18" height="18" viewBox="0 0 1200 1227" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.163 519.284ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.828Z" fill="white" />
                            </svg>
                            Continue with X (Twitter)
                        </button>

                        {/* Register Link */}
                        <p className="text-sm text-center text-zinc-500">
                            Don't have an account?{' '}
                            <button
                                type="button"
                                onClick={() => navigate('/registration')}
                                className="text-emerald-500 hover:text-emerald-600 font-semibold transition-colors"
                            >
                                {showPassword
                                    ? "I won't peek! 🙈"
                                    : passwordFocused
                                        ? "Watching over you 👀"
                                        : "Hi! I'm SubEx Bot 🤖"}
                            </motion.p>
                        </motion.div>

                        {/* ── Form column ── */}
                        <motion.div
                            initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.55, ease: 'easeOut', delay: 0.08 }}
                            className="flex-1 w-full max-w-md"
                        >
                            {/* Heading */}
                            <div className="mb-8">
                                <h1 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white mb-2">
                                    Welcome{' '}
                                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-cyan-500">
                                        Back
                                    </span>
                                </h1>
                                <p className="text-zinc-500 dark:text-zinc-400">
                                    Sign in to manage your subscriptions
                                </p>
                            </div>

                            {/* Card */}
                            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800
                                rounded-2xl p-8 shadow-xl dark:shadow-zinc-950/50">
                                <form onSubmit={handleSubmit} className="space-y-5">

                                    {/* Email / Phone */}
                                    <div>
                                        <label htmlFor="identifier"
                                            className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2 flex items-center gap-2">
                                            <Mail size={14} className="text-emerald-500" />
                                            Email or Phone Number
                                        </label>
                                        <input
                                            id="identifier" name="identifier" type="text"
                                            value={formData.identifier} onChange={handleChange}
                                            disabled={isLocked}
                                            placeholder="john.doe@example.com"
                                            className={`w-full px-4 py-3 rounded-xl text-sm text-zinc-900 dark:text-white
                                                bg-zinc-50 dark:bg-zinc-800/70
                                                border transition-all outline-none
                                                placeholder:text-zinc-400 dark:placeholder:text-zinc-600
                                                ${errors.identifier
                                                    ? 'border-red-400 dark:border-red-500 focus:ring-red-400/20'
                                                    : 'border-zinc-200 dark:border-zinc-700 focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-emerald-500/15'}
                                                focus:ring-2`}
                                        />
                                        <AnimatePresence>
                                            {errors.identifier && (
                                                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                                    className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                                                    <AlertCircle size={11} /> {errors.identifier}
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Password */}
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label htmlFor="password"
                                                className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                                                <Lock size={14} className="text-emerald-500" />
                                                Password
                                            </label>
                                            <button type="button" onClick={() => navigate('/forgot-password')}
                                                className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium">
                                                Forgot password?
                                            </button>
                                        </div>
                                        <div className="relative">
                                            <input
                                                id="password" name="password"
                                                type={showPassword ? 'text' : 'password'}
                                                value={formData.password} onChange={handleChange}
                                                onFocus={() => setPasswordFocused(true)}
                                                onBlur={() => setPasswordFocused(false)}
                                                disabled={isLocked}
                                                placeholder="Enter your password"
                                                className={`w-full px-4 py-3 pr-11 rounded-xl text-sm text-zinc-900 dark:text-white
                                                    bg-zinc-50 dark:bg-zinc-800/70
                                                    border transition-all outline-none
                                                    placeholder:text-zinc-400 dark:placeholder:text-zinc-600
                                                    ${errors.password
                                                        ? 'border-red-400 dark:border-red-500 focus:ring-red-400/20'
                                                        : 'border-zinc-200 dark:border-zinc-700 focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-emerald-500/15'}
                                                    focus:ring-2`}
                                            />
                                            <button type="button"
                                                onClick={() => setShowPassword(v => !v)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-white transition-colors">
                                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                        <AnimatePresence>
                                            {errors.password && (
                                                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                                    className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                                                    <AlertCircle size={11} /> {errors.password}
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Status banner */}
                                    <AnimatePresence>
                                        {submitStatus && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -8, height: 0 }}
                                                animate={{ opacity: 1, y: 0, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className={`flex items-start gap-3 p-3.5 rounded-xl text-sm font-medium
                                                    ${submitStatus === 'success'
                                                        ? 'bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/25 text-emerald-700 dark:text-emerald-400'
                                                        : 'bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/25 text-red-600 dark:text-red-400'}`}
                                            >
                                                {submitStatus === 'success'
                                                    ? <CheckCircle2 size={16} className="flex-shrink-0 mt-0.5" />
                                                    : <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />}
                                                <div>
                                                    {submitMessage}
                                                    {isLocked && remainingSeconds > 0 && (
                                                        <div className="text-xs opacity-75 mt-1">Retry in {remainingSeconds}s</div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Submit button */}
                                    <motion.button
                                        type="submit"
                                        disabled={isSubmitting || isLocked}
                                        whileHover={{ scale: isSubmitting || isLocked ? 1 : 1.015 }}
                                        whileTap={{ scale: 0.985 }}
                                        className="w-full h-12 rounded-xl font-bold text-sm text-white
                                            disabled:opacity-50 disabled:cursor-not-allowed transition-shadow"
                                        style={{
                                            background: submitStatus === 'success'
                                                ? 'linear-gradient(135deg,#10b981,#06b6d4)'
                                                : 'linear-gradient(135deg,#10b981,#06b6d4)',
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
                                                Signing in…
                                            </span>
                                        ) : isLocked
                                            ? `Locked — retry in ${remainingSeconds}s`
                                            : submitStatus === 'success'
                                                ? '✓ Signed in!'
                                                : 'Sign In'}
                                    </motion.button>

                                    <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
                                        Don't have an account?{' '}
                                        <button
                                            type="button"
                                            onClick={handleSwitchToRegister}
                                            disabled={isPushing}
                                            className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-semibold transition-colors group disabled:opacity-60"
                                        >
                                            Register here
                                            <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                                        </button>
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

export default Login;
