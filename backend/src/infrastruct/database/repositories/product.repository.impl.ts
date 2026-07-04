import { Injectable } from '@nestjs/common';
import { DataSource, FindOptionsWhere } from 'typeorm';
import type { IProductRepository } from '../../../domain/product/repositories/product.repository';
import { ProductEntity } from '../../../domain/product/entities/product.entity';
import { ProductFiltersRequestDto } from 'src/application/dtos/product/product-filters.dto';
import { PaginatedResult } from 'src/application/dtos/paginated-result.dto';

/**
 * Implementação de IProductRepository
 * Fornece acesso a dados de produtos usando TypeORM
 */
@Injectable()
export class ProductRepositoryImpl implements IProductRepository {
  constructor(private readonly dataSource: DataSource) {}

  /**
   * Buscar produto por ID
   */
  async findById(id: string): Promise<ProductEntity | null> {
    return this.dataSource
      .getRepository(ProductEntity)
      .findOne({ where: { id }, relations: ['seller'] });
  }

  /**
   * Buscar todos os produtos
   */
  async findAll(): Promise<ProductEntity[]> {
    return this.dataSource
      .getRepository(ProductEntity)
      .find({ relations: ['seller'] });
  }

  /**
   * Salvar produto (criar ou atualizar)
   */
  async save(entity: ProductEntity): Promise<ProductEntity> {
    return this.dataSource.getRepository(ProductEntity).save(entity);
  }

  /**
   * Deletar produto por ID
   */
  async delete(id: string): Promise<boolean> {
    const result = await this.dataSource
      .getRepository(ProductEntity)
      .delete({ id });
    return (result.affected ?? 0) > 0;
  }

  /**
   * Buscar com critérios customizados
   */
  async find(criteria: Partial<ProductEntity>): Promise<ProductEntity[]> {
    const where: FindOptionsWhere<ProductEntity> = {};

    if (criteria.id) where.id = criteria.id;
    if (criteria.name) where.name = criteria.name;
    if (criteria.isActive !== undefined) where.isActive = criteria.isActive;

    return this.dataSource
      .getRepository(ProductEntity)
      .find({ where, relations: ['seller'] });
  }

  /**
   * Buscar produtos ativos
   */
  async findActive(): Promise<ProductEntity[]> {
    return this.dataSource.getRepository(ProductEntity).find({
      where: { isActive: true },
      relations: ['seller'],
    });
  }

  /**
   * Buscar produtos por vendedor
   */
  async findBySellerId(sellerId: string): Promise<ProductEntity[]> {
    return this.dataSource.getRepository(ProductEntity).find({
      where: { seller: { id: sellerId } },
      relations: ['seller'],
    });
  }

  /**
   * Buscar com base em filtros específicos
   */
  async findBy(
    filters: ProductFiltersRequestDto,
  ): Promise<PaginatedResult<ProductEntity>> {
    const qb = this.dataSource
      .getRepository(ProductEntity)
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.seller', 'seller')
      .select(['product', 'seller.name', 'seller.createdAt'])
      .where('product.stock > 0');

    if (filters.min_price != null) {
      qb.andWhere('product.price >= :minPrice', {
        minPrice: filters.min_price,
      });
    }

    if (filters.max_price != null) {
      qb.andWhere('product.price <= :maxPrice', {
        maxPrice: filters.max_price,
      });
    }

    if (filters.name != null && filters.name.trim().length > 0) {
      qb.andWhere('product.name ILIKE :name', { name: `%${filters.name}%` });
    }

    if (filters.seller != null && filters.seller.trim().length > 0) {
      qb.andWhere('seller.name ILIKE :seller', {
        seller: `%${filters.seller}%`,
      });
    }

    if (filters.sellerId != null) {
      qb.andWhere('seller.id = :sellerId', {
        sellerId: filters.sellerId,
      });
    }

    const page = filters.page && filters.page > 0 ? filters.page : 1;
    const limit = filters.limit && filters.limit > 0 ? filters.limit : 10;

    qb.skip((page - 1) * limit).take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
