import { Inject, Injectable } from '@nestjs/common';
import type { IUnitOfWork } from '../../domain/shared/repositories/unit-of-work.interface';
import { UNIT_OF_WORK_TOKEN } from '../di/tokens';
import { ProductDomainService } from 'src/domain/product/services/product.service';

@Injectable()
export class DeleteProductUseCase {
  constructor(
    @Inject(UNIT_OF_WORK_TOKEN)
    private readonly unitOfWork: IUnitOfWork,
    private readonly productDomainService: ProductDomainService,
  ) {}

  async execute(productId: string): Promise<void> {
    return this.unitOfWork.execute(async () => {
      return this.productDomainService.deactivateProduct(productId);
    });
  }
}
