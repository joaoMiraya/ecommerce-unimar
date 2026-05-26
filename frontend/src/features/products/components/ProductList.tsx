import type { Product as ProductType } from "../types/product.types"
import { Product } from "./Product"



export const ProductList = () => {

    const products: ProductType[] = [
        {
            name: 'Miau',
            description: 'aaaaaaaaaaaaaaaaaaau',
            price: 10.0,
            soldout: true,
        },
        {
            name: 'Auu',
            description: 'miaaauuuuuuuuuuu',
            price: 15.0,
            soldout: false,
        },
        {
            name: 'Miau',
            description: 'aaaaaaaaaaaaaaaaaaau',
            price: 10.0,
            soldout: false,
        },
    ]

    return (
        <div className="flex flex-wrap gap-4">
            {products.map((product) => <Product product={product} />)}
        </div>
    )
}
