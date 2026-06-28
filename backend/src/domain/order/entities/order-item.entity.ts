import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../shared/entities/base.entity';

@Entity('order_products')
export class OrderItemEntity extends BaseEntity {
  @Column()
  orderId: string;

  @Column()
  productId: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  unitPrice: number;

  @ManyToOne('OrderEntity', 'items', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: unknown;

  @ManyToOne('ProductEntity')
  @JoinColumn({ name: 'productId' })
  product: unknown;

  constructor(props?: Partial<OrderItemEntity>) {
    super(props);
    if (props) {
      Object.assign(this, props);
    }
  }

  get subtotal(): number {
    return this.quantity * Number(this.unitPrice);
  }
}
