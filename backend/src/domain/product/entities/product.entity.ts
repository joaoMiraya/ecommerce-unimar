import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../shared/entities/base.entity';
import type { UserEntity } from '../../user/entities/user.entity';

/**
 * Entidade Product - Agregado de produto
 * Representa um produto disponível no e-commerce
 */
@Entity('products')
export class ProductEntity extends BaseEntity {
  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  price: number;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne('UserEntity')
  @JoinColumn({ name: 'seller_id' })
  seller: UserEntity;

  constructor(props?: Partial<ProductEntity>) {
    super(props);
    if (props) {
      Object.assign(this, props);
    }
  }

  /**
   * Método de domínio: atualizar preço do produto
   */
  updatePrice(newPrice: number): void {
    if (newPrice < 0) {
      throw new Error('Price cannot be negative');
    }
    this.price = newPrice;
  }

  /**
   * Método de domínio: atualizar estoque
   */
  updateStock(quantity: number): void {
    if (quantity < 0) {
      throw new Error('Stock cannot be negative');
    }
    this.stock = quantity;
  }

  /**
   * Método de domínio: deduzir estoque
   */
  decreaseStock(quantity: number): void {
    if (quantity > this.stock) {
      throw new Error('Insufficient stock');
    }
    this.stock -= quantity;
  }

  /**
   * Método de domínio: adicionar ao estoque
   */
  increaseStock(quantity: number): void {
    this.stock += quantity;
  }

  /**
   * Método de domínio: desativar produto
   */
  deactivate(): void {
    this.isActive = false;
  }

  /**
   * Método de domínio: ativar produto
   */
  activate(): void {
    this.isActive = true;
  }
}
