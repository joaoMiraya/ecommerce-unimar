import { Injectable } from '@nestjs/common';
import { DataSource, FindOptionsWhere } from 'typeorm';
import type { IProductRepository } from '../../../domain/product/repositories/product.repository';
import { ProductEntity } from '../../../domain/product/entities/product.entity';

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
   * Buscar por nome com busca parcial
   */
  async findByName(name: string): Promise<ProductEntity[]> {
    return this.dataSource
      .getRepository(ProductEntity)
      .createQueryBuilder('product')
      .where('product.name ILIKE :name', { name: `%${name}%` })
      .leftJoinAndSelect('product.seller', 'seller')
      .getMany();
  }

  /**
   * Buscar com filtro de preço
   */
  async findByPriceRange(
    minPrice: number,
    maxPrice: number,
  ): Promise<ProductEntity[]> {
    return this.dataSource
      .getRepository(ProductEntity)
      .createQueryBuilder('product')
      .where('product.price >= :minPrice', { minPrice })
      .andWhere('product.price <= :maxPrice', { maxPrice })
      .leftJoinAndSelect('product.seller', 'seller')
      .getMany();
  }
}
