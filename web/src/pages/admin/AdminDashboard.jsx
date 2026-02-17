import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { fetchDashboard } from '../../services/adminApi';
import {
    Users,
    TrendingUp,
    CreditCard,
    UserPlus,
    ArrowUpRight,
    ArrowDownRight,
    IndianRupee,
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts';

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#6366f1'];

const statusColors = {
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    failed: 'bg-red-500/10 text-red-400 border-red-500/20',
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    refunded: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
};

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            setLoading(true);
            const { data } = await fetchDashboard();
            setStats(data.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load dashboard');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-96">
                    <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </AdminLayout>
        );
    }

    if (error) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <p className="text-red-400 mb-4">{error}</p>
                        <button onClick={loadDashboard} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                            Retry
                        </button>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    const kpiCards = [
        {
            label: 'Total Users',
            value: stats?.totalUsers || 0,
            icon: Users,
            color: 'from-emerald-500 to-teal-600',
            shadowColor: 'shadow-emerald-500/20',
        },
        {
            label: 'New This Month',
            value: stats?.newUsersThisMonth || 0,
            icon: UserPlus,
            color: 'from-blue-500 to-indigo-600',
            shadowColor: 'shadow-blue-500/20',
        },
        {
            label: 'Active Subscriptions',
            value: stats?.activeSubscriptions || 0,
            icon: CreditCard,
            color: 'from-amber-500 to-orange-600',
            shadowColor: 'shadow-amber-500/20',
        },
        {
            label: 'Total Revenue',
            value: `₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`,
            icon: IndianRupee,
            color: 'from-purple-500 to-pink-600',
            shadowColor: 'shadow-purple-500/20',
        },
    ];

    const pieData = (stats?.subscriptionsByStatus || []).map(item => ({
        name: item.is_active ? 'Active' : 'Inactive',
        value: parseInt(item.count),
    }));

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Page header */}
                <div>
                    <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                    <p className="text-sm text-zinc-400 mt-1">Overview of your subscription platform</p>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {kpiCards.map(({ label, value, icon: Icon, color, shadowColor }) => (
                        <div
                            key={label}
                            className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/50 rounded-2xl p-5 hover:border-zinc-700/50 transition-all group"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg ${shadowColor}`}>
                                    <Icon className="w-5 h-5 text-white" />
                                </div>
                                <ArrowUpRight className="w-4 h-4 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <p className="text-2xl font-bold text-white">{value}</p>
                            <p className="text-xs text-zinc-500 mt-1">{label}</p>
                        </div>
                    ))}
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Revenue Chart */}
                    <div className="xl:col-span-2 bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/50 rounded-2xl p-6">
                        <h3 className="text-sm font-semibold text-white mb-1">Revenue Overview</h3>
                        <p className="text-xs text-zinc-500 mb-6">Monthly revenue for the last 6 months</p>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stats?.monthlyRevenue || []}>
                                    <defs>
                                        <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                    <XAxis dataKey="month" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#18181b',
                                            border: '1px solid #3f3f46',
                                            borderRadius: '12px',
                                            fontSize: '12px',
                                            color: '#fff',
                                        }}
                                        formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Revenue']}
                                    />
                                    <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2.5} fill="url(#revenueGrad)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Subscription Status Pie */}
                    <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/50 rounded-2xl p-6">
                        <h3 className="text-sm font-semibold text-white mb-1">Subscriptions</h3>
                        <p className="text-xs text-zinc-500 mb-6">Active vs Inactive breakdown</p>
                        <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={75}
                                        dataKey="value"
                                        stroke="none"
                                        paddingAngle={4}
                                    >
                                        {pieData.map((_, idx) => (
                                            <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#18181b',
                                            border: '1px solid #3f3f46',
                                            borderRadius: '12px',
                                            fontSize: '12px',
                                            color: '#fff',
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex justify-center gap-6 mt-2">
                            {pieData.map((item, idx) => (
                                <div key={item.name} className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                                    <span className="text-xs text-zinc-400">{item.name}: {item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/50 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-zinc-800/50">
                        <h3 className="text-sm font-semibold text-white">Recent Transactions</h3>
                        <p className="text-xs text-zinc-500 mt-1">Latest payment activity</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-zinc-800/50">
                                    <th className="text-left px-6 py-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">User</th>
                                    <th className="text-left px-6 py-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Amount</th>
                                    <th className="text-left px-6 py-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Status</th>
                                    <th className="text-left px-6 py-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Method</th>
                                    <th className="text-left px-6 py-3 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/50">
                                {(stats?.recentTransactions || []).map((tx) => (
                                    <tr key={tx.transaction_id} className="hover:bg-zinc-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-medium text-zinc-300">
                                                    {tx.user?.first_name?.[0]}{tx.user?.last_name?.[0]}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-white">{tx.user?.first_name} {tx.user?.last_name}</p>
                                                    <p className="text-xs text-zinc-500">{tx.user?.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-semibold text-white">₹{Number(tx.amount).toLocaleString('en-IN')}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2.5 py-0.5 text-[11px] font-semibold rounded-full border ${statusColors[tx.status] || statusColors.pending}`}>
                                                {tx.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-zinc-300">{tx.payment_method || '-'}</td>
                                        <td className="px-6 py-4 text-sm text-zinc-400">
                                            {new Date(tx.transaction_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
