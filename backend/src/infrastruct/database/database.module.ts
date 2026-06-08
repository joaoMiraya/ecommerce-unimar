import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  UNIT_OF_WORK_TOKEN,
  USER_REPOSITORY_TOKEN,
  PRODUCT_REPOSITORY_TOKEN,
  ORDER_REPOSITORY_TOKEN,
  ADDRESS_REPOSITORY_TOKEN,
} from '../../domain/shared/di/tokens';

// Entities
import { UserEntity } from '../../domain/user/entities/user.entity';
import { ProductEntity } from '../../domain/product/entities/product.entity';
import { OrderEntity } from '../../domain/order/entities/order.entity';
import { OrderItemEntity } from '../../domain/order/entities/order-item.entity';
import { LoginSessionEntity } from '../../domain/auth/entities/login-session.entity';
import { AddressEntity } from '../../domain/address/entities/address.entity';

// Infrastructure
import { UnitOfWork } from './unit-of-work/unit-of-work';
import { UserRepositoryImpl } from './repositories/user.repository.impl';
import { ProductRepositoryImpl } from './repositories/product.repository.impl';
import { OrderRepositoryImpl } from './repositories/order.repository.impl';
import { AddressRepositoryImpl } from './repositories/address.repository.impl';

// Domain Services
import { UserDomainService } from '../../domain/user/services/user.service';
import { ProductDomainService } from '../../domain/product/services/product.service';
import { OrderDomainService } from '../../domain/order/services/order.service';
import { AddressDomainService } from '../../domain/address/services/address.service';
import { IUserRepository } from '../../domain/user/repositories/user.repository';
import { IProductRepository } from '../../domain/product/repositories/product.repository';
import { IOrderRepository } from '../../domain/order/repositories/order.repository';
import { IAddressRepository } from '../../domain/address/repositories/address.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      ProductEntity,
      OrderEntity,
      OrderItemEntity,
      LoginSessionEntity,
      AddressEntity,
    ]),
  ],
  providers: [
    // Unit of Work
    {
      provide: UNIT_OF_WORK_TOKEN,
      useClass: UnitOfWork,
    },
    // Repositories
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: UserRepositoryImpl,
    },
    {
      provide: ADDRESS_REPOSITORY_TOKEN,
      useClass: AddressRepositoryImpl,
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
      useFactory: (userRepo: IUserRepository) =>
        new UserDomainService(userRepo),
      inject: [USER_REPOSITORY_TOKEN],
    },
    {
      provide: ProductDomainService,
      useFactory: (productRepo: IProductRepository) =>
        new ProductDomainService(productRepo),
      inject: [PRODUCT_REPOSITORY_TOKEN],
    },
    {
      provide: OrderDomainService,
      useFactory: (orderRepo: IOrderRepository) =>
        new OrderDomainService(orderRepo),
      inject: [ORDER_REPOSITORY_TOKEN],
    },
    {
      provide: AddressDomainService,
      useFactory: (addressRepo: IAddressRepository) =>
        new AddressDomainService(addressRepo),
      inject: [ADDRESS_REPOSITORY_TOKEN],
    },
  ],
  exports: [
    UNIT_OF_WORK_TOKEN,
    USER_REPOSITORY_TOKEN,
    PRODUCT_REPOSITORY_TOKEN,
    ORDER_REPOSITORY_TOKEN,
    ADDRESS_REPOSITORY_TOKEN,
    UserDomainService,
    ProductDomainService,
    OrderDomainService,
    AddressDomainService,
  ],
})
export class DatabaseModule {}
