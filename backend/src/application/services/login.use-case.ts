import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { IUserRepository } from '../../domain/user/repositories/user.repository';
import type { IAuthRepository } from '../../domain/auth/repositories/auth.repository';
import { type IUnitOfWork } from '../../domain/shared/repositories/unit-of-work.interface';
import { UserDomainService } from '../../domain/user/services/user.service';
import { LoginSessionEntity } from '../../domain/auth/entities/login-session.entity';
import { Password } from '../../domain/shared/value-objects/password';
import { Email } from '../../domain/shared/value-objects/email';
import { RefreshToken } from '../../domain/auth/value-objects/refresh-token';
import { type JwtPayload } from '../../domain/auth/types/auth.types';
import {
  UNIT_OF_WORK_TOKEN,
  USER_REPOSITORY_TOKEN,
  AUTH_REPOSITORY_TOKEN,
} from '../di/tokens';
import { CleanUser } from 'src/domain/user/DTOs/user.dto';

export interface LoginUseCaseInput {
  email: string;
  password: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface LoginUseCaseOutput {
  user: CleanUser;
  accessToken: string;
  refreshToken: RefreshToken;
}

/**
 * Use Case para autenticar usuário com email e senha
 * Responsável por validar credenciais e criar sessão de login
 */
@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(UNIT_OF_WORK_TOKEN)
    private readonly unitOfWork: IUnitOfWork,
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
    @Inject(AUTH_REPOSITORY_TOKEN)
    private readonly authRepository: IAuthRepository,
    private readonly userDomainService: UserDomainService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(input: LoginUseCaseInput): Promise<LoginUseCaseOutput> {
    return this.unitOfWork.execute(async () => {
      const email = Email.create(input.email);

      const user = await this.userDomainService.getUserByEmail(email);
      if (!user) {
        throw new Error('Invalid credentials: email or password incorrect');
      }

      const passwordVO = Password.createFromHash(user.password);
      const passwordMatches = await passwordVO.compare(input.password);
      if (!passwordMatches) {
        throw new Error('Invalid credentials: email or password incorrect');
      }

      const now = new Date();
      const accessTokenExpiresIn = 15 * 60;
      const refreshToken = RefreshToken.create(7);

      const jwtPayload: JwtPayload = {
        sub: user.id,
        email: user.email,
        type: 'access',
      };

      const accessToken = this.jwtService.sign(jwtPayload, {
        expiresIn: accessTokenExpiresIn,
      });

      const expiresAt = new Date(now.getTime() + accessTokenExpiresIn * 1000);
      const session = LoginSessionEntity.create({
        userId: user.id,
        accessToken,
        refreshToken,
        issuedAt: now,
        expiresAt,
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
      });

      await this.authRepository.saveSession(session);

      const cleanUser: CleanUser = {
        name: user.name,
        email: user.email,
      };

      return {
        user: cleanUser,
        accessToken,
        refreshToken,
      };
    });
  }
}
