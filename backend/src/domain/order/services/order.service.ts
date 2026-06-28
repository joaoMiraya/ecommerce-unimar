import type { IOrderRepository } from '../repositories/order.repository';
import { OrderEntity, OrderStatus } from '../entities/order.entity';
import type { ProductEntity } from '../../product/entities/product.entity';
import type { UserEntity } from '../../user/entities/user.entity';

export class OrderDomainService {
  constructor(private readonly orderRepository: IOrderRepository) {}

  createOrder(
    buyer: UserEntity,
    items: { product: ProductEntity; quantity: number }[],
    shippingAddress: string,
  ): OrderEntity {
    if (!buyer) {
      throw new Error('Buyer is required');
    }

    if (!items || items.length === 0) {
      throw new Error('Order must have at least one item');
    }

    if (!shippingAddress || shippingAddress.trim().length === 0) {
      throw new Error('Shipping address is required');
    }

    const order = new OrderEntity({
      buyer,
      items: [],
      status: OrderStatus.PROCESSING,
      shippingAddress: shippingAddress.trim(),
    });

    for (const { product, quantity } of items) {
      order.addItem(product.id, quantity, product.price);
    }

    order.totalPrice = order.calculateTotal();
    return order;
  }

  async addItemToOrder(
    orderId: string,
    product: ProductEntity,
    quantity: number,
  ): Promise<OrderEntity> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new Error(`Order with id ${orderId} not found`);
    }
    if (order.status !== OrderStatus.PENDING) {
      throw new Error('Cannot add items to non-pending orders');
    }

    order.addItem(product.id, quantity, product.price);
    order.totalPrice = order.calculateTotal();
    return order;
  }

  async removeItemFromOrder(
    orderId: string,
    productId: string,
  ): Promise<OrderEntity> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new Error(`Order with id ${orderId} not found`);
    }
    if (order.status !== OrderStatus.PENDING) {
      throw new Error('Cannot remove items from non-pending orders');
    }

    order.removeItem(productId);
    order.totalPrice = order.calculateTotal();
    return order;
  }

  async processOrder(orderId: string): Promise<OrderEntity> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) throw new Error(`Order with id ${orderId} not found`);
    order.process();
    return order;
  }

  async shipOrder(orderId: string): Promise<OrderEntity> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) throw new Error(`Order with id ${orderId} not found`);
    order.ship();
    return order;
  }

  async deliverOrder(orderId: string): Promise<OrderEntity> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) throw new Error(`Order with id ${orderId} not found`);
    order.deliver();
    return order;
  }

  async cancelOrder(orderId: string): Promise<OrderEntity> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) throw new Error(`Order with id ${orderId} not found`);
    order.cancel();
    return order;
  }

  async getBuyerOrders(buyerId: string): Promise<OrderEntity[]> {
    return this.orderRepository.findByBuyerId(buyerId);
  }

  async getOrdersByStatus(status: OrderStatus): Promise<OrderEntity[]> {
    return this.orderRepository.findByStatus(status);
  }

  async getRecentOrders(days: number = 7): Promise<OrderEntity[]> {
    return this.orderRepository.findRecent(days);
  }
}
