import { IRepository } from '../../shared/repositories/repository.interface';
import { UserEntity } from '../entities/user.entity';

/**
 * Interface do Repositório de User
 * Contrato que a implementação em Infrastructure deve seguir
 */
export interface IUserRepository extends IRepository<UserEntity> {
  /**
   * Buscar usuário por email
   */
  findByEmail(email: string): Promise<UserEntity | null>;

  /**
   * Verificar se email já existe
   */
  emailExists(email: string): Promise<boolean>;
}
