import React, { useState, useEffect } from 'react';
import { Shield, Key, CheckCircle, AlertCircle, Eye, EyeOff, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';

const SecurityPage = () => {
    const { token } = useAuth();
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [passwordUpdatedAt, setPasswordUpdatedAt] = useState(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/auth/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (data.success) {
                    setPasswordUpdatedAt(data.data.passwordUpdatedAt);
                }
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };
        fetchUserInfo();
    }, [token]);

    const formatPasswordDate = (date) => {
        if (!date) return 'Never changed';
        const d = new Date(date);
        const now = new Date();
        const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return 'Changed today';
        if (diffDays === 1) return 'Changed yesterday';
        if (diffDays < 30) return `Changed ${diffDays} days ago`;
        if (diffDays < 365) return `Changed ${Math.floor(diffDays / 30)} months ago`;
        return `Changed ${Math.floor(diffDays / 365)} year(s) ago`;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: '', message: '' });

        if (formData.newPassword !== formData.confirmPassword) {
            setStatus({ type: 'error', message: 'New passwords do not match' });
            return;
        }
        if (formData.newPassword.length < 8) {
            setStatus({ type: 'error', message: 'New password must be at least 8 characters long' });
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/api/auth/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword
                })
            });

            const data = await response.json();

            if (data.success) {
                setPasswordUpdatedAt(new Date().toISOString());
                setStatus({ type: 'success', message: 'Password changed successfully' });
                setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                setTimeout(() => {
                    setIsChangingPassword(false);
                    setStatus({ type: '', message: '' });
                }, 2000);
            } else {
                setStatus({ type: 'error', message: data.message || 'Failed to change password' });
            }
        } catch (error) {
            console.error('Error changing password:', error);
            setStatus({ type: 'error', message: 'An error occurred. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all pr-10";
    const eyeToggleClass = "absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300";
    const eyeIcon = showPassword ? <EyeOff size={16} /> : <Eye size={16} />;

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="flex items-center gap-4 mb-8">
                <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-xl">
                    <Shield size={32} className="text-red-600 dark:text-red-400" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Security Settings</h1>
                    <p className="text-zinc-500 dark:text-zinc-400">Manage your account security and authentication.</p>
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-6">

                {/* Password Section */}
                <div className="pb-6 border-b border-zinc-100 dark:border-zinc-800">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                                <Key size={18} className="text-zinc-400" />
                                Password
                            </h3>
                            <p className="text-sm text-zinc-500 mt-1">Update your password to keep your account secure</p>
                        </div>
                        <Button
                            variant={isChangingPassword ? 'ghost' : 'outline'}
                            onClick={() => {
                                setIsChangingPassword(!isChangingPassword);
                                setStatus({ type: '', message: '' });
                            }}
                        >
                            {isChangingPassword ? 'Cancel' : 'Change Password'}
                        </Button>
                    </div>

                    {/* Last Password Updated Badge */}
                    <div className="flex items-center gap-2 text-sm bg-zinc-50 dark:bg-zinc-800/50 px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 w-fit mb-4">
                        <Clock size={14} className="text-zinc-400 shrink-0" />
                        <span className="font-medium text-zinc-600 dark:text-zinc-300">Password last updated:</span>
                        <span className="text-zinc-500 dark:text-zinc-400">{formatPasswordDate(passwordUpdatedAt)}</span>
                        {passwordUpdatedAt && (
                            <span className="text-zinc-400 text-xs">
                                — {new Date(passwordUpdatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                        )}
                    </div>

                    {isChangingPassword && (
                        <form onSubmit={handleSubmit} className="mt-2 bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800">
                            <div className="space-y-4">
                                {status.message && (
                                    <div className={`p-3 rounded-lg flex items-center gap-2 text-sm ${status.type === 'success'
                                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
                                            : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                                        }`}>
                                        {status.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                                        {status.message}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Current Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="currentPassword"
                                            value={formData.currentPassword}
                                            onChange={handleChange}
                                            className={inputClass}
                                            placeholder="Enter current password"
                                            required
                                        />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className={eyeToggleClass}>
                                            {eyeIcon}
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">New Password</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                name="newPassword"
                                                value={formData.newPassword}
                                                onChange={handleChange}
                                                className={inputClass}
                                                placeholder="Min. 8 characters"
                                                required
                                            />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className={eyeToggleClass}>
                                                {eyeIcon}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Confirm New Password</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                className={inputClass}
                                                placeholder="Confirm new password"
                                                required
                                            />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className={eyeToggleClass}>
                                                {eyeIcon}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-2">
                                    <Button type="submit" disabled={loading} className="bg-emerald-500 hover:bg-emerald-600 text-white">
                                        {loading ? 'Updating...' : 'Update Password'}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    )}
                </div>

                <div className="flex justify-between items-center pb-6 border-b border-zinc-100 dark:border-zinc-800">
                    <div>
                        <h3 className="font-semibold text-zinc-900 dark:text-white">Two-Factor Authentication</h3>
                        <p className="text-sm text-zinc-500">Add an extra layer of security</p>
                    </div>
                    <Button variant="outline">Enable 2FA</Button>
                </div>

                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="font-semibold text-zinc-900 dark:text-white">Active Sessions</h3>
                        <p className="text-sm text-zinc-500">Manage devices logged into your account</p>
                    </div>
                    <Button variant="outline">View Devices</Button>
                </div>
            </div>
        </div>
    );
};

export default SecurityPage;
