import React, { useState } from 'react';
import { apiFetch } from '../lib/api';
import { motion } from 'framer-motion';
import { Lock, CheckCircle2, AlertCircle, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PasswordStrengthBar = ({ password }) => {
    const checks = [
        { label: 'At least 8 characters', test: password.length >= 8 },
        { label: 'Uppercase letter (A-Z)', test: /[A-Z]/.test(password) },
        { label: 'Lowercase letter (a-z)', test: /[a-z]/.test(password) },
        { label: 'Number (0-9)', test: /[0-9]/.test(password) },
        { label: 'Special character (!@#$...)', test: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) },
    ];

    const passed = checks.filter(c => c.test).length;
    const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-emerald-500'];
    const color = password ? strengthColors[passed - 1] || 'bg-zinc-300 dark:bg-zinc-700' : 'bg-zinc-300 dark:bg-zinc-700';

    return (
        <div className="mt-2 space-y-2">
            {/* Strength bar */}
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(i => (
                    <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= passed ? color : 'bg-zinc-200 dark:bg-zinc-700'}`}
                    />
                ))}
            </div>
            {/* Checklist */}
            <ul className="space-y-1">
                {checks.map((check, i) => (
                    <li key={i} className={`flex items-center gap-2 text-xs transition-colors ${check.test ? 'text-emerald-500' : 'text-zinc-500 dark:text-zinc-400'}`}>
                        <CheckCircle2 size={12} className={check.test ? 'text-emerald-500' : 'text-zinc-400'} />
                        {check.label}
                    </li>
                ))}
            </ul>
        </div>
    );
};

const CreatePassword = () => {
    const navigate = useNavigate();
    const { token, updateUser } = useAuth();

    const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const [submitMessage, setSubmitMessage] = useState('');

    const validateForm = () => {
        const newErrors = {};

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters long';
        } else if (!/[A-Z]/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one uppercase letter';
        } else if (!/[a-z]/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one lowercase letter';
        } else if (!/[0-9]/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one number';
        } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one special character';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            const response = await apiFetch('/api/auth/set-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ password: formData.password }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setSubmitStatus('success');
                setSubmitMessage('Password created successfully! Taking you to your dashboard...');
                // Update user context so hasPassword is reflected
                if (updateUser) updateUser({ hasPassword: true });
                setTimeout(() => navigate('/dashboard'), 1500);
            } else {
                setSubmitStatus('error');
                setSubmitMessage(data.message || 'Failed to set password. Please try again.');
            }
        } catch (error) {
            setSubmitStatus('error');
            setSubmitMessage('Unable to connect to server. Please try again later.');
            console.error('Set password error:', error);
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
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-10"
                >
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                            <ShieldCheck size={32} className="text-emerald-500" />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-3">
                        Create <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-cyan-500">Password</span>
                    </h1>
                    <p className="text-zinc-600 dark:text-zinc-400 text-base">
                        Set a password so you can also sign in with your email in the future.
                    </p>
                </motion.div>

                {/* Form Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-white dark:bg-zinc-900/50 backdrop-blur border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-xl"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium mb-2 flex items-center gap-2">
                                <Lock size={16} className="text-emerald-500" />
                                New Password <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 pr-12 rounded-lg bg-white dark:bg-zinc-800 border ${errors.password ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-700'} focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all`}
                                    placeholder="Create a strong password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(v => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-emerald-500 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                            )}
                            {formData.password && <PasswordStrengthBar password={formData.password} />}
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2 flex items-center gap-2">
                                <Lock size={16} className="text-emerald-500" />
                                Confirm Password <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirm ? 'text' : 'password'}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 pr-12 rounded-lg bg-white dark:bg-zinc-800 border ${errors.confirmPassword ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-700'} focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all`}
                                    placeholder="Confirm your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(v => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-emerald-500 transition-colors"
                                >
                                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                            )}
                        </div>

                        {/* Status Message */}
                        {submitStatus && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex items-center gap-3 p-4 rounded-lg ${submitStatus === 'success'
                                    ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                                    : 'bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400'
                                    }`}
                            >
                                {submitStatus === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                                <span>{submitMessage}</span>
                            </motion.div>
                        )}

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={isSubmitting || submitStatus === 'success'}
                            className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Creating Password...' : submitStatus === 'success' ? 'Done!' : 'Create Password'}
                        </Button>

                        {/* Skip option */}
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard')}
                            className="w-full text-center text-sm text-zinc-500 dark:text-zinc-400 hover:text-emerald-500 transition-colors"
                        >
                            Skip for now
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default CreatePassword;
