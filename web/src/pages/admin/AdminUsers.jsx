import React, { useEffect, useState, useCallback } from 'react';
import { fetchUsers, updateUser, deleteUser, createUser, restoreUser } from '../../lib/adminApi';
import { Search, ChevronLeft, ChevronRight, Edit2, Trash2, X, Check, Plus, RotateCcw, UserPlus, Eye, EyeOff } from 'lucide-react';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [showDeleted, setShowDeleted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [editingUser, setEditingUser] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [saving, setSaving] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [addForm, setAddForm] = useState({ first_name: '', last_name: '', email: '', password: 'Welcome@123', role: 'user', status: 'active' });
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const loadUsers = useCallback(async () => {
        setLoading(true);
        try {
            const params = { page: currentPage, limit: 15, search };
            if (roleFilter) params.role = roleFilter;
            if (statusFilter) params.status = statusFilter;
            if (showDeleted) params.includeDeleted = 'true';

            const res = await fetchUsers(params);
            setUsers(res.data.users);
            setTotalUsers(res.data.totalUsers);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            console.error('Load users error:', err);
        } finally {
            setLoading(false);
        }
    }, [currentPage, search, roleFilter, statusFilter, showDeleted]);

    useEffect(() => { loadUsers(); }, [loadUsers]);

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        loadUsers();
    };

    const openEdit = (user) => {
        setEditingUser(user);
        setEditForm({
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role || 'user',
            status: user.status || 'active'
        });
    };

    const handleSave = async () => {
        if (!editingUser) return;
        setSaving(true);
        try {
            await updateUser(editingUser.user_id, editForm);
            setEditingUser(null);
            showToast('User updated successfully');
            loadUsers();
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (userId, userName) => {
        if (!confirm(`Soft-delete "${userName}"? They can be restored later.`)) return;
        try {
            await deleteUser(userId);
            showToast(`${userName} deleted (can be restored)`);
            loadUsers();
        } catch (err) {
            showToast(err.message, 'error');
        }
    };

    const handleRestore = async (userId, userName) => {
        try {
            await restoreUser(userId);
            showToast(`${userName} restored successfully`);
            loadUsers();
        } catch (err) {
            showToast(err.message, 'error');
        }
    };

    const handleAddUser = async () => {
        if (!addForm.first_name || !addForm.last_name || !addForm.email) {
            showToast('Please fill in all required fields', 'error');
            return;
        }
        setSaving(true);
        try {
            await createUser(addForm);
            setShowAddModal(false);
            setAddForm({ first_name: '', last_name: '', email: '', password: 'Welcome@123', role: 'user', status: 'active' });
            showToast('User created successfully');
            loadUsers();
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            setSaving(false);
        }
    };

    const inputClass = "w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20";
    const labelClass = "text-xs text-zinc-400 mb-1 block";

    return (
        <div className="space-y-6">
            {/* Toast */}
            {toast && (
                <div className={`fixed top-6 right-6 z-[60] px-4 py-3 rounded-lg text-sm font-medium shadow-xl border animate-in slide-in-from-top-2 ${toast.type === 'error'
                        ? 'bg-red-500/10 border-red-500/30 text-red-400'
                        : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    }`}>
                    {toast.message}
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">User Management</h1>
                    <p className="text-sm text-zinc-400 mt-1">{totalUsers} users total</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-emerald-500/10"
                >
                    <UserPlus size={16} /> Add User
                </button>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-wrap gap-3">
                <form onSubmit={handleSearch} className="flex-1 min-w-[250px]">
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/60 border border-zinc-800/60 rounded-lg text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20"
                        />
                    </div>
                </form>
                <select
                    value={roleFilter}
                    onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
                    className="px-3 py-2.5 bg-zinc-900/60 border border-zinc-800/60 rounded-lg text-sm text-zinc-300 focus:outline-none focus:border-emerald-500/50"
                >
                    <option value="">All Roles</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                </select>
                <select
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                    className="px-3 py-2.5 bg-zinc-900/60 border border-zinc-800/60 rounded-lg text-sm text-zinc-300 focus:outline-none focus:border-emerald-500/50"
                >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="banned">Banned</option>
                </select>
                <button
                    onClick={() => { setShowDeleted(!showDeleted); setCurrentPage(1); }}
                    className={`flex items-center gap-2 px-3 py-2.5 border rounded-lg text-sm transition-colors ${showDeleted
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                            : 'bg-zinc-900/60 border-zinc-800/60 text-zinc-400 hover:text-zinc-300'
                        }`}
                >
                    {showDeleted ? <Eye size={14} /> : <EyeOff size={14} />}
                    {showDeleted ? 'Showing Deleted' : 'Show Deleted'}
                </button>
            </div>

            {/* Users Table */}
            <div className="bg-zinc-900/60 backdrop-blur-sm border border-zinc-800/60 rounded-xl overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center h-40">
                        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-zinc-800/40">
                                <tr className="text-xs text-zinc-400 uppercase tracking-wider">
                                    <th className="px-5 py-3 font-medium">User</th>
                                    <th className="px-5 py-3 font-medium">Email</th>
                                    <th className="px-5 py-3 font-medium">Phone</th>
                                    <th className="px-5 py-3 font-medium">Role</th>
                                    <th className="px-5 py-3 font-medium">Status</th>
                                    <th className="px-5 py-3 font-medium">Subs</th>
                                    <th className="px-5 py-3 font-medium">Joined</th>
                                    <th className="px-5 py-3 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm divide-y divide-zinc-800/30">
                                {users.map((user) => {
                                    const isDeleted = !!user.deleted_at;
                                    return (
                                        <tr key={user.user_id} className={`transition-colors ${isDeleted ? 'opacity-50 bg-red-500/5' : 'hover:bg-zinc-800/20'}`}>
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${isDeleted
                                                            ? 'bg-red-500/10 border-red-500/20'
                                                            : 'bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border-emerald-500/30'
                                                        }`}>
                                                        <span className={`text-xs font-bold ${isDeleted ? 'text-red-400' : 'text-emerald-400'}`}>
                                                            {user.first_name?.[0]?.toUpperCase()}{user.last_name?.[0]?.toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="text-zinc-200 font-medium">{user.first_name} {user.last_name}</span>
                                                        {isDeleted && <span className="ml-2 text-[10px] px-1.5 py-0.5 bg-red-500/15 text-red-400 rounded">DELETED</span>}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5 text-zinc-400">{user.email}</td>
                                            <td className="px-5 py-3.5 text-zinc-500">{user.phone_number || '—'}</td>
                                            <td className="px-5 py-3.5">
                                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${user.role === 'super_admin' ? 'bg-red-500/15 text-red-400' :
                                                    user.role === 'admin' ? 'bg-amber-500/15 text-amber-400' :
                                                        'bg-zinc-700/50 text-zinc-400'
                                                    }`}>{user.role || 'user'}</span>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${user.status === 'active' ? 'bg-emerald-500/15 text-emerald-400' :
                                                    user.status === 'banned' ? 'bg-red-500/15 text-red-400' :
                                                        'bg-amber-500/15 text-amber-400'
                                                    }`}>{user.status || 'active'}</span>
                                            </td>
                                            <td className="px-5 py-3.5 text-zinc-400">{user.subscriptions?.length || 0}</td>
                                            <td className="px-5 py-3.5 text-zinc-500 text-xs">{new Date(user.created_at).toLocaleDateString()}</td>
                                            <td className="px-5 py-3.5 text-right">
                                                <div className="flex items-center gap-1 justify-end">
                                                    {isDeleted ? (
                                                        <button
                                                            onClick={() => handleRestore(user.user_id, `${user.first_name} ${user.last_name}`)}
                                                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-medium transition-colors"
                                                            title="Restore user"
                                                        >
                                                            <RotateCcw size={12} /> Restore
                                                        </button>
                                                    ) : (
                                                        <>
                                                            <button onClick={() => openEdit(user)} className="p-1.5 rounded-md hover:bg-zinc-700/50 text-zinc-400 hover:text-zinc-200 transition-colors" title="Edit user">
                                                                <Edit2 size={14} />
                                                            </button>
                                                            <button onClick={() => handleDelete(user.user_id, `${user.first_name} ${user.last_name}`)} className="p-1.5 rounded-md hover:bg-red-500/10 text-zinc-400 hover:text-red-400 transition-colors" title="Delete user">
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {users.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="px-5 py-10 text-center text-zinc-500">No users found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-5 py-3 border-t border-zinc-800/40">
                        <span className="text-xs text-zinc-500">Page {currentPage} of {totalPages}</span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage <= 1}
                                className="p-1.5 rounded-md border border-zinc-700/50 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 disabled:opacity-30 transition-colors"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage >= totalPages}
                                className="p-1.5 rounded-md border border-zinc-700/50 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 disabled:opacity-30 transition-colors"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Add User Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)}>
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md p-6 space-y-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-white flex items-center gap-2"><UserPlus size={20} className="text-emerald-400" /> Add New User</h2>
                            <button onClick={() => setShowAddModal(false)} className="text-zinc-400 hover:text-zinc-200"><X size={20} /></button>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className={labelClass}>First Name *</label>
                                    <input value={addForm.first_name} onChange={(e) => setAddForm({ ...addForm, first_name: e.target.value })} className={inputClass} placeholder="John" />
                                </div>
                                <div>
                                    <label className={labelClass}>Last Name *</label>
                                    <input value={addForm.last_name} onChange={(e) => setAddForm({ ...addForm, last_name: e.target.value })} className={inputClass} placeholder="Doe" />
                                </div>
                            </div>

                            <div>
                                <label className={labelClass}>Email *</label>
                                <input type="email" value={addForm.email} onChange={(e) => setAddForm({ ...addForm, email: e.target.value })} className={inputClass} placeholder="john@example.com" />
                            </div>

                            <div>
                                <label className={labelClass}>Password</label>
                                <input type="text" value={addForm.password} onChange={(e) => setAddForm({ ...addForm, password: e.target.value })} className={inputClass} />
                                <p className="text-[10px] text-zinc-600 mt-1">Default: Welcome@123</p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className={labelClass}>Role</label>
                                    <select value={addForm.role} onChange={(e) => setAddForm({ ...addForm, role: e.target.value })} className={inputClass}>
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Status</label>
                                    <select value={addForm.status} onChange={(e) => setAddForm({ ...addForm, status: e.target.value })} className={inputClass}>
                                        <option value="active">Active</option>
                                        <option value="suspended">Suspended</option>
                                        <option value="banned">Banned</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 justify-end pt-2">
                            <button onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-200 border border-zinc-700/50 hover:bg-zinc-800/50 transition-colors">
                                Cancel
                            </button>
                            <button onClick={handleAddUser} disabled={saving} className="px-4 py-2 rounded-lg text-sm bg-emerald-600 hover:bg-emerald-500 text-white font-medium disabled:opacity-50 transition-colors flex items-center gap-2">
                                {saving ? 'Creating...' : <><Plus size={14} /> Create User</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setEditingUser(null)}>
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md p-6 space-y-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-white flex items-center gap-2"><Edit2 size={18} className="text-blue-400" /> Edit User</h2>
                            <button onClick={() => setEditingUser(null)} className="text-zinc-400 hover:text-zinc-200"><X size={20} /></button>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className={labelClass}>First Name</label>
                                    <input value={editForm.first_name} onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })} className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Last Name</label>
                                    <input value={editForm.last_name} onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })} className={inputClass} />
                                </div>
                            </div>

                            <div>
                                <label className={labelClass}>Email</label>
                                <input value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} className={inputClass} />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className={labelClass}>Role</label>
                                    <select value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })} className={inputClass}>
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                        <option value="super_admin">Super Admin</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Status</label>
                                    <select value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })} className={inputClass}>
                                        <option value="active">Active</option>
                                        <option value="suspended">Suspended</option>
                                        <option value="banned">Banned</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 justify-end pt-2">
                            <button onClick={() => setEditingUser(null)} className="px-4 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-200 border border-zinc-700/50 hover:bg-zinc-800/50 transition-colors">
                                Cancel
                            </button>
                            <button onClick={handleSave} disabled={saving} className="px-4 py-2 rounded-lg text-sm bg-emerald-600 hover:bg-emerald-500 text-white font-medium disabled:opacity-50 transition-colors flex items-center gap-2">
                                {saving ? 'Saving...' : <><Check size={14} /> Save Changes</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
