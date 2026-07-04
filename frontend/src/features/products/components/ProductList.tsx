import { Product } from "./Product"
import { useGetAllQuery } from "../queries/product.query"
import type { ProductRequest } from "../types/product.types";
import { useState, type Dispatch, type SetStateAction } from "react";
import { ArrowBendDownLeftIcon, ArrowBendDownRightIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
import { PriceFilter } from "./PriceFilter";

export const ProductList = () => {
    const [filters, setFilters] = useState<ProductRequest>({ page: 1, limit: 25 });
    const [isFilterOpen, setIsFilterOpen] = useState<boolean>(
        () => window.innerWidth >= 640
    );

    const { data, isLoading, isError } = useGetAllQuery(filters);

    const handleSearch = (name: string) => setFilters(prev => ({ ...prev, name, page: 1 }));
    const handleSearchBySeller = (seller: string) => setFilters(prev => ({ ...prev, seller, page: 1 }));
    const handleClearFilters = () => { const { page, limit } = filters; setFilters({ page, limit }); };
    const handlePriceRange = ({ min_price, max_price }: { min_price: number; max_price: number }) => {
        setFilters(prev => ({
            ...prev,
            min_price: min_price > 0 ? min_price : undefined,
            max_price: max_price > 0 ? max_price : undefined,
            page: 1,
        }));
    };

    if (isLoading) return <p>Carregando...</p>;
    if (isError) return <p>Erro ao carregar produtos.</p>;

    return (
        <div className="flex h-screen overflow-hidden">
            {isFilterOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-20 sm:hidden"
                    onClick={() => setIsFilterOpen(false)}
                />
            )}

            <ProductFilters
                filters={filters}
                handleSearch={handleSearch}
                handleSearchBySeller={handleSearchBySeller}
                handleClearFilters={handleClearFilters}
                handlePriceRange={handlePriceRange}
                isOpen={isFilterOpen}
                setIsOpen={setIsFilterOpen}
            />

            <main className="flex-1 overflow-y-auto p-4">
                {!isFilterOpen && (
                    <button
                        onClick={() => setIsFilterOpen(true)}
                        className="mb-4 border border-gray-200 rounded-md cursor-pointer p-2 hover:bg-gray-50 transition-colors"
                        aria-label="Abrir filtros"
                    >
                        <ArrowBendDownRightIcon size={24} />
                    </button>
                )}
                {
                    data?.data.products.meta?.total && data?.data.products.meta?.total > 0 ? 
                    <div className="flex flex-wrap gap-4">
                        {data?.data.products.data.map((product) => (
                            <Product key={product.id} product={product} />
                        ))}
                    </div>
                    : <p className="text-center">Nenhum produto disponível</p>
                }
            </main>
        </div>
    );
};

interface ProductFiltersProps {
    filters: ProductRequest;
    handleSearch: (name: string) => void;
    handleSearchBySeller: (seller: string) => void;
    handleClearFilters: () => void;
    handlePriceRange: ({ min_price, max_price }: { min_price: number; max_price: number }) => void;
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const ProductFilters = (props: ProductFiltersProps) => {
    const { filters, handleSearch, handleSearchBySeller, handleClearFilters, handlePriceRange, isOpen, setIsOpen } = props;

    return (
        <aside
            className={[
                "flex flex-col gap-2 border-r border-gray-200 py-4 px-4 w-64 shrink-0 overflow-y-auto",
                "fixed top-0 left-0 h-full z-30 bg-white transition-transform duration-300",
                isOpen ? "translate-x-0" : "-translate-x-full",
                "sm:translate-x-0 sm:h-screen sm:sticky sm:top-0 sm:z-auto sm:bg-transparent",
                !isOpen ? "sm:hidden" : "sm:flex sm:flex-col",
            ].join(" ")}
        >
            <div className="flex justify-between items-center">
                <h2 className="font-semibold">Filtros</h2>
                <button
                    onClick={() => setIsOpen(false)}
                    className="shadow-inner rounded-full cursor-pointer p-2 hover:bg-gray-100 transition-colors"
                    aria-label="Fechar filtros"
                >
                    <ArrowBendDownLeftIcon size={24} />
                </button>
            </div>

            <div className="flex border border-gray-200 rounded-md">
                <input
                    className="outline-none pl-2 w-full"
                    type="text"
                    name="search"
                    value={filters.name ?? ''}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Procure pelo produto"
                />
                <MagnifyingGlassIcon size={32} color="#e5e7eb" />
            </div>

            <div className="flex border border-gray-200 rounded-md">
                <input
                    className="outline-none pl-2 w-full"
                    type="text"
                    name="seller"
                    value={filters.seller ?? ''}
                    onChange={(e) => handleSearchBySeller(e.target.value)}
                    placeholder="Procure pelo vendedor"
                />
                <MagnifyingGlassIcon size={32} color="#e5e7eb" />
            </div>

            <button
                className="bg-[#D1AC2B] text-white cursor-pointer rounded-md py-1 hover:bg-[#b8941f] transition-colors"
                onClick={handleClearFilters}
            >
                Limpar
            </button>

            <PriceFilter onApply={handlePriceRange} max={10000} />
        </aside>
    );
};