import React from 'react';
import { formatPrice } from '../utils/formatPrice';

const PriceTag = ({ price }) => {
    if (price === 0) {
        return (
            <span className="font-bold">
                Free
            </span>
        );
    }

    return (
        <span className="font-bold tracking-tight">
            {formatPrice(price)}
        </span>
    );
};

export default PriceTag;
