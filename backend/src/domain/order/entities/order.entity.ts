import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { BaseEntity } from '../../shared/entities/base.entity';

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

/**
 * Entidade Order - Agregado de pedido
 * Representa um pedido no sistema e-commerce
 */
@Entity('orders')
export class OrderEntity extends BaseEntity {
  @ManyToOne('UserEntity')
  @JoinColumn({ name: 'buyer_id' })
  buyer: any;

  @ManyToMany('ProductEntity')
  @JoinTable({
    name: 'order_products',
    joinColumn: { name: 'order_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'product_id', referencedColumnName: 'id' },
  })
  products: any[];

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  totalPrice: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column({ type: 'text', nullable: true })
  shippingAddress: string;

  constructor(props?: Partial<OrderEntity>) {
    super(props);
    if (props) {
      Object.assign(this, props);
    }
    this.products = this.products || [];
  }

  /**
   * Método de domínio: adicionar produto ao pedido
   */
  addProduct(product: any): void {
    if (!this.products.find((p) => p.id === product.id)) {
      this.products.push(product);
    }
  }

  /**
   * Método de domínio: remover produto do pedido
   */
  removeProduct(productId: string): void {
    this.products = this.products.filter((p) => p.id !== productId);
  }

  /**
   * Método de domínio: processar pedido
   */
  process(): void {
    if (this.status !== OrderStatus.PENDING) {
      throw new Error('Only pending orders can be processed');
    }
    this.status = OrderStatus.PROCESSING;
  }

  /**
   * Método de domínio: enviar pedido
   */
  ship(): void {
    if (this.status !== OrderStatus.PROCESSING) {
      throw new Error('Only processing orders can be shipped');
    }
    this.status = OrderStatus.SHIPPED;
  }

  /**
   * Método de domínio: entregar pedido
   */
  deliver(): void {
    if (this.status !== OrderStatus.SHIPPED) {
      throw new Error('Only shipped orders can be delivered');
    }
    this.status = OrderStatus.DELIVERED;
  }

  /**
   * Método de domínio: cancelar pedido
   */
  cancel(): void {
    if (
      this.status === OrderStatus.SHIPPED ||
      this.status === OrderStatus.DELIVERED
    ) {
      throw new Error('Cannot cancel shipped or delivered orders');
    }
    this.status = OrderStatus.CANCELLED;
  }

  /**
   * Método de domínio: calcular preço total
   */
  calculateTotal(): number {
    return this.products.reduce(
      (total, product) => total + Number(product.price),
      0,
    );
  }
}
