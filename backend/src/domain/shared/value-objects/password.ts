/**
 * Value Object para Password
 * Encapsula validação de força de senha
 */
export class Password {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(value: string): Password {
    this.validate(value);
    return new Password(value);
  }

  private static validate(password: string): void {
    // Validar comprimento mínimo e força
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    // Validar se tem pelo menos um número e uma letra
    const hasLetters = /[a-zA-Z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);

    if (!hasLetters || !hasNumbers) {
      throw new Error('Password must contain both letters and numbers');
    }
  }

  get value(): string {
    return this._value;
  }

  equals(other: Password): boolean {
    return this._value === other._value;
  }
}
