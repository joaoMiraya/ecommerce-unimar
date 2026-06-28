import { Module } from '@nestjs/common';
import { DatabaseModule } from '../infrastruct/database/database.module';
import { ProductController } from './controllers/product.controller';
import { CreateProductUseCase } from './services/create-product.use-case';
import { DeleteProductUseCase } from './services/delete-product.use-case';
import { AuthModule } from './auth.module';
import { GetProductsUseCase } from './services/get-products.use-case';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [ProductController],
  providers: [CreateProductUseCase, DeleteProductUseCase, GetProductsUseCase],
})
export class ProductModule {}
