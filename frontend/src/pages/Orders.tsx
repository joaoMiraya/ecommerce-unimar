import { Order } from "../features/order/components/Order";
import { useGetAllOrdersQuery } from "../features/order/queries/order.query"


export const Orders = () => {
    const {data, isError, isLoading} = useGetAllOrdersQuery();

    if (isLoading) return <p>Carregando...</p>
    if (isError) return <p>Erro ao carregar pedidos</p>

    return (
        <div className="py-4 flex flex-col gap-4">
            <h1 className="text-2xl">Meus pedidos</h1>
            <main className="flex flex-wrap gap-2">
                {data?.data.orders.map((order, i) => (
                    <Order key={order.id} index={i} order={order} />
                ))}
            </main>
        </div>
    )
}