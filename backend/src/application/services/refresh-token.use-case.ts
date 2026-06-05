import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { IAuthRepository } from '../../domain/auth/repositories/auth.repository';
import { type IUnitOfWork } from '../../domain/shared/repositories/unit-of-work.interface';
import { type JwtPayload } from '../../domain/auth/types/auth.types';
import { UNIT_OF_WORK_TOKEN, AUTH_REPOSITORY_TOKEN } from '../di/tokens';
import { AuthMapper } from '../mappers/auth.mapper';
import { UserAuthDto } from '../dtos/auth';

export interface RefreshTokenUseCaseInput {
  refreshToken: string;
}

export interface RefreshTokenUseCaseOutput {
  user: UserAuthDto;
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
    private readonly authMapper: AuthMapper,
    private readonly jwtService: JwtService,
  ) {}

  async execute(
    input: RefreshTokenUseCaseInput,
  ): Promise<RefreshTokenUseCaseOutput> {
    return this.unitOfWork.execute(async () => {
      const session = await this.authRepository.findByRefreshToken(
        input.refreshToken,
      );
      if (!session) {
        throw new Error('Invalid refresh token');
      }

      if (!session.isRefreshTokenValid()) {
        throw new Error('Refresh token expired or invalid');
      }

      if (!session.isActive) {
        throw new Error('Session is not active');
      }

      const now = new Date();
      const accessTokenExpiresIn = 15 * 60; // 15 minutos

      const jwtPayload: JwtPayload = {
        sub: session.userId,
        email: session.user?.email || '',
        type: 'access',
      };

      const newAccessToken = this.jwtService.sign(jwtPayload, {
        expiresIn: accessTokenExpiresIn,
      });

      const newExpiresAt = new Date(
        now.getTime() + accessTokenExpiresIn * 1000,
      );
      session.renewAccessToken(newAccessToken, newExpiresAt);

      await this.authRepository.updateSession(session);
      const user: UserAuthDto = this.authMapper.toUserAuthDto(session.user);
      return {
        user,
        accessToken: newAccessToken,
      };
    });
  }
}
