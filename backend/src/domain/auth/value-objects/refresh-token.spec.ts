import { RefreshToken } from './refresh-token';

describe('RefreshToken Value Object', () => {
  describe('create', () => {
    it('should create a valid refresh token', () => {
      const token = RefreshToken.create();
      expect(token).toBeInstanceOf(RefreshToken);
      expect(token.value).toBeDefined();
      expect(token.value.length).toBe(64); // 32 bytes = 64 hex chars
    });

    it('should create token with custom expiration days', () => {
      const token = RefreshToken.create(14);
      expect(token).toBeInstanceOf(RefreshToken);
      expect(token.expiresAt.getTime()).toBeGreaterThan(new Date().getTime());
    });

    it('should throw error for expiration <= 0', () => {
      expect(() => RefreshToken.create(0)).toThrow('greater than 0');
      expect(() => RefreshToken.create(-1)).toThrow('greater than 0');
    });

    it('should throw error for expiration > 365 days', () => {
      expect(() => RefreshToken.create(366)).toThrow('cannot exceed 365 days');
    });

    it('should generate unique tokens', () => {
      const token1 = RefreshToken.create();
      const token2 = RefreshToken.create();
      expect(token1.value).not.toBe(token2.value);
    });

    it('should set expiration in future', () => {
      const beforeCreation = new Date();
      const token = RefreshToken.create(7);
      const afterCreation = new Date();

      expect(token.expiresAt.getTime()).toBeGreaterThan(
        afterCreation.getTime(),
      );
      expect(
        token.expiresAt.getTime() - beforeCreation.getTime(),
      ).toBeGreaterThan(
        7 * 24 * 60 * 60 * 1000 - 1000, // Account for execution time
      );
    });
  });

  describe('createFromExisting', () => {
    it('should create token from existing values', () => {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      const token = RefreshToken.createFromExisting('token123', expiresAt, now);

      expect(token.value).toBe('token123');
      expect(token.expiresAt).toEqual(expiresAt);
      expect(token.createdAt).toEqual(now);
    });

    it('should throw error for empty token value', () => {
      const expiresAt = new Date();
      expect(() => RefreshToken.createFromExisting('', expiresAt)).toThrow(
        'cannot be empty',
      );
    });

    it('should throw error for invalid expiration date', () => {
      expect(() =>
        RefreshToken.createFromExisting('token', null as unknown as Date),
      ).toThrow('must be a valid Date');
    });
  });

  describe('isExpired', () => {
    it('should return false for valid token', () => {
      const token = RefreshToken.create(7);
      expect(token.isExpired()).toBe(false);
    });

    it('should return true for expired token', () => {
      const now = new Date();
      const pastDate = new Date(now.getTime() - 1000); // 1 second ago
      const token = RefreshToken.createFromExisting('expired', pastDate);
      expect(token.isExpired()).toBe(true);
    });
  });

  describe('isValid', () => {
    it('should return true for valid token', () => {
      const token = RefreshToken.create(7);
      expect(token.isValid()).toBe(true);
    });

    it('should return false for expired token', () => {
      const pastDate = new Date(new Date().getTime() - 1000);
      const token = RefreshToken.createFromExisting('token', pastDate);
      expect(token.isValid()).toBe(false);
    });
  });

  describe('getTimeRemainingInSeconds', () => {
    it('should return positive value for valid token', () => {
      const token = RefreshToken.create(1);
      const timeRemaining = token.getTimeRemainingInSeconds();
      expect(timeRemaining).toBeGreaterThan(0);
      expect(timeRemaining).toBeLessThanOrEqual(24 * 60 * 60);
    });

    it('should return negative value for expired token', () => {
      const pastDate = new Date(new Date().getTime() - 1000);
      const token = RefreshToken.createFromExisting('token', pastDate);
      expect(token.getTimeRemainingInSeconds()).toBeLessThan(0);
    });
  });

  describe('getTimeRemainingInDays', () => {
    it('should return days remaining', () => {
      const token = RefreshToken.create(7);
      const daysRemaining = token.getTimeRemainingInDays();
      expect(daysRemaining).toBeGreaterThanOrEqual(6); // Account for seconds elapsed
      expect(daysRemaining).toBeLessThanOrEqual(7);
    });
  });

  describe('isExpiringSoon', () => {
    it('should return true if expiring within 24 hours', () => {
      const now = new Date();
      const soonDate = new Date(now.getTime() + 12 * 60 * 60 * 1000); // 12 hours
      const token = RefreshToken.createFromExisting('token', soonDate);
      expect(token.isExpiringSoon()).toBe(true);
    });

    it('should return false if more than 24 hours remain', () => {
      const token = RefreshToken.create(7);
      expect(token.isExpiringSoon()).toBe(false);
    });

    it('should return false if already expired', () => {
      const pastDate = new Date(new Date().getTime() - 1000);
      const token = RefreshToken.createFromExisting('token', pastDate);
      expect(token.isExpiringSoon()).toBe(false);
    });
  });

  describe('equals', () => {
    it('should return true for same token values', () => {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      const token1 = RefreshToken.createFromExisting(
        'same-token',
        expiresAt,
        now,
      );
      const token2 = RefreshToken.createFromExisting(
        'same-token',
        expiresAt,
        now,
      );
      expect(token1.equals(token2)).toBe(true);
    });

    it('should return false for different token values', () => {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      const token1 = RefreshToken.createFromExisting('token1', expiresAt, now);
      const token2 = RefreshToken.createFromExisting('token2', expiresAt, now);
      expect(token1.equals(token2)).toBe(false);
    });
  });

  describe('toJSON', () => {
    it('should serialize to JSON with ISO strings', () => {
      const token = RefreshToken.create(7);
      const json = token.toJSON();

      expect(json.value).toBe(token.value);
      expect(json.expiresAt).toBe(token.expiresAt.toISOString());
      expect(json.createdAt).toBe(token.createdAt.toISOString());
    });
  });

  describe('immutability', () => {
    it('should return copy of dates to maintain immutability', () => {
      const token = RefreshToken.create(7);
      const expiresAt1 = token.expiresAt;
      const expiresAt2 = token.expiresAt;

      expect(expiresAt1).not.toBe(expiresAt2);
      expect(expiresAt1).toEqual(expiresAt2);
    });
  });
});
