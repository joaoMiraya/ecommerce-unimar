/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginSessionEntity } from '../../../domain/auth/entities/login-session.entity';
import { RefreshToken } from '../../../domain/auth/value-objects/refresh-token';
import { AuthRepositoryImpl } from './auth.repository.impl';

describe('AuthRepositoryImpl', () => {
  let authRepository: AuthRepositoryImpl;
  let typeormRepository: Repository<LoginSessionEntity>;

  const mockUserId = '550e8400-e29b-41d4-a716-446655440000';
  const mockSessionId = '660e8400-e29b-41d4-a716-446655440001';

  const createMockSession = (
    overrides?: Partial<LoginSessionEntity>,
  ): LoginSessionEntity => {
    const refreshToken = RefreshToken.create(7);
    const now = new Date();
    const session = LoginSessionEntity.create({
      userId: mockUserId,
      accessToken: 'mock-access-token',
      refreshToken,
      issuedAt: now,
      expiresAt: new Date(now.getTime() + 15 * 60 * 1000),
    });

    if (overrides) {
      Object.assign(session, overrides);
    }

    session.id = mockSessionId;
    return session;
  };

  beforeEach(async () => {
    const mockTypeormRepository = {
      findOne: jest.fn(),
      find: jest.fn(),
      save: jest.fn(),
      count: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthRepositoryImpl,
        {
          provide: getRepositoryToken(LoginSessionEntity),
          useValue: mockTypeormRepository,
        },
      ],
    }).compile();

    authRepository = module.get<AuthRepositoryImpl>(AuthRepositoryImpl);
    typeormRepository = module.get<Repository<LoginSessionEntity>>(
      getRepositoryToken(LoginSessionEntity),
    );
  });

  describe('findByUserId', () => {
    it('should find session by user id', async () => {
      const session = createMockSession();
      (typeormRepository.findOne as jest.Mock).mockResolvedValue(session);

      const result = await authRepository.findByUserId(mockUserId);

      expect(result).toEqual(session);
      expect(typeormRepository.findOne).toHaveBeenCalledWith({
        where: { userId: mockUserId },
        order: { createdAt: 'DESC' },
      });
    });

    it('should return null when session not found', async () => {
      (typeormRepository.findOne as jest.Mock).mockResolvedValue(null);

      const result = await authRepository.findByUserId('non-existent-user');

      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should find session by id', async () => {
      const session = createMockSession();
      (typeormRepository.findOne as jest.Mock).mockResolvedValue(session);

      const result = await authRepository.findById(mockSessionId);

      expect(result).toEqual(session);
      expect(typeormRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockSessionId },
      });
    });
  });

  describe('findActiveSession', () => {
    it('should find active session', async () => {
      const session = createMockSession({ isActive: true });
      (typeormRepository.findOne as jest.Mock).mockResolvedValue(session);

      const result = await authRepository.findActiveSession(mockUserId);

      expect(result).toEqual(session);
      expect(typeormRepository.findOne).toHaveBeenCalledWith({
        where: { userId: mockUserId, isActive: true },
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('findByRefreshToken', () => {
    it('should find session by refresh token', async () => {
      const refreshToken = 'mock-refresh-token-value';
      const session = createMockSession({ refreshTokenValue: refreshToken });
      (typeormRepository.findOne as jest.Mock).mockResolvedValue(session);

      const result = await authRepository.findByRefreshToken(refreshToken);

      expect(result).toEqual(session);
      expect(typeormRepository.findOne).toHaveBeenCalledWith({
        where: { refreshTokenValue: refreshToken },
        relations: { user: true },
      });
    });
  });

  describe('saveSession', () => {
    it('should save session', async () => {
      const session = createMockSession();
      (typeormRepository.save as jest.Mock).mockResolvedValue(session);

      const result = await authRepository.saveSession(session);

      expect(result).toEqual(session);
      expect(typeormRepository.save).toHaveBeenCalledWith(session);
    });
  });

  describe('updateSession', () => {
    it('should update session', async () => {
      const session = createMockSession();
      (typeormRepository.save as jest.Mock).mockResolvedValue(session);

      const result = await authRepository.updateSession(session);

      expect(result).toEqual(session);
      expect(typeormRepository.save).toHaveBeenCalledWith(session);
    });
  });

  describe('revokeSession', () => {
    it('should revoke session', async () => {
      const session = createMockSession({ isActive: true });
      (typeormRepository.findOne as jest.Mock).mockResolvedValue(session);
      (typeormRepository.save as jest.Mock).mockResolvedValue(session);

      const result = await authRepository.revokeSession(mockSessionId);

      expect(result).toBe(true);
      expect(session.isActive).toBe(false);
    });

    it('should return false when session not found', async () => {
      (typeormRepository.findOne as jest.Mock).mockResolvedValue(null);

      const result = await authRepository.revokeSession('non-existent');

      expect(result).toBe(false);
    });
  });

  describe('revokeAllUserSessions', () => {
    it('should revoke all user sessions', async () => {
      const sessions = [createMockSession(), createMockSession()];
      (typeormRepository.find as jest.Mock).mockResolvedValue(sessions);
      (typeormRepository.save as jest.Mock).mockResolvedValue(sessions);

      const result = await authRepository.revokeAllUserSessions(mockUserId);

      expect(result).toBe(2);
      expect(typeormRepository.save).toHaveBeenCalled();
    });

    it('should return 0 when no sessions found', async () => {
      (typeormRepository.find as jest.Mock).mockResolvedValue([]);

      const result =
        await authRepository.revokeAllUserSessions('non-existent-user');

      expect(result).toBe(0);
    });
  });

  describe('deleteExpiredSessions', () => {
    it('should delete expired sessions', async () => {
      const mockQueryBuilder = {
        createQueryBuilder: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({ affected: 3 }),
      };

      (typeormRepository.createQueryBuilder as jest.Mock).mockReturnValue(
        mockQueryBuilder,
      );

      const result = await authRepository.deleteExpiredSessions();

      expect(result).toBe(3);
      expect(mockQueryBuilder.delete).toHaveBeenCalled();
    });
  });

  describe('hasActiveSessions', () => {
    it('should return true if user has active sessions', async () => {
      (typeormRepository.count as jest.Mock).mockResolvedValue(1);

      const result = await authRepository.hasActiveSessions(mockUserId);

      expect(result).toBe(true);
    });

    it('should return false if user has no active sessions', async () => {
      (typeormRepository.count as jest.Mock).mockResolvedValue(0);

      const result = await authRepository.hasActiveSessions(mockUserId);

      expect(result).toBe(false);
    });
  });

  describe('countActiveSessions', () => {
    it('should count active sessions', async () => {
      (typeormRepository.count as jest.Mock).mockResolvedValue(3);

      const result = await authRepository.countActiveSessions(mockUserId);

      expect(result).toBe(3);
    });
  });

  describe('findAllActiveSessionsByUserId', () => {
    it('should find all active sessions for user', async () => {
      const sessions = [
        createMockSession({ isActive: true }),
        createMockSession({ isActive: true }),
      ];
      (typeormRepository.find as jest.Mock).mockResolvedValue(sessions);

      const result =
        await authRepository.findAllActiveSessionsByUserId(mockUserId);

      expect(result).toEqual(sessions);
      expect(typeormRepository.find).toHaveBeenCalledWith({
        where: { userId: mockUserId, isActive: true },
        order: { createdAt: 'DESC' },
      });
    });
  });
});
