import { useDispatch, useSelector } from "react-redux";
import { ShoppingCartIcon, TrashIcon, PlusIcon, MinusIcon, ArrowLeftIcon } from "@phosphor-icons/react";
import type { AppDispatch } from "../store/store";
import { selectCartItems, selectCartTotal } from "../features/cart/store/cart.selectors";
import { clearCart, decrementQuantity, incrementQuantity, removeItem } from "../features/cart/store/cart_slice";
import { Link } from "react-router";
import { useCreateOrderMutation } from "../features/order/queries/order.query";
import type { OrderRequest } from "../features/order/types/order.types";

export const Cart = () => {
    const dispatch = useDispatch<AppDispatch>();
    const items = useSelector(selectCartItems);
    const total = useSelector(selectCartTotal);
    const [createOrder] = useCreateOrderMutation();

    const handleCheckout = async () => {
        const orderPayload: OrderRequest = {
            items: items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
            })),
        };
        await createOrder(orderPayload).then(() => {
            dispatch(clearCart());
        }).catch((err) => {
            console.error(err)
        });
    };

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-screen gap-4 text-gray-500">
                <ShoppingCartIcon size={64} weight="thin" />
                <p className="text-lg font-medium">Seu carrinho está vazio</p>
                <Link
                    to="/"
                    className="flex items-center gap-2 text-[#D1AC2B] hover:text-[#b8941f] transition-colors font-medium"
                >
                    <ArrowLeftIcon size={18} />
                    Ver produtos
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-lg sm:text-xl font-semibold">Carrinho</h1>
                    <Link
                        to="/"
                        className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <ArrowLeftIcon size={16} />
                        <span className="hidden sm:inline">Continuar comprando</span>
                        <span className="sm:hidden">Voltar</span>
                    </Link>
                </div>
                <ul className="flex flex-col divide-y divide-gray-100">
                    {items.map(({ product, quantity }) => (
                        <li key={product.id} className="py-4">
                            <div className="flex gap-3 sm:gap-4 sm:items-center">
                                <img
                                    src="/public/product_cover.png"
                                    alt={product.name}
                                    className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-md bg-gray-100 shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm sm:text-base truncate">{product.name}</p>
                                    <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
                                        {product.price.toLocaleString("pt-BR", {
                                            style: "currency",
                                            currency: "BRL",
                                        })}{" "}cada
                                    </p>
                                    <div className="flex items-center justify-between mt-3 sm:hidden">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => dispatch(decrementQuantity(product.id))}
                                                className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
                                                aria-label="Diminuir quantidade"
                                            >
                                                <MinusIcon size={13} />
                                            </button>
                                            <span className="w-5 text-center font-medium tabular-nums text-sm">
                                                {quantity}
                                            </span>
                                            <button
                                                onClick={() => dispatch(incrementQuantity(product.id))}
                                                className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
                                                aria-label="Aumentar quantidade"
                                            >
                                                <PlusIcon size={13} />
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <p className="font-medium text-sm tabular-nums">
                                                {(product.price * quantity).toLocaleString("pt-BR", {
                                                    style: "currency",
                                                    currency: "BRL",
                                                })}
                                            </p>
                                            <button
                                                onClick={() => dispatch(removeItem(product.id))}
                                                className="text-gray-300 hover:text-red-400 transition-colors cursor-pointer"
                                                aria-label={`Remover ${product.name}`}
                                            >
                                                <TrashIcon size={17} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="hidden sm:flex items-center gap-2 shrink-0">
                                    <button
                                        onClick={() => dispatch(decrementQuantity(product.id))}
                                        className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
                                        aria-label="Diminuir quantidade"
                                    >
                                        <MinusIcon size={14} />
                                    </button>
                                    <span className="w-5 text-center font-medium tabular-nums">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => dispatch(incrementQuantity(product.id))}
                                        className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
                                        aria-label="Aumentar quantidade"
                                    >
                                        <PlusIcon size={14} />
                                    </button>
                                </div>
                                <div className="hidden sm:flex items-center gap-4 shrink-0">
                                    <p className="w-24 text-right font-medium tabular-nums">
                                        {(product.price * quantity).toLocaleString("pt-BR", {
                                            style: "currency",
                                            currency: "BRL",
                                        })}
                                    </p>
                                    <button
                                        onClick={() => dispatch(removeItem(product.id))}
                                        className="text-gray-300 hover:text-red-400 transition-colors cursor-pointer"
                                        aria-label={`Remover ${product.name}`}
                                    >
                                        <TrashIcon size={18} />
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
                <div className="
                    fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4
                    sm:static sm:border-t sm:border-gray-200 sm:mt-4 sm:pt-6
                ">
                    <div className="max-w-2xl mx-auto flex flex-col gap-3">
                        <div className="flex justify-between items-baseline">
                            <span className="text-gray-500 text-sm sm:text-base">Total</span>
                            <span className="text-xl sm:text-2xl font-semibold tabular-nums">
                                {total.toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                })}
                            </span>
                        </div>
                        <button
                            onClick={handleCheckout}
                            className="w-full bg-[#D1AC2B] hover:bg-[#b8941f] text-white font-medium py-3 rounded-md transition-colors cursor-pointer text-sm sm:text-base"
                        >
                            Finalizar compra
                        </button>
                    </div>
                </div>
                <div className="h-28 sm:hidden" />
            </div>
        </div>
    );
};