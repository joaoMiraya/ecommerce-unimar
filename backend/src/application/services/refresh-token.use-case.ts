import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { IAuthRepository } from '../../domain/auth/repositories/auth.repository';
import { type IUnitOfWork } from '../../domain/shared/repositories/unit-of-work.interface';
import { LoginSessionEntity } from '../../domain/auth/entities/login-session.entity';
import { RefreshToken } from '../../domain/auth/value-objects/refresh-token';
import { type JwtPayload } from '../../domain/auth/types/auth.types';
import { UNIT_OF_WORK_TOKEN, AUTH_REPOSITORY_TOKEN } from '../di/tokens';

export interface RefreshTokenUseCaseInput {
  refreshToken: string;
}

export interface RefreshTokenUseCaseOutput {
  session: LoginSessionEntity;
  accessToken: string;
}

/**
 * Use Case para renovar access token usando refresh token
 * Valida o refresh token e gera um novo access token
 */
@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject(UNIT_OF_WORK_TOKEN)
    private readonly unitOfWork: IUnitOfWork,
    @Inject(AUTH_REPOSITORY_TOKEN)
    private readonly authRepository: IAuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(input: RefreshTokenUseCaseInput): Promise<RefreshTokenUseCaseOutput> {
    return this.unitOfWork.execute(async () => {
      // 1. Buscar sessão pelo refresh token
      const session = await this.authRepository.findByRefreshToken(input.refreshToken);
      if (!session) {
        throw new Error('Invalid refresh token');
      }

      // 2. Validar se refresh token está válido
      if (!session.isRefreshTokenValid()) {
        throw new Error('Refresh token expired or invalid');
      }

      // 3. Validar se sessão está ativa
      if (!session.isActive) {
        throw new Error('Session is not active');
      }

      // 4. Gerar novo access token
      const now = new Date();
      const accessTokenExpiresIn = 15 * 60; // 15 minutos

      const jwtPayload: JwtPayload = {
        sub: session.userId,
        email: session.user?.email || '', // Será preenchido quando carregar user
        iat: Math.floor(now.getTime() / 1000),
        exp: Math.floor(now.getTime() / 1000) + accessTokenExpiresIn,
        type: 'access',
      };

      const newAccessToken = this.jwtService.sign(jwtPayload);

      // 5. Atualizar sessão
      const newExpiresAt = new Date(now.getTime() + accessTokenExpiresIn * 1000);
      session.renewAccessToken(newAccessToken, newExpiresAt);

      // 6. Persistir sessão atualizada
      await this.authRepository.updateSession(session);

      return {
        session,
        accessToken: newAccessToken,
      };
    });
  }
}
