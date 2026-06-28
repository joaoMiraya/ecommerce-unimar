import { usePriceFilter } from "../../../hooks/usePriceFilter";

interface PriceFilterProps {
    onApply: (range: { min_price: number; max_price: number }) => void;
    max?: number;
}

export const PriceFilter = ({ onApply, max = 10000 }: PriceFilterProps) => {
    const {
        localRange,
        handleMinChange,
        handleMaxChange,
        handleApply,
        handleClear,
    } = usePriceFilter({ onApply, max });

    return (
        <div className="flex flex-col gap-3 p-2 border border-gray-200 rounded-md shadow-inner">
            <h3 className="text-sm font-medium">Faixa de preço</h3>
            <div className="flex items-center gap-2">
                <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-500">Mín.</label>
                    <input
                        type="number"
                        className="w-20 border border-gray-200 rounded-md px-2 py-1 outline-none text-sm"
                        value={localRange.min_price}
                        min={0}
                        max={localRange.max_price - 1}
                        onChange={(e) => handleMinChange(Number(e.target.value))}
                    />
                </div>
                <span className="mt-4 text-gray-400">—</span>
                <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-500">Máx.</label>
                    <input
                        type="number"
                        className="w-20 border border-gray-200 rounded-md px-2 py-1 outline-none text-sm"
                        value={localRange.max_price}
                        min={localRange.min_price + 1}
                        max={max}
                        onChange={(e) => handleMaxChange(Number(e.target.value))}
                    />
                </div>
            </div>
            <div className="relative flex flex-col gap-1">
                <input
                    type="range"
                    className="w-full accent-[#D1AC2B]"
                    min={0}
                    max={max}
                    value={localRange.min_price}
                    onChange={(e) => handleMinChange(Number(e.target.value))}
                />
                <input
                    type="range"
                    className="w-full accent-[#D1AC2B]"
                    min={0}
                    max={max}
                    value={localRange.max_price}
                    onChange={(e) => handleMaxChange(Number(e.target.value))}
                />
            </div>
            <p className="text-xs text-gray-400">
                R$ {localRange.min_price.toLocaleString('pt-BR')} — R$ {localRange.max_price.toLocaleString('pt-BR')}
            </p>
            <div className="flex gap-2">
                <button
                    className="flex-1 bg-[#D1AC2B] cursor-pointer text-white text-sm py-1.5"
                    onClick={handleApply}
                >
                    Aplicar
                </button>
                <button
                    className="flex-1 border border-gray-200 cursor-pointer text-sm py-1.5"
                    onClick={handleClear}
                >
                    Limpar
                </button>
            </div>
        </div>
    );
};