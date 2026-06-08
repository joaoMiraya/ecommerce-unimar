import { Injectable } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import type { IUnitOfWork } from '../../../domain/shared/repositories/unit-of-work.interface';

/**
 * Implementação stateless do Unit of Work.
 * Cada chamada a execute() cria seu próprio QueryRunner,
 * evitando race conditions entre requests concorrentes.
 */
@Injectable()
export class UnitOfWork implements IUnitOfWork {
  constructor(private readonly dataSource: DataSource) {}

  async execute<T>(work: () => Promise<T>): Promise<T> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const result = await work();
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
