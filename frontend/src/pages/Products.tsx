import { CreateProduct } from "../features/products/components/CreateProduct";
import { OwnProducts } from "../features/products/components/OwnProducts";



export const Products = () => {


    return (

        <div className="py-4 h-full pb-12">
            <CreateProduct />
            <div className="py-4">
                <OwnProducts />
            </div>
        </div>
    )
}
