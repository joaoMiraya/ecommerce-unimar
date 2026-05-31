import { Injectable } from '@nestjs/common';
import { LoginSessionEntity } from '../../domain/auth/entities/login-session.entity';
import { UserEntity } from '../../domain/user/entities/user.entity';
import {
  LoginResponseDto,
  RefreshTokenResponseDto,
  UserAuthDto,
} from '../dtos/auth';

/**
 * Mapper para converter entidades de autenticação em DTOs
 * Garante que dados sensíveis nunca sejam expostos na resposta
 */
@Injectable()
export class AuthMapper {
  /**
   * Converte entidades de sessão e usuário em LoginResponseDto
   * @param session - Sessão de login (contém tokens)
   * @param user - Usuário autenticado
   * @param accessToken - Access token JWT
   * @returns LoginResponseDto pronta para ser retornada ao cliente
   */
  toLoginResponse(
    session: LoginSessionEntity,
    user: UserEntity,
    accessToken: string,
  ): LoginResponseDto {
    const expiresIn = session.getAccessTokenTimeRemainingInSeconds();

    return {
      accessToken,
      refreshToken: session.refreshTokenValue,
      expiresIn: Math.max(0, expiresIn), // Nunca retornar negativo
      user: this.toUserAuthDto(user),
    };
  }

  /**
   * Converte sessão em RefreshTokenResponseDto
   * @param session - Sessão com token renovado
   * @param newAccessToken - Novo access token gerado
   * @returns RefreshTokenResponseDto
   */
  toRefreshTokenResponse(
    session: LoginSessionEntity,
    newAccessToken: string,
  ): RefreshTokenResponseDto {
    const expiresIn = session.getAccessTokenTimeRemainingInSeconds();

    return {
      accessToken: newAccessToken,
      expiresIn: Math.max(0, expiresIn),
    };
  }

  /**
   * Converte entidade de usuário em UserAuthDto
   * Garante que a senha nunca é exposta
   * @param user - Entidade de usuário
   * @returns UserAuthDto com dados públicos apenas
   */
  toUserAuthDto(user: UserEntity): UserAuthDto {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      isActive: user.isActive,
    };
  }

  /**
   * Converte múltiplos usuários em DTOs
   */
  toUserAuthDtoList(users: UserEntity[]): UserAuthDto[] {
    return users.map((user) => this.toUserAuthDto(user));
  }
}
