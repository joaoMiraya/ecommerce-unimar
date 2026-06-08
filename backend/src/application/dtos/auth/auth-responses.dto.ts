import { FullAddress } from '../address/create-address.dto';

/**
 * DTO para resposta de login
 */
export class LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: UserAuthDto;
}

/**
 * DTO para resposta de refresh token
 */
export class RefreshTokenResponseDto {
  accessToken: string;
  expiresIn: number;
}

/**
 * DTO para informações do usuário autenticado (sem dados sensíveis)
 */
export class UserAuthDto {
  email: string;
  name: string;
  createdAt: Date;
}

/**
 * DTO para perfil completo do usuário com endereços
 */
export class FullCleanUser {
  email: string;
  name: string;
  createdAt: Date;
  addresses?: FullAddress[];
}
