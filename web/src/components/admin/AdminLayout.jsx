import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
    LayoutDashboard,
    Users,
    CreditCard,
    Receipt,
    Settings,
    LogOut,
    Menu,
    X,
    Shield,
    ChevronRight,
} from 'lucide-react';

const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/users', label: 'Users', icon: Users },
    { path: '/admin/plans', label: 'Plans', icon: CreditCard },
    { path: '/admin/transactions', label: 'Transactions', icon: Receipt },
];

const AdminLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const isActive = (path) => {
        if (path === '/admin') return location.pathname === '/admin';
        return location.pathname.startsWith(path);
    };

    return (
        <div className="min-h-screen bg-zinc-950 flex">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-72 bg-zinc-900/95 backdrop-blur-xl border-r border-zinc-800/50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {/* Logo area */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-zinc-800/50">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-white tracking-tight">SubEx</h1>
                            <p className="text-[10px] text-emerald-400 font-medium tracking-wider uppercase">Admin Panel</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-1.5 flex-1">
                    <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider px-3 mb-3">Menu</p>
                    {navItems.map(({ path, label, icon: Icon }) => (
                        <Link
                            key={path}
                            to={path}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive(path)
                                    ? 'bg-emerald-500/10 text-emerald-400 shadow-sm'
                                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                                }`}
                        >
                            <Icon
                                className={`w-[18px] h-[18px] transition-colors ${isActive(path) ? 'text-emerald-400' : 'text-zinc-500 group-hover:text-zinc-300'
                                    }`}
                            />
                            <span>{label}</span>
                            {isActive(path) && (
                                <ChevronRight className="w-4 h-4 ml-auto text-emerald-500/60" />
                            )}
                        </Link>
                    ))}
                </nav>

                {/* User profile section */}
                <div className="p-4 border-t border-zinc-800/50">
                    <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-zinc-800/40">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                            {user?.name?.[0] || user?.email?.[0] || 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{user?.name || 'Admin'}</p>
                            <p className="text-[11px] text-zinc-500 truncate">{user?.role === 'super_admin' ? 'Super Admin' : 'Admin'}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                            title="Logout"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top bar */}
                <header className="h-16 bg-zinc-900/50 backdrop-blur-xl border-b border-zinc-800/50 flex items-center justify-between px-6 sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors lg:hidden"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <div>
                            <h2 className="text-sm font-semibold text-white">
                                {navItems.find(i => isActive(i.path))?.label || 'Admin'}
                            </h2>
                            <p className="text-xs text-zinc-500">Subscription Management Platform</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
                            {user?.role === 'super_admin' ? 'SUPER ADMIN' : 'ADMIN'}
                        </span>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
