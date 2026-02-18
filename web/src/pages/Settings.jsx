import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    User,
    Bell,
    Shield,
    Moon,
    Sun,
    LogOut,
    Mail,
    Lock,
    Globe,
    Smartphone,
    CreditCard
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../lib/ThemeProvider';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch'; // You might need to adjust or create this if not present
import { Separator } from '../components/ui/separator'; // Adjust import if needed

// Simple Switch Component (if not available in ui/switch)
const ToggleSwitch = ({ checked, onChange }) => (
    <button
        onClick={() => onChange(!checked)}
        className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 ${checked ? 'bg-emerald-500' : 'bg-zinc-200 dark:bg-zinc-700'
            }`}
    >
        <div
            className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${checked ? 'translate-x-6' : 'translate-x-0'
                }`}
        />
    </button>
);

const SettingsSection = ({ title, icon: Icon, children }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 mb-6"
    >
        <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Icon size={20} />
            </div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">{title}</h2>
        </div>
        <div className="space-y-6">
            {children}
        </div>
    </motion.div>
);

const SettingsItem = ({ title, description, action }) => (
    <div className="flex items-center justify-between">
        <div className="flex-1 pr-4">
            <h3 className="text-sm font-medium text-zinc-900 dark:text-white">{title}</h3>
            {description && (
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{description}</p>
            )}
        </div>
        <div>
            {action}
        </div>
    </div>
);

const Settings = () => {
    const { user, logout } = useAuth();
    const { theme, setTheme } = useTheme();
    const [notifications, setNotifications] = useState({
        email: true,
        push: false,
        news: true
    });
    const [privacy, setPrivacy] = useState({
        publicProfile: false,
        showActivity: true
    });

    const handleNotificationChange = (key) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-10">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">Settings</h1>
                <p className="text-zinc-500 dark:text-zinc-400 mt-1">Manage your account preferences and application settings.</p>
            </div>

            {/* Profile Section */}
            <SettingsSection title="Profile Information" icon={User}>
                <div className="flex items-center gap-4 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold">
                        {user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{user?.name || 'User Name'}</h3>
                        <p className="text-zinc-500 dark:text-zinc-400">{user?.email || 'user@example.com'}</p>
                    </div>
                    <Button variant="outline" className="ml-auto text-sm">Edit Profile</Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Display Name</label>
                        <input
                            type="text"
                            disabled
                            value={user?.name || ''}
                            className="w-full px-4 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-500 cursor-not-allowed"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-2.5 text-zinc-400" size={16} />
                            <input
                                type="email"
                                disabled
                                value={user?.email || ''}
                                className="w-full pl-10 pr-4 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-500 cursor-not-allowed"
                            />
                        </div>
                    </div>
                </div>
            </SettingsSection>

            {/* Appearance Section */}
            <SettingsSection title="Appearance" icon={Sun}>
                <SettingsItem
                    title="Theme Preference"
                    description="Choose how SubEx looks on your device."
                    action={
                        <div className="flex gap-2 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg">
                            <button
                                onClick={() => setTheme("light")}
                                className={`p-2 rounded-md transition-all ${theme === 'light' ? 'bg-white shadow text-emerald-600' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'}`}
                            >
                                <Sun size={18} />
                            </button>
                            <button
                                onClick={() => setTheme("dark")}
                                className={`p-2 rounded-md transition-all ${theme === 'dark' ? 'bg-zinc-700 shadow text-emerald-400' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'}`}
                            >
                                <Moon size={18} />
                            </button>
                            <button
                                onClick={() => setTheme("system")}
                                className={`p-2 rounded-md transition-all ${theme === 'system' ? 'bg-white dark:bg-zinc-700 shadow text-emerald-600 dark:text-emerald-400' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'}`}
                            >
                                <Smartphone size={18} />
                            </button>
                        </div>
                    }
                />
            </SettingsSection>

            {/* Notifications Section */}
            <SettingsSection title="Notifications" icon={Bell}>
                <SettingsItem
                    title="Email Notifications"
                    description="Receive emails about your subscription renewals and updates."
                    action={
                        <ToggleSwitch
                            checked={notifications.email}
                            onChange={() => handleNotificationChange('email')}
                        />
                    }
                />
                <SettingsItem
                    title="Push Notifications"
                    description="Receive push notifications on your device."
                    action={
                        <ToggleSwitch
                            checked={notifications.push}
                            onChange={() => handleNotificationChange('push')}
                        />
                    }
                />
                <SettingsItem
                    title="Product Updates & Tips"
                    description="Get news about new features and money-saving tips."
                    action={
                        <ToggleSwitch
                            checked={notifications.news}
                            onChange={() => handleNotificationChange('news')}
                        />
                    }
                />
            </SettingsSection>

            {/* Security Section */}
            <SettingsSection title="Security" icon={Shield}>
                <SettingsItem
                    title="Password"
                    description="Last changed 3 months ago"
                    action={
                        <Button variant="outline" size="sm" className="gap-2">
                            <Lock size={14} /> Change Password
                        </Button>
                    }
                />
                <div className="pt-2">
                    <Button
                        variant="destructive"
                        onClick={logout}
                        className="w-full sm:w-auto bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20"
                    >
                        <LogOut size={16} className="mr-2" />
                        Sign Out of All Devices
                    </Button>
                </div>
            </SettingsSection>
        </div>
    );
};

export default Settings;
