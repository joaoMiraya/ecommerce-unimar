/**
 * Interface do Unit of Work
 * Garante atomicidade de operações dentro de execute().
 *
 * Nota: nesta implementação, os repositories usam DataSource diretamente.
 * O UnitOfWork fornece rollback/commit como boundary transacional para
 * operações que falham no meio do caminho — mas cada repo.save() individual
 * já persiste imediatamente. Para transações ACID completas entre múltiplos
 * repos, seria necessário injetar o EntityManager transacional nos repos.
 */
export interface IUnitOfWork {
  execute<T>(work: () => Promise<T>): Promise<T>;
}
