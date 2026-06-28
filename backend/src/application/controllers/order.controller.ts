import {
  Controller,
  Body,
  HttpStatus,
  UseGuards,
  Post,
  Logger,
} from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUserId } from '../decorators/current-user.decorator';
import {
  type CreateOrderType,
  CreateOrderUseCase,
  type OrderItemsType,
} from '../services/create-order.use-case';

@Controller('order')
export class OrderController {
  private logger = new Logger();
  constructor(private readonly createOrderUseCase: CreateOrderUseCase) {}

  @Post('')
  @UseGuards(JwtAuthGuard)
  async create(
    @CurrentUserId() userId: string,
    @Body() items: OrderItemsType[],
  ) {
    const input: CreateOrderType = {
      items: items,
      buyerId: userId,
    };

    await this.createOrderUseCase.execute(input);
    return {
      status: HttpStatus.ACCEPTED,
    };
  }
}
