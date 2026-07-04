import { IsEnum, IsUUID } from 'class-validator';
import { OrderStatus } from 'src/domain/order/entities/order.entity';

export class UpdateOrderStatusDto {
  @IsUUID()
  orderId: string;

  @IsEnum(OrderStatus)
  status: OrderStatus;
}
