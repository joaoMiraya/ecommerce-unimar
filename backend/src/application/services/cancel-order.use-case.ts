import { Inject, Injectable } from '@nestjs/common';
import type { IUnitOfWork } from '../../domain/shared/repositories/unit-of-work.interface';
import { ORDER_REPOSITORY_TOKEN, UNIT_OF_WORK_TOKEN } from '../di/tokens';
import { OrderDomainService } from 'src/domain/order/services/order.service';
import type { IOrderRepository } from 'src/domain/order/repositories/order.repository';

@Injectable()
export class CancelOrderUseCase {
  constructor(
    @Inject(UNIT_OF_WORK_TOKEN)
    private readonly unitOfWork: IUnitOfWork,
    @Inject(ORDER_REPOSITORY_TOKEN)
    private readonly orderRepository: IOrderRepository,
    private readonly orderDomainService: OrderDomainService,
  ) {}

  async execute(orderId: string, buyerId: string): Promise<void> {
    return this.unitOfWork.execute(async () => {
      const order = await this.orderDomainService.cancelOrder(orderId);

      if (order.buyer?.id !== buyerId) {
        throw new Error('You can only cancel your own orders');
      }

      await this.orderRepository.save(order);
    });
  }
}
