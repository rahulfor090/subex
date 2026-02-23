import React, { useEffect, useState } from 'react';
import { fetchDashboardStats, fetchDashboardCharts } from '../../lib/adminApi';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import { Users, DollarSign, CreditCard, Package, TrendingUp, UserPlus } from 'lucide-react';

const CHART_COLORS = ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899'];

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [charts, setCharts] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const [statsRes, chartsRes] = await Promise.all([
                    fetchDashboardStats(),
                    fetchDashboardCharts()
                ]);
                setStats(statsRes.data);
                setCharts(chartsRes.data);
            } catch (err) {
                console.error('Dashboard load error:', err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const kpiCards = [
        { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'from-emerald-500 to-emerald-600', change: `+${stats?.newUsersThisMonth || 0} this month` },
        { label: 'Revenue', value: `$${(stats?.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: 'from-blue-500 to-blue-600', change: 'Total completed' },
        { label: 'Active Subscriptions', value: stats?.totalSubscriptions || 0, icon: CreditCard, color: 'from-violet-500 to-violet-600', change: 'All time' },
        { label: 'Active Plans', value: stats?.activePlans || 0, icon: Package, color: 'from-amber-500 to-amber-600', change: 'Currently active' },
    ];

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const revenueData = (charts?.monthlyRevenue || []).map(item => ({
        month: monthNames[parseInt(item.month.split('-')[1]) - 1] || item.month,
        revenue: parseFloat(item.revenue),
        count: item.count
    }));

    const userGrowthData = (charts?.userGrowth || []).map(item => ({
        month: monthNames[parseInt(item.month.split('-')[1]) - 1] || item.month,
        users: item.new_users
    }));

    const subscriptionTypeData = (charts?.subscriptionTypes || []).map((item, idx) => ({
        name: item.type || 'Unknown',
        value: parseInt(item.getDataValue?.('count') || item.dataValues?.count || 0),
        color: CHART_COLORS[idx % CHART_COLORS.length]
    }));

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                <p className="text-sm text-zinc-400 mt-1">Welcome back. Here's what's happening with your platform.</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpiCards.map((card, idx) => (
                    <div key={idx} className="bg-zinc-900/60 backdrop-blur-sm border border-zinc-800/60 rounded-xl p-5 hover:border-zinc-700/60 transition-all">
                        <div className="flex items-center justify-between mb-3">
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                                <card.icon size={20} className="text-white" />
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-white">{card.value}</div>
                        <div className="text-xs text-zinc-500 mt-1">{card.label}</div>
                        <div className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                            <TrendingUp size={12} /> {card.change}
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <div className="bg-zinc-900/60 backdrop-blur-sm border border-zinc-800/60 rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-zinc-300 mb-4">Monthly Revenue</h3>
                    <div className="h-64">
                        {revenueData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={revenueData}>
                                    <defs>
                                        <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                                    <XAxis dataKey="month" stroke="#71717a" fontSize={12} />
                                    <YAxis stroke="#71717a" fontSize={12} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px', color: '#fff' }}
                                        formatter={(value) => [`$${value}`, 'Revenue']}
                                    />
                                    <Area type="monotone" dataKey="revenue" stroke="#10b981" fill="url(#revenueGrad)" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-zinc-500 text-sm">No revenue data yet</div>
                        )}
                    </div>
                </div>

                {/* User Growth Chart */}
                <div className="bg-zinc-900/60 backdrop-blur-sm border border-zinc-800/60 rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-zinc-300 mb-4">User Growth</h3>
                    <div className="h-64">
                        {userGrowthData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={userGrowthData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                                    <XAxis dataKey="month" stroke="#71717a" fontSize={12} />
                                    <YAxis stroke="#71717a" fontSize={12} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px', color: '#fff' }}
                                        formatter={(value) => [value, 'New Users']}
                                    />
                                    <Bar dataKey="users" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-zinc-500 text-sm">No user data yet</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Subscription Types + Recent Users */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Subscription Types Pie */}
                <div className="bg-zinc-900/60 backdrop-blur-sm border border-zinc-800/60 rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-zinc-300 mb-4">Subscription Types</h3>
                    <div className="h-48">
                        {subscriptionTypeData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={subscriptionTypeData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={4} dataKey="value">
                                        {subscriptionTypeData.map((entry, index) => (
                                            <Cell key={index} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px', color: '#fff' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-zinc-500 text-sm">No data</div>
                        )}
                    </div>
                    {subscriptionTypeData.length > 0 && (
                        <div className="space-y-2 mt-2">
                            {subscriptionTypeData.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                        <span className="text-zinc-400 capitalize">{item.name}</span>
                                    </div>
                                    <span className="text-zinc-300 font-medium">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Users */}
                <div className="lg:col-span-2 bg-zinc-900/60 backdrop-blur-sm border border-zinc-800/60 rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-2">
                        <UserPlus size={16} className="text-emerald-400" /> Recent Users
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-xs text-zinc-500 border-b border-zinc-800/40">
                                    <th className="pb-3 font-medium">Name</th>
                                    <th className="pb-3 font-medium">Email</th>
                                    <th className="pb-3 font-medium">Role</th>
                                    <th className="pb-3 font-medium">Status</th>
                                    <th className="pb-3 font-medium">Joined</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {(charts?.recentUsers || []).map((usr) => (
                                    <tr key={usr.user_id} className="border-b border-zinc-800/20 hover:bg-zinc-800/30 transition-colors">
                                        <td className="py-3 text-zinc-200">{usr.first_name} {usr.last_name}</td>
                                        <td className="py-3 text-zinc-400">{usr.email}</td>
                                        <td className="py-3">
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${usr.role === 'super_admin' ? 'bg-red-500/15 text-red-400' :
                                                    usr.role === 'admin' ? 'bg-amber-500/15 text-amber-400' :
                                                        'bg-zinc-700/50 text-zinc-400'
                                                }`}>{usr.role}</span>
                                        </td>
                                        <td className="py-3">
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${usr.status === 'active' ? 'bg-emerald-500/15 text-emerald-400' :
                                                    usr.status === 'banned' ? 'bg-red-500/15 text-red-400' :
                                                        'bg-amber-500/15 text-amber-400'
                                                }`}>{usr.status || 'active'}</span>
                                        </td>
                                        <td className="py-3 text-zinc-500 text-xs">{new Date(usr.created_at).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
