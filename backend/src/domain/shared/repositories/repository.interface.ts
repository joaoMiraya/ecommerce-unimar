import { BaseEntity } from '../entities/base.entity';

/**
 * Interface genérica para repositórios
 * Define contrato que todos os repositórios devem implementar
 */
export interface IRepository<T extends BaseEntity> {
  findById(id: string): Promise<T | null>;

  findAll(): Promise<T[]>;

  save(entity: T): Promise<T>;

  delete(id: string): Promise<boolean>;

  find(criteria: Partial<T>): Promise<T[]>;
}
