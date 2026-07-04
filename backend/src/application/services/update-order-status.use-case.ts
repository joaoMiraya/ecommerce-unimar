import { Inject, Injectable } from '@nestjs/common';
import type { IUnitOfWork } from '../../domain/shared/repositories/unit-of-work.interface';
import { ORDER_REPOSITORY_TOKEN, UNIT_OF_WORK_TOKEN } from '../di/tokens';
import { OrderDomainService } from 'src/domain/order/services/order.service';
import type { IOrderRepository } from 'src/domain/order/repositories/order.repository';
import { UpdateOrderStatusDto } from '../dtos/order/update-order-status.dto';

type OrderSeller = { seller?: { id?: string } };

@Injectable()
export class UpdateOrderStatusUseCase {
  constructor(
    @Inject(UNIT_OF_WORK_TOKEN)
    private readonly unitOfWork: IUnitOfWork,
    @Inject(ORDER_REPOSITORY_TOKEN)
    private readonly orderRepository: IOrderRepository,
    private readonly orderDomainService: OrderDomainService,
  ) {}

  async execute(input: UpdateOrderStatusDto, sellerId: string): Promise<void> {
    return this.unitOfWork.execute(async () => {
      const order = await this.orderRepository.findById(input.orderId);
      if (!order) {
        throw new Error(`Order with id ${input.orderId} not found`);
      }

      const isSeller = (order.items ?? []).some((item) => {
        const product = item.product as OrderSeller | undefined;
        return product?.seller?.id === sellerId;
      });

      if (!isSeller) {
        throw new Error('You can only update orders for your own products');
      }

      const updatedOrder = await this.orderDomainService.updateOrderStatus(
        input.orderId,
        input.status,
      );
      await this.orderRepository.save(updatedOrder);
    });
  }
}
