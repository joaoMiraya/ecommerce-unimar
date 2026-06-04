import * as bcrypt from 'bcrypt';

export class Password {
  private readonly _hashedValue: string;

  private constructor(hashedValue: string) {
    this._hashedValue = hashedValue;
  }

  /** Cria uma senha hasheada a partir do texto plano */
  static async create(value: string): Promise<Password> {
    Password.validate(value);
    const hashed = await bcrypt.hash(value, 12);
    return new Password(hashed);
  }

  /** Reconstitui a partir de um hash existente (vindo do banco) */
  static createFromHash(hashedValue: string): Password {
    if (!hashedValue) {
      throw new Error('Hashed password cannot be empty');
    }
    return new Password(hashedValue);
  }

  private static validate(password: string): void {
    if (!password || password.length < 8)
      throw new Error('Password must be at least 8 characters long');
    if (password.length > 128)
      throw new Error('Password must not exceed 128 characters');
    if (!/[A-Z]/.test(password))
      throw new Error('Password must contain at least one uppercase letter');
    if (!/[a-z]/.test(password))
      throw new Error('Password must contain at least one lowercase letter');
    if (!/[0-9]/.test(password))
      throw new Error('Password must contain at least one number');
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password))
      throw new Error('Password must contain at least one special character');
  }

  /** Hash da senha — nunca expõe o texto plano */
  get value(): string {
    return this._hashedValue;
  }

  /** Verifica se uma senha em texto plano corresponde ao hash */
  async compare(plainPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(plainPassword, this._hashedValue);
    } catch {
      return false;
    }
  }

  /**
   * Compara dois objetos Password pelo hash armazenado.
   * Útil apenas quando ambos foram reconstituídos do banco com o mesmo hash.
   */
  equals(other: Password): boolean {
    return this._hashedValue === other._hashedValue;
  }
}
