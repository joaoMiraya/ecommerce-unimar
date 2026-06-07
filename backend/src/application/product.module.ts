import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PRODUCT_REPOSITORY_TOKEN, USER_REPOSITORY_TOKEN } from './di/tokens';
import { DatabaseModule } from '../infrastruct/database/database.module';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ProductController } from './controllers/product.controller';
import { ProductRepositoryImpl } from 'src/infrastruct/database/repositories/product.repository.impl';
import { ProductDomainService } from 'src/domain/product/services/product.service';
import { UserDomainService } from 'src/domain/user/services/user.service';
import { CreateProductUseCase } from './services/create-product.use-case';
import { UserRepositoryImpl } from 'src/infrastruct/database/repositories/user.repository.impl';
import { DeleteProductUseCase } from './services/delete-product.use-case';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: {
        expiresIn: '1h',
      },
    }),
  ],
  controllers: [ProductController],
  providers: [
    // Use Cases
    CreateProductUseCase,
    DeleteProductUseCase,

    // Domain Services
    ProductDomainService,
    UserDomainService,

    // Repositories
    {
      provide: PRODUCT_REPOSITORY_TOKEN,
      useClass: ProductRepositoryImpl,
    },
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: UserRepositoryImpl,
    },

    // Guards
    JwtAuthGuard,
  ],
  exports: [
    JwtAuthGuard,
    JwtModule,
    PRODUCT_REPOSITORY_TOKEN,
    USER_REPOSITORY_TOKEN,
  ],
})
export class ProductModule {}
