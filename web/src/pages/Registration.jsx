import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, AlertCircle, User, Mail } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Registration = () => {
    const navigate = useNavigate();
    const { signup } = useAuth();
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        password: '',
        confirm_password: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
    const [submitMessage, setSubmitMessage] = useState('');

    const validateForm = () => {
        const newErrors = {};

        // Required fields
        if (!formData.first_name.trim()) {
            newErrors.first_name = 'First name is required';
        }
        if (!formData.last_name.trim()) {
            newErrors.last_name = 'Last name is required';
        }
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Optional phone validation
        if (formData.phone_number && !/^[\d\s\-\+\(\)]+$/.test(formData.phone_number)) {
            newErrors.phone_number = 'Please enter a valid phone number';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters long';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.password)) {
            newErrors.password = 'Password must contain uppercase, lowercase, number, and special character';
        }

        // Confirm password validation
        if (!formData.confirm_password) {
            newErrors.confirm_password = 'Please confirm your password';
        } else if (formData.password !== formData.confirm_password) {
            newErrors.confirm_password = 'Passwords do not match';
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
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            const data = await response.json();

            if (response.ok) {
                setSubmitStatus('success');
                setSubmitMessage('Registration successful! Welcome to SubEx.');

                // Store token and user data
                if (data.accessToken) {
                    // Fetch user details using the token
                    const userResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, {
                        headers: {
                            'Authorization': `Bearer ${data.accessToken}`
                        }
                    });
                    const userData = await userResponse.json();

                    if (userData.success) {
                        signup(data.accessToken, userData.data);
                    }
                }
                // Reset form
                setFormData({
                    first_name: '',
                    last_name: '',
                    email: '',
                    phone_number: '',
                    password: '',
                    confirm_password: ''
                });
                // Redirect to home after 2 seconds
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } else {
                setSubmitStatus('error');
                setSubmitMessage(data.message || 'Registration failed. Please try again.');
            }
        } catch (error) {
            setSubmitStatus('error');
            setSubmitMessage('Unable to connect to server. Please try again later.');
            console.error('Registration error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-white antialiased overflow-x-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] pointer-events-none" />
            <div className="fixed inset-0 bg-white/90 dark:bg-black/[0.96] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
                        Start Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-cyan-500">Free Trial</span>
                    </h1>
                    <p className="text-lg text-zinc-600 dark:text-zinc-400">
                        Join thousands of users taking control of their subscriptions
                    </p>
                </motion.div>

                {/* Registration Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-white dark:bg-zinc-900/50 backdrop-blur border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-xl"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Personal Information */}
                        <div>
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <User size={20} className="text-emerald-500" />
                                Personal Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="first_name" className="block text-sm font-medium mb-2">
                                        First Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="first_name"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 rounded-lg bg-white dark:bg-zinc-800 border ${errors.first_name ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-700'
                                            } focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all`}
                                        placeholder="John"
                                    />
                                    {errors.first_name && (
                                        <p className="mt-1 text-sm text-red-500">{errors.first_name}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="last_name" className="block text-sm font-medium mb-2">
                                        Last Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="last_name"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 rounded-lg bg-white dark:bg-zinc-800 border ${errors.last_name ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-700'
                                            } focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all`}
                                        placeholder="Doe"
                                    />
                                    {errors.last_name && (
                                        <p className="mt-1 text-sm text-red-500">{errors.last_name}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div>
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <Mail size={20} className="text-emerald-500" />
                                Contact Information
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                                        Email Address <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 rounded-lg bg-white dark:bg-zinc-800 border ${errors.email ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-700'
                                            } focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all`}
                                        placeholder="john.doe@example.com"
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="phone_number" className="block text-sm font-medium mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone_number"
                                        name="phone_number"
                                        value={formData.phone_number}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 rounded-lg bg-white dark:bg-zinc-800 border ${errors.phone_number ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-700'
                                            } focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all`}
                                        placeholder="+91 (Mobile) 98765 43210"
                                    />
                                    {errors.phone_number && (
                                        <p className="mt-1 text-sm text-red-500">{errors.phone_number}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Password Information */}
                        <div>
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                </svg>
                                Account Security
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium mb-2">
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
                                    />
                                    {errors.password && (
                                        <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                                    )}
                                    <p className="mt-1 text-xs text-zinc-500">
                                        Must be at least 8 characters with uppercase, lowercase, number, and special character
                                    </p>
                                </div>

                                <div>
                                    <label htmlFor="confirm_password" className="block text-sm font-medium mb-2">
                                        Confirm Password <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        id="confirm_password"
                                        name="confirm_password"
                                        value={formData.confirm_password}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 rounded-lg bg-white dark:bg-zinc-800 border ${errors.confirm_password ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-700'
                                            } focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all`}
                                        placeholder="Confirm your password"
                                    />
                                    {errors.confirm_password && (
                                        <p className="mt-1 text-sm text-red-500">{errors.confirm_password}</p>
                                    )}
                                </div>
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
                                <span>{submitMessage}</span>
                            </motion.div>
                        )}

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Creating Account...' : 'Start Free Trial'}
                        </Button>

                        <p className="text-sm text-center text-zinc-500">
                            Already have an account?{' '}
                            <button
                                type="button"
                                onClick={() => navigate('/login')}
                                className="text-emerald-500 hover:text-emerald-600 font-semibold transition-colors"
                            >
                                Login here
                            </button>
                        </p>

                        <p className="text-sm text-center text-zinc-500">
                            By registering, you agree to our Terms of Service and Privacy Policy
                        </p>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default Registration;
