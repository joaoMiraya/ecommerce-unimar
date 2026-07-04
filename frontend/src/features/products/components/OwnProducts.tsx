import { useState } from "react";
import type { Pagination } from "../../../constants/api";
import { useOwnQuery } from "../queries/product.query";
import { Product } from "./Product";
import { Pagination as PaginationComponent } from "../../../components/Pagination";

export const OwnProducts = () => {
    const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10 });
    const { data, isLoading, isError } = useOwnQuery(pagination);
    const currentPage = data?.data.products.meta.page ?? pagination.page;
    const totalPages = data?.data.products.meta.totalPages ?? 1;
    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages || page === currentPage) return;
        setPagination((prev) => ({ ...prev, page }));
    };


    if (isLoading) return <p>Carregando...</p>;
    if (isError) return <p>Erro ao carregar produtos.</p>;
    return (
        <div className="flex h-[30rem] flex-col">
            <h2 className="text-2xl mb-4">Seus produtos</h2>
                {
                    data?.data.products.meta?.total && data?.data.products.meta?.total > 0 ? 
                    <div className="flex h-full flex-col">
                        <div className="flex-1 overflow-y-auto">
                        <div className="flex flex-wrap gap-4 pb-2">
                            {data?.data.products.data.map((product) => (
                                <Product onlyView={true} key={product.id} product={product} />
                            ))}
                        </div>
                        </div>
                        <div className="mt-3 border-t border-gray-100 pt-3">
                        <PaginationComponent
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                        </div>
                    </div>
                    : <p className="text-center">Você não tem nenhum produto cadastrado</p>
                }
        </div>
    )
};
