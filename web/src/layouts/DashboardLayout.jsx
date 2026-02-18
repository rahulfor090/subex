import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    CreditCard,
    BarChart2,
    Settings,
    Menu,
    X,
    ChevronRight,
    LogOut,
    Sparkles,
    Bell,
    ShoppingBag,
    FileText,
    Shield,
    User
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import UserProfile from '../components/UserProfile';
import { ModeToggle } from '../components/ModeToggle';
import Logo from '../components/Logo';
import { Button } from '../components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../components/ui/tooltip';

const SidebarLink = ({ to, icon: Icon, label, collapsed }) => {
    const location = useLocation();
    const isActive = location.pathname === to || (to !== '/dashboard' && location.pathname.startsWith(to));

    const LinkContent = (
        <NavLink
            to={to}
            className={`
                relative group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300
                ${isActive
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-200'
                }
                ${collapsed ? 'justify-center px-2' : ''}
            `}
        >
            <Icon size={20} className={`transition-all duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />

            <span className={`font-medium whitespace-nowrap transition-all duration-300 origin-left ${collapsed ? 'opacity-0 w-0 overflow-hidden scale-0' : 'opacity-100 w-auto scale-100'}`}>
                {label}
            </span>

            {!collapsed && isActive && (
                <motion.div
                    layoutId="active-pill"
                    className="absolute right-2 w-1.5 h-1.5 rounded-full bg-emerald-500"
                />
            )}
        </NavLink>
    );

    if (collapsed) {
        return (
            <TooltipProvider>
                <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                        {LinkContent}
                    </TooltipTrigger>
                    <TooltipContent side="right" className="bg-zinc-900 text-white border-zinc-700">
                        {label}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }

    return LinkContent;
};

const DashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black flex overflow-hidden font-sans">
            {/* Desktop Sidebar */}
            <aside
                className={`
                    hidden md:flex flex-col border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/50 backdrop-blur-xl h-screen sticky top-0 z-40
                    transition-all duration-500 ease-in-out shadow-sm
                    ${sidebarOpen ? 'w-72' : 'w-[88px]'}
                `}
            >
                {/* Sidebar Header */}
                <div className="p-6 h-20 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/50">
                    <div className={`transition-all duration-500 overflow-hidden ${sidebarOpen ? 'w-auto opacity-100' : 'w-0 opacity-0 absolute pointer-events-none'}`}>
                        <Logo className="h-8" />
                    </div>
                    <div className={`${!sidebarOpen ? 'w-full flex justify-center' : ''}`}>
                        {/* Toggle Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="h-8 w-8 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-all"
                        >
                            <ChevronRight className={`transition-transform duration-300 ${sidebarOpen ? 'rotate-180' : 'rotate-0'}`} size={18} />
                        </Button>
                    </div>
                </div>

                {/* Navigation Links */}
                <div className="flex-1 overflow-y-auto py-8 px-4 space-y-2">
                    <SidebarLink to="/dashboard" icon={LayoutDashboard} label="Dashboard" collapsed={!sidebarOpen} />
                    <SidebarLink to="/dashboard/subscriptions" icon={CreditCard} label="My Subscriptions" collapsed={!sidebarOpen} />
                    <SidebarLink to="/dashboard/alerts" icon={Bell} label="Renewal Alerts" collapsed={!sidebarOpen} />
                    <SidebarLink to="/dashboard/marketplace" icon={ShoppingBag} label="Marketplace" collapsed={!sidebarOpen} />
                    <SidebarLink to="/dashboard/transactions" icon={FileText} label="Transactions" collapsed={!sidebarOpen} />
                    <SidebarLink to="/dashboard/analytics" icon={BarChart2} label="Analytics" collapsed={!sidebarOpen} />
                    <SidebarLink to="/dashboard/security" icon={Shield} label="Security" collapsed={!sidebarOpen} />
                    <SidebarLink to="/dashboard/profile" icon={User} label="Profile" collapsed={!sidebarOpen} />
                    <SidebarLink to="/dashboard/settings" icon={Settings} label="Settings" collapsed={!sidebarOpen} />

                    {/* Pro Plan Banner (only visible when expanded) */}
                    {sidebarOpen && (
                        <div className="mt-8 relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-800 dark:from-emerald-950/30 dark:to-zinc-900 p-5 text-white shadow-lg mx-1">
                            <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
                            <div className="relative z-10">
                                <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full text-xs font-semibold mb-3 border border-emerald-500/20">
                                    <Sparkles size={12} fill="currentColor" /> Pro Plan
                                </span>
                                <h3 className="font-semibold text-sm mb-1 text-white">Upgrade to Pro</h3>
                                <p className="text-xs text-zinc-400 mb-3">Get advanced analytics and unlimited tracking.</p>
                                <Button size="sm" className="w-full bg-white text-black hover:bg-zinc-200 border-none h-8 text-xs font-semibold">
                                    Upgrade Now
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/50">
                    <div className={`flex items-center gap-3 ${!sidebarOpen ? 'justify-center' : ''}`}>
                        {sidebarOpen ? (
                            <Button
                                variant="ghost"
                                className="w-full justify-start text-zinc-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                                onClick={handleLogout}
                            >
                                <LogOut size={20} />
                                <span className="ml-3">Sign Out</span>
                            </Button>
                        ) : (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-zinc-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                                            onClick={handleLogout}
                                        >
                                            <LogOut size={20} />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="right">Sign Out</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                    </div>
                </div>
            </aside>

            {/* Mobile Header */}
            <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 z-50 px-4 flex items-center justify-between shadow-sm">
                <Logo className="h-8" />
                <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? <X /> : <Menu />}
                </Button>
            </header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden fixed inset-x-0 top-16 bg-white dark:bg-zinc-900 z-40 border-b border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden"
                    >
                        <nav className="p-4 space-y-2">
                            <NavLink
                                to="/dashboard"
                                className={({ isActive }) => `flex items-center gap-3 p-3 rounded-lg ${isActive ? 'bg-emerald-500/10 text-emerald-600' : 'text-zinc-600 dark:text-zinc-400'}`}
                            >
                                <LayoutDashboard size={20} />
                                Dashboard
                            </NavLink>
                            <NavLink
                                to="/dashboard/subscriptions"
                                className={({ isActive }) => `flex items-center gap-3 p-3 rounded-lg ${isActive ? 'bg-emerald-500/10 text-emerald-600' : 'text-zinc-600 dark:text-zinc-400'}`}
                            >
                                <CreditCard size={20} />
                                My Subscriptions
                            </NavLink>
                            <NavLink
                                to="/dashboard/alerts"
                                className={({ isActive }) => `flex items-center gap-3 p-3 rounded-lg ${isActive ? 'bg-emerald-500/10 text-emerald-600' : 'text-zinc-600 dark:text-zinc-400'}`}
                            >
                                <Bell size={20} />
                                Renewal Alerts
                            </NavLink>
                            <NavLink
                                to="/dashboard/marketplace"
                                className={({ isActive }) => `flex items-center gap-3 p-3 rounded-lg ${isActive ? 'bg-emerald-500/10 text-emerald-600' : 'text-zinc-600 dark:text-zinc-400'}`}
                            >
                                <ShoppingBag size={20} />
                                Marketplace
                            </NavLink>
                            <NavLink
                                to="/dashboard/transactions"
                                className={({ isActive }) => `flex items-center gap-3 p-3 rounded-lg ${isActive ? 'bg-emerald-500/10 text-emerald-600' : 'text-zinc-600 dark:text-zinc-400'}`}
                            >
                                <FileText size={20} />
                                Transactions
                            </NavLink>
                            <NavLink
                                to="/dashboard/analytics"
                                className={({ isActive }) => `flex items-center gap-3 p-3 rounded-lg ${isActive ? 'bg-emerald-500/10 text-emerald-600' : 'text-zinc-600 dark:text-zinc-400'}`}
                            >
                                <BarChart2 size={20} />
                                Analytics
                            </NavLink>
                            <NavLink
                                to="/dashboard/security"
                                className={({ isActive }) => `flex items-center gap-3 p-3 rounded-lg ${isActive ? 'bg-emerald-500/10 text-emerald-600' : 'text-zinc-600 dark:text-zinc-400'}`}
                            >
                                <Shield size={20} />
                                Security
                            </NavLink>
                            <NavLink
                                to="/dashboard/profile"
                                className={({ isActive }) => `flex items-center gap-3 p-3 rounded-lg ${isActive ? 'bg-emerald-500/10 text-emerald-600' : 'text-zinc-600 dark:text-zinc-400'}`}
                            >
                                <User size={20} />
                                Profile
                            </NavLink>
                            <NavLink
                                to="/dashboard/settings"
                                className={({ isActive }) => `flex items-center gap-3 p-3 rounded-lg ${isActive ? 'bg-emerald-500/10 text-emerald-600' : 'text-zinc-600 dark:text-zinc-400'}`}
                            >
                                <Settings size={20} />
                                Settings
                            </NavLink>
                        </nav>
                        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
                            <div className="flex items-center justify-between mb-4">
                                <UserProfile />
                                <ModeToggle />
                            </div>
                            <Button variant="destructive" className="w-full justify-start" onClick={handleLogout}>
                                <LogOut className="mr-2" size={20} />
                                Logout
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-zinc-50 dark:bg-black">
                {/* Top Bar - Simplified */}
                <header className="h-16 px-6 md:px-8 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md sticky top-0 z-30 shadow-sm md:shadow-none">
                    <div className="flex items-center gap-4">
                        <h1 className="text-lg md:text-xl font-semibold text-zinc-900 dark:text-white hidden md:block tracking-tight">
                            {location.pathname === '/dashboard' ? 'Overview' :
                                location.pathname.includes('subscriptions') ? 'Subscriptions' :
                                    location.pathname.includes('analytics') ? 'Analytics' :
                                        location.pathname.includes('alerts') ? 'Renewal Alerts' :
                                            location.pathname.includes('marketplace') ? 'Marketplace' :
                                                location.pathname.includes('transactions') ? 'Transactions' :
                                                    location.pathname.includes('security') ? 'Security' :
                                                        location.pathname.includes('profile') ? 'Profile' : 'Settings'}
                        </h1>
                    </div>
                    <div className="flex items-center gap-3 md:gap-5">
                        <ModeToggle />
                        <div className="h-8 w-px bg-zinc-200 dark:bg-zinc-800" />
                        <UserProfile />
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
                    <div className="max-w-7xl mx-auto pb-10">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
