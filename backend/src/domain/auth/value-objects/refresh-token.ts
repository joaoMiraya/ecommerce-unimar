import { randomBytes } from 'crypto';

/**
 * Value Object para RefreshToken
 * Gerencia tokens de refresh com expiração e validação
 * Imutável: uma vez criado, não pode ser alterado
 */
export class RefreshToken {
  private readonly _value: string;
  private readonly _expiresAt: Date;
  private readonly _createdAt: Date;

  private constructor(value: string, expiresAt: Date, createdAt: Date = new Date()) {
    this._value = value;
    this._expiresAt = expiresAt;
    this._createdAt = createdAt;
  }

  /**
   * Factory method para criar um novo RefreshToken
   * @param expiresInDays - Dias até expiração (default: 7 dias)
   * @returns RefreshToken instance com token aleatório gerado
   */
  static create(expiresInDays: number = 7): RefreshToken {
    if (expiresInDays <= 0) {
      throw new Error('Expiration time must be greater than 0');
    }

    if (expiresInDays > 365) {
      throw new Error('Refresh token expiration cannot exceed 365 days');
    }

    // Gerar token seguro (32 bytes = 64 caracteres hex)
    const token = this.generateSecureToken();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + expiresInDays * 24 * 60 * 60 * 1000);

    return new RefreshToken(token, expiresAt, now);
  }

  /**
   * Factory method para criar a partir de um token existente
   * Usado ao carregar do banco de dados
   */
  static createFromExisting(
    value: string,
    expiresAt: Date,
    createdAt?: Date,
  ): RefreshToken {
    if (!value || value.length === 0) {
      throw new Error('Token value cannot be empty');
    }

    if (!expiresAt || !(expiresAt instanceof Date)) {
      throw new Error('Expiration date must be a valid Date');
    }

    return new RefreshToken(value, expiresAt, createdAt || new Date());
  }

  /**
   * Gera um token seguro e aleatório
   * @returns String hexadecimal de 64 caracteres
   */
  private static generateSecureToken(): string {
    return randomBytes(32).toString('hex');
  }

  /**
   * Obtém o valor do token
   */
  get value(): string {
    return this._value;
  }

  /**
   * Obtém a data de expiração
   */
  get expiresAt(): Date {
    return new Date(this._expiresAt.getTime()); // Retorna cópia para imutabilidade
  }

  /**
   * Obtém a data de criação
   */
  get createdAt(): Date {
    return new Date(this._createdAt.getTime()); // Retorna cópia para imutabilidade
  }

  /**
   * Verifica se o token expirou
   */
  isExpired(): boolean {
    return new Date() > this._expiresAt;
  }

  /**
   * Verifica se o token está válido (não expirado)
   */
  isValid(): boolean {
    return !this.isExpired();
  }

  /**
   * Obtém o tempo restante em segundos
   * Retorna número negativo se já expirou
   */
  getTimeRemainingInSeconds(): number {
    const now = new Date();
    return Math.floor((this._expiresAt.getTime() - now.getTime()) / 1000);
  }

  /**
   * Obtém o tempo restante em dias
   */
  getTimeRemainingInDays(): number {
    const secondsRemaining = this.getTimeRemainingInSeconds();
    return Math.floor(secondsRemaining / (24 * 60 * 60));
  }

  /**
   * Verifica se o token está próximo de expirar (menos de 24 horas)
   */
  isExpiringSoon(): boolean {
    const timeRemaining = this.getTimeRemainingInSeconds();
    return timeRemaining > 0 && timeRemaining < 24 * 60 * 60; // Menos de 24 horas
  }

  /**
   * Compara dois RefreshTokens
   */
  equals(other: RefreshToken): boolean {
    return this._value === other._value;
  }

  /**
   * Retorna representação string segura
   */
  toString(): string {
    return `[RefreshToken - Created: ${this._createdAt.toISOString()}, Expires: ${this._expiresAt.toISOString()}, Valid: ${this.isValid()}]`;
  }

  /**
   * Converte para objeto simples para persistência
   */
  toJSON(): {
    value: string;
    expiresAt: string;
    createdAt: string;
  } {
    return {
      value: this._value,
      expiresAt: this._expiresAt.toISOString(),
      createdAt: this._createdAt.toISOString(),
    };
  }
}
