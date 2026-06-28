

export type OrderRequest = {
  items: {
    productId: string;
    quantity: number;
  }[];
}