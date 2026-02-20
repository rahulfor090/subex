import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, CreditCard, BarChart2, Settings,
    Bell, Menu, X, ChevronLeft, LogOut, User,
    Wallet, Shield, Receipt, Sparkles
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ModeToggle } from '../components/ModeToggle';
import UserProfile from '../components/UserProfile';

const NAV = [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/dashboard/subscriptions', label: 'Subscriptions', icon: CreditCard },
    { to: '/dashboard/analytics', label: 'Analytics', icon: BarChart2 },
    { to: '/dashboard/alerts', label: 'Alerts', icon: Bell },
    { to: '/dashboard/transactions', label: 'Transactions', icon: Receipt },
];

const BOTTOM_NAV = [
    { to: '/dashboard/profile', label: 'Profile', icon: User },
    { to: '/dashboard/security', label: 'Security', icon: Shield },
    { to: '/dashboard/settings', label: 'Settings', icon: Settings },
];

const NavItem = ({ to, label, icon: Icon, end, collapsed }) => (
    <NavLink to={to} end={end}
        className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative
            ${isActive
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/70 hover:text-zinc-900 dark:hover:text-white'
            }`
        }>
        {({ isActive }) => (
            <>
                {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-emerald-500 rounded-r-full" />
                )}
                <Icon size={18} className={`flex-shrink-0 transition-colors ${isActive ? 'text-emerald-500' : ''}`} />
                {!collapsed && <span className="truncate">{label}</span>}
                {collapsed && (
                    <span className="absolute left-full ml-3 px-2.5 py-1 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl">
                        {label}
                    </span>
                )}
            </>
        )}
    </NavLink>
);

const DashboardLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const getInitials = () => {
        if (!user?.name) return 'U';
        const parts = user.name.split(' ');
        return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase();
    };

    const Sidebar = ({ mobile = false }) => (
        <div className={`flex flex-col h-full ${mobile ? 'w-72' : collapsed ? 'w-[68px]' : 'w-60'} transition-all duration-300 ease-in-out`}>
            {/* Logo */}
            <div className={`flex items-center gap-3 px-4 py-5 border-b border-zinc-200 dark:border-zinc-800 ${collapsed && !mobile ? 'justify-center px-2' : ''}`}>
                <button
                    onClick={() => navigate('/')}
                    className={`flex items-center gap-3 min-w-0 group ${collapsed && !mobile ? 'justify-center' : 'flex-1'}`}
                    title="Go to home"
                >
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg flex-shrink-0 group-hover:shadow-emerald-400/40 group-hover:scale-105 transition-all duration-200">
                        <Sparkles size={16} className="text-white" />
                    </div>
                    {(!collapsed || mobile) && (
                        <div className="text-left">
                            <span className="text-base font-black tracking-tight text-zinc-900 dark:text-white group-hover:text-emerald-500 transition-colors">SubEx</span>
                            <span className="text-[10px] font-medium text-zinc-400 block -mt-0.5">Subscription Manager</span>
                        </div>
                    )}
                </button>
                {!mobile && (
                    <button onClick={() => setCollapsed(c => !c)}
                        className={`p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all flex-shrink-0 ${collapsed ? '' : 'ml-auto'}`}>
                        <ChevronLeft size={16} className={`transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
                    </button>
                )}
            </div>

            {/* Main nav */}
            <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
                {!collapsed && (
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 px-3 mb-2">Main</p>
                )}
                {NAV.map(n => <NavItem key={n.to} {...n} collapsed={collapsed && !mobile} />)}

                <div className="my-3 border-t border-zinc-200 dark:border-zinc-800 mx-2" />

                {!collapsed && (
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 px-3 mb-2">Account</p>
                )}
                {BOTTOM_NAV.map(n => <NavItem key={n.to} {...n} collapsed={collapsed && !mobile} />)}
            </nav>

            {/* User strip */}
            <div className={`border-t border-zinc-200 dark:border-zinc-800 p-3 ${collapsed && !mobile ? 'flex justify-center' : ''}`}>
                {(!collapsed || mobile) ? (
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {getInitials()}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">{user?.name}</p>
                            <p className="text-xs text-zinc-400 truncate">{user?.email}</p>
                        </div>
                        <button onClick={handleLogout} title="Logout"
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex-shrink-0">
                            <LogOut size={15} />
                        </button>
                    </div>
                ) : (
                    <button onClick={handleLogout} title="Logout"
                        className="p-2 rounded-xl text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                        <LogOut size={16} />
                    </button>
                )}
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
            {/* Desktop sidebar */}
            <aside className="hidden lg:flex flex-col border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex-shrink-0 transition-all duration-300">
                <Sidebar />
            </aside>

            {/* Mobile drawer */}
            {mobileOpen && (
                <>
                    <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
                        onClick={() => setMobileOpen(false)} />
                    <div className="fixed inset-y-0 left-0 z-50 flex flex-col bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 lg:hidden">
                        <div className="flex items-center justify-between px-4 py-4 border-b border-zinc-200 dark:border-zinc-800">
                            <span className="font-black text-zinc-900 dark:text-white">SubEx</span>
                            <button onClick={() => setMobileOpen(false)}
                                className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                                <X size={18} />
                            </button>
                        </div>
                        <Sidebar mobile />
                    </div>
                </>
            )}

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top bar */}
                <header className="flex-shrink-0 h-14 flex items-center justify-between px-4 sm:px-6 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
                    <button className="lg:hidden p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        onClick={() => setMobileOpen(true)}>
                        <Menu size={20} />
                    </button>

                    <div className="flex items-center gap-3 ml-auto">
                        <ModeToggle />
                        <UserProfile />
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
