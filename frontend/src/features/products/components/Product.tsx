import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../../store/store';
import type { Product as ProductType } from "../types/product.types";
import { addItem } from '../../cart/store/cart_slice';

export const Product = ({ product }: { product: ProductType }) => {
    const dispatch = useDispatch<AppDispatch>();

    const handleCartAction = () => {
        dispatch(addItem(product));
    };

    return (
        <div className="bg-gray-50 rounded-md shadow-xl flex flex-col max-w-40">
            <h2 className="text-center font-medium">{product.name}</h2>
            <div>
                <img src="/public/product_cover.png" alt={product.name} />
            </div>
            <div className="px-2">
                <div>
                    <p className="wrap-break-word">{product.description}</p>
                </div>
                <h3>
                    {product.price.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                    })}
                </h3>
            </div>
            <button
                onClick={handleCartAction}
                className={'w-full mt-2 cursor-pointer font-medium transition-colors bg-[#D1AC2B] hover:bg-[#b8941f]'}
            >
                Adicionar
            </button>
        </div>
    );
};