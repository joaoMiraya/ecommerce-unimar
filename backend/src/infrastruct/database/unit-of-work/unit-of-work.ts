import { Injectable } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import type { IUnitOfWork } from '../../../domain/shared/repositories/unit-of-work.interface';

/**
 * Implementação do padrão Unit of Work
 * Gerencia transações e múltiplos repositórios
 * Garante atomicidade de operações sobre múltiplas entidades
 */
@Injectable()
export class UnitOfWork implements IUnitOfWork {
  private queryRunner: QueryRunner | null = null;

  constructor(private readonly dataSource: DataSource) {}

  /**
   * Iniciar uma transação
   */
  async begin(): Promise<void> {
    if (this.queryRunner) {
      throw new Error('Transaction already started');
    }

    this.queryRunner = this.dataSource.createQueryRunner();
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();
  }

  /**
   * Confirmar todas as mudanças (commit)
   */
  async commit(): Promise<void> {
    if (!this.queryRunner) {
      throw new Error('No active transaction');
    }

    try {
      await this.queryRunner.commitTransaction();
    } finally {
      await this.queryRunner.release();
      this.queryRunner = null;
    }
  }

  /**
   * Descartar todas as mudanças (rollback)
   */
  async rollback(): Promise<void> {
    if (!this.queryRunner) {
      throw new Error('No active transaction');
    }

    try {
      await this.queryRunner.rollbackTransaction();
    } finally {
      await this.queryRunner.release();
      this.queryRunner = null;
    }
  }

  /**
   * Salvar mudanças na transação atual
   */
  // eslint-disable-next-line @typescript-eslint/require-await
  async saveChanges(): Promise<void> {
    // No TypeORM, as mudanças são salvas automaticamente
    // Este método é um placeholder para compatibilidade com a interface
    if (!this.queryRunner) {
      throw new Error('No active transaction');
    }
  }

  /**
   * Executar operação dentro de uma transação
   * Útil para operações que precisam ser atômicas
   */
  async execute<T>(work: () => Promise<T>): Promise<T> {
    await this.begin();
    try {
      const result = await work();
      await this.commit();
      return result;
    } catch (error) {
      await this.rollback();
      throw error;
    }
  }

  /**
   * Verificar se há transação ativa
   */
  isTransactionActive(): boolean {
    return this.queryRunner !== null && this.queryRunner.isTransactionActive;
  }

  /**
   * Obter o QueryRunner ativo (uso interno)
   * Repositórios usam isso para executar queries dentro da transação
   */
  getQueryRunner(): QueryRunner {
    if (!this.queryRunner) {
      throw new Error('No active transaction');
    }
    return this.queryRunner;
  }
}
