export type OrderRequest = {
  items: {
    productId: string;
    quantity: number;
  }[];
}

export type OrderResponse<T> = {
  status: number;
  data: {
    orders: T,
    message?: string;
  }
}

export type OrderItem = {
  id: string;
  quantity: number;
  unitPrice: number;
  product: {
    name: string;
  }
}

export type Order = {
  id: string;
  createdAt: string;
  updatedAt: string;
  buyer?: {
    id: string;
    name: string;
  };
  items: OrderItem[];
  totalPrice: number;
  status: OrderStatus;
}

export type UpdateOrderStatusRequest = {
  orderId: string;
  status: OrderStatus;
}

export const OrderStatusEnum = {
  PENDING: 'Pendente',
  PROCESSING: 'Processando',
  SHIPPED: 'Enviado',
  DELIVERED: 'Entregue',
  CANCELLED: 'Cancelado',
} as const;

export type OrderStatus = keyof typeof OrderStatusEnum;