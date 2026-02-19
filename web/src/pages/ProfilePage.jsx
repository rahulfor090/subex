import React, { useState, useRef } from 'react';
import { Camera, X, User, Phone, Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';

const ProfilePage = () => {
    const { user, token, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ name: user?.name || '', phone: user?.phone || '' });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [saving, setSaving] = useState(false);
    const [uploadingPfp, setUploadingPfp] = useState(false);
    const fileInputRef = useRef(null);

    const avatarSrc = user?.profilePicture
        ? `http://localhost:3000${user.profilePicture}`
        : null;

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingPfp(true);
        setStatus({ type: '', message: '' });

        const fd = new FormData();
        fd.append('avatar', file);

        try {
            const res = await fetch('http://localhost:3000/api/users/avatar', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: fd
            });
            const data = await res.json();
            if (data.success) {
                updateUser({ profilePicture: data.profilePicture });
                setStatus({ type: 'success', message: 'Profile picture updated!' });
            } else {
                setStatus({ type: 'error', message: data.message || 'Upload failed' });
            }
        } catch {
            setStatus({ type: 'error', message: 'Network error. Please try again.' });
        } finally {
            setUploadingPfp(false);
            e.target.value = '';
        }
    };

    const handleRemovePfp = async () => {
        setUploadingPfp(true);
        try {
            const res = await fetch('http://localhost:3000/api/users/avatar', {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                updateUser({ profilePicture: null });
                setStatus({ type: 'success', message: 'Profile picture removed.' });
            }
        } catch {
            setStatus({ type: 'error', message: 'Failed to remove picture.' });
        } finally {
            setUploadingPfp(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setStatus({ type: '', message: '' });
        try {
            const res = await fetch('http://localhost:3000/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name: formData.name, phone: formData.phone })
            });
            const data = await res.json();
            if (data.success) {
                updateUser({ name: data.data.name, phone: data.data.phone });
                setStatus({ type: 'success', message: 'Profile saved successfully!' });
                setIsEditing(false);
            } else {
                setStatus({ type: 'error', message: data.message || 'Update failed' });
            }
        } catch {
            setStatus({ type: 'error', message: 'Network error. Please try again.' });
        } finally {
            setSaving(false);
        }
    };

    const initials = user?.name
        ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : 'U';

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">My Profile</h1>
                <p className="text-zinc-500 dark:text-zinc-400 mt-1">Manage your personal information and profile picture.</p>
            </div>

            {/* Avatar Card */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                        <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-white text-3xl font-bold shadow-xl">
                            {avatarSrc ? (
                                <img src={avatarSrc} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <span>{initials}</span>
                            )}
                        </div>
                        {/* Upload overlay button */}
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadingPfp}
                            className="absolute bottom-0 right-0 w-8 h-8 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors disabled:opacity-50"
                        >
                            {uploadingPfp ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                    </div>

                    {/* Info + buttons */}
                    <div className="flex-1 text-center sm:text-left">
                        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{user?.name || 'Your Name'}</h2>
                        <p className="text-zinc-500 dark:text-zinc-400">{user?.email}</p>
                        <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                            <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploadingPfp}>
                                Change Photo
                            </Button>
                            {avatarSrc && (
                                <Button size="sm" variant="ghost" onClick={handleRemovePfp} disabled={uploadingPfp}
                                    className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                                    <X size={14} className="mr-1" /> Remove
                                </Button>
                            )}
                        </div>
                        <p className="text-xs text-zinc-400 mt-2">JPG, PNG, GIF or WebP — max 5MB</p>
                    </div>
                </div>

                {status.message && (
                    <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 text-sm ${status.type === 'success'
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
                            : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                        }`}>
                        {status.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                        {status.message}
                    </div>
                )}
            </div>

            {/* Personal Details Card */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Personal Details</h3>
                    {!isEditing ? (
                        <Button variant="outline" size="sm" onClick={() => {
                            setFormData({ name: user?.name || '', phone: user?.phone || '' });
                            setIsEditing(true);
                            setStatus({ type: '', message: '' });
                        }}>Edit</Button>
                    ) : (
                        <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>Cancel</Button>
                            <Button size="sm" onClick={handleSave} disabled={saving}
                                className="bg-emerald-500 hover:bg-emerald-600 text-white">
                                {saving ? <Loader2 size={14} className="animate-spin mr-1" /> : null}
                                {saving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2">
                            <User size={12} className="inline mr-1" /> Full Name
                        </label>
                        {isEditing ? (
                            <input
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                                className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-zinc-900 dark:text-white"
                                placeholder="Your full name"
                            />
                        ) : (
                            <p className="text-zinc-900 dark:text-white font-medium">{user?.name || '—'}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2">
                            <Mail size={12} className="inline mr-1" /> Email Address
                        </label>
                        <p className="text-zinc-500 dark:text-zinc-400 font-medium">{user?.email || '—'}</p>
                        <p className="text-xs text-zinc-400 mt-1">Email cannot be changed</p>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2">
                            <Phone size={12} className="inline mr-1" /> Phone Number
                        </label>
                        {isEditing ? (
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                                className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-zinc-900 dark:text-white"
                                placeholder="+91 98765 43210"
                            />
                        ) : (
                            <p className="text-zinc-900 dark:text-white font-medium">{user?.phone || '—'}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
