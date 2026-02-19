import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, LogOut, LayoutDashboard, ChevronDown, Settings } from 'lucide-react';

const UserProfile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    if (!user) return null;

    const handleLogout = async () => {
        await logout();
        navigate('/');
        setIsOpen(false);
    };

    const getInitials = () => {
        if (user.name) {
            const parts = user.name.split(' ');
            return (parts[0]?.[0] || '') + (parts[1]?.[0] || '');
        }
        return 'U';
    };

    const avatarSrc = user.profilePicture
        ? `http://localhost:3000${user.profilePicture}`
        : null;

    const Avatar = ({ size = 'sm' }) => {
        const cls = size === 'lg'
            ? 'w-12 h-12 text-lg'
            : 'w-8 h-8 text-sm';
        return (
            <div className={`${cls} rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-semibold overflow-hidden flex-shrink-0`}>
                {avatarSrc
                    ? <img src={avatarSrc} alt="avatar" className="w-full h-full object-cover" />
                    : <span>{getInitials().toUpperCase()}</span>
                }
            </div>
        );
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors"
            >
                <Avatar size="sm" />
                <div className="hidden md:block text-left">
                    <div className="text-sm font-medium text-zinc-900 dark:text-white">{user.name}</div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">{user.email}</div>
                </div>
                <ChevronDown size={16} className={`text-zinc-600 dark:text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl z-20 overflow-hidden">
                        {/* User header */}
                        <div className="flex items-center gap-3 px-4 py-4 border-b border-zinc-100 dark:border-zinc-800">
                            <Avatar size="lg" />
                            <div className="min-w-0">
                                <div className="text-sm font-semibold text-zinc-900 dark:text-white truncate">{user.name}</div>
                                <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{user.email}</div>
                            </div>
                        </div>

                        <div className="py-2">
                            <button
                                onClick={() => { navigate('/dashboard'); setIsOpen(false); }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                            >
                                <LayoutDashboard size={16} className="text-emerald-500" />
                                Dashboard
                            </button>
                            <button
                                onClick={() => { navigate('/dashboard/profile'); setIsOpen(false); }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                            >
                                <User size={16} className="text-emerald-500" />
                                My Profile
                            </button>
                            <button
                                onClick={() => { navigate('/dashboard/settings'); setIsOpen(false); }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                            >
                                <Settings size={16} className="text-emerald-500" />
                                Settings
                            </button>
                            <div className="border-t border-zinc-100 dark:border-zinc-800 my-1" />
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                                <LogOut size={16} />
                                Logout
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default UserProfile;
