import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { fetchPlans, createPlan, updatePlan, deletePlan } from '../../services/adminApi';
import { Plus, Edit3, Trash2, X, Check, Star, Users } from 'lucide-react';

const AdminPlans = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);
    const [deleteModal, setDeleteModal] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [form, setForm] = useState({
        name: '', description: '', price: '', interval: 'monthly', features: '', is_active: true,
    });

    useEffect(() => { loadPlans(); }, []);

    const loadPlans = async () => {
        try {
            setLoading(true);
            const { data } = await fetchPlans();
            setPlans(data.data);
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    const openCreate = () => {
        setEditingPlan(null);
        setForm({ name: '', description: '', price: '', interval: 'monthly', features: '', is_active: true });
        setShowModal(true);
    };

    const openEdit = (plan) => {
        setEditingPlan(plan);
        const features = Array.isArray(plan.features) ? plan.features.join('\n') : '';
        setForm({ name: plan.name, description: plan.description || '', price: plan.price, interval: plan.interval, features, is_active: plan.is_active });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setActionLoading(true);
            const payload = { ...form, price: parseFloat(form.price), features: form.features.split('\n').map(f => f.trim()).filter(Boolean) };
            if (editingPlan) await updatePlan(editingPlan.plan_id, payload);
            else await createPlan(payload);
            setShowModal(false);
            loadPlans();
        } catch (err) { alert(err.response?.data?.message || 'Failed to save'); } finally { setActionLoading(false); }
    };

    const handleDelete = async () => {
        if (!deleteModal) return;
        try {
            setActionLoading(true);
            await deletePlan(deleteModal.plan_id);
            setDeleteModal(null);
            loadPlans();
        } catch (err) { alert(err.response?.data?.message || 'Failed to delete'); } finally { setActionLoading(false); }
    };

    if (loading) return <AdminLayout><div className="flex items-center justify-center h-96"><div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div></div></AdminLayout>;

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div><h1 className="text-2xl font-bold text-white">Plans</h1><p className="text-sm text-zinc-400 mt-1">Manage subscription plans</p></div>
                    <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/20"><Plus className="w-4 h-4" />Create Plan</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {plans.map((plan) => {
                        const features = Array.isArray(plan.features) ? plan.features : [];
                        const count = plan.dataValues?.subscriberCount ?? plan.subscriberCount ?? 0;
                        return (
                            <div key={plan.plan_id} className={`relative bg-zinc-900/80 backdrop-blur-xl border rounded-2xl p-6 transition-all hover:shadow-lg ${plan.is_active ? 'border-zinc-800/50 hover:border-emerald-500/30' : 'border-zinc-800/30 opacity-60'}`}>
                                <div className={`absolute top-5 right-5 w-2.5 h-2.5 rounded-full ${plan.is_active ? 'bg-emerald-400' : 'bg-zinc-600'}`} />
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/20 flex items-center justify-center"><Star className="w-5 h-5 text-emerald-400" /></div>
                                    <div><h3 className="text-lg font-bold text-white">{plan.name}</h3><p className="text-xs text-zinc-500">{plan.interval}</p></div>
                                </div>
                                <div className="mb-4"><span className="text-3xl font-bold text-white">₹{Number(plan.price).toLocaleString('en-IN')}</span><span className="text-sm text-zinc-500">/{plan.interval === 'yearly' ? 'year' : 'mo'}</span></div>
                                {plan.description && <p className="text-xs text-zinc-400 mb-4 leading-relaxed">{plan.description}</p>}
                                <div className="space-y-2 mb-6">{features.map((f, i) => (<div key={i} className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /><span className="text-xs text-zinc-300">{f}</span></div>))}</div>
                                <div className="flex items-center gap-2 text-xs text-zinc-500 mb-4 pt-4 border-t border-zinc-800/50"><Users className="w-3.5 h-3.5" /><span>{count} subscribers</span></div>
                                <div className="flex gap-2">
                                    <button onClick={() => openEdit(plan)} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-zinc-800 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all"><Edit3 className="w-3.5 h-3.5" />Edit</button>
                                    <button onClick={() => setDeleteModal(plan)} className="flex items-center justify-center px-3 py-2 rounded-xl border border-zinc-800 text-zinc-500 hover:text-red-400 hover:border-red-500/30 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6"><h3 className="text-lg font-semibold text-white">{editingPlan ? 'Edit Plan' : 'Create Plan'}</h3><button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800"><X className="w-5 h-5" /></button></div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div><label className="block text-xs font-medium text-zinc-400 mb-1.5">Plan Name</label><input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="w-full px-4 py-2.5 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50" placeholder="e.g. Pro" /></div>
                            <div><label className="block text-xs font-medium text-zinc-400 mb-1.5">Description</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2.5 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 resize-none h-20" placeholder="Brief description" /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-xs font-medium text-zinc-400 mb-1.5">Price (₹)</label><input type="number" step="0.01" min="0" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required className="w-full px-4 py-2.5 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500/50" placeholder="499" /></div>
                                <div><label className="block text-xs font-medium text-zinc-400 mb-1.5">Interval</label><select value={form.interval} onChange={e => setForm({ ...form, interval: e.target.value })} className="w-full px-4 py-2.5 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500/50"><option value="monthly">Monthly</option><option value="yearly">Yearly</option></select></div>
                            </div>
                            <div><label className="block text-xs font-medium text-zinc-400 mb-1.5">Features (one per line)</label><textarea value={form.features} onChange={e => setForm({ ...form, features: e.target.value })} className="w-full px-4 py-2.5 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 resize-none h-28 font-mono" placeholder={"Unlimited subscriptions\nAdvanced analytics"} /></div>
                            <div className="flex items-center gap-3">
                                <button type="button" onClick={() => setForm({ ...form, is_active: !form.is_active })} className={`relative w-10 h-5 rounded-full transition-colors ${form.is_active ? 'bg-emerald-500' : 'bg-zinc-700'}`}><span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.is_active ? 'translate-x-5' : ''}`} /></button>
                                <span className="text-sm text-zinc-400">Active Plan</span>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-800 text-zinc-400 text-sm font-medium hover:bg-zinc-800 transition-colors">Cancel</button>
                                <button type="submit" disabled={actionLoading} className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors">{actionLoading ? 'Saving...' : editingPlan ? 'Save Changes' : 'Create Plan'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {deleteModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setDeleteModal(null)}>
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-semibold text-white mb-2">Delete Plan</h3>
                        <p className="text-sm text-zinc-400 mb-6">Delete "<span className="text-white font-medium">{deleteModal.name}</span>"? Plans with active subscriptions cannot be deleted.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteModal(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-800 text-zinc-400 text-sm font-medium hover:bg-zinc-800 transition-colors">Cancel</button>
                            <button onClick={handleDelete} disabled={actionLoading} className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors">{actionLoading ? 'Deleting...' : 'Delete'}</button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminPlans;
