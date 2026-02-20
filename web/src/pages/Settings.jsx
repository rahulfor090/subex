import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
    User, Bell, Shield, Moon, Sun, LogOut,
    Mail, Lock, Smartphone, Camera, CheckCircle,
    AlertCircle, Loader2, X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../lib/ThemeProvider';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';

const ToggleSwitch = ({ checked, onChange }) => (
    <button
        onClick={() => onChange(!checked)}
        className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${checked ? 'bg-emerald-500' : 'bg-zinc-200 dark:bg-zinc-700'}`}
    >
        <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${checked ? 'translate-x-6' : 'translate-x-0'}`} />
    </button>
);

const SettingsSection = ({ title, icon: Icon, children }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 mb-6"
    >
        <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"><Icon size={20} /></div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">{title}</h2>
        </div>
        <div className="space-y-6">{children}</div>
    </motion.div>
);

const SettingsItem = ({ title, description, action }) => (
    <div className="flex items-center justify-between">
        <div className="flex-1 pr-4">
            <h3 className="text-sm font-medium text-zinc-900 dark:text-white">{title}</h3>
            {description && <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{description}</p>}
        </div>
        <div>{action}</div>
    </div>
);

const StatusMsg = ({ status }) => {
    if (!status.message) return null;
    return (
        <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 text-sm ${status.type === 'success'
                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
                : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
            }`}>
            {status.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            {status.message}
        </div>
    );
};

const Settings = () => {
    const { user, token, logout, updateUser } = useAuth();
    const { theme, setTheme } = useTheme();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ name: user?.name || '', phone: user?.phone || '' });
    const [savingProfile, setSavingProfile] = useState(false);
    const [uploadingPfp, setUploadingPfp] = useState(false);
    const [profileStatus, setProfileStatus] = useState({ type: '', message: '' });

    const [notifications, setNotifications] = useState({ email: true, push: false, news: true });

    const avatarSrc = user?.profilePicture ? `${import.meta.env.VITE_BACKEND_URL}${user.profilePicture}` : null;

    const initials = user?.name
        ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : 'U';

    // ── PFP Upload ────────────────────────────────────────────────
    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploadingPfp(true);
        setProfileStatus({ type: '', message: '' });
        const fd = new FormData();
        fd.append('avatar', file);
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/avatar`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: fd
            });
            const data = await res.json();
            if (data.success) {
                updateUser({ profilePicture: data.profilePicture });
                setProfileStatus({ type: 'success', message: 'Profile picture updated!' });
            } else {
                setProfileStatus({ type: 'error', message: data.message || 'Upload failed' });
            }
        } catch {
            setProfileStatus({ type: 'error', message: 'Network error. Please try again.' });
        } finally {
            setUploadingPfp(false);
            e.target.value = '';
        }
    };

    const handleRemovePfp = async () => {
        setUploadingPfp(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/avatar`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                updateUser({ profilePicture: null });
                setProfileStatus({ type: 'success', message: 'Profile picture removed.' });
            }
        } catch {
            setProfileStatus({ type: 'error', message: 'Failed to remove picture.' });
        } finally {
            setUploadingPfp(false);
        }
    };

    // ── Profile Save ──────────────────────────────────────────────
    const handleSaveProfile = async () => {
        setSavingProfile(true);
        setProfileStatus({ type: '', message: '' });
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/profile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ name: formData.name, phone: formData.phone })
            });
            const data = await res.json();
            if (data.success) {
                updateUser({ name: data.data.name, phone: data.data.phone });
                setProfileStatus({ type: 'success', message: 'Profile updated successfully!' });
                setIsEditing(false);
            } else {
                setProfileStatus({ type: 'error', message: data.message || 'Update failed' });
            }
        } catch {
            setProfileStatus({ type: 'error', message: 'Network error. Please try again.' });
        } finally {
            setSavingProfile(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-10">
            <div>
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">Settings</h1>
                <p className="text-zinc-500 dark:text-zinc-400 mt-1">Manage your account preferences and application settings.</p>
            </div>

            {/* ── Profile Section ── */}
            <SettingsSection title="Profile Information" icon={User}>
                {/* Avatar row */}
                <div className="flex items-center gap-4 pb-6 border-b border-zinc-100 dark:border-zinc-800">
                    <div className="relative flex-shrink-0">
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold">
                            {avatarSrc
                                ? <img src={avatarSrc} alt="avatar" className="w-full h-full object-cover" />
                                : <span>{initials}</span>
                            }
                        </div>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadingPfp}
                            className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow transition-colors"
                        >
                            {uploadingPfp ? <Loader2 size={10} className="animate-spin" /> : <Camera size={10} />}
                        </button>
                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                    </div>

                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{user?.name || 'User Name'}</h3>
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm">{user?.email}</p>
                    </div>

                    <div className="flex gap-2 flex-shrink-0">
                        {!isEditing ? (
                            <Button variant="outline" size="sm" onClick={() => {
                                setFormData({ name: user?.name || '', phone: user?.phone || '' });
                                setIsEditing(true);
                                setProfileStatus({ type: '', message: '' });
                            }}>Edit Profile</Button>
                        ) : (
                            <>
                                <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>Cancel</Button>
                                <Button size="sm" onClick={handleSaveProfile} disabled={savingProfile}
                                    className="bg-emerald-500 hover:bg-emerald-600 text-white">
                                    {savingProfile ? <Loader2 size={14} className="animate-spin mr-1" /> : null}
                                    {savingProfile ? 'Saving…' : 'Save'}
                                </Button>
                            </>
                        )}
                        {avatarSrc && (
                            <Button variant="ghost" size="sm" onClick={handleRemovePfp} disabled={uploadingPfp}
                                className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                                <X size={14} />
                            </Button>
                        )}
                    </div>
                </div>

                {/* Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Display Name</label>
                        {isEditing ? (
                            <input
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                                className="w-full px-4 py-2 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                placeholder="Your full name"
                            />
                        ) : (
                            <div className="px-4 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300">
                                {user?.name || '—'}
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-2.5 text-zinc-400" size={16} />
                            <div className="pl-10 pr-4 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 text-sm">
                                {user?.email || '—'}
                            </div>
                        </div>
                        <p className="text-xs text-zinc-400 mt-1">Email cannot be changed</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Phone Number</label>
                        {isEditing ? (
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                                className="w-full px-4 py-2 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                placeholder="+91 98765 43210"
                            />
                        ) : (
                            <div className="px-4 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300">
                                {user?.phone || '—'}
                            </div>
                        )}
                    </div>
                </div>

                <StatusMsg status={profileStatus} />
            </SettingsSection>

            {/* ── Appearance ── */}
            <SettingsSection title="Appearance" icon={Sun}>
                <SettingsItem
                    title="Theme Preference"
                    description="Choose how SubEx looks on your device."
                    action={
                        <div className="flex gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg">
                            {[
                                { value: 'light', icon: <Sun size={16} />, label: 'Light' },
                                { value: 'dark', icon: <Moon size={16} />, label: 'Dark' },
                                { value: 'system', icon: <Smartphone size={16} />, label: 'System' }
                            ].map(t => (
                                <button
                                    key={t.value}
                                    onClick={() => setTheme(t.value)}
                                    title={t.label}
                                    className={`p-2 rounded-md transition-all ${theme === t.value
                                        ? 'bg-white dark:bg-zinc-700 shadow text-emerald-600 dark:text-emerald-400'
                                        : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'
                                        }`}
                                >
                                    {t.icon}
                                </button>
                            ))}
                        </div>
                    }
                />
            </SettingsSection>

            {/* ── Notifications ── */}
            <SettingsSection title="Notifications" icon={Bell}>
                {[
                    { key: 'email', title: 'Email Notifications', desc: 'Receive emails about subscription renewals and updates.' },
                    { key: 'push', title: 'Push Notifications', desc: 'Receive push notifications on your device.' },
                    { key: 'news', title: 'Product Updates & Tips', desc: 'Get news about new features and money-saving tips.' }
                ].map(item => (
                    <SettingsItem
                        key={item.key}
                        title={item.title}
                        description={item.desc}
                        action={
                            <ToggleSwitch
                                checked={notifications[item.key]}
                                onChange={() => setNotifications(p => ({ ...p, [item.key]: !p[item.key] }))}
                            />
                        }
                    />
                ))}
            </SettingsSection>

            {/* ── Security ── */}
            <SettingsSection title="Security" icon={Shield}>
                <SettingsItem
                    title="Password"
                    description="Change your account password."
                    action={
                        <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/security')} className="gap-2">
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
                        Sign Out
                    </Button>
                </div>
            </SettingsSection>
        </div>
    );
};

export default Settings;
