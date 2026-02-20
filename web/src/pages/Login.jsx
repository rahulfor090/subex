import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, AlertCircle, Mail, Lock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        identifier: '',
        password: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
    const [submitMessage, setSubmitMessage] = useState('');
    const [isLocked, setIsLocked] = useState(false);
    const [remainingSeconds, setRemainingSeconds] = useState(0);

    // Countdown timer for locked account
    useEffect(() => {
        if (remainingSeconds > 0) {
            const timer = setTimeout(() => {
                setRemainingSeconds(prev => prev - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (isLocked && remainingSeconds === 0) {
            setIsLocked(false);
            setSubmitStatus(null);
            setSubmitMessage('');
        }
    }, [remainingSeconds, isLocked]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.identifier.trim()) {
            newErrors.identifier = 'Email or phone number is required';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error for this field when user starts typing
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

        if (isLocked) {
            return;
        }

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
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            const data = await response.json();

            if (response.ok) {
                setSubmitStatus('success');
                setSubmitMessage('Login successful! Welcome back.');

                // Fetch user details using the token
                if (data.accessToken) {
                    const userResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, {
                        headers: {
                            'Authorization': `Bearer ${data.accessToken}`
                        }
                    });
                    const userData = await userResponse.json();

                    if (userData.success) {
                        login(data.accessToken, userData.data);
                    }
                }

                // Redirect to home after 1 second
                setTimeout(() => {
                    navigate('/');
                }, 1000);
            } else if (response.status === 423) {
                // Account locked
                setSubmitStatus('error');
                setSubmitMessage(data.message);
                setIsLocked(true);
                setRemainingSeconds(data.remainingSeconds || 60);
            } else {
                setSubmitStatus('error');
                setSubmitMessage(data.message || 'Login failed. Please try again.');
            }
        } catch (error) {
            setSubmitStatus('error');
            setSubmitMessage('Unable to connect to server. Please try again later.');
            console.error('Login error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-white antialiased overflow-x-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] pointer-events-none" />
            <div className="fixed inset-0 bg-white/90 dark:bg-black/[0.96] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] pointer-events-none" />

            <div className="relative z-10 max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Back Button */}
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors mb-8"
                >
                    <ArrowLeft size={20} />
                    <span>Back to Home</span>
                </motion.button>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Welcome <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-cyan-500">Back</span>
                    </h1>
                    <p className="text-lg text-zinc-600 dark:text-zinc-400">
                        Sign in to manage your subscriptions
                    </p>
                </motion.div>

                {/* Login Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-white dark:bg-zinc-900/50 backdrop-blur border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-xl"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Identifier Field */}
                        <div>
                            <label htmlFor="identifier" className="block text-sm font-medium mb-2 flex items-center gap-2">
                                <Mail size={16} className="text-emerald-500" />
                                Email or Phone Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="identifier"
                                name="identifier"
                                value={formData.identifier}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 rounded-lg bg-white dark:bg-zinc-800 border ${errors.identifier ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-700'
                                    } focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all`}
                                placeholder="john.doe@example.com or +1234567890"
                                disabled={isLocked}
                            />
                            {errors.identifier && (
                                <p className="mt-1 text-sm text-red-500">{errors.identifier}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium mb-2 flex items-center gap-2">
                                <Lock size={16} className="text-emerald-500" />
                                Password <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 rounded-lg bg-white dark:bg-zinc-800 border ${errors.password ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-700'
                                    } focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all`}
                                placeholder="Enter your password"
                                disabled={isLocked}
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                            )}
                            <div className="text-right">
                                <button
                                    type="button"
                                    onClick={() => navigate('/forgot-password')}
                                    className="text-sm text-emerald-500 hover:text-emerald-600 transition-colors"
                                >
                                    Forgot Password?
                                </button>
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
                                <div className="flex-1">
                                    <span>{submitMessage}</span>
                                    {isLocked && remainingSeconds > 0 && (
                                        <div className="mt-2 text-sm font-semibold">
                                            Time remaining: {remainingSeconds}s
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={isSubmitting || isLocked}
                            className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Signing In...' : isLocked ? `Locked (${remainingSeconds}s)` : 'Sign In'}
                        </Button>

                        {/* Register Link */}
                        <p className="text-sm text-center text-zinc-500">
                            Don't have an account?{' '}
                            <button
                                type="button"
                                onClick={() => navigate('/registration')}
                                className="text-emerald-500 hover:text-emerald-600 font-semibold transition-colors"
                            >
                                Register here
                            </button>
                        </p>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
