import { useState } from "react";
import type { Pagination } from "../../../constants/api";
import { useOwnQuery } from "../queries/product.query";
import { Product } from "./Product";

export const OwnProducts = () => {
    const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 25 });
    const { data, isLoading, isError } = useOwnQuery(pagination);


    if (isLoading) return <p>Carregando...</p>;
    if (isError) return <p>Erro ao carregar produtos.</p>;
    return (
        <div>
            <h2 className="text-2xl mb-4">Seus produtos</h2>
                {
                    data?.data.products.meta?.total && data?.data.products.meta?.total > 0 ? 
                    <div className="flex flex-wrap gap-4">
                        {data?.data.products.data.map((product) => (
                            <Product onlyView={true} key={product.id} product={product} />
                        ))}
                    </div>
                    : <p className="text-center">Você não tem nenhum produto cadastrado</p>
                }
        </div>
    )
};
