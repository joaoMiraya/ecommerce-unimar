import { IRepository } from '../../shared/repositories/repository.interface';
import { AddressEntity } from '../entities/address.entity';

/**
 * Interface do Repositório de User
 * Contrato que a implementação em Infrastructure deve seguir
 */
export interface IAddressRepository extends IRepository<AddressEntity> {
  /**
   * Buscar endereço por id de usuário
   */
  findByUserId(email: string): Promise<AddressEntity | null>;
}
