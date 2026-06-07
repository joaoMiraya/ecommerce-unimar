
export interface Product {
  name: string;
  description: string;
  price: number;
  stock: number;
}

export type ProductResponse<T> = {
  status: number;
  data: {
    product: T,
    message: string;
  }
}

export type ProductRequest = {
  page: number;
  limit: number;
}