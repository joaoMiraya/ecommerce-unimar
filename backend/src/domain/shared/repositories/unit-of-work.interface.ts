/**
 * Interface do Unit of Work
 * Define contrato para gerenciar transações e múltiplos repositórios
 */
export interface IUnitOfWork {
  /**
   * Iniciar uma transação
   */
  begin(): Promise<void>;

  /**
   * Confirmar todas as mudanças (commit)
   */
  commit(): Promise<void>;

  /**
   * Descartar todas as mudanças (rollback)
   */
  rollback(): Promise<void>;

  /**
   * Salvar mudanças na transação atual
   */
  saveChanges(): Promise<void>;

  /**
   * Executar operação dentro de uma transação
   */
  execute<T>(work: () => Promise<T>): Promise<T>;

  /**
   * Verificar se há transação ativa
   */
  isTransactionActive(): boolean;
}
