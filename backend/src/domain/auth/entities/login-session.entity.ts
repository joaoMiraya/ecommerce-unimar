import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../shared/entities/base.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { RefreshToken } from '../value-objects/refresh-token';

/**
 * Entidade de Autenticação: LoginSession
 * Representa uma sessão de login ativa do usuário
 * Encapsula todos os dados necessários para gerenciar autenticação e refresh tokens
 */
@Entity('login_sessions')
@Index(['userId', 'isActive'])
@Index(['refreshTokenValue']) // Para buscar sessões por refresh token
export class LoginSessionEntity extends BaseEntity {
  @Column()
  userId: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column()
  accessToken: string;

  @Column({ type: 'text' })
  refreshTokenValue: string;

  @Column({ type: 'timestamp' })
  refreshTokenExpiresAt: Date;

  @Column({ type: 'timestamp' })
  refreshTokenCreatedAt: Date;

  @Column({ type: 'timestamp' })
  issuedAt: Date;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastUsedAt: Date | null;

  @Column({ type: 'varchar', length: 15, nullable: true })
  ipAddress: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  userAgent: string | null;

  @Column({ default: true })
  isActive: boolean;

  private _refreshToken?: RefreshToken;

  constructor(props?: Partial<LoginSessionEntity>) {
    super(props);
    if (props) {
      Object.assign(this, props);
    }
  }

  /**
   * Factory method para criar uma nova sessão de login
   */
  static create(props: {
    userId: string;
    accessToken: string;
    refreshToken: RefreshToken;
    issuedAt: Date;
    expiresAt: Date;
    ipAddress?: string;
    userAgent?: string;
  }): LoginSessionEntity {
    const session = new LoginSessionEntity();
    session.userId = props.userId;
    session.accessToken = props.accessToken;
    session.refreshTokenValue = props.refreshToken.value;
    session.refreshTokenExpiresAt = props.refreshToken.expiresAt;
    session.refreshTokenCreatedAt = props.refreshToken.createdAt;
    session.issuedAt = props.issuedAt;
    session.expiresAt = props.expiresAt;
    session.lastUsedAt = null;
    session.ipAddress = props.ipAddress || null;
    session.userAgent = props.userAgent || null;
    session.isActive = true;
    session._refreshToken = props.refreshToken;

    return session;
  }

  /**
   * Reconstrói o VO de RefreshToken a partir dos dados armazenados
   */
  private getRefreshToken(): RefreshToken {
    if (!this._refreshToken) {
      this._refreshToken = RefreshToken.createFromExisting(
        this.refreshTokenValue,
        this.refreshTokenExpiresAt,
        this.refreshTokenCreatedAt,
      );
    }
    return this._refreshToken;
  }

  /**
   * Verifica se a sessão (access token) expirou
   */
  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  /**
   * Verifica se o access token está válido (não expirado e sessão ativa)
   */
  isTokenValid(): boolean {
    return this.isActive && !this.isExpired();
  }

  /**
   * Verifica se o refresh token está válido
   */
  isRefreshTokenValid(): boolean {
    if (!this.isActive) {
      return false;
    }
    return this.getRefreshToken().isValid();
  }

  /**
   * Verifica se o refresh token está próximo de expirar (< 24h)
   */
  isRefreshTokenExpiringSoon(): boolean {
    return this.getRefreshToken().isExpiringSoon();
  }

  /**
   * Atualiza a data de último uso da sessão
   * Chamado sempre que o usuário faz uma requisição autenticada
   */
  updateLastUsed(): void {
    if (!this.isActive) {
      throw new Error('Cannot update last used on inactive session');
    }
    this.lastUsedAt = new Date();
  }

  /**
   * Atualiza o access token e data de expiração
   * Usado quando o access token é renovado via refresh token
   */
  renewAccessToken(newAccessToken: string, newExpiresAt: Date): void {
    if (!this.isActive) {
      throw new Error('Cannot renew token on inactive session');
    }

    if (!this.isRefreshTokenValid()) {
      throw new Error('Cannot renew: refresh token is invalid or expired');
    }

    this.accessToken = newAccessToken;
    this.expiresAt = newExpiresAt;
    this.lastUsedAt = new Date();
  }

  /**
   * Renova o refresh token
   * Cria um novo refresh token e armazena os dados
   */
  renewRefreshToken(newRefreshToken: RefreshToken): void {
    if (!this.isActive) {
      throw new Error('Cannot renew refresh token on inactive session');
    }

    this.refreshTokenValue = newRefreshToken.value;
    this.refreshTokenExpiresAt = newRefreshToken.expiresAt;
    this.refreshTokenCreatedAt = newRefreshToken.createdAt;
    this._refreshToken = newRefreshToken;
  }

  /**
   * Revoga (desativa) a sessão
   * O usuário precisará fazer login novamente
   */
  revoke(): void {
    this.isActive = false;
  }

  /**
   * Ativa a sessão
   */
  activate(): void {
    this.isActive = true;
  }

  /**
   * Verifica se a sessão está expirada e pode ser removida
   */
  canBeDeleted(): boolean {
    // Sessão pode ser deletada se expirou e refresh token também expirou
    return this.isExpired() && this.getRefreshToken().isExpired();
  }

  /**
   * Retorna o tempo restante da sessão em segundos
   */
  getAccessTokenTimeRemainingInSeconds(): number {
    const now = new Date();
    return Math.floor((this.expiresAt.getTime() - now.getTime()) / 1000);
  }

  /**
   * Retorna o tempo restante do refresh token em segundos
   */
  getRefreshTokenTimeRemainingInSeconds(): number {
    return this.getRefreshToken().getTimeRemainingInSeconds();
  }

  /**
   * Verifica se a sessão é recente (criada há menos de 5 minutos)
   */
  isRecent(): boolean {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return this.issuedAt > fiveMinutesAgo;
  }

  /**
   * Compara duas sessões
   */
  equals(other: LoginSessionEntity): boolean {
    return this.id === other.id;
  }
}
