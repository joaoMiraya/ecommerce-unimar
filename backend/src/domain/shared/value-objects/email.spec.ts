import { Email } from './email';

describe('Email Value Object', () => {
  describe('create', () => {
    it('should create a valid email', () => {
      const email = Email.create('user@example.com');
      expect(email).toBeInstanceOf(Email);
      expect(email.value).toBe('user@example.com');
    });

    it('should normalize email to lowercase', () => {
      const email = Email.create('USER@EXAMPLE.COM');
      expect(email.value).toBe('user@example.com');
    });

    it('should trim whitespace', () => {
      const email = Email.create('  user@example.com  ');
      expect(email.value).toBe('user@example.com');
    });

    it('should throw error for invalid email format', () => {
      expect(() => Email.create('invalid-email')).toThrow();
      expect(() => Email.create('user@')).toThrow();
      expect(() => Email.create('@example.com')).toThrow();
      expect(() => Email.create('user@domain')).toThrow();
    });

    it('should throw error for empty email', () => {
      expect(() => Email.create('')).toThrow();
    });

    it('should throw error for email exceeding max length', () => {
      const longEmail = 'a'.repeat(255) + '@example.com';
      expect(() => Email.create(longEmail)).toThrow();
    });
  });

  describe('equals', () => {
    it('should return true for same emails', () => {
      const email1 = Email.create('user@example.com');
      const email2 = Email.create('user@example.com');
      expect(email1.equals(email2)).toBe(true);
    });

    it('should return false for different emails', () => {
      const email1 = Email.create('user1@example.com');
      const email2 = Email.create('user2@example.com');
      expect(email1.equals(email2)).toBe(false);
    });

    it('should be case insensitive', () => {
      const email1 = Email.create('USER@EXAMPLE.COM');
      const email2 = Email.create('user@example.com');
      expect(email1.equals(email2)).toBe(true);
    });
  });

  describe('localPart', () => {
    it('should return local part of email', () => {
      const email = Email.create('john.doe@example.com');
      expect(email.localPart).toBe('john.doe');
    });
  });

  describe('domain', () => {
    it('should return domain of email', () => {
      const email = Email.create('john.doe@example.com');
      expect(email.domain).toBe('example.com');
    });
  });

  describe('toString', () => {
    it('should return email value as string', () => {
      const email = Email.create('user@example.com');
      expect(email.toString()).toBe('user@example.com');
    });
  });
});
