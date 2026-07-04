import { Inject, Injectable } from '@nestjs/common';
import type { IUnitOfWork } from '../../domain/shared/repositories/unit-of-work.interface';
import {
  ORDER_REPOSITORY_TOKEN,
  PRODUCT_REPOSITORY_TOKEN,
  UNIT_OF_WORK_TOKEN,
} from '../di/tokens';
import { UserDomainService } from 'src/domain/user/services/user.service';
import type { IOrderRepository } from 'src/domain/order/repositories/order.repository';
import { OrderDomainService } from 'src/domain/order/services/order.service';
import type { IProductRepository } from 'src/domain/product/repositories/product.repository';
import { ProductEntity } from 'src/domain/product/entities/product.entity';
import { CreateOrderRequestDto } from '../dtos/order/create-order.dto';

export type CreateOrderInput = CreateOrderRequestDto & { buyerId: string };

@Injectable()
export class CreateOrderUseCase {
  constructor(
    @Inject(UNIT_OF_WORK_TOKEN)
    private readonly unitOfWork: IUnitOfWork,
    @Inject(ORDER_REPOSITORY_TOKEN)
    private readonly orderRepository: IOrderRepository,
    @Inject(PRODUCT_REPOSITORY_TOKEN)
    private readonly productRepository: IProductRepository,
    private readonly orderDomainService: OrderDomainService,
    private readonly userDomainService: UserDomainService,
  ) {}

  async execute(input: CreateOrderInput): Promise<void> {
    return this.unitOfWork.execute(async () => {
      const buyer = await this.userDomainService.getUserById(input.buyerId);
      if (!buyer) {
        throw new Error('Buyer not found');
      }

      const quantityByProductId = new Map<string, number>();
      for (const item of input.items) {
        quantityByProductId.set(
          item.productId,
          (quantityByProductId.get(item.productId) ?? 0) + item.quantity,
        );
      }

      const products = await Promise.all(
        [...quantityByProductId.keys()].map((productId) =>
          this.productRepository.findById(productId),
        ),
      );

      const items = products
        .map((product) => ({
          product,
          quantity: product ? (quantityByProductId.get(product.id) ?? 0) : 0,
        }))
        .filter(
          (item): item is { product: ProductEntity; quantity: number } =>
            item.product !== null,
        );

      if (items.length === 0) {
        throw new Error('No valid products found');
      }

      for (const item of items) {
        item.product.decreaseStock(item.quantity);
      }

      const order = this.orderDomainService.createOrder(
        buyer,
        items,
        buyer.addresses[0].id,
      );

      await this.orderRepository.save(order);
      await Promise.all(
        items.map((item) => this.productRepository.save(item.product)),
      );
    });
  }
}
