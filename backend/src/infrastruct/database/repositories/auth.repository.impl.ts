import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginSessionEntity } from '../../../domain/auth/entities/login-session.entity';
import { IAuthRepository } from '../../../domain/auth/repositories/auth.repository';

/**
 * Implementação do repositório de autenticação
 * Usa TypeORM para persistência
 */
@Injectable()
export class AuthRepositoryImpl implements IAuthRepository {
  constructor(
    @InjectRepository(LoginSessionEntity)
    private readonly repository: Repository<LoginSessionEntity>,
  ) {}

  async findByUserId(userId: string): Promise<LoginSessionEntity | null> {
    return this.repository.findOne({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findById(sessionId: string): Promise<LoginSessionEntity | null> {
    return this.repository.findOne({
      where: { id: sessionId },
    });
  }

  async findActiveSession(userId: string): Promise<LoginSessionEntity | null> {
    return this.repository.findOne({
      where: {
        userId,
        isActive: true,
      },
      order: { createdAt: 'DESC' },
    });
  }

  async findByRefreshToken(
    refreshToken: string,
  ): Promise<LoginSessionEntity | null> {
    return this.repository.findOne({
      where: { refreshTokenValue: refreshToken },
      relations: { user: true },
    });
  }

  async saveSession(session: LoginSessionEntity): Promise<LoginSessionEntity> {
    return this.repository.save(session);
  }

  async updateSession(
    session: LoginSessionEntity,
  ): Promise<LoginSessionEntity> {
    return this.repository.save(session);
  }

  async revokeSession(sessionId: string): Promise<boolean> {
    const session = await this.repository.findOne({ where: { id: sessionId } });

    if (!session) {
      return false;
    }

    session.revoke();
    await this.repository.save(session);
    return true;
  }

  async revokeAllUserSessions(userId: string): Promise<number> {
    const sessions = await this.repository.find({
      where: { userId, isActive: true },
    });

    for (const session of sessions) {
      session.revoke();
    }

    if (sessions.length > 0) {
      await this.repository.save(sessions);
    }

    return sessions.length;
  }

  async deleteExpiredSessions(): Promise<number> {
    const now = new Date();

    // Delete sessions where both access token and refresh token are expired
    const result = await this.repository
      .createQueryBuilder('session')
      .delete()
      .where('session.expiresAt < :now', { now })
      .andWhere('session.refreshTokenExpiresAt < :now', { now })
      .execute();

    return result.affected || 0;
  }

  async hasActiveSessions(userId: string): Promise<boolean> {
    const count = await this.repository.count({
      where: { userId, isActive: true },
    });

    return count > 0;
  }

  async countActiveSessions(userId: string): Promise<number> {
    return this.repository.count({
      where: { userId, isActive: true },
    });
  }

  async findAllActiveSessionsByUserId(
    userId: string,
  ): Promise<LoginSessionEntity[]> {
    return this.repository.find({
      where: { userId, isActive: true },
      order: { createdAt: 'DESC' },
    });
  }
}
