import React, { useState } from 'react';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';

const fileTypes = [
    { value: 'dxf', label: 'DXF', color: 'bg-blue-100 text-blue-700' },
    { value: 'stl', label: 'STL', color: 'bg-purple-100 text-purple-700' },
    { value: 'svg', label: 'SVG', color: 'bg-green-100 text-green-700' },
    { value: 'rar', label: 'RAR', color: 'bg-amber-100 text-amber-700' },
    { value: 'rar4', label: 'RAR4', color: 'bg-orange-100 text-orange-700' },
    { value: 'zip', label: 'ZIP', color: 'bg-slate-100 text-slate-700' },
];

const priceRanges = [
    { value: '0-100', label: 'Under ₹100', min: 0, max: 100 },
    { value: '100-500', label: '₹100 - ₹500', min: 100, max: 500 },
    { value: '500-1000', label: '₹500 - ₹1000', min: 500, max: 1000 },
    { value: '1000-5000', label: '₹1000 - ₹5000', min: 1000, max: 5000 },
    { value: '5000+', label: 'Above ₹5000', min: 5000, max: null },
];

const complexityLevels = [
    { value: 'beginner', label: 'Beginner', color: 'bg-green-100 text-green-700' },
    { value: 'intermediate', label: 'Intermediate', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'advanced', label: 'Advanced', color: 'bg-red-100 text-red-700' },
    { value: 'expert', label: 'Expert', color: 'bg-purple-100 text-purple-700' },
];

const AdvancedFilters = ({ onFilterChange, initialFilters = {} }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState(initialFilters.search || '');
    const [selectedFileTypes, setSelectedFileTypes] = useState(initialFilters.fileTypes || []);
    const [selectedPriceRange, setSelectedPriceRange] = useState(initialFilters.priceRange || '');
    const [selectedComplexity, setSelectedComplexity] = useState(initialFilters.complexity || []);
    const [sortBy, setSortBy] = useState(initialFilters.sortBy || 'newest');

    const handleFileTypeToggle = (type) => {
        const updated = selectedFileTypes.includes(type)
            ? selectedFileTypes.filter(t => t !== type)
            : [...selectedFileTypes, type];
        setSelectedFileTypes(updated);
    };

    const handleComplexityToggle = (level) => {
        const updated = selectedComplexity.includes(level)
            ? selectedComplexity.filter(l => l !== level)
            : [...selectedComplexity, level];
        setSelectedComplexity(updated);
    };

    const handleApplyFilters = () => {
        onFilterChange({
            search: searchQuery,
            fileTypes: selectedFileTypes,
            priceRange: selectedPriceRange,
            complexity: selectedComplexity,
            sortBy,
        });
        setIsOpen(false);
    };

    const handleClearFilters = () => {
        setSearchQuery('');
        setSelectedFileTypes([]);
        setSelectedPriceRange('');
        setSelectedComplexity([]);
        setSortBy('newest');
        onFilterChange({
            search: '',
            fileTypes: [],
            priceRange: '',
            complexity: [],
            sortBy: 'newest',
        });
    };

    const hasActiveFilters = selectedFileTypes.length > 0 || 
        selectedPriceRange || 
        selectedComplexity.length > 0 || 
        searchQuery;

    return (
        <div className="mb-8">
            {/* Search and Filter Toggle Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search designs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:border-[#111] focus:ring-0 text-gray-900 font-medium bg-white"
                    />
                </div>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold transition-colors ${
                        isOpen || hasActiveFilters 
                            ? 'bg-[#111] text-white' 
                            : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                >
                    <SlidersHorizontal size={18} />
                    Filters
                    {hasActiveFilters && (
                        <span className="ml-1 px-2 py-0.5 bg-white text-[#111] rounded-full text-xs">
                            {selectedFileTypes.length + (selectedPriceRange ? 1 : 0) + selectedComplexity.length}
                        </span>
                    )}
                </button>
            </div>

            {/* Filter Panel */}
            {isOpen && (
                <div className="bg-white rounded-3xl border border-gray-200 p-6 mb-6 animate-in slide-in-from-top-2 duration-200">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* File Type Filter */}
                        <div>
                            <h4 className="font-bold text-gray-900 mb-3">File Type</h4>
                            <div className="flex flex-wrap gap-2">
                                {fileTypes.map((type) => (
                                    <button
                                        key={type.value}
                                        onClick={() => handleFileTypeToggle(type.value)}
                                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                                            selectedFileTypes.includes(type.value)
                                                ? type.color + ' ring-2 ring-offset-1 ring-' + type.color.split(' ')[1]
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        {type.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Price Range Filter */}
                        <div>
                            <h4 className="font-bold text-gray-900 mb-3">Price Range</h4>
                            <div className="relative">
                                <select
                                    value={selectedPriceRange}
                                    onChange={(e) => setSelectedPriceRange(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#111] focus:ring-0 text-gray-700 font-medium bg-white appearance-none cursor-pointer"
                                >
                                    <option value="">All Prices</option>
                                    {priceRanges.map((range) => (
                                        <option key={range.value} value={range.value}>
                                            {range.label}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Complexity Filter */}
                        <div>
                            <h4 className="font-bold text-gray-900 mb-3">Complexity</h4>
                            <div className="flex flex-wrap gap-2">
                                {complexityLevels.map((level) => (
                                    <button
                                        key={level.value}
                                        onClick={() => handleComplexityToggle(level.value)}
                                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                                            selectedComplexity.includes(level.value)
                                                ? level.color + ' ring-2 ring-offset-1 ring-' + level.color.split(' ')[1]
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        {level.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sort By */}
                        <div>
                            <h4 className="font-bold text-gray-900 mb-3">Sort By</h4>
                            <div className="relative">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#111] focus:ring-0 text-gray-700 font-medium bg-white appearance-none cursor-pointer"
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="popular">Most Popular</option>
                                    <option value="rating">Highest Rated</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-100">
                        {hasActiveFilters && (
                            <button
                                onClick={handleClearFilters}
                                className="px-6 py-2.5 rounded-full font-bold text-gray-600 hover:bg-gray-100 transition-colors flex items-center gap-2"
                            >
                                <X size={16} /> Clear All
                            </button>
                        )}
                        <button
                            onClick={handleApplyFilters}
                            className="px-6 py-2.5 bg-[#111] text-white rounded-full font-bold hover:bg-gray-800 transition-colors"
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            )}

            {/* Active Filter Tags */}
            {hasActiveFilters && !isOpen && (
                <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="text-sm text-gray-500 font-medium">Active Filters:</span>
                    {selectedFileTypes.map((type) => (
                        <span key={type} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold">
                            {type.toUpperCase()}
                            <button onClick={() => handleFileTypeToggle(type)} className="hover:text-blue-900">
                                <X size={14} />
                            </button>
                        </span>
                    ))}
                    {selectedPriceRange && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-semibold">
                            {priceRanges.find(r => r.value === selectedPriceRange)?.label}
                            <button onClick={() => setSelectedPriceRange('')} className="hover:text-green-900">
                                <X size={14} />
                            </button>
                        </span>
                    )}
                    {selectedComplexity.map((level) => (
                        <span key={level} className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-semibold">
                            {complexityLevels.find(l => l.value === level)?.label}
                            <button onClick={() => handleComplexityToggle(level)} className="hover:text-purple-900">
                                <X size={14} />
                            </button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdvancedFilters;
