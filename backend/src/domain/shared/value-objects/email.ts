/**
 * Value Object para Email
 * Encapsula validação e lógica de email
 * Imutável: uma vez criado, não pode ser alterado
 */
export class Email {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  /**
   * Factory method para criar um Email validado
   * @param value - String do email
   * @returns Email instance
   * @throws Error se email inválido
   */
  static create(value: string): Email {
    this.validate(value);
    return new Email(value.toLowerCase().trim());
  }

  private static validate(email: string): void {
    const normalizedEmail = email.toLowerCase().trim();

    // Validar comprimento
    if (!normalizedEmail || normalizedEmail.length > 254) {
      throw new Error('Invalid email format: length must be between 1 and 254 characters');
    }

    // Regex RFC 5322 simplificado
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      throw new Error(`Invalid email format: ${email}`);
    }

    // Validar domínio básico
    const [, domain] = normalizedEmail.split('@');
    if (!domain.includes('.')) {
      throw new Error('Invalid email format: domain must contain a dot');
    }

    const domainParts = domain.split('.');
    const hasValidTld = domainParts[domainParts.length - 1].length >= 2;
    if (!hasValidTld) {
      throw new Error('Invalid email format: invalid top-level domain');
    }
  }

  /**
   * Obtém o valor do email
   */
  get value(): string {
    return this._value;
  }

  /**
   * Compara dois emails (case-insensitive)
   */
  equals(other: Email): boolean {
    return this._value === other._value;
  }

  /**
   * Retorna string do email
   */
  toString(): string {
    return this._value;
  }

  /**
   * Obtém o local parte do email (antes do @)
   */
  get localPart(): string {
    return this._value.split('@')[0];
  }

  /**
   * Obtém o domínio do email (depois do @)
   */
  get domain(): string {
    return this._value.split('@')[1];
  }
}
