import { Injectable } from '@nestjs/common';
import { AddressEntity } from 'src/domain/address/entities/address.entity';
import { IAddressRepository } from 'src/domain/address/repositories/address.repository';
import { DataSource, FindOptionsWhere } from 'typeorm';

/**
 * Implementação de IUserRepository
 * Fornece acesso a dados de usuários usando TypeORM
 */
@Injectable()
export class AddressRepositoryImpl implements IAddressRepository {
  constructor(private readonly dataSource: DataSource) {}

  /**
   * Buscar usuário por ID
   */
  async findByUserId(id: string): Promise<AddressEntity | null> {
    return this.dataSource
      .getRepository(AddressEntity)
      .findOne({ where: { id } });
  }

  /**
   * Buscar usuário por ID
   */
  async findById(id: string): Promise<AddressEntity | null> {
    return this.dataSource
      .getRepository(AddressEntity)
      .findOne({ where: { id } });
  }

  /**
   * Buscar todos os usuários
   */
  async findAll(): Promise<AddressEntity[]> {
    return this.dataSource.getRepository(AddressEntity).find();
  }

  /**
   * Buscar com critérios customizados
   */
  async find(criteria: Partial<AddressEntity>): Promise<AddressEntity[]> {
    const where: FindOptionsWhere<AddressEntity> = {};

    if (criteria.id) where.id = criteria.id;
    if (criteria.street) where.street = criteria.street;
    if (criteria.city) where.city = criteria.city;
    if (criteria.zipCode) where.zipCode = criteria.zipCode;

    return this.dataSource.getRepository(AddressEntity).find({ where });
  }

  /**
   * Salvar usuário (criar ou atualizar)
   */
  async save(entity: AddressEntity): Promise<AddressEntity> {
    return this.dataSource.getRepository(AddressEntity).save(entity);
  }

  /**
   * Deletar usuário por ID
   */
  async delete(id: string): Promise<boolean> {
    const result = await this.dataSource
      .getRepository(AddressEntity)
      .delete({ id });
    return (result.affected ?? 0) > 0;
  }
}
