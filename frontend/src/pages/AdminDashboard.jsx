import React, { useState, useEffect } from 'react';
import { getAdminStats } from '../services/admin.service';
import { Users, FileBox, IndianRupee, Database, Image as ImageIcon, Cloud, BarChart3, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

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
            {/* Background Icon */}
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
                        {/* Database */}
                        <StatCard
                            title="MongoDB Atlas (Free M0)"
                            value={`${storage.mongodb.dataSize} MB`}
                            subValue={`Limit: ${storage.mongodb.totalLimit || 512} MB • Storage used: ${storage.mongodb.storageSize} MB`}
                            icon={Database}
                            color="green"
                        />

                        {/* Cloudinary */}
                        <StatCard
                            title="Cloudinary Previews"
                            value={storage.cloudinary.status === 'Active' ? `${storage.cloudinary.storage} MB` : 'Offline'}
                            subValue={storage.cloudinary.status === 'Active' ? `Bandwidth: ${storage.cloudinary.bandwidth} MB • Plan: ${storage.cloudinary.plan}` : storage.cloudinary.error || 'API details missing.'}
                            icon={ImageIcon}
                            color="purple"
                            isWarning={storage.cloudinary.status !== 'Active'}
                        />

                        {/* Cloudflare R2 */}
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
            </div>
        </div>
    );
};

export default AdminDashboard;
