import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './application/controllers/app.controller';
import { LoggerMiddleware } from './application/middlewares/logger.middleware';
import {
  ORDER_REPOSITORY_TOKEN,
  PRODUCT_REPOSITORY_TOKEN,
  UNIT_OF_WORK_TOKEN,
  USER_REPOSITORY_TOKEN,
} from './application/di/tokens';

// Domain
import { UserEntity } from './domain/user/entities/user.entity';
import { ProductEntity } from './domain/product/entities/product.entity';
import { OrderEntity } from './domain/order/entities/order.entity';
import { LoginSessionEntity } from './domain/auth/entities/login-session.entity';
import { UserDomainService } from './domain/user/services/user.service';
import { ProductDomainService } from './domain/product/services/product.service';
import { OrderDomainService } from './domain/order/services/order.service';
import { CreateUserUseCase } from './application/services/create-user.use-case';

// Infrastructure
import { UnitOfWork } from './infrastruct/database/unit-of-work/unit-of-work';
import { UserRepositoryImpl } from './infrastruct/database/repositories/user.repository.impl';
import { ProductRepositoryImpl } from './infrastruct/database/repositories/product.repository.impl';
import { OrderRepositoryImpl } from './infrastruct/database/repositories/order.repository.impl';
import { AppDataSource } from './infrastruct/database/config/data-source';

// Modules
import { AuthModule } from './application/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    TypeOrmModule.forFeature([UserEntity, ProductEntity, OrderEntity, LoginSessionEntity]),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    // Unit of Work
    {
      provide: UNIT_OF_WORK_TOKEN,
      useClass: UnitOfWork,
    },
    // Repositórios
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: UserRepositoryImpl,
    },
    {
      provide: PRODUCT_REPOSITORY_TOKEN,
      useClass: ProductRepositoryImpl,
    },
    {
      provide: ORDER_REPOSITORY_TOKEN,
      useClass: OrderRepositoryImpl,
    },
    // Domain Services
    {
      provide: UserDomainService,
      useFactory: (userRepo: any) => new UserDomainService(userRepo),
      inject: [USER_REPOSITORY_TOKEN],
    },
    {
      provide: ProductDomainService,
      useFactory: (productRepo: any) => new ProductDomainService(productRepo),
      inject: [PRODUCT_REPOSITORY_TOKEN],
    },
    {
      provide: OrderDomainService,
      useFactory: (orderRepo: any, productRepo: any) =>
        new OrderDomainService(orderRepo, productRepo),
      inject: [ORDER_REPOSITORY_TOKEN, PRODUCT_REPOSITORY_TOKEN],
    },
    // Application Services
    CreateUserUseCase,
  ],
  exports: [
    UNIT_OF_WORK_TOKEN,
    USER_REPOSITORY_TOKEN,
    PRODUCT_REPOSITORY_TOKEN,
    ORDER_REPOSITORY_TOKEN,
    UserDomainService,
    ProductDomainService,
    OrderDomainService,
    CreateUserUseCase,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('health');
  }
}
