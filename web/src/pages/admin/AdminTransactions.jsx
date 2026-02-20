import React, { useEffect, useState, useCallback } from 'react';
import { fetchTransactions } from '../../lib/adminApi';
import { Search, ChevronLeft, ChevronRight, FileText } from 'lucide-react';

const AdminTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [total, setTotal] = useState(0);
    const [pages, setPages] = useState(1);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const p = { page, limit: 20, search };
            if (status) p.status = status;
            if (startDate) p.startDate = startDate;
            if (endDate) p.endDate = endDate;
            const res = await fetchTransactions(p);
            setTransactions(res.data.transactions);
            setTotal(res.data.totalTransactions);
            setPages(res.data.totalPages);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    }, [page, search, status, startDate, endDate]);

    useEffect(() => { load(); }, [load]);

    const sc = { completed: 'bg-emerald-500/15 text-emerald-400', pending: 'bg-amber-500/15 text-amber-400', failed: 'bg-red-500/15 text-red-400', refunded: 'bg-blue-500/15 text-blue-400' };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Transactions</h1>
                <p className="text-sm text-zinc-400 mt-1">{total} transactions total</p>
            </div>
            <div className="flex flex-wrap gap-3">
                <div className="flex-1 min-w-[200px] relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input type="text" placeholder="Search user..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/60 border border-zinc-800/60 rounded-lg text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50" />
                </div>
                <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }} className="px-3 py-2.5 bg-zinc-900/60 border border-zinc-800/60 rounded-lg text-sm text-zinc-300">
                    <option value="">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                </select>
                <input type="date" value={startDate} onChange={e => { setStartDate(e.target.value); setPage(1); }} className="px-3 py-2.5 bg-zinc-900/60 border border-zinc-800/60 rounded-lg text-sm text-zinc-300" />
                <input type="date" value={endDate} onChange={e => { setEndDate(e.target.value); setPage(1); }} className="px-3 py-2.5 bg-zinc-900/60 border border-zinc-800/60 rounded-lg text-sm text-zinc-300" />
            </div>
            <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center h-40"><div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-zinc-800/40">
                                <tr className="text-xs text-zinc-400 uppercase tracking-wider">
                                    <th className="px-5 py-3">ID</th><th className="px-5 py-3">User</th><th className="px-5 py-3">Amount</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Payment</th><th className="px-5 py-3">Date</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm divide-y divide-zinc-800/30">
                                {transactions.map(t => (
                                    <tr key={t.transaction_id} className="hover:bg-zinc-800/20">
                                        <td className="px-5 py-3.5 text-zinc-500 font-mono text-xs">#{t.transaction_id}</td>
                                        <td className="px-5 py-3.5">{t.user ? <div><p className="text-zinc-200">{t.user.first_name} {t.user.last_name}</p><p className="text-zinc-500 text-xs">{t.user.email}</p></div> : '—'}</td>
                                        <td className="px-5 py-3.5 text-white font-semibold">{t.currency} {parseFloat(t.amount).toFixed(2)}</td>
                                        <td className="px-5 py-3.5"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sc[t.status] || 'bg-zinc-700/50 text-zinc-400'}`}>{t.status}</span></td>
                                        <td className="px-5 py-3.5 text-zinc-400 text-xs">{t.payment_method || '—'}</td>
                                        <td className="px-5 py-3.5 text-zinc-500 text-xs">{new Date(t.transaction_date).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                                {!transactions.length && <tr><td colSpan={6} className="px-5 py-16 text-center"><FileText size={40} className="mx-auto mb-3 text-zinc-700" /><p className="text-zinc-500">No transactions found</p></td></tr>}
                            </tbody>
                        </table>
                    </div>
                )}
                {pages > 1 && (
                    <div className="flex items-center justify-between px-5 py-3 border-t border-zinc-800/40">
                        <span className="text-xs text-zinc-500">Page {page} of {pages}</span>
                        <div className="flex gap-2">
                            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} className="p-1.5 rounded-md border border-zinc-700/50 text-zinc-400 disabled:opacity-30"><ChevronLeft size={16} /></button>
                            <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page >= pages} className="p-1.5 rounded-md border border-zinc-700/50 text-zinc-400 disabled:opacity-30"><ChevronRight size={16} /></button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
export default AdminTransactions;
