import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getBundleById, createBundleOrder } from '../services/bundle.service';
import { AuthContext } from '../context/AuthContext';
import PriceTag from '../components/PriceTag';
import { Clock, ShieldCheck, Download, PackageOpen, LayoutGrid, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import NotFound from './NotFound';
import placeholderImg from '../assets/wood_part_placeholder.png';

const BundleDetails = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [bundle, setBundle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        const fetchBundle = async () => {
            try {
                const res = await getBundleById(id);
                setBundle(res.bundle);
            } catch (error) {
                toast.error('Failed to load bundle details');
            } finally {
                setLoading(false);
            }
        };
        fetchBundle();
    }, [id]);

    const handleCheckout = async () => {
        if (!user) {
            toast.error('Please login to purchase bundles');
            navigate('/login');
            return;
        }

        try {
            setProcessing(true);
            const orderData = await createBundleOrder(id);

            if (orderData.sessionUrl) {
                window.location.href = orderData.sessionUrl;
            } else {
                toast.error('Failed to initialize checkout session');
                setProcessing(false);
            }
        } catch (error) {
            toast.error(error.response?.data?.error || error.message || 'Failed to initialize checkout');
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f8f9fc] flex justify-center items-center">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!bundle) return <NotFound />;

    const originalValue = bundle.designs.reduce((acc, curr) => acc + curr.price, 0);

    return (
        <div className="min-h-screen bg-[#f8f9fc] pt-8 pb-24 font-sans selection:bg-black selection:text-white">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
                <div className="text-sm font-medium text-gray-400 mb-8 flex items-center gap-2">
                    <Link to="/" className="hover:text-black transition-colors">Home</Link>
                    <span>/</span>
                    <Link to="/bundles" className="hover:text-black transition-colors">Bundles</Link>
                    <span>/</span>
                    <span className="text-gray-900 truncate max-w-[200px]">{bundle.title}</span>
                </div>

                <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-12 lg:gap-16 mb-16">
                    <div className="lg:w-1/2 flex flex-col justify-center">
                        <div className="inline-block bg-blue-100 text-blue-800 px-4 py-1.5 rounded-full font-bold text-sm shadow-sm mb-6 w-max border border-blue-200">
                            EXCLUSIVE BUNDLE
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4 tracking-tight leading-[1.1]">
                            {bundle.title}
                        </h1>
                        <p className="text-lg text-gray-500 font-medium mb-8 leading-relaxed">
                            {bundle.description}
                        </p>

                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-8">
                            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                                <span className="font-bold text-gray-500">Includes</span>
                                <span className="font-black text-gray-900 text-lg">{bundle.designs.length} Premium Designs</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="font-bold text-gray-400 block text-sm line-through decoration-red-400">Total Value: ₹{originalValue}</span>
                                    <span className="font-black text-4xl text-gray-900 tracking-tighter">₹{bundle.price}</span>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    disabled={processing}
                                    className="px-8 py-4 bg-blue-600 text-white rounded-full font-bold text-lg hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/20 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-wait"
                                >
                                    {processing ? "Starting Checkout..." : "Buy Bundle Now"}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="lg:w-1/2 flex items-center justify-center">
                        <figure className="w-full aspect-[4/3] rounded-[2rem] overflow-hidden bg-gray-50 shrink-0 border border-gray-100 shadow-md">
                            <img src={bundle.previewImage} alt="Bundle preview" className="w-full h-full object-cover" />
                        </figure>
                    </div>
                </div>

                <div className="flex items-center gap-3 mb-10">
                    <LayoutGrid size={28} className="text-blue-500" />
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Included in this bundle</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {bundle.designs.map(design => (
                        <Link key={design._id} to={`/design/${design._id}`} className="group bg-white rounded-3xl p-3 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col h-full cursor-pointer relative">
                            <div className="absolute top-6 left-6 w-8 h-8 rounded-full bg-green-500 text-white flex justify-center items-center shadow-md z-10 border-2 border-white">
                                <CheckCircle2 size={16} />
                            </div>
                            <figure className="relative aspect-[4/3] w-full rounded-[1.5rem] overflow-hidden bg-gray-50 mb-4 shrink-0">
                                <img src={design.previewImages?.[0] || placeholderImg} alt={design.title} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                            </figure>
                            <div className="px-2 pb-2">
                                <h3 className="text-md font-bold text-gray-900 leading-snug truncate group-hover:text-blue-600 transition-colors">{design.title}</h3>
                                <div className="text-gray-400 font-bold text-sm line-through mt-1">₹{design.price}</div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BundleDetails;
