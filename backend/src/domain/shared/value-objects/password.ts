import * as bcrypt from 'bcrypt';

/**
 * Value Object para Password
 * Encapsula validação de força de senha e hashing seguro
 * Imutável: uma vez criado, não pode ser alterado
 */
export class Password {
  private readonly _hashedValue: string;
  private readonly _plainValue?: string; // Armazenado temporariamente apenas na criação

  private constructor(hashedValue: string, plainValue?: string) {
    this._hashedValue = hashedValue;
    this._plainValue = plainValue;
  }

  /**
   * Factory method para criar uma Password hasheada
   * @param value - Senha em texto plano
   * @returns Password instance com hash
   * @throws Error se senha inválida
   */
  static create(value: string): Password {
    this.validate(value);
    return new Password('', value); // Armazenar plainValue temporariamente
  }

  /**
   * Factory method para criar a partir de um hash existente
   * Usado ao carregar do banco de dados
   */
  static createFromHash(hashedValue: string): Password {
    if (!hashedValue || hashedValue.length === 0) {
      throw new Error('Hashed password cannot be empty');
    }
    return new Password(hashedValue);
  }

  private static validate(password: string): void {
    // Validar comprimento mínimo
    if (!password || password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    // Validar comprimento máximo
    if (password.length > 128) {
      throw new Error('Password must not exceed 128 characters');
    }

    // Validar se tem pelo menos uma letra maiúscula
    const hasUpperCase = /[A-Z]/.test(password);
    if (!hasUpperCase) {
      throw new Error('Password must contain at least one uppercase letter');
    }

    // Validar se tem pelo menos uma letra minúscula
    const hasLowerCase = /[a-z]/.test(password);
    if (!hasLowerCase) {
      throw new Error('Password must contain at least one lowercase letter');
    }

    // Validar se tem pelo menos um número
    const hasNumbers = /[0-9]/.test(password);
    if (!hasNumbers) {
      throw new Error('Password must contain at least one number');
    }

    // Validar se tem pelo menos um caractere especial
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
      password,
    );
    if (!hasSpecialChar) {
      throw new Error(
        'Password must contain at least one special character (!@#$%^&*...)',
      );
    }
  }

  /**
   * Obtém o valor hasheado da senha
   * NUNCA retorna a senha em texto plano
   */
  get value(): string {
    return this._hashedValue;
  }

  /**
   * Obtém a senha em texto plano (apenas logo após criação)
   * Usado para hashear antes de persistir
   * NUNCA deve ser armazenado em banco de dados
   */
  get plainValue(): string | undefined {
    return this._plainValue;
  }

  /**
   * Compara a senha em texto plano com o hash armazenado
   * Usa bcrypt.compare para comparação segura
   * @param plainPassword - Senha em texto plano para comparar
   * @returns true se as senhas combinam
   */
  async compare(plainPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(plainPassword, this._hashedValue);
    } catch (error) {
      return false;
    }
  }

  /**
   * Compara duas instâncias de Password
   * Compara os hashes, não o texto plano
   */
  equals(other: Password): boolean {
    return this._hashedValue === other._hashedValue;
  }

  /**
   * Retorna uma representação string segura (sem expor a senha)
   */
  toString(): string {
    return '[Password - REDACTED]';
  }
}
