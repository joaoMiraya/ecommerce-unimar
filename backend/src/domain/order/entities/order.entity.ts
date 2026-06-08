import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../shared/entities/base.entity';
import type { UserEntity } from '../../user/entities/user.entity';
import { OrderItemEntity } from './order-item.entity';

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

@Entity('orders')
export class OrderEntity extends BaseEntity {
  @ManyToOne('UserEntity')
  @JoinColumn({ name: 'buyer_id' })
  buyer: UserEntity;

  @OneToMany(() => OrderItemEntity, (item) => item.order, { cascade: true })
  items: OrderItemEntity[];

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
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
  }

  addItem(productId: string, quantity: number, unitPrice: number): void {
    if (!this.items) this.items = [];
    const existing = this.items.find((i) => i.productId === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      const item = new OrderItemEntity({
        productId,
        quantity,
        unitPrice,
      });
      this.items.push(item);
    }
  }

  removeItem(productId: string): void {
    if (!this.items) return;
    this.items = this.items.filter((i) => i.productId !== productId);
  }

  calculateTotal(): number {
    return (this.items ?? []).reduce((sum, item) => sum + item.subtotal, 0);
  }

  process(): void {
    if (this.status !== OrderStatus.PENDING) {
      throw new Error('Only pending orders can be processed');
    }
    this.status = OrderStatus.PROCESSING;
  }

  ship(): void {
    if (this.status !== OrderStatus.PROCESSING) {
      throw new Error('Only processing orders can be shipped');
    }
    this.status = OrderStatus.SHIPPED;
  }

  deliver(): void {
    if (this.status !== OrderStatus.SHIPPED) {
      throw new Error('Only shipped orders can be delivered');
    }
    this.status = OrderStatus.DELIVERED;
  }

  cancel(): void {
    if (
      this.status === OrderStatus.SHIPPED ||
      this.status === OrderStatus.DELIVERED
    ) {
      throw new Error('Cannot cancel shipped or delivered orders');
    }
    this.status = OrderStatus.CANCELLED;
  }
}
