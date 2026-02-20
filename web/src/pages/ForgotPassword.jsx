import React, { useState } from 'react';
import { apiJSON } from '../lib/api';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
    const [submitMessage, setSubmitMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.trim()) {
            setSubmitStatus('error');
            setSubmitMessage('Please enter your email address');
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            const response = await apiJSON('/api/auth/forgot-password', 'POST', { email });

            const data = await response.json();

            if (response.ok && data.success) {
                setSubmitStatus('success');
                setSubmitMessage(data.message || 'Password reset link has been sent to your email.');
                setEmail('');
            } else {
                setSubmitStatus('error');
                setSubmitMessage(data.message || 'Failed to send reset link. Please try again.');
            }
        } catch (error) {
            setSubmitStatus('error');
            setSubmitMessage('Unable to connect to server. Please try again later.');
            console.error('Forgot password error:', error);
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
                    onClick={() => navigate('/login')}
                    className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors mb-8"
                >
                    <ArrowLeft size={20} />
                    <span>Back to Login</span>
                </motion.button>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Forgot <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-cyan-500">Password?</span>
                    </h1>
                    <p className="text-lg text-zinc-600 dark:text-zinc-400">
                        No worries! Enter your email and we'll send you a reset link.
                    </p>
                </motion.div>

                {/* Forgot Password Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-white dark:bg-zinc-900/50 backdrop-blur border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-xl"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-2 flex items-center gap-2">
                                <Mail size={16} className="text-emerald-500" />
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                                placeholder="john.doe@example.com"
                                required
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
                            className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                        </Button>

                        {/* Back to Login Link */}
                        <p className="text-sm text-center text-zinc-500">
                            Remember your password?{' '}
                            <button
                                type="button"
                                onClick={() => navigate('/login')}
                                className="text-emerald-500 hover:text-emerald-600 font-semibold transition-colors"
                            >
                                Sign in here
                            </button>
                        </p>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default ForgotPassword;
