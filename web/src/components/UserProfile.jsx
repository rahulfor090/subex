import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';

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

    const handleDashboard = () => {
        navigate('/dashboard');
        setIsOpen(false);
    };

    // Get user initials for avatar
    const getInitials = () => {
        if (user.name) {
            const nameParts = user.name.split(' ');
            const first = nameParts[0]?.charAt(0) || '';
            const last = nameParts[1]?.charAt(0) || '';
            return (first + last).toUpperCase();
        }
        return 'U';
    };

    return (
        <div className="relative">
            {/* Profile Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors"
            >
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center text-white text-sm font-semibold">
                    {getInitials()}
                </div>

                {/* User Info - Desktop Only */}
                <div className="hidden md:block text-left">
                    <div className="text-sm font-medium text-zinc-900 dark:text-white">
                        {user.name}
                    </div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                        {user.email}
                    </div>
                </div>

                {/* Chevron */}
                <ChevronDown
                    size={16}
                    className={`text-zinc-600 dark:text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Menu */}
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-xl z-20 overflow-hidden">
                        {/* User Info - Mobile */}
                        <div className="md:hidden px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
                            <div className="text-sm font-medium text-zinc-900 dark:text-white">
                                {user.name}
                            </div>
                            <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                                {user.email}
                            </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                            <button
                                onClick={handleDashboard}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                            >
                                <LayoutDashboard size={18} className="text-emerald-500" />
                                <span>Dashboard</span>
                            </button>

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                                <LogOut size={18} />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default UserProfile;
