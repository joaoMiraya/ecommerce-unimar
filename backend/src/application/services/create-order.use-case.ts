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

      const products = await Promise.all(
        input.items.map((item) =>
          this.productRepository.findById(item.productId),
        ),
      );

      const items = products
        .map((product, index) => ({
          product,
          quantity: input.items[index].quantity,
        }))
        .filter(
          (item): item is { product: ProductEntity; quantity: number } =>
            item.product !== null,
        );

      if (items.length === 0) {
        throw new Error('No valid products found');
      }

      const order = this.orderDomainService.createOrder(
        buyer,
        items,
        input.shippingAddress,
      );

      await this.orderRepository.save(order);
    });
  }
}
