import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Classe base para todas as entidades do domínio
 * Fornece propriedades comuns: id, createdAt, updatedAt
 */
export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  constructor(props?: Partial<BaseEntity>) {
    if (props) {
      Object.assign(this, props);
    }
  }
}
