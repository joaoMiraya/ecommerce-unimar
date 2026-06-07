import { Inject, Injectable } from '@nestjs/common';
import type { IUnitOfWork } from '../../domain/shared/repositories/unit-of-work.interface';
import { PRODUCT_REPOSITORY_TOKEN, UNIT_OF_WORK_TOKEN } from '../di/tokens';
import { type IProductRepository } from 'src/domain/product/repositories/product.repository';
import { ProductDomainService } from 'src/domain/product/services/product.service';
import { UserDomainService } from 'src/domain/user/services/user.service';
import { ProductEntity } from 'src/domain/product/entities/product.entity';

export interface CreateProductInput {
  userId: string;
  name: string;
  description: string;
  price: number;
  stock: number;
}

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject(UNIT_OF_WORK_TOKEN)
    private readonly unitOfWork: IUnitOfWork,
    @Inject(PRODUCT_REPOSITORY_TOKEN)
    private readonly productRepository: IProductRepository,
    private readonly productDomainService: ProductDomainService,
    private readonly userDomainService: UserDomainService,
  ) {}

  async execute(input: CreateProductInput): Promise<ProductEntity> {
    const { name, description, price, stock, userId } = input;
    const user = await this.userDomainService.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return this.unitOfWork.execute(async () => {
      const product = this.productDomainService.createProduct(
        name,
        description,
        price,
        stock,
        user,
      );
      return this.productRepository.save(product);
    });
  }
}
