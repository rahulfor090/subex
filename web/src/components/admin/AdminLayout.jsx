import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
    LayoutDashboard,
    Users,
    CreditCard,
    FileText,
    Activity,
    ChevronLeft,
    ChevronRight,
    LogOut,
    Shield,
    ArrowLeft
} from 'lucide-react';

const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/admin/users', icon: Users, label: 'Users' },
    { to: '/admin/plans', icon: CreditCard, label: 'Plans' },
    { to: '/admin/transactions', icon: FileText, label: 'Transactions' },
    { to: '/admin/system', icon: Activity, label: 'System Health' },
];

const AdminLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="flex min-h-screen bg-zinc-950">
            {/* Sidebar */}
            <aside
                className={`${collapsed ? 'w-20' : 'w-64'
                    } bg-zinc-900/80 backdrop-blur-xl border-r border-zinc-800/60 flex flex-col transition-all duration-300 ease-in-out fixed h-full z-20`}
            >
                {/* Logo / Brand */}
                <div className="h-16 flex items-center px-5 border-b border-zinc-800/60">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                            <Shield size={18} className="text-white" />
                        </div>
                        {!collapsed && (
                            <div className="min-w-0">
                                <h1 className="text-sm font-bold text-white truncate">SubEx Admin</h1>
                                <p className="text-[10px] text-emerald-400 font-medium">Super Admin Panel</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${isActive
                                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 border border-transparent'
                                }`
                            }
                        >
                            <item.icon size={20} className="flex-shrink-0" />
                            {!collapsed && <span className="truncate">{item.label}</span>}
                        </NavLink>
                    ))}
                </nav>

                {/* Bottom section */}
                <div className="p-3 border-t border-zinc-800/60 space-y-2">
                    {/* Back to User Dashboard */}
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-colors"
                    >
                        <ArrowLeft size={18} />
                        {!collapsed && <span>User Dashboard</span>}
                    </button>

                    {/* Collapse toggle */}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/60 transition-colors"
                    >
                        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                        {!collapsed && <span>Collapse</span>}
                    </button>

                    {/* Admin info / Logout */}
                    <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-zinc-800/40">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs font-bold">
                                {user?.name?.[0]?.toUpperCase() || 'A'}
                            </span>
                        </div>
                        {!collapsed && (
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-medium text-zinc-200 truncate">{user?.name || 'Admin'}</p>
                                <p className="text-[10px] text-zinc-500 truncate">{user?.email}</p>
                            </div>
                        )}
                        {!collapsed && (
                            <button
                                onClick={handleLogout}
                                className="text-zinc-500 hover:text-red-400 transition-colors"
                                title="Logout"
                            >
                                <LogOut size={16} />
                            </button>
                        )}
                    </div>
                </div>
            </aside>

            {/* Main content area */}
            <main className={`flex-1 ${collapsed ? 'ml-20' : 'ml-64'} transition-all duration-300 min-h-screen`}>
                <div className="p-6 lg:p-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
