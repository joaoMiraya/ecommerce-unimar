import { IRepository } from '../../shared/repositories/repository.interface';
import { ProductEntity } from '../entities/product.entity';

/**
 * Interface do Repositório de Product
 * Contrato que a implementação em Infrastructure deve seguir
 */
export interface IProductRepository extends IRepository<ProductEntity> {
  /**
   * Buscar produtos ativos
   */
  findActive(): Promise<ProductEntity[]>;

  /**
   * Buscar produtos por vendedor
   */
  findBySellerId(sellerId: string): Promise<ProductEntity[]>;

  /**
   * Buscar por nome com busca parcial
   */
  findByName(name: string): Promise<ProductEntity[]>;

  /**
   * Buscar com filtro de preço
   */
  findByPriceRange(
    minPrice: number,
    maxPrice: number,
  ): Promise<ProductEntity[]>;
}
