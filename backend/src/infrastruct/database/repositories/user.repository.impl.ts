import { Injectable } from '@nestjs/common';
import { DataSource, FindOptionsWhere } from 'typeorm';
import type { IUserRepository } from '../../../domain/user/repositories/user.repository';
import { UserEntity } from '../../../domain/user/entities/user.entity';

/**
 * Implementação de IUserRepository
 * Fornece acesso a dados de usuários usando TypeORM
 */
@Injectable()
export class UserRepositoryImpl implements IUserRepository {
  constructor(private readonly dataSource: DataSource) {}

  /**
   * Buscar usuário por ID
   */
  async findById(id: string): Promise<UserEntity | null> {
    return this.dataSource.getRepository(UserEntity).findOne({ where: { id } });
  }

  /**
   * Buscar todos os usuários
   */
  async findAll(): Promise<UserEntity[]> {
    return this.dataSource.getRepository(UserEntity).find();
  }

  /**
   * Salvar usuário (criar ou atualizar)
   */
  async save(entity: UserEntity): Promise<UserEntity> {
    return this.dataSource.getRepository(UserEntity).save(entity);
  }

  /**
   * Deletar usuário por ID
   */
  async delete(id: string): Promise<boolean> {
    const result = await this.dataSource
      .getRepository(UserEntity)
      .delete({ id });
    return (result.affected ?? 0) > 0;
  }

  /**
   * Buscar com critérios customizados
   */
  async find(criteria: Partial<UserEntity>): Promise<UserEntity[]> {
    const where: FindOptionsWhere<UserEntity> = {};

    if (criteria.id) where.id = criteria.id;
    if (criteria.name) where.name = criteria.name;
    if (criteria.email) where.email = criteria.email;
    if (criteria.isActive !== undefined) where.isActive = criteria.isActive;

    return this.dataSource.getRepository(UserEntity).find({ where });
  }

  /**
   * Buscar usuário por email
   */
  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.dataSource
      .getRepository(UserEntity)
      .findOne({ where: { email } });
  }

  /**
   * Verificar se email já existe
   */
  async emailExists(email: string): Promise<boolean> {
    const user = await this.findByEmail(email);
    return user !== null;
  }
}
