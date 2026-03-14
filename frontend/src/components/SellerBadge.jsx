import React from 'react';

const tierConfig = {
    verified: {
        label: 'Verified',
        color: 'bg-blue-100 text-blue-700 border-blue-200',
        icon: (
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
        ),
        description: 'Identity verified seller'
    },
    pro: {
        label: 'Pro',
        color: 'bg-purple-100 text-purple-700 border-purple-200',
        icon: (
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
        ),
        description: 'Professional seller with premium support'
    },
    topSeller: {
        label: 'Top Seller',
        color: 'bg-amber-100 text-amber-700 border-amber-200',
        icon: (
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5 3l14 9-14 9-3.5-7 9.5-2z"/>
            </svg>
),
        description: 'Top rated seller with 50+ sales'
    }
};

const SellerBadge = ({ tier = 'none', showLabel = true, size = 'md' }) => {
    if (tier === 'none' || !tierConfig[tier]) {
        return null;
    }

    const config = tierConfig[tier];
    
    const sizeClasses = {
        sm: 'px-1.5 py-0.5 text-[10px]',
        md: 'px-2 py-1 text-xs',
        lg: 'px-3 py-1.5 text-sm'
    };

    return (
        <div className="inline-flex items-center gap-1" title={config.description}>
            <span className={`inline-flex items-center gap-1 rounded-full font-semibold border ${config.color} ${sizeClasses[size]}`}>
                {config.icon}
                {showLabel && <span>{config.label}</span>}
            </span>
        </div>
    );
};

export const SellerTierIndicator = ({ totalSales, averageRating, tier }) => {
    const getTierFromStats = () => {
        if (tier === 'topSeller' || totalSales >= 50) return 'topSeller';
        if (tier === 'pro' || totalSales >= 20) return 'pro';
        if (tier === 'verified' || totalSales >= 5) return 'verified';
        return 'none';
    };

    const calculatedTier = getTierFromStats();

    return (
        <div className="flex items-center gap-3">
            <SellerBadge tier={calculatedTier} />
            {totalSales > 0 && (
                <span className="text-xs text-gray-500">
                    {totalSales} sale{totalSales !== 1 ? 's' : ''}
                </span>
            )}
            {averageRating > 0 && (
                <span className="flex items-center gap-1 text-xs text-amber-600">
                    <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                    {averageRating.toFixed(1)}
                </span>
            )}
        </div>
    );
};

export default SellerBadge;
