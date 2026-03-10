import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getAdminStats, getAdminUsers, updateUserRole } from '../services/admin.service';
import { Users, FileBox, IndianRupee, Database, Image as ImageIcon, Cloud, BarChart3, AlertTriangle, Search, ChevronLeft, ChevronRight, ShieldCheck, Shield, X } from 'lucide-react';
import toast from 'react-hot-toast';

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ title, value, subValue, icon: Icon, color, isWarning }) => {
    const iconColors = {
        blue: "text-blue-500 bg-blue-50 border-blue-100",
        purple: "text-purple-500 bg-purple-50 border-purple-100",
        green: "text-green-500 bg-green-50 border-green-100",
        orange: "text-orange-500 bg-orange-50 border-orange-100",
        red: "text-red-500 bg-red-50 border-red-100",
        gray: "text-gray-500 bg-gray-50 border-gray-100"
    };
    const activeColorStr = isWarning ? iconColors['red'] : iconColors[color] || iconColors['gray'];

    return (
        <div className={`bg-white rounded-[2rem] p-6 shadow-sm border ${isWarning ? 'border-red-200 shadow-red-500/5' : 'border-gray-100'} relative overflow-hidden group hover:shadow-md transition-shadow`}>
            <div className={`absolute -bottom-4 -right-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity ${isWarning ? 'text-red-500' : 'text-gray-900'}`}>
                <Icon size={120} />
            </div>
            <div className="flex items-center gap-4 mb-4 relative z-10">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${activeColorStr}`}>
                    <Icon size={20} />
                </div>
                <h3 className="text-[15px] font-bold text-gray-500">{title}</h3>
            </div>
            <div className="relative z-10">
                <span className={`text-4xl font-black ${isWarning ? 'text-red-600' : 'text-gray-900'} tracking-tight`}>{value}</span>
                {subValue && <p className="text-sm text-gray-400 mt-3 font-medium border-t border-gray-50 pt-3">{subValue}</p>}
            </div>
        </div>
    );
};

// ─── User Management Section ──────────────────────────────────────────────────
const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [updatingId, setUpdatingId] = useState(null);
    const searchTimer = useRef(null);

    const fetchUsers = useCallback(async (p, s) => {
        setLoading(true);
        try {
            const data = await getAdminUsers(p, s);
            setUsers(data.users || []);
            setTotalPages(data.pages || 1);
            setTotal(data.total || 0);
        } catch (e) {
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers(page, search);
    }, [page, fetchUsers]);

    const handleSearch = (value) => {
        setSearch(value);
        setPage(1);
        clearTimeout(searchTimer.current);
        searchTimer.current = setTimeout(() => fetchUsers(1, value), 400);
    };

    const handleRoleToggle = async (user) => {
        const newRole = user.role === 'admin' ? 'user' : 'admin';
        try {
            setUpdatingId(user._id);
            await updateUserRole(user._id, newRole);
            setUsers(prev => prev.map(u => u._id === user._id ? { ...u, role: newRole } : u));
            toast.success(`${user.name} is now ${newRole === 'admin' ? 'an Admin' : 'a regular User'}`);
        } catch (e) {
            toast.error(e.response?.data?.error || 'Failed to update role');
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <div className="mt-16">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <Users size={14} className="text-blue-600" />
                    </span>
                    User Management
                    <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2.5 py-1 rounded-full">{total}</span>
                </h2>

                {/* Search */}
                <div className="flex items-center bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm w-full sm:w-72 gap-2">
                    <Search size={16} className="text-gray-400 shrink-0" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={e => handleSearch(e.target.value)}
                        className="bg-transparent border-none outline-none text-sm font-medium text-gray-700 placeholder-gray-400 w-full"
                    />
                    {search && (
                        <button onClick={() => handleSearch('')} className="text-gray-400 hover:text-black">
                            <X size={14} />
                        </button>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/60">
                                <th className="text-left px-6 py-4 font-bold text-gray-500 text-xs tracking-wider">USER</th>
                                <th className="text-left px-6 py-4 font-bold text-gray-500 text-xs tracking-wider">EMAIL</th>
                                <th className="text-left px-6 py-4 font-bold text-gray-500 text-xs tracking-wider">ROLE</th>
                                <th className="text-left px-6 py-4 font-bold text-gray-500 text-xs tracking-wider">PURCHASES</th>
                                <th className="text-left px-6 py-4 font-bold text-gray-500 text-xs tracking-wider">SUBSCRIPTION</th>
                                <th className="text-left px-6 py-4 font-bold text-gray-500 text-xs tracking-wider">JOINED</th>
                                <th className="text-right px-6 py-4 font-bold text-gray-500 text-xs tracking-wider">ACTION</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-32" /></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-40" /></td>
                                        <td className="px-6 py-4"><div className="h-6 bg-gray-100 rounded-full w-16" /></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-8" /></td>
                                        <td className="px-6 py-4"><div className="h-6 bg-gray-100 rounded-full w-20" /></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-24" /></td>
                                        <td className="px-6 py-4"><div className="h-8 bg-gray-100 rounded-xl w-24 ml-auto" /></td>
                                    </tr>
                                ))
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-16 text-gray-400 font-medium">
                                        No users found{search && ` for "${search}"`}
                                    </td>
                                </tr>
                            ) : (
                                users.map(user => (
                                    <tr key={user._id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                                                    {user.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-bold text-gray-900 truncate max-w-[140px]">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 font-medium">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                                                {user.role === 'admin' ? <ShieldCheck size={11} /> : <Shield size={11} />}
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-700">{user.purchasedDesigns?.length || 0}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${user.subscriptionStatus === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                                {user.subscriptionStatus === 'active' ? `Active (${user.downloadsRemaining} left)` : 'None'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400 font-medium text-xs">
                                            {new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleRoleToggle(user)}
                                                disabled={updatingId === user._id}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-wait ${user.role === 'admin' ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100' : 'bg-purple-50 text-purple-600 hover:bg-purple-100 border border-purple-100'}`}
                                            >
                                                {updatingId === user._id ? '...' : user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/40">
                        <p className="text-sm font-medium text-gray-400">
                            Page <span className="font-bold text-gray-700">{page}</span> of <span className="font-bold text-gray-700">{totalPages}</span>
                        </p>
                        <div className="flex gap-2">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(p => p - 1)}
                                className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <button
                                disabled={page === totalPages}
                                onClick={() => setPage(p => p + 1)}
                                className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────
const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getAdminStats();
                setStats(data.data);
            } catch (error) {
                toast.error(error.response?.data?.error || error.message || 'Failed to load admin dashboard metrics');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64 bg-[#f8f9fc]">
                <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!stats) return <div className="text-center font-medium text-gray-400 mt-10">No metrics available</div>;

    const { counts, revenue, storage } = stats;

    return (
        <div className="min-h-screen bg-[#f8f9fc] pb-24 font-sans selection:bg-black selection:text-white">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-12">

                {/* Header */}
                <div className="flex items-center gap-4 mb-10 border-b border-gray-200 pb-8">
                    <div className="p-3.5 bg-blue-50 rounded-2xl border border-blue-100">
                        <BarChart3 className="text-blue-600" size={28} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Platform Analytics</h1>
                        <p className="text-gray-500 font-medium text-sm mt-1">Live operational metrics and storage tracking</p>
                    </div>
                </div>

                {/* General App Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 xl:gap-8 mb-12">
                    <StatCard title="Total Users" value={counts.users} icon={Users} color="blue" />
                    <StatCard title="Total Designs" value={counts.designs} icon={FileBox} color="purple" />
                    <StatCard
                        title="Gross Revenue"
                        value={`₹${revenue.toLocaleString()}`}
                        icon={IndianRupee}
                        color="green"
                    />
                </div>

                {/* Infrastructure Tracker */}
                <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"><Database size={14} className="text-gray-600" /></span>
                        Infrastructure Limits Tracker
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 xl:gap-8 mb-10">
                        <StatCard
                            title="MongoDB Atlas (Free M0)"
                            value={`${storage.mongodb.dataSize} MB`}
                            subValue={`Limit: ${storage.mongodb.totalLimit || 512} MB • Storage used: ${storage.mongodb.storageSize} MB`}
                            icon={Database}
                            color="green"
                        />
                        <StatCard
                            title="Cloudinary Previews"
                            value={storage.cloudinary.status === 'Active' ? `${storage.cloudinary.storage} MB` : 'Offline'}
                            subValue={storage.cloudinary.status === 'Active' ? `Bandwidth: ${storage.cloudinary.bandwidth} MB • Plan: ${storage.cloudinary.plan}` : storage.cloudinary.error || 'API details missing.'}
                            icon={ImageIcon}
                            color="purple"
                            isWarning={storage.cloudinary.status !== 'Active'}
                        />
                        <StatCard
                            title="Cloudflare R2 Bucket"
                            value={storage.r2.status === 'Active' ? `${storage.r2.totalSize} MB` : 'Offline'}
                            subValue={storage.r2.status === 'Active' ? `Total Secured CNC Files: ${storage.r2.totalFiles} (Limit: 10GB/mo free)` : storage.r2.error || 'Bucket details missing.'}
                            icon={Cloud}
                            color="orange"
                            isWarning={storage.r2.status !== 'Active'}
                        />
                    </div>
                </div>

                {/* Admin Note */}
                <div className="bg-amber-50 border border-amber-200 rounded-[1.5rem] p-6 sm:p-8 flex items-start gap-4 shadow-sm">
                    <div className="p-3 bg-amber-100 rounded-xl shrink-0">
                        <AlertTriangle className="text-amber-600" size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-amber-900 mb-1">Admin Infrastructure Note</h3>
                        <div className="text-sm font-medium text-amber-800/80 leading-relaxed max-w-4xl">
                            The MongoDB Atlas Free cluster (M0) limits data to 512MB and implements heavy connection throttles. Cloudflare R2 provides up to 10GB of egress free monthly. Monitor usage closely as the CNC market scales to anticipate service billing.
                        </div>
                    </div>
                </div>

                {/* ── User Management ── */}
                <UserManagement />

            </div>
        </div>
    );
};

export default AdminDashboard;
