import React, { useEffect, useState } from 'react';
import { fetchPlans, createPlan, updatePlan, deletePlan } from '../../lib/adminApi';
import { Plus, Edit2, Trash2, X, Check, Package, DollarSign, Users } from 'lucide-react';

const EMPTY_FORM = { name: '', description: '', price: '', interval: 'monthly', features: '', max_users: '', is_active: true };

const AdminPlans = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);

    const loadPlans = async () => {
        setLoading(true);
        try {
            const res = await fetchPlans();
            setPlans(res.data);
        } catch (err) {
            console.error('Load plans error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadPlans(); }, []);

    const openCreate = () => {
        setEditingPlan(null);
        setForm(EMPTY_FORM);
        setShowModal(true);
    };

    const openEdit = (plan) => {
        setEditingPlan(plan);
        const features = Array.isArray(plan.features) ? plan.features.join('\n') : (plan.features || '');
        setForm({
            name: plan.name,
            description: plan.description || '',
            price: plan.price,
            interval: plan.interval,
            features: features,
            max_users: plan.max_users || '',
            is_active: plan.is_active
        });
        setShowModal(true);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const payload = {
                ...form,
                price: parseFloat(form.price),
                max_users: form.max_users ? parseInt(form.max_users) : null,
                features: form.features.split('\n').map(f => f.trim()).filter(Boolean)
            };

            if (editingPlan) {
                await updatePlan(editingPlan.plan_id, payload);
            } else {
                await createPlan(payload);
            }
            setShowModal(false);
            loadPlans();
        } catch (err) {
            alert(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (planId) => {
        if (!confirm('Are you sure you want to delete this plan?')) return;
        try {
            await deletePlan(planId);
            loadPlans();
        } catch (err) {
            alert(err.message);
        }
    };

    const intervalColors = {
        monthly: 'bg-blue-500/15 text-blue-400',
        yearly: 'bg-violet-500/15 text-violet-400',
        weekly: 'bg-amber-500/15 text-amber-400',
        lifetime: 'bg-emerald-500/15 text-emerald-400'
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Plan Management</h1>
                    <p className="text-sm text-zinc-400 mt-1">{plans.length} plans total</p>
                </div>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors"
                >
                    <Plus size={16} /> Create Plan
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-40">
                    <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {plans.map((plan) => (
                        <div
                            key={plan.plan_id}
                            className={`bg-zinc-900/60 backdrop-blur-sm border rounded-xl p-5 transition-all hover:border-zinc-700/60 ${plan.is_active ? 'border-zinc-800/60' : 'border-red-900/30 opacity-60'
                                }`}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center">
                                        <Package size={18} className="text-emerald-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-semibold text-white">{plan.name}</h3>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${intervalColors[plan.interval] || 'bg-zinc-700/50 text-zinc-400'}`}>
                                            {plan.interval}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button onClick={() => openEdit(plan)} className="p-1.5 rounded-md hover:bg-zinc-700/50 text-zinc-400 hover:text-zinc-200 transition-colors">
                                        <Edit2 size={14} />
                                    </button>
                                    <button onClick={() => handleDelete(plan.plan_id)} className="p-1.5 rounded-md hover:bg-red-500/10 text-zinc-400 hover:text-red-400 transition-colors">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="flex items-baseline gap-1 mb-3">
                                <DollarSign size={16} className="text-zinc-500" />
                                <span className="text-2xl font-bold text-white">{parseFloat(plan.price).toFixed(2)}</span>
                                <span className="text-xs text-zinc-500">/ {plan.interval}</span>
                            </div>

                            {/* Description */}
                            {plan.description && (
                                <p className="text-xs text-zinc-400 mb-4">{plan.description}</p>
                            )}

                            {/* Features */}
                            {plan.features && (Array.isArray(plan.features) ? plan.features : []).length > 0 && (
                                <ul className="space-y-1.5 mb-4">
                                    {(Array.isArray(plan.features) ? plan.features : []).map((feature, idx) => (
                                        <li key={idx} className="flex items-center gap-2 text-xs text-zinc-300">
                                            <Check size={12} className="text-emerald-400 flex-shrink-0" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {/* Footer */}
                            <div className="flex items-center justify-between pt-3 border-t border-zinc-800/40">
                                <div className="flex items-center gap-1 text-xs text-zinc-500">
                                    <Users size={12} />
                                    {plan.max_users ? `${plan.max_users} users` : 'Unlimited'}
                                </div>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${plan.is_active ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'
                                    }`}>
                                    {plan.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>
                    ))}

                    {plans.length === 0 && (
                        <div className="col-span-full text-center py-16 text-zinc-500">
                            <Package size={40} className="mx-auto mb-3 opacity-30" />
                            <p>No plans yet. Create your first plan!</p>
                        </div>
                    )}
                </div>
            )}

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)}>
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-lg p-6 space-y-5 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-white">{editingPlan ? 'Edit Plan' : 'Create Plan'}</h2>
                            <button onClick={() => setShowModal(false)} className="text-zinc-400 hover:text-zinc-200"><X size={20} /></button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-zinc-400 mb-1 block">Plan Name *</label>
                                <input
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    placeholder="e.g. Pro"
                                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/50"
                                />
                            </div>

                            <div>
                                <label className="text-xs text-zinc-400 mb-1 block">Description</label>
                                <input
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    placeholder="A short description"
                                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/50"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs text-zinc-400 mb-1 block">Price *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={form.price}
                                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                                        placeholder="9.99"
                                        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/50"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-zinc-400 mb-1 block">Interval *</label>
                                    <select
                                        value={form.interval}
                                        onChange={(e) => setForm({ ...form, interval: e.target.value })}
                                        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-300 focus:outline-none focus:border-emerald-500/50"
                                    >
                                        <option value="monthly">Monthly</option>
                                        <option value="yearly">Yearly</option>
                                        <option value="weekly">Weekly</option>
                                        <option value="lifetime">Lifetime</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs text-zinc-400 mb-1 block">Features (one per line)</label>
                                <textarea
                                    value={form.features}
                                    onChange={(e) => setForm({ ...form, features: e.target.value })}
                                    placeholder="Advanced analytics&#10;Priority support&#10;Export data"
                                    rows={4}
                                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/50 resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs text-zinc-400 mb-1 block">Max Users</label>
                                    <input
                                        type="number"
                                        value={form.max_users}
                                        onChange={(e) => setForm({ ...form, max_users: e.target.value })}
                                        placeholder="Leave empty for unlimited"
                                        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/50"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-zinc-400 mb-1 block">Status</label>
                                    <select
                                        value={form.is_active}
                                        onChange={(e) => setForm({ ...form, is_active: e.target.value === 'true' })}
                                        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-300 focus:outline-none focus:border-emerald-500/50"
                                    >
                                        <option value="true">Active</option>
                                        <option value="false">Inactive</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-200 border border-zinc-700/50 hover:bg-zinc-800/50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving || !form.name || !form.price}
                                className="px-4 py-2 rounded-lg text-sm bg-emerald-600 hover:bg-emerald-500 text-white font-medium disabled:opacity-50 transition-colors flex items-center gap-2"
                            >
                                {saving ? 'Saving...' : <><Check size={14} /> {editingPlan ? 'Update' : 'Create'}</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPlans;
