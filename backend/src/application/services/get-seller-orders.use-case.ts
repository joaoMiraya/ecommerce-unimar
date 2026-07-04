import { Inject, Injectable } from '@nestjs/common';
import type { IUnitOfWork } from '../../domain/shared/repositories/unit-of-work.interface';
import { UNIT_OF_WORK_TOKEN } from '../di/tokens';
import { OrderDomainService } from 'src/domain/order/services/order.service';
import { OrderEntity } from 'src/domain/order/entities/order.entity';

@Injectable()
export class GetSellerOrdersUseCase {
  constructor(
    @Inject(UNIT_OF_WORK_TOKEN)
    private readonly unitOfWork: IUnitOfWork,
    private readonly orderDomainService: OrderDomainService,
  ) {}

  async execute(sellerId: string): Promise<OrderEntity[]> {
    return this.unitOfWork.execute(async () => {
      return this.orderDomainService.getSellerOrders(sellerId);
    });
  }
}
