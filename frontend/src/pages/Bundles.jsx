import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllBundles } from '../services/bundle.service';
import PriceTag from '../components/PriceTag';
import { PackageOpen, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import placeholderImg from '../assets/wood_part_placeholder.png';

const Bundles = () => {
    const [bundles, setBundles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBundles = async () => {
            try {
                const data = await getAllBundles();
                setBundles(data.data.bundles);
            } catch (error) {
                toast.error('Failed to load bundles');
            } finally {
                setLoading(false);
            }
        };
        fetchBundles();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f8f9fc] flex justify-center items-center">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8f9fc] pt-12 pb-24 font-sans selection:bg-black selection:text-white">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4 tracking-tight">
                        Premium Design Bundles
                    </h1>
                    <p className="text-lg text-gray-500 font-medium">
                        Save up to 80% by purchasing expertly curated collections of 3D reliefs and vectors.
                    </p>
                </div>

                {bundles.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl shadow-sm border border-gray-100 min-h-[400px]">
                        <PackageOpen size={64} className="mb-4 text-gray-300" />
                        <p className="text-xl font-bold text-gray-800">No bundles currently available</p>
                        <p className="text-base mt-2 text-gray-500 font-medium">Check back soon for new collections!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {bundles.map((bundle) => (
                            <Link key={bundle._id} to={`/bundle/${bundle._id}`} className="group bg-white rounded-[2rem] p-4 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 flex flex-col h-full cursor-pointer relative overflow-hidden">
                                <div className="absolute top-8 left-8 bg-blue-600 text-white px-3 py-1.5 rounded-full font-bold text-xs shadow-md z-10 flex items-center gap-1.5">
                                    <Sparkles size={14} className="fill-current" /> BUNDLE DEAL
                                </div>
                                <figure className="relative aspect-[4/3] w-full rounded-[1.5rem] overflow-hidden bg-gray-50 mb-6 shrink-0 border border-gray-100">
                                    <img src={bundle.previewImage || placeholderImg} alt={bundle.title} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-700" />
                                </figure>
                                <div className="px-2 pb-2 flex flex-col grow justify-between">
                                    <div>
                                        <h2 className="text-xl font-black text-gray-900 leading-snug mb-2 group-hover:text-blue-600 transition-colors">{bundle.title}</h2>
                                        <p className="text-sm font-medium text-gray-400 mb-4 line-clamp-2">{bundle.description}</p>
                                    </div>
                                    <div className="flex items-center justify-between mt-auto">
                                        <span className="text-sm font-bold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">{bundle.designs.length} Designs</span>
                                        <div className="bg-[#111] text-white px-4 py-2 rounded-full font-black text-sm shadow-md group-hover:bg-blue-600 transition-colors">
                                            <PriceTag price={bundle.price} />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Bundles;
