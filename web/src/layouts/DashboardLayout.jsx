import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, CreditCard, BarChart2, Settings,
    Bell, Menu, X, ChevronLeft, LogOut, User,
    Wallet, Shield, Receipt
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ModeToggle } from '../components/ModeToggle';
import UserProfile from '../components/UserProfile';
import Logo from '../components/Logo';

const NAV = [
    { to: '/dashboard/subscriptions', label: 'Subscription', icon: CreditCard },
    { to: '/dashboard/lifetime-deals', label: 'Life Time Deal', icon: Wallet },
    { to: '/dashboard/complementary', label: 'Complementary Deal', icon: Receipt },
    { to: '/dashboard/revenue', label: 'Revenue', icon: BarChart2 },
];

const REPORTS_NAV = [
    { to: '/dashboard/reports', label: 'Report', icon: BarChart2 },
    { to: '/dashboard/cash-flow', label: 'Cash Flow', icon: Wallet },
    { to: '/dashboard/calendar', label: 'Calendar', icon: LayoutDashboard },
    { to: '/dashboard/cardworld', label: 'Cardworld', icon: Shield },
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

    const [accountOpen, setAccountOpen] = useState(false);

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
                    className={`flex items-center gap-2 min-w-0 group ${collapsed && !mobile ? 'justify-center' : 'flex-1'}`}
                    title="Go to home"
                >
                    <div className="flex flex-col min-w-0">
                        <Logo showText={!collapsed || mobile} />
                        {(!collapsed || mobile) && (
                            <span className="text-[10px] font-medium text-zinc-400 ml-10 -mt-0.5">You May Forget. SubEx Won't.</span>
                        )}
                    </div>
                </button>
                {!mobile && (
                    <button onClick={() => setCollapsed(c => !c)}
                        className={`p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all flex-shrink-0 ${collapsed ? '' : 'ml-auto'}`}>
                        <ChevronLeft size={16} className={`transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
                    </button>
                )}
            </div>

            {/* Main nav */}
            <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1 custom-scrollbar">
                {!collapsed && (
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 px-3 mb-2">Main</p>
                )}
                {NAV.map(n => <NavItem key={n.to} {...n} collapsed={collapsed && !mobile} />)}

                <div className="my-5" />

                {!collapsed && (
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 px-3 mb-2">Reports</p>
                )}
                {REPORTS_NAV.map(n => <NavItem key={n.to} {...n} collapsed={collapsed && !mobile} />)}

                <div className="my-5" />

                {/* Account Toggle */}
                <button
                    onClick={() => setAccountOpen(!accountOpen)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                               text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/70 hover:text-zinc-900 dark:hover:text-white
                               ${collapsed && !mobile ? 'justify-center' : ''}`}
                >
                    <User size={18} className="flex-shrink-0" />
                    {!collapsed && <span className="flex-1 text-left">Account</span>}
                    {!collapsed && (
                        <ChevronLeft size={14} className={`transition-transform duration-300 ${accountOpen ? '-rotate-90' : ''}`} />
                    )}
                </button>

                {/* Collapsible Account Menu */}
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${accountOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="mt-1 space-y-1 pb-2">
                        {BOTTOM_NAV.map(n => (
                            <div key={n.to} className={collapsed && !mobile ? '' : 'pl-4'}>
                                <NavItem {...n} collapsed={collapsed && !mobile} />
                            </div>
                        ))}
                    </div>
                </div>
            </nav>

            {/* Logout Only */}
            <div className={`border-t border-zinc-200 dark:border-zinc-800 p-3 flex justify-center`}>
                <button onClick={handleLogout} title="Logout"
                    className={`p-2 rounded-xl text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2 ${collapsed && !mobile ? '' : 'w-full'}`}>
                    <LogOut size={16} />
                    {!collapsed && <span className="text-sm font-medium">Logout</span>}
                </button>
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
                            <Logo />
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
