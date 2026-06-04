import { Injectable } from '@nestjs/common';
import { DataSource, FindOptionsWhere } from 'typeorm';
import type { IOrderRepository } from '../../../domain/order/repositories/order.repository';
import {
  OrderEntity,
  OrderStatus,
} from '../../../domain/order/entities/order.entity';

/**
 * Implementação de IOrderRepository
 * Fornece acesso a dados de pedidos usando TypeORM
 */
@Injectable()
export class OrderRepositoryImpl implements IOrderRepository {
  constructor(private readonly dataSource: DataSource) {}

  /**
   * Buscar pedido por ID
   */
  async findById(id: string): Promise<OrderEntity | null> {
    return this.dataSource.getRepository(OrderEntity).findOne({
      where: { id },
      relations: ['buyer', 'products'],
    });
  }

  /**
   * Buscar todos os pedidos
   */
  async findAll(): Promise<OrderEntity[]> {
    return this.dataSource.getRepository(OrderEntity).find({
      relations: ['buyer', 'products'],
    });
  }

  /**
   * Salvar pedido (criar ou atualizar)
   */
  async save(entity: OrderEntity): Promise<OrderEntity> {
    return this.dataSource.getRepository(OrderEntity).save(entity);
  }

  /**
   * Deletar pedido por ID
   */
  async delete(id: string): Promise<boolean> {
    const result = await this.dataSource
      .getRepository(OrderEntity)
      .delete({ id });
    return (result.affected ?? 0) > 0;
  }

  /**
   * Buscar com critérios customizados
   */
  async find(criteria: Partial<OrderEntity>): Promise<OrderEntity[]> {
    const where: FindOptionsWhere<OrderEntity> = {};

    if (criteria.id) where.id = criteria.id;
    if (criteria.status) where.status = criteria.status;

    return this.dataSource.getRepository(OrderEntity).find({
      where,
      relations: ['buyer', 'products'],
    });
  }

  /**
   * Buscar pedidos de um comprador
   */
  async findByBuyerId(buyerId: string): Promise<OrderEntity[]> {
    return this.dataSource.getRepository(OrderEntity).find({
      where: { buyer: { id: buyerId } },
      relations: ['buyer', 'products'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Buscar pedidos por status
   */
  async findByStatus(status: OrderStatus): Promise<OrderEntity[]> {
    return this.dataSource.getRepository(OrderEntity).find({
      where: { status },
      relations: ['buyer', 'products'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Buscar pedidos de um comprador com filtro de status
   */
  async findByBuyerIdAndStatus(
    buyerId: string,
    status: OrderStatus,
  ): Promise<OrderEntity[]> {
    return this.dataSource.getRepository(OrderEntity).find({
      where: {
        buyer: { id: buyerId },
        status,
      },
      relations: ['buyer', 'products'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Buscar pedidos recentes
   */
  async findRecent(days: number): Promise<OrderEntity[]> {
    const date = new Date();
    date.setDate(date.getDate() - days);

    return this.dataSource
      .getRepository(OrderEntity)
      .createQueryBuilder('order')
      .where('order.createdAt >= :date', { date })
      .leftJoinAndSelect('order.buyer', 'buyer')
      .leftJoinAndSelect('order.products', 'products')
      .orderBy('order.createdAt', 'DESC')
      .getMany();
  }
}
