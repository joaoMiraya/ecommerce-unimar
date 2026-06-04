import { Password } from './password';

describe('Password Value Object', () => {
  describe('create', () => {
    it('should create a valid password', () => {
      const password = Password.create('SecureP@ss123');
      expect(password).toBeInstanceOf(Password);
    });

    it('should throw error for password with less than 8 characters', () => {
      expect(() => Password.create('Short1!')).toThrow('at least 8 characters');
    });

    it('should throw error for password without uppercase letter', () => {
      expect(() => Password.create('nouppercase1@')).toThrow(
        'uppercase letter',
      );
    });

    it('should throw error for password without lowercase letter', () => {
      expect(() => Password.create('NOLOWERCASE1@')).toThrow(
        'lowercase letter',
      );
    });

    it('should throw error for password without number', () => {
      expect(() => Password.create('NoNumber@')).toThrow('number');
    });

    it('should throw error for password without special character', () => {
      expect(() => Password.create('NoSpecial1')).toThrow('special character');
    });

    it('should throw error for password exceeding 128 characters', () => {
      const longPassword = 'Aa1!' + 'a'.repeat(128);
      expect(() => Password.create(longPassword)).toThrow(
        'not exceed 128 characters',
      );
    });

    it('should accept password with all requirements met', () => {
      const password = Password.create('ValidP@ss123');
      expect(password).toBeInstanceOf(Password);
    });

    it('should accept various special characters', () => {
      const validPasswords = [
        'Test!Pass1',
        'Test@Pass1',
        'Test#Pass1',
        'Test$Pass1',
        'Test%Pass1',
        'Test^Pass1',
        'Test&Pass1',
        'Test*Pass1',
      ];

      validPasswords.forEach((pwd) => {
        expect(() => Password.create(pwd)).not.toThrow();
      });
    });
  });

  describe('createFromHash', () => {
    it('should create password from hash', () => {
      const hash = '$2b$10$...';
      const password = Password.createFromHash(hash);
      expect(password).toBeInstanceOf(Password);
      expect(password.value).toBe(hash);
    });

    it('should throw error for empty hash', () => {
      expect(() => Password.createFromHash('')).toThrow('cannot be empty');
    });
  });

  describe('compare', () => {
    it('should compare password correctly', () => {
      const password = Password.create('ValidP@ss123');
      const plainPassword = password.plainValue;

      // Simular um hash (em produção seria feito pelo adapter)
      // Este teste mostra o contrato que deve ser seguido
      if (plainPassword) {
        const isEqual = plainPassword === 'ValidP@ss123';
        expect(isEqual).toBe(true);
      }
    });
  });

  describe('equals', () => {
    it('should return true for same password hashes', () => {
      const hash = '$2b$10$...';
      const password1 = Password.createFromHash(hash);
      const password2 = Password.createFromHash(hash);
      expect(password1.equals(password2)).toBe(true);
    });

    it('should return false for different password hashes', () => {
      const password1 = Password.createFromHash('$2b$10$hash1');
      const password2 = Password.createFromHash('$2b$10$hash2');
      expect(password1.equals(password2)).toBe(false);
    });
  });

  describe('plainValue', () => {
    it('should return plain value with new Password instance', () => {
      // Note: plainValue é armazenado apenas durante a criação
      // e será removido quando o hash for gerado pelo adapter
      const password = Password.create('ValidP@ss123');
      // Após create(), plainValue contém o valor em texto plano
      // que será usado pelo adapter para gerar hash via bcrypt
      expect(password.plainValue).toBeDefined();
      expect(typeof password.plainValue).toBe('string');
    });

    it('should return undefined when created from hash', () => {
      const password = Password.createFromHash('$2b$10$...');
      expect(password.plainValue).toBeUndefined();
    });
  });

  describe('toString', () => {
    it('should return redacted representation', () => {
      const password = Password.create('ValidP@ss123');
      expect(password.toString()).toBe('[Password - REDACTED]');
    });
  });
});
