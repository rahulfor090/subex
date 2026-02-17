import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { fetchUsers, updateUser, deleteUser } from '../../services/adminApi';
import {
    Search,
    ChevronLeft,
    ChevronRight,
    Trash2,
    Edit3,
    X,
    UserCheck,
    Shield,
    User as UserIcon,
} from 'lucide-react';

const roleBadge = {
    super_admin: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    admin: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    user: 'bg-zinc-700/50 text-zinc-300 border-zinc-600/30',
};

const roleLabel = {
    super_admin: 'Super Admin',
    admin: 'Admin',
    user: 'User',
};

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [editModal, setEditModal] = useState(null); // user object or null
    const [editRole, setEditRole] = useState('');
    const [deleteModal, setDeleteModal] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    const loadUsers = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await fetchUsers({ page, limit: 15, search });
            setUsers(data.data.users);
            setTotalUsers(data.data.totalUsers);
            setTotalPages(data.data.totalPages);
        } catch (err) {
            console.error('Failed to load users:', err);
        } finally {
            setLoading(false);
        }
    }, [page, search]);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const handleEditRole = async () => {
        if (!editModal) return;
        try {
            setActionLoading(true);
            await updateUser(editModal.user_id, { role: editRole });
            setEditModal(null);
            loadUsers();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update role');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteModal) return;
        try {
            setActionLoading(true);
            await deleteUser(deleteModal.user_id);
            setDeleteModal(null);
            loadUsers();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete user');
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Users</h1>
                        <p className="text-sm text-zinc-400 mt-1">{totalUsers} registered users</p>
                    </div>
                    {/* Search */}
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input
                            type="text"
                            value={search}
                            onChange={handleSearch}
                            placeholder="Search by name or email..."
                            className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/80 border border-zinc-800/50 rounded-xl text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/50 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-zinc-800/50">
                                    <th className="text-left px-6 py-3.5 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">User</th>
                                    <th className="text-left px-6 py-3.5 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Role</th>
                                    <th className="text-left px-6 py-3.5 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Subscriptions</th>
                                    <th className="text-left px-6 py-3.5 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Verified</th>
                                    <th className="text-left px-6 py-3.5 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Joined</th>
                                    <th className="text-right px-6 py-3.5 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/50">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-16 text-center">
                                            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                                        </td>
                                    </tr>
                                ) : users.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-16 text-center text-zinc-500 text-sm">No users found</td>
                                    </tr>
                                ) : (
                                    users.map((u) => (
                                        <tr key={u.user_id} className="hover:bg-zinc-800/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-xs font-semibold text-white">
                                                        {u.first_name?.[0]}{u.last_name?.[0]}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-white">{u.first_name} {u.last_name}</p>
                                                        <p className="text-xs text-zinc-500">{u.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2.5 py-0.5 text-[11px] font-semibold rounded-full border ${roleBadge[u.role] || roleBadge.user}`}>
                                                    {roleLabel[u.role] || u.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-zinc-300">
                                                {u.subscriptions?.length || 0} active
                                            </td>
                                            <td className="px-6 py-4">
                                                {u.is_email_verified ? (
                                                    <UserCheck className="w-4 h-4 text-emerald-400" />
                                                ) : (
                                                    <X className="w-4 h-4 text-zinc-600" />
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-zinc-400">
                                                {new Date(u.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button
                                                        onClick={() => { setEditModal(u); setEditRole(u.role); }}
                                                        className="p-2 rounded-lg text-zinc-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all"
                                                        title="Edit Role"
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteModal(u)}
                                                        className="p-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-800/50">
                            <p className="text-xs text-zinc-500">Page {page} of {totalPages}</p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="p-2 rounded-lg border border-zinc-800 text-zinc-400 hover:bg-zinc-800 disabled:opacity-30 transition-all"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="p-2 rounded-lg border border-zinc-800 text-zinc-400 hover:bg-zinc-800 disabled:opacity-30 transition-all"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Role Modal */}
            {editModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setEditModal(null)}>
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-white">Edit User Role</h3>
                            <button onClick={() => setEditModal(null)} className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="mb-6">
                            <p className="text-sm text-zinc-400 mb-4">
                                Change role for <span className="text-white font-medium">{editModal.first_name} {editModal.last_name}</span>
                            </p>
                            <div className="space-y-2">
                                {['user', 'admin', 'super_admin'].map((role) => (
                                    <label
                                        key={role}
                                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${editRole === role
                                                ? 'border-emerald-500/50 bg-emerald-500/5'
                                                : 'border-zinc-800 hover:border-zinc-700'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="role"
                                            value={role}
                                            checked={editRole === role}
                                            onChange={(e) => setEditRole(e.target.value)}
                                            className="sr-only"
                                        />
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${editRole === role ? 'border-emerald-500' : 'border-zinc-600'
                                            }`}>
                                            {editRole === role && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />}
                                        </div>
                                        {role === 'super_admin' && <Shield className="w-4 h-4 text-purple-400" />}
                                        {role === 'admin' && <Shield className="w-4 h-4 text-blue-400" />}
                                        {role === 'user' && <UserIcon className="w-4 h-4 text-zinc-400" />}
                                        <span className="text-sm text-white">{roleLabel[role]}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setEditModal(null)}
                                className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-800 text-zinc-400 text-sm font-medium hover:bg-zinc-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEditRole}
                                disabled={actionLoading}
                                className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                            >
                                {actionLoading ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setDeleteModal(null)}>
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white">Delete User</h3>
                            <button onClick={() => setDeleteModal(null)} className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-sm text-zinc-400 mb-6">
                            Are you sure you want to delete <span className="text-white font-medium">{deleteModal.first_name} {deleteModal.last_name}</span>?
                            This will permanently remove their account, subscriptions, and transaction history.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteModal(null)}
                                className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-800 text-zinc-400 text-sm font-medium hover:bg-zinc-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={actionLoading}
                                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
                            >
                                {actionLoading ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminUsers;
