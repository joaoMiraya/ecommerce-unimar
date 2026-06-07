import { Entity, Column, JoinColumn, ManyToOne, Index } from 'typeorm';
import { BaseEntity } from '../../shared/entities/base.entity';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('address')
@Index(['userId'])
export class AddressEntity extends BaseEntity {
  @Column()
  userId: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column({ length: 120 })
  city: string;

  @Column()
  street: string;

  @Column()
  number: string;
  
  @Column()
  neighborhood: string;
  
  @Column()
  zipCode: string;

  constructor(props?: Partial<AddressEntity>) {
    super(props);
    if (props) {
      Object.assign(this, props);
    }
  }

  /**
   * Método de domínio: atualizar informações do endereço
   */
  updateInfo(
    props: Partial<
      Pick<
        AddressEntity,
        'city' | 'street' | 'number' | 'neighborhood' | 'zipCode'
      >
    >,
  ): void {
    if (props.city !== undefined) {
      if (props.city.trim().length === 0) {
        throw new Error('City cannot be empty');
      }
      this.city = props.city.trim();
    }

    if (props.street !== undefined) {
      if (props.street.trim().length === 0) {
        throw new Error('Street cannot be empty');
      }
      this.street = props.street.trim();
    }

    if (props.number !== undefined) {
      if (props.number.trim().length === 0) {
        throw new Error('Number cannot be empty');
      }
      this.number = props.number.trim();
    }

    if (props.neighborhood !== undefined) {
      this.neighborhood = props.neighborhood;
    }

    if (props.zipCode !== undefined) {
      if (!/^\d{5}-?\d{3}$/.test(props.zipCode)) {
        throw new Error('Invalid zip code format');
      }
      this.zipCode = props.zipCode;
    }
  }
}
