import { LoginSessionEntity } from '../entities/login-session.entity';

/**
 * Interface do Repositório de Autenticação
 * Contrato que a implementação em Infrastructure deve seguir
 */
export interface IAuthRepository {
  /**
   * Buscar sessão de login ativa por userId
   * @param userId - ID do usuário
   * @returns Sessão ativa ou null
   */
  findByUserId(userId: string): Promise<LoginSessionEntity | null>;

  /**
   * Buscar sessão por ID
   * @param sessionId - ID da sessão
   * @returns Sessão ou null
   */
  findById(sessionId: string): Promise<LoginSessionEntity | null>;

  /**
   * Buscar sessão ativa (não expirada e não revogada) por userId
   * @param userId - ID do usuário
   * @returns Primeira sessão ativa ou null
   */
  findActiveSession(userId: string): Promise<LoginSessionEntity | null>;

  /**
   * Buscar sessão por refresh token
   * @param refreshToken - Valor do refresh token
   * @returns Sessão que contém este refresh token ou null
   */
  findByRefreshToken(refreshToken: string): Promise<LoginSessionEntity | null>;

  /**
   * Salvar nova sessão
   * @param session - Sessão para persistir
   * @returns Sessão salva com ID
   */
  saveSession(session: LoginSessionEntity): Promise<LoginSessionEntity>;

  /**
   * Atualizar sessão existente
   * @param session - Sessão com dados atualizados
   * @returns Sessão atualizada
   */
  updateSession(session: LoginSessionEntity): Promise<LoginSessionEntity>;

  /**
   * Revogar (desativar) uma sessão
   * @param sessionId - ID da sessão a revogar
   * @returns true se revogada, false se não encontrada
   */
  revokeSession(sessionId: string): Promise<boolean>;

  /**
   * Revogar todas as sessões de um usuário
   * @param userId - ID do usuário
   * @returns Número de sessões revogadas
   */
  revokeAllUserSessions(userId: string): Promise<number>;

  /**
   * Deletar sessões expiradas
   * (Limpeza de banco de dados)
   * @returns Número de sessões deletadas
   */
  deleteExpiredSessions(): Promise<number>;

  /**
   * Verificar se existe sessão ativa para um usuário
   * @param userId - ID do usuário
   * @returns true se existe pelo menos uma sessão ativa
   */
  hasActiveSessions(userId: string): Promise<boolean>;

  /**
   * Contar sessões ativas de um usuário
   * @param userId - ID do usuário
   * @returns Número de sessões ativas
   */
  countActiveSessions(userId: string): Promise<number>;

  /**
   * Listar todas as sessões ativas de um usuário
   * @param userId - ID do usuário
   * @returns Array de sessões ativas
   */
  findAllActiveSessionsByUserId(userId: string): Promise<LoginSessionEntity[]>;
}
