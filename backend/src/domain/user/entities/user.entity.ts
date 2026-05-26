import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../shared/entities/base.entity';

@Entity('users')
export class UserEntity extends BaseEntity {
  @Column({ length: 120 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;

  constructor(props?: Partial<UserEntity>) {
    super(props);
    if (props) {
      Object.assign(this, props);
    }
  }

  /**
   * Método de domínio: atualizar informações do usuário
   */
  updateInfo(name: string, email: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('User name cannot be empty');
    }
    this.name = name;
    this.email = email;
  }

  /**
   * Método de domínio: desativar usuário
   */
  deactivate(): void {
    this.isActive = false;
  }

  /**
   * Método de domínio: ativar usuário
   */
  activate(): void {
    this.isActive = true;
  }
}