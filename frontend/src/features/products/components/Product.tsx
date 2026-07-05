import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../../store/store';
import type { Product as ProductType } from "../types/product.types";
import { addItem } from '../../cart/store/cart_slice';
import { Button } from '../../../components/Button';

type ProductsProps = {
    product: ProductType;
    onlyView?: boolean;
}

export const Product = (props: ProductsProps) => {
    const { product, onlyView } = props;

    const dispatch = useDispatch<AppDispatch>();

    const handleCartAction = () => {
        dispatch(addItem(product));
    };

    return (
        <div className="bg-white rounded-md shadow-xl flex overflow-hidden">
            <div className='max-w-40'>
                <img src="/product_cover.png" alt={product.name} />
            </div>
            <div className="flex flex-col justify-between w-40">
                <h2 className="text-center font-medium">{product.name}</h2>
                <p className="wrap-break-word px-2 text-sm">{product.description}</p>
         
                <div className='flex flex-col'>
                    <h3 className='self-end px-2'>
                        {product.price.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                        })}
                    </h3>
                    <p className='text-sm px-2 underline self-end'>Estoque: {product.stock}</p>
                    {!onlyView &&
                        <Button
                            onClick={handleCartAction}
                            className={'w-full mt-2 rounded-none font-medium transition-colors bg-[#D1AC2B] hover:bg-[#b8941f]'}
                        >
                            Adicionar
                        </Button>
                    }
                </div>
            </div>
        </div>
    );
};