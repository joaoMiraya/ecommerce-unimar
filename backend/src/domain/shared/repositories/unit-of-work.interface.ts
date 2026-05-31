/**
 * Interface do Unit of Work
 * Define contrato para gerenciar transações e múltiplos repositórios
 */
export interface IUnitOfWork {
  begin(): Promise<void>;

  commit(): Promise<void>;

  rollback(): Promise<void>;

  saveChanges(): Promise<void>;

  execute<T>(work: () => Promise<T>): Promise<T>;

  isTransactionActive(): boolean;
}
