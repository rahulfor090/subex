import React, { useEffect, useState } from 'react';
import { fetchSystemHealth } from '../../lib/adminApi';
import { Activity, Server, Database, Clock, Cpu, HardDrive, RefreshCw } from 'lucide-react';

const AdminSystemHealth = () => {
    const [health, setHealth] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lastRefresh, setLastRefresh] = useState(null);

    const load = async () => {
        setLoading(true);
        try {
            const res = await fetchSystemHealth();
            setHealth(res.data);
            setLastRefresh(new Date());
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { load(); }, []);

    const formatUptime = (s) => {
        const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60);
        return `${d}d ${h}h ${m}m`;
    };
    const formatBytes = (b) => {
        if (b < 1024) return b + ' B';
        if (b < 1048576) return (b / 1024).toFixed(1) + ' KB';
        return (b / 1048576).toFixed(1) + ' MB';
    };

    if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>;

    const srv = health?.server || {};
    const db = health?.database || {};
    const mem = srv.memoryUsage || {};

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">System Health</h1>
                    <p className="text-sm text-zinc-400 mt-1">
                        Last checked: {lastRefresh?.toLocaleTimeString() || '—'}
                    </p>
                </div>
                <button onClick={load} className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-sm text-zinc-300 transition-colors">
                    <RefreshCw size={14} /> Refresh
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Server Status */}
                <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                            <Server size={20} className="text-white" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-white">Server</h3>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${srv.status === 'healthy' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>{srv.status || 'unknown'}</span>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm"><span className="text-zinc-400 flex items-center gap-2"><Clock size={14} />Uptime</span><span className="text-zinc-200">{formatUptime(srv.uptime || 0)}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-zinc-400 flex items-center gap-2"><Cpu size={14} />Node Version</span><span className="text-zinc-200">{srv.nodeVersion || '—'}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-zinc-400">Platform</span><span className="text-zinc-200">{srv.platform || '—'}</span></div>
                    </div>
                </div>

                {/* Database Status */}
                <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                            <Database size={20} className="text-white" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-white">Database</h3>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${db.status === 'connected' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>{db.status || 'unknown'}</span>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm"><span className="text-zinc-400">Response Time</span><span className="text-zinc-200">{db.responseTime || '—'}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-zinc-400">Dialect</span><span className="text-zinc-200">{db.dialect || '—'}</span></div>
                        {db.tables && Object.entries(db.tables).map(([k, v]) => (
                            <div key={k} className="flex justify-between text-sm"><span className="text-zinc-400 capitalize">{k.replace('_count', 's')}</span><span className="text-zinc-200">{v}</span></div>
                        ))}
                    </div>
                </div>

                {/* Memory Usage */}
                <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-5 space-y-4 md:col-span-2">
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2"><HardDrive size={16} className="text-violet-400" />Memory Usage</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[['RSS', mem.rss], ['Heap Total', mem.heapTotal], ['Heap Used', mem.heapUsed], ['External', mem.external]].map(([label, val]) => (
                            <div key={label} className="bg-zinc-800/40 rounded-lg p-3 text-center">
                                <p className="text-lg font-bold text-white">{formatBytes(val || 0)}</p>
                                <p className="text-xs text-zinc-500 mt-1">{label}</p>
                            </div>
                        ))}
                    </div>
                    {mem.heapTotal > 0 && (
                        <div>
                            <div className="flex justify-between text-xs text-zinc-500 mb-1"><span>Heap utilization</span><span>{((mem.heapUsed / mem.heapTotal) * 100).toFixed(1)}%</span></div>
                            <div className="w-full bg-zinc-800 rounded-full h-2"><div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all" style={{ width: `${Math.min(100, (mem.heapUsed / mem.heapTotal) * 100)}%` }} /></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default AdminSystemHealth;
