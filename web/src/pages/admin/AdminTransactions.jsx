import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { fetchTransactions } from '../../services/adminApi';
import { Search, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

const statusColors = {
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    failed: 'bg-red-500/10 text-red-400 border-red-500/20',
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    refunded: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
};

const AdminTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [loading, setLoading] = useState(true);

    const loadTransactions = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await fetchTransactions({ page, limit: 15, search, status: statusFilter });
            setTransactions(data.data.transactions);
            setTotal(data.data.totalTransactions);
            setTotalPages(data.data.totalPages);
        } catch (err) { console.error(err); } finally { setLoading(false); }
    }, [page, search, statusFilter]);

    useEffect(() => { loadTransactions(); }, [loadTransactions]);

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div><h1 className="text-2xl font-bold text-white">Transactions</h1><p className="text-sm text-zinc-400 mt-1">{total} total transactions</p></div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input type="text" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search by user..." className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/80 border border-zinc-800/50 rounded-xl text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-zinc-500" />
                        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="px-4 py-2.5 bg-zinc-900/80 border border-zinc-800/50 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all">
                            <option value="">All Status</option>
                            <option value="success">Success</option>
                            <option value="failed">Failed</option>
                            <option value="pending">Pending</option>
                            <option value="refunded">Refunded</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/50 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-zinc-800/50">
                                    <th className="text-left px-6 py-3.5 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">ID</th>
                                    <th className="text-left px-6 py-3.5 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">User</th>
                                    <th className="text-left px-6 py-3.5 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Amount</th>
                                    <th className="text-left px-6 py-3.5 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Status</th>
                                    <th className="text-left px-6 py-3.5 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Method</th>
                                    <th className="text-left px-6 py-3.5 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Description</th>
                                    <th className="text-left px-6 py-3.5 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/50">
                                {loading ? (
                                    <tr><td colSpan={7} className="px-6 py-16 text-center"><div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div></td></tr>
                                ) : transactions.length === 0 ? (
                                    <tr><td colSpan={7} className="px-6 py-16 text-center text-zinc-500 text-sm">No transactions found</td></tr>
                                ) : transactions.map((tx) => (
                                    <tr key={tx.transaction_id} className="hover:bg-zinc-800/30 transition-colors">
                                        <td className="px-6 py-4 text-xs text-zinc-500 font-mono">#{tx.transaction_id}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-medium text-zinc-300">{tx.user?.first_name?.[0]}{tx.user?.last_name?.[0]}</div>
                                                <div><p className="text-sm font-medium text-white">{tx.user?.first_name} {tx.user?.last_name}</p><p className="text-xs text-zinc-500">{tx.user?.email}</p></div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-semibold text-white">₹{Number(tx.amount).toLocaleString('en-IN')}</td>
                                        <td className="px-6 py-4"><span className={`inline-flex px-2.5 py-0.5 text-[11px] font-semibold rounded-full border ${statusColors[tx.status] || statusColors.pending}`}>{tx.status}</span></td>
                                        <td className="px-6 py-4 text-sm text-zinc-300">{tx.payment_method || '-'}</td>
                                        <td className="px-6 py-4 text-sm text-zinc-400 max-w-[200px] truncate">{tx.description || '-'}</td>
                                        <td className="px-6 py-4 text-sm text-zinc-400">{new Date(tx.transaction_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-800/50">
                            <p className="text-xs text-zinc-500">Page {page} of {totalPages}</p>
                            <div className="flex gap-2">
                                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-lg border border-zinc-800 text-zinc-400 hover:bg-zinc-800 disabled:opacity-30 transition-all"><ChevronLeft className="w-4 h-4" /></button>
                                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 rounded-lg border border-zinc-800 text-zinc-400 hover:bg-zinc-800 disabled:opacity-30 transition-all"><ChevronRight className="w-4 h-4" /></button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminTransactions;
