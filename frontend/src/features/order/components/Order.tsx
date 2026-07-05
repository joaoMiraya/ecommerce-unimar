import { formatDatetime } from "../../../services/formatters";
import { useCancelOrderMutation } from "../queries/order.query";
import { OrderStatusEnum, type Order as OrderType } from '../types/order.types';

type OrderProps = {
    order: OrderType;
    index: number;
}

const STATUS_STYLES: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    PROCESSING: 'bg-blue-100 text-blue-700 border-blue-200',
    SHIPPED: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    DELIVERED: 'bg-green-100 text-green-700 border-green-200',
    CANCELLED: 'bg-red-100 text-red-600 border-red-200',
};

export const Order = (props: OrderProps) => {
    const { order, index } = props;
    const [cancelOrder] = useCancelOrderMutation();
    const isCancelled = order.status === 'CANCELLED';
    const isDelivered = order.status === 'DELIVERED';

    const handleCancelOrder = async (orderId: string) => {
        try {
            await cancelOrder(orderId).unwrap();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div
            key={index}
            className={`bg-white rounded-md shadow-md flex flex-col justify-between border p-2 transition-opacity
                ${isCancelled ? 'border-gray-100 opacity-60 grayscale-30' : 'border-gray-100'}`}
        >
            <div className="flex items-center justify-between">
                <span
                    className={`text-xs font-medium px-2 py-1 rounded-full border ${STATUS_STYLES[order.status] ?? 'bg-gray-100 text-gray-600 border-gray-200'}`}
                >
                    {OrderStatusEnum[order.status]}
                </span>
                <div className="w-8 h-8 self-end flex justify-center items-center rounded-full border border-gray-200 text-sm">
                    {index + 1}
                </div>
            </div>

            <div className="flex flex-col my-2">
                <p className="text-sm text-gray-500">Criado em: {formatDatetime(order.createdAt)}</p>
                <p className="text-sm text-gray-500">Última atualização: {formatDatetime(order.updatedAt)}</p>
            </div>

            <div className="flex flex-col gap-2">
                {order.items.map((item) => (
                    <div key={item.id} className="border-b border-gray-100">
                        <p className={isCancelled ? 'text-gray-500' : ''}>{item.product.name}</p>
                        <p className="text-sm text-gray-400">{item.quantity} x {item.unitPrice}</p>
                    </div>
                ))}
            </div>

            {!isCancelled && !isDelivered && (
                <button
                    className="underline text-red-400 hover:text-red-500 self-end cursor-pointer my-4 text-sm"
                    onClick={() => handleCancelOrder(order.id)}
                >
                    Cancelar
                </button>
            )}

            <div className="flex justify-between mt-2">
                <h2 className="font-semibold">Total:</h2>
                <h2 className={`font-medium self-end ${isCancelled ? 'text-gray-500 line-through' : ''}`}>
                    {order.totalPrice.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                    })}
                </h2>
            </div>
        </div>
    )
}