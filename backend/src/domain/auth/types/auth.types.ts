import { Email } from '../../shared/value-objects/email';
import { RefreshToken } from '../value-objects/refresh-token';

/**
 * Tipos e interfaces para o módulo de autenticação
 * Centraliza as definições de tipos usados em autenticação
 */

/**
 * Credenciais de autenticação
 */
export interface AuthCredentials {
  email: string;
  password: string;
}

/**
 * Payload do JWT (Access Token)
 */
export interface JwtPayload {
  sub: string; // User ID
  email: string;
  iat: number; // Issued at
  exp: number; // Expiration time
  type: 'access'; // Tipo de token
}

/**
 * Payload do Refresh Token (armazenado no BD)
 */
export interface RefreshTokenPayload {
  sub: string; // User ID
  tokenId: string; // ID único do refresh token
  iat: number; // Issued at
  exp: number; // Expiration time
  type: 'refresh'; // Tipo de token
}

/**
 * Par de tokens (Access + Refresh)
 */
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // Segundos até expiração do access token
}

/**
 * Informações de sessão autenticada
 */
export interface AuthSessionInfo {
  userId: string;
  email: Email;
  tokenPair: TokenPair;
  issuedAt: Date;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Resposta de login bem-sucedido
 */
export interface AuthSuccessResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

/**
 * Erro de autenticação
 */
export interface AuthError {
  code: string;
  message: string;
  statusCode: number;
}

/**
 * Tipos de erro de autenticação
 */
export enum AuthErrorCode {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  INVALID_TOKEN = 'INVALID_TOKEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  REFRESH_TOKEN_EXPIRED = 'REFRESH_TOKEN_EXPIRED',
  INVALID_REFRESH_TOKEN = 'INVALID_REFRESH_TOKEN',
  ACCOUNT_DEACTIVATED = 'ACCOUNT_DEACTIVATED',
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
  INVALID_PASSWORD = 'INVALID_PASSWORD',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
}

/**
 * Contexto de autenticação HTTP
 * Extraído do JWT e armazenado em req.user
 */
export interface AuthContext {
  userId: string;
  email: string;
  tokenType: 'access' | 'refresh';
}

/**
 * Parâmetros para geração de token JWT
 */
export interface GenerateTokenParams {
  userId: string;
  email: string;
  expiresIn: string | number; // Ex: '15m', 900 (segundos)
}

/**
 * Parâmetros para criação de sessão
 */
export interface CreateSessionParams {
  userId: string;
  accessToken: string;
  refreshToken: RefreshToken;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Opções de autenticação
 */
export interface AuthOptions {
  accessTokenExpiration: string; // Ex: '15m'
  refreshTokenExpiration: number; // Em dias
  jwtSecret: string;
}
