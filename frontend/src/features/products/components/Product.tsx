import type { Product as ProductType } from "../types/product.types"

export const Product = ({ product }: { product: ProductType }) => {

    return (
        <div className="bg-gray-50 rounded-md p-4 min-h-40 shadow-xl
        flex flex-col max-w-40"
        >
            <h2>{product.name}</h2>
            <div>
                <img src="/public/product_cover.png" alt={product.name} />
            </div>
            <div>
                <p className="wrap-break-word">{product.description}</p>
            </div>
            <h3>{product.price.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                })
            }</h3>
            {product.soldout ? <p>Esgotado</p> : <button>Comprar</button>}
        </div>
    )
}
