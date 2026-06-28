import { useState } from "react";

interface PriceRange {
    min_price: number;
    max_price: number;
}

interface UsePriceFilterProps {
    onApply: (range: PriceRange) => void;
    max?: number;
}

export const usePriceFilter = ({ onApply, max = 10000 }: UsePriceFilterProps) => {
    const [localRange, setLocalRange] = useState<PriceRange>({
        min_price: 0,
        max_price: max,
    });

    const handleMinChange = (value: number) => {
        if (value >= localRange.max_price) return;
        setLocalRange(prev => ({ ...prev, min_price: value }));
    };

    const handleMaxChange = (value: number) => {
        if (value <= localRange.min_price) return;
        setLocalRange(prev => ({ ...prev, max_price: value }));
    };

    const handleApply = () => {
        onApply(localRange);
    };

    const handleClear = () => {
        setLocalRange({ min_price: 0, max_price: max });
        onApply({ min_price: 0, max_price: max });
    };

    return {
        localRange,
        handleMinChange,
        handleMaxChange,
        handleApply,
        handleClear,
    };
};