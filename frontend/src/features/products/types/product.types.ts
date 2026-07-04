export type CreateProductType = {
  name: string;
  description: string;
  price: number;
  stock: number;
}
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  isActive: boolean;
  stock: number;
  createdAt: string;
  updatedAt: string;
  seller: {
    name: string;
    createdAt: string;
  }
}

export type ProductResponse<T> = {
  status: number;
  data: {
    products: {
      data: T,
      meta: {
        page: number,
        limit: number;
        total: number;
        totalPages: number;
      }
    },
    message: string;
  }
}
export interface ProductRequest {
  page: number;
  limit: number;
  name?: string;
  seller?: string;
  min_price?: number;
  max_price?: number;
}
