import { LoginSessionEntity } from './login-session.entity';
import { RefreshToken } from '../value-objects/refresh-token';

describe('LoginSessionEntity', () => {
  const mockUserId = '550e8400-e29b-41d4-a716-446655440000';
  const mockAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

  describe('create', () => {
    it('should create a valid login session', () => {
      const refreshToken = RefreshToken.create(7);
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 15 * 60 * 1000); // 15 min

      const session = LoginSessionEntity.create({
        userId: mockUserId,
        accessToken: mockAccessToken,
        refreshToken,
        issuedAt: now,
        expiresAt,
      });

      expect(session).toBeInstanceOf(LoginSessionEntity);
      expect(session.userId).toBe(mockUserId);
      expect(session.accessToken).toBe(mockAccessToken);
      expect(session.isActive).toBe(true);
      expect(session.refreshTokenValue).toBe(refreshToken.value);
    });

    it('should include optional fields when provided', () => {
      const refreshToken = RefreshToken.create(7);
      const now = new Date();

      const session = LoginSessionEntity.create({
        userId: mockUserId,
        accessToken: mockAccessToken,
        refreshToken,
        issuedAt: now,
        expiresAt: new Date(now.getTime() + 15 * 60 * 1000),
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0...',
      });

      expect(session.ipAddress).toBe('192.168.1.1');
      expect(session.userAgent).toBe('Mozilla/5.0...');
    });
  });

  describe('isExpired', () => {
    it('should return false for valid session', () => {
      const refreshToken = RefreshToken.create(7);
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 15 * 60 * 1000);

      const session = LoginSessionEntity.create({
        userId: mockUserId,
        accessToken: mockAccessToken,
        refreshToken,
        issuedAt: now,
        expiresAt,
      });

      expect(session.isExpired()).toBe(false);
    });

    it('should return true for expired session', () => {
      const refreshToken = RefreshToken.create(7);
      const now = new Date();
      const pastExpiresAt = new Date(now.getTime() - 1000);

      const session = LoginSessionEntity.create({
        userId: mockUserId,
        accessToken: mockAccessToken,
        refreshToken,
        issuedAt: new Date(now.getTime() - 20 * 60 * 1000),
        expiresAt: pastExpiresAt,
      });

      expect(session.isExpired()).toBe(true);
    });
  });

  describe('isTokenValid', () => {
    it('should return true for active non-expired session', () => {
      const refreshToken = RefreshToken.create(7);
      const now = new Date();

      const session = LoginSessionEntity.create({
        userId: mockUserId,
        accessToken: mockAccessToken,
        refreshToken,
        issuedAt: now,
        expiresAt: new Date(now.getTime() + 15 * 60 * 1000),
      });

      expect(session.isTokenValid()).toBe(true);
    });

    it('should return false for inactive session', () => {
      const refreshToken = RefreshToken.create(7);
      const now = new Date();

      const session = LoginSessionEntity.create({
        userId: mockUserId,
        accessToken: mockAccessToken,
        refreshToken,
        issuedAt: now,
        expiresAt: new Date(now.getTime() + 15 * 60 * 1000),
      });

      session.revoke();
      expect(session.isTokenValid()).toBe(false);
    });

    it('should return false for expired session', () => {
      const refreshToken = RefreshToken.create(7);
      const now = new Date();

      const session = LoginSessionEntity.create({
        userId: mockUserId,
        accessToken: mockAccessToken,
        refreshToken,
        issuedAt: new Date(now.getTime() - 20 * 60 * 1000),
        expiresAt: new Date(now.getTime() - 1000),
      });

      expect(session.isTokenValid()).toBe(false);
    });
  });

  describe('isRefreshTokenValid', () => {
    it('should return true for valid refresh token', () => {
      const refreshToken = RefreshToken.create(7);
      const now = new Date();

      const session = LoginSessionEntity.create({
        userId: mockUserId,
        accessToken: mockAccessToken,
        refreshToken,
        issuedAt: now,
        expiresAt: new Date(now.getTime() + 15 * 60 * 1000),
      });

      expect(session.isRefreshTokenValid()).toBe(true);
    });

    it('should return false if session is inactive', () => {
      const refreshToken = RefreshToken.create(7);
      const now = new Date();

      const session = LoginSessionEntity.create({
        userId: mockUserId,
        accessToken: mockAccessToken,
        refreshToken,
        issuedAt: now,
        expiresAt: new Date(now.getTime() + 15 * 60 * 1000),
      });

      session.revoke();
      expect(session.isRefreshTokenValid()).toBe(false);
    });
  });

  describe('updateLastUsed', () => {
    it('should update last used timestamp', () => {
      const refreshToken = RefreshToken.create(7);
      const now = new Date();

      const session = LoginSessionEntity.create({
        userId: mockUserId,
        accessToken: mockAccessToken,
        refreshToken,
        issuedAt: now,
        expiresAt: new Date(now.getTime() + 15 * 60 * 1000),
      });

      expect(session.lastUsedAt).toBeNull();

      session.updateLastUsed();
      expect(session.lastUsedAt).not.toBeNull();
    });

    it('should throw error if session is inactive', () => {
      const refreshToken = RefreshToken.create(7);
      const now = new Date();

      const session = LoginSessionEntity.create({
        userId: mockUserId,
        accessToken: mockAccessToken,
        refreshToken,
        issuedAt: now,
        expiresAt: new Date(now.getTime() + 15 * 60 * 1000),
      });

      session.revoke();
      expect(() => session.updateLastUsed()).toThrow('Cannot update last used on inactive session');
    });
  });

  describe('renewAccessToken', () => {
    it('should renew access token', () => {
      const refreshToken = RefreshToken.create(7);
      const now = new Date();

      const session = LoginSessionEntity.create({
        userId: mockUserId,
        accessToken: mockAccessToken,
        refreshToken,
        issuedAt: now,
        expiresAt: new Date(now.getTime() + 15 * 60 * 1000),
      });

      const newToken = 'new-access-token-xyz';
      const newExpiresAt = new Date(now.getTime() + 30 * 60 * 1000);

      session.renewAccessToken(newToken, newExpiresAt);

      expect(session.accessToken).toBe(newToken);
      expect(session.expiresAt).toEqual(newExpiresAt);
      expect(session.lastUsedAt).not.toBeNull();
    });

    it('should throw error if session is inactive', () => {
      const refreshToken = RefreshToken.create(7);
      const now = new Date();

      const session = LoginSessionEntity.create({
        userId: mockUserId,
        accessToken: mockAccessToken,
        refreshToken,
        issuedAt: now,
        expiresAt: new Date(now.getTime() + 15 * 60 * 1000),
      });

      session.revoke();
      expect(() =>
        session.renewAccessToken('new-token', new Date(now.getTime() + 30 * 60 * 1000)),
      ).toThrow('Cannot renew token on inactive session');
    });
  });

  describe('renewRefreshToken', () => {
    it('should renew refresh token', () => {
      const refreshToken = RefreshToken.create(7);
      const now = new Date();

      const session = LoginSessionEntity.create({
        userId: mockUserId,
        accessToken: mockAccessToken,
        refreshToken,
        issuedAt: now,
        expiresAt: new Date(now.getTime() + 15 * 60 * 1000),
      });

      const oldTokenValue = session.refreshTokenValue;
      const newRefreshToken = RefreshToken.create(7);

      session.renewRefreshToken(newRefreshToken);

      expect(session.refreshTokenValue).toBe(newRefreshToken.value);
      expect(session.refreshTokenValue).not.toBe(oldTokenValue);
      expect(session.refreshTokenExpiresAt).toEqual(newRefreshToken.expiresAt);
    });

    it('should throw error if session is inactive', () => {
      const refreshToken = RefreshToken.create(7);
      const now = new Date();

      const session = LoginSessionEntity.create({
        userId: mockUserId,
        accessToken: mockAccessToken,
        refreshToken,
        issuedAt: now,
        expiresAt: new Date(now.getTime() + 15 * 60 * 1000),
      });

      session.revoke();
      const newRefreshToken = RefreshToken.create(7);
      expect(() => session.renewRefreshToken(newRefreshToken)).toThrow(
        'Cannot renew refresh token on inactive session',
      );
    });
  });

  describe('revoke', () => {
    it('should deactivate session', () => {
      const refreshToken = RefreshToken.create(7);
      const now = new Date();

      const session = LoginSessionEntity.create({
        userId: mockUserId,
        accessToken: mockAccessToken,
        refreshToken,
        issuedAt: now,
        expiresAt: new Date(now.getTime() + 15 * 60 * 1000),
      });

      expect(session.isActive).toBe(true);
      session.revoke();
      expect(session.isActive).toBe(false);
    });
  });

  describe('activate', () => {
    it('should reactivate session', () => {
      const refreshToken = RefreshToken.create(7);
      const now = new Date();

      const session = LoginSessionEntity.create({
        userId: mockUserId,
        accessToken: mockAccessToken,
        refreshToken,
        issuedAt: now,
        expiresAt: new Date(now.getTime() + 15 * 60 * 1000),
      });

      session.revoke();
      expect(session.isActive).toBe(false);

      session.activate();
      expect(session.isActive).toBe(true);
    });
  });

  describe('getAccessTokenTimeRemainingInSeconds', () => {
    it('should return positive value for valid token', () => {
      const refreshToken = RefreshToken.create(7);
      const now = new Date();

      const session = LoginSessionEntity.create({
        userId: mockUserId,
        accessToken: mockAccessToken,
        refreshToken,
        issuedAt: now,
        expiresAt: new Date(now.getTime() + 15 * 60 * 1000),
      });

      const timeRemaining = session.getAccessTokenTimeRemainingInSeconds();
      expect(timeRemaining).toBeGreaterThan(0);
      expect(timeRemaining).toBeLessThanOrEqual(15 * 60);
    });

    it('should return negative value for expired token', () => {
      const refreshToken = RefreshToken.create(7);
      const now = new Date();

      const session = LoginSessionEntity.create({
        userId: mockUserId,
        accessToken: mockAccessToken,
        refreshToken,
        issuedAt: new Date(now.getTime() - 20 * 60 * 1000),
        expiresAt: new Date(now.getTime() - 1000),
      });

      expect(session.getAccessTokenTimeRemainingInSeconds()).toBeLessThan(0);
    });
  });

  describe('isRecent', () => {
    it('should return true for recently created session', () => {
      const refreshToken = RefreshToken.create(7);
      const now = new Date();

      const session = LoginSessionEntity.create({
        userId: mockUserId,
        accessToken: mockAccessToken,
        refreshToken,
        issuedAt: now,
        expiresAt: new Date(now.getTime() + 15 * 60 * 1000),
      });

      expect(session.isRecent()).toBe(true);
    });

    it('should return false for old session', () => {
      const refreshToken = RefreshToken.create(7);
      const now = new Date();
      const oldIssuedAt = new Date(now.getTime() - 10 * 60 * 1000);

      const session = LoginSessionEntity.create({
        userId: mockUserId,
        accessToken: mockAccessToken,
        refreshToken,
        issuedAt: oldIssuedAt,
        expiresAt: new Date(now.getTime() + 15 * 60 * 1000),
      });

      expect(session.isRecent()).toBe(false);
    });
  });

  describe('equals', () => {
    it('should return true for same session IDs', () => {
      const refreshToken = RefreshToken.create(7);
      const now = new Date();

      const session = LoginSessionEntity.create({
        userId: mockUserId,
        accessToken: mockAccessToken,
        refreshToken,
        issuedAt: now,
        expiresAt: new Date(now.getTime() + 15 * 60 * 1000),
      });

      // Simular um outro objeto com o mesmo ID
      const other = new LoginSessionEntity();
      other.id = session.id;

      expect(session.equals(other)).toBe(true);
    });
  });
});
