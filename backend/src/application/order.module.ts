import { Module } from '@nestjs/common';
import { DatabaseModule } from '../infrastruct/database/database.module';
import { AuthModule } from './auth.module';
import { OrderController } from './controllers/order.controller';
import { CreateOrderUseCase } from './services/create-order.use-case';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [OrderController],
  providers: [CreateOrderUseCase],
})
export class OrderModule {}
