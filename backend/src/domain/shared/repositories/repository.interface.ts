import { BaseEntity } from '../entities/base.entity';

/**
 * Interface genérica para repositórios
 * Define contrato que todos os repositórios devem implementar
 */
export interface IRepository<T extends BaseEntity> {
  /**
   * Buscar entidade por ID
   */
  findById(id: string): Promise<T | null>;

  /**
   * Buscar todas as entidades
   */
  findAll(): Promise<T[]>;

  /**
   * Salvar (criar ou atualizar) entidade
   */
  save(entity: T): Promise<T>;

  /**
   * Deletar entidade por ID
   */
  delete(id: string): Promise<boolean>;

  /**
   * Buscar com critérios customizados
   */
  find(criteria: Partial<T>): Promise<T[]>;
}
