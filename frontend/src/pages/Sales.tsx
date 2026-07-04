
import { formatDatetime } from "../services/formatters";
import { OrderStatusEnum, type OrderStatus } from "../features/order/types/order.types";
import { useGetSalesOrdersQuery, useUpdateOrderStatusMutation } from "../features/order/queries/order.query";

export const Sales = () => {
    const { data, isError, isLoading } = useGetSalesOrdersQuery();
    const [updateOrderStatus] = useUpdateOrderStatusMutation();

    const getNextStatuses = (status: OrderStatus): OrderStatus[] => {
        switch (status) {
            case 'PROCESSING':
                return ['SHIPPED', 'CANCELLED'];
            case 'SHIPPED':
                return ['DELIVERED'];
            default:
                return [];
        }
    };

    const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
        try {
            await updateOrderStatus({ orderId, status }).unwrap();
        } catch (err) {
            console.error(err);
        }
    };

    if (isLoading) return <p>Carregando...</p>;
    if (isError) return <p>Erro ao carregar vendas</p>;

    return (
        <div className="py-4 flex flex-col gap-4">
            <h1 className="text-2xl">Minhas vendas</h1>
            <main className="flex flex-wrap gap-2">
                {data?.data.orders.length ? data.data.orders.map((order, i) => (
                    <div
                        key={order.id}
                        className="bg-white rounded-md shadow-md flex flex-col justify-between border border-gray-100 p-2 min-w-72"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium px-2 py-1 rounded-full border bg-gray-100 text-gray-600 border-gray-200">
                                {OrderStatusEnum[order.status]}
                            </span>
                            <div className="w-8 h-8 self-end flex justify-center items-center rounded-full border border-gray-200 text-sm">
                                {i + 1}
                            </div>
                        </div>

                        <div className="flex flex-col my-2">
                            <p className="text-sm text-gray-500">Comprador: {order.buyer?.name ?? 'Não identificado'}</p>
                            <p className="text-sm text-gray-500">Criado em: {formatDatetime(order.createdAt)}</p>
                            <p className="text-sm text-gray-500">Última atualização: {formatDatetime(order.updatedAt)}</p>
                        </div>

                        <div className="flex flex-col gap-2">
                            {order.items.map((item) => (
                                <div key={item.id} className="border-b border-gray-100">
                                    <p>{item.product.name}</p>
                                    <p className="text-sm text-gray-400">{item.quantity} x {item.unitPrice}</p>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between mt-3">
                            <h2 className="font-semibold">Total:</h2>
                            <h2 className="font-medium">
                                {order.totalPrice.toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL',
                                })}
                            </h2>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-3">
                            {getNextStatuses(order.status).map((status) => (
                                <button
                                    key={status}
                                    type="button"
                                    onClick={() => handleUpdateStatus(order.id, status)}
                                    className="px-2 py-1 text-xs border border-gray-300 rounded cursor-pointer hover:bg-gray-50"
                                >
                                    Marcar como {OrderStatusEnum[status]}
                                </button>
                            ))}
                        </div>
                    </div>
                )) : <p>Você não possui vendas no momento.</p>}
            </main>
        </div>
    )
}