import { Module } from '@nestjs/common';
import { DatabaseModule } from '../infrastruct/database/database.module';
import { AuthModule } from './auth.module';
import { OrderController } from './controllers/order.controller';
import { CreateOrderUseCase } from './services/create-order.use-case';
import { GetOrdersUseCase } from './services/get-orders.use-case';
import { CancelOrderUseCase } from './services/cancel-order.use-case';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [OrderController],
  providers: [CreateOrderUseCase, GetOrdersUseCase, CancelOrderUseCase],
})
export class OrderModule {}
