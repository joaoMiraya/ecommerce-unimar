import {
  Controller,
  Body,
  HttpStatus,
  UseGuards,
  Post,
  Get,
  Patch,
  Param,
} from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUserId } from '../decorators/current-user.decorator';
import { CreateOrderUseCase, CreateOrderInput } from '../services/create-order.use-case';
import { GetOrdersUseCase } from '../services/get-orders.use-case';
import { CancelOrderUseCase } from '../services/cancel-order.use-case';
import { CreateOrderRequestDto } from '../dtos/order/create-order.dto';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly getOrdersUseCase: GetOrdersUseCase,
    private readonly cancelOrderUseCase: CancelOrderUseCase,
  ) {}

  @Post('')
  async create(
    @CurrentUserId() userId: string,
    @Body() body: CreateOrderRequestDto,
  ) {
    const input: CreateOrderInput = { ...body, buyerId: userId };
    await this.createOrderUseCase.execute(input);
    return { status: HttpStatus.CREATED };
  }

  @Get('')
  async getMyOrders(@CurrentUserId() userId: string) {
    const orders = await this.getOrdersUseCase.execute(userId);
    return { status: HttpStatus.OK, data: { orders } };
  }

  @Patch(':id/cancel')
  async cancel(
    @CurrentUserId() userId: string,
    @Param('id') orderId: string,
  ) {
    await this.cancelOrderUseCase.execute(orderId, userId);
    return { status: HttpStatus.OK };
  }
}
