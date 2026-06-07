import { FullAddress } from "../address/create-address.dto";

/**
 * DTO para resposta de login
 * Contém os tokens e informações do usuário autenticado
 */
export class LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // Segundos até expiração do access token
  user: UserAuthDto;
}

/**
 * DTO para resposta de refresh token
 * Contém o novo access token e tempo de expiração
 */
export class RefreshTokenResponseDto {
  accessToken: string;
  expiresIn: number;
}

/**
 * DTO para informações do usuário autenticado
 * Nunca expõe a senha
 */
export class UserAuthDto {
  email: string;
  name: string;
  createdAt: Date;
}

export class FullCleanUser {
  email: string;
  name: string;
  createdAt: Date;
  addresses?: FullAddress[];
}
