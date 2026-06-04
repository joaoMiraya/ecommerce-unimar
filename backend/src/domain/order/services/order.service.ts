import { Injectable } from '@nestjs/common';
import type { IOrderRepository } from '../repositories/order.repository';
import type { IProductRepository } from '../../product/repositories/product.repository';
import { OrderEntity, OrderStatus } from '../entities/order.entity';
import type { ProductEntity } from '../../product/entities/product.entity';
import type { UserEntity } from '../../user/entities/user.entity';

@Injectable()
export class OrderDomainService {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly productRepository: IProductRepository,
  ) {}

  createOrder(
    buyer: UserEntity,
    products: ProductEntity[],
    shippingAddress: string,
  ): OrderEntity {
    if (!buyer) {
      throw new Error('Buyer is required');
    }

    if (!products || products.length === 0) {
      throw new Error('Order must have at least one product');
    }

    if (!shippingAddress || shippingAddress.trim().length === 0) {
      throw new Error('Shipping address is required');
    }

    const totalPrice = products.reduce(
      (total, product) => total + product.price,
      0,
    );

    const order = new OrderEntity({
      buyer,
      products,
      totalPrice,
      status: OrderStatus.PENDING,
      shippingAddress: shippingAddress.trim(),
    });

    return order;
  }

  async addProductToOrder(
    orderId: string,
    productId: string,
  ): Promise<OrderEntity> {
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new Error(`Order with id ${orderId} not found`);
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new Error('Cannot add products to non-pending orders');
    }

    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new Error(`Product with id ${productId} not found`);
    }

    order.addProduct(product);
    order.totalPrice = order.calculateTotal();

    return order;
  }

  async removeProductFromOrder(
    orderId: string,
    productId: string,
  ): Promise<OrderEntity> {
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new Error(`Order with id ${orderId} not found`);
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new Error('Cannot remove products from non-pending orders');
    }

    order.removeProduct(productId);
    order.totalPrice = order.calculateTotal();

    return order;
  }

  async processOrder(orderId: string): Promise<OrderEntity> {
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new Error(`Order with id ${orderId} not found`);
    }

    order.process();
    return order;
  }

  async shipOrder(orderId: string): Promise<OrderEntity> {
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new Error(`Order with id ${orderId} not found`);
    }

    order.ship();
    return order;
  }

  async deliverOrder(orderId: string): Promise<OrderEntity> {
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new Error(`Order with id ${orderId} not found`);
    }

    order.deliver();
    return order;
  }

  async cancelOrder(orderId: string): Promise<OrderEntity> {
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new Error(`Order with id ${orderId} not found`);
    }

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
