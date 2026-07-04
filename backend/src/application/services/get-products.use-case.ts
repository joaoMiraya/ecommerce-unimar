import { Inject, Injectable } from '@nestjs/common';
import type { IUnitOfWork } from '../../domain/shared/repositories/unit-of-work.interface';
import { UNIT_OF_WORK_TOKEN } from '../di/tokens';
import { ProductDomainService } from 'src/domain/product/services/product.service';
import { ProductEntity } from 'src/domain/product/entities/product.entity';
import { ProductFiltersRequestDto } from '../dtos/product/product-filters.dto';
import { PaginatedResult } from '../dtos/paginated-result.dto';

@Injectable()
export class GetProductsUseCase {
  constructor(
    @Inject(UNIT_OF_WORK_TOKEN)
    private readonly unitOfWork: IUnitOfWork,
    private readonly productDomainService: ProductDomainService,
  ) {}

  async execute(
    filters: ProductFiltersRequestDto,
  ): Promise<PaginatedResult<ProductEntity>> {
    return this.unitOfWork.execute(async () => {
      const products = await this.productDomainService.searchBy(filters);
      return products;
    });
  }
}
