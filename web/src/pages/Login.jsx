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
            console.log('Attempting login with:', formData.identifier);

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ emailOrPhone: formData.identifier, password: formData.password }),
            });

            console.log('Login response status:', response.status);

            const data = await response.json();
            console.log('Login response data:', data);

            if (response.ok) {
                setSubmitStatus('success');
                setSubmitMessage('Login successful! Welcome back.');
                robotRef.current?.react('success');
                if (data.accessToken) {
                    try {
                        const userResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, {
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${data.accessToken}`,
                                'Content-Type': 'application/json'
                            }
                        });
                        console.log('User details response status:', userResponse.status);
                        const ud = await userResponse.json();
                        console.log('User details data:', ud);
                        if (ud.success) login(data.accessToken, ud.data);
                    } catch (fetchError) {
                        console.error('Error fetching user details:', fetchError);
                    }
                }
                setTimeout(() => navigate('/dashboard'), 1200);
            } else if (response.status === 423) {
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
        } catch (error) {
            console.error('Login error:', error);
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
                        onClick={() => navigateTo('/registration', 1)}
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
                                            <button type="button" onClick={() => navigateTo('/forgot-password', 1)}
                                                className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium">
                                                Forgot password?
                                            </button>
                                        </div>
                                        <div className="relative">
                                            <input
                                                id="password" name="password"
                                                type={showPassword ? 'text' : 'password'}
                                                autoComplete="current-password"
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
                                        Don't have an account?{' '}
                                        <button
                                            type="button"
                                            onClick={() => navigateTo('/registration', 1)}
                                            className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-semibold transition-colors group"
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
