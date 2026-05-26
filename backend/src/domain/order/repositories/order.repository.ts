import { IRepository } from '../../shared/repositories/repository.interface';
import { OrderEntity, OrderStatus } from '../entities/order.entity';

/**
 * Interface do Repositório de Order
 * Contrato que a implementação em Infrastructure deve seguir
 */
export interface IOrderRepository extends IRepository<OrderEntity> {
  /**
   * Buscar pedidos de um comprador
   */
  findByBuyerId(buyerId: string): Promise<OrderEntity[]>;

  /**
   * Buscar pedidos por status
   */
  findByStatus(status: OrderStatus): Promise<OrderEntity[]>;

  /**
   * Buscar pedidos de um comprador com filtro de status
   */
  findByBuyerIdAndStatus(
    buyerId: string,
    status: OrderStatus,
  ): Promise<OrderEntity[]>;

  /**
   * Buscar pedidos recentes
   */
  findRecent(days: number): Promise<OrderEntity[]>;
}
