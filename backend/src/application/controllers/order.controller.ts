import {
  Controller,
  Body,
  HttpStatus,
  UseGuards,
  Post,
  Get,
  Logger,
} from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUserId } from '../decorators/current-user.decorator';
import {
  CreateOrderUseCase,
  CreateOrderInput,
} from '../services/create-order.use-case';
import { GetOrdersUseCase } from '../services/get-orders.use-case';
import { CancelOrderUseCase } from '../services/cancel-order.use-case';
import { GetSellerOrdersUseCase } from '../services/get-seller-orders.use-case';
import { UpdateOrderStatusUseCase } from '../services/update-order-status.use-case';
import {
  CancelOrderDto,
  CreateOrderRequestDto,
} from '../dtos/order/create-order.dto';
import { UpdateOrderStatusDto } from '../dtos/order/update-order-status.dto';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
  private logger = new Logger();
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly getOrdersUseCase: GetOrdersUseCase,
    private readonly cancelOrderUseCase: CancelOrderUseCase,
    private readonly getSellerOrdersUseCase: GetSellerOrdersUseCase,
    private readonly updateOrderStatusUseCase: UpdateOrderStatusUseCase,
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

  @Get('sales')
  async getMySales(@CurrentUserId() userId: string) {
    const orders = await this.getSellerOrdersUseCase.execute(userId);
    return { status: HttpStatus.OK, data: { orders } };
  }

  @Post('cancel')
  async cancel(
    @CurrentUserId() userId: string,
    @Body() { orderId }: CancelOrderDto,
  ) {
    await this.cancelOrderUseCase.execute(orderId, userId);
    return { status: HttpStatus.OK };
  }

  @Post('status')
  async updateStatus(
    @CurrentUserId() userId: string,
    @Body() body: UpdateOrderStatusDto,
  ) {
    await this.updateOrderStatusUseCase.execute(body, userId);
    return { status: HttpStatus.OK };
  }
}
