import { Inject, Injectable } from '@nestjs/common';
import type { IAuthRepository } from '../../domain/auth/repositories/auth.repository';
import { type IUnitOfWork } from '../../domain/shared/repositories/unit-of-work.interface';
import { UNIT_OF_WORK_TOKEN, AUTH_REPOSITORY_TOKEN } from '../di/tokens';

/**
 * Use Case para fazer logout
 * Revoga a sessão de login do usuário
 */
@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject(UNIT_OF_WORK_TOKEN)
    private readonly unitOfWork: IUnitOfWork,
    @Inject(AUTH_REPOSITORY_TOKEN)
    private readonly authRepository: IAuthRepository,
  ) {}

  async execute(userId: string): Promise<void> {
    return this.unitOfWork.execute(async () => {
      // 1. Revogar todas as sessões ativas do usuário
      await this.authRepository.revokeAllUserSessions(userId);
    });
  }
}
