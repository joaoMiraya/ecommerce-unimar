import { IsEmail, IsNotEmpty, MinLength, MaxLength, Matches } from 'class-validator';

/**
 * DTO para requisição de login
 * Contém as credenciais do usuário
 */
export class LoginRequestDto {
  @IsEmail({}, { message: 'Email must be valid' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @MaxLength(128, { message: 'Password must not exceed 128 characters' })
  @Matches(/[A-Z]/, { message: 'Password must contain uppercase letter' })
  @Matches(/[a-z]/, { message: 'Password must contain lowercase letter' })
  @Matches(/[0-9]/, { message: 'Password must contain number' })
  @Matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, {
    message: 'Password must contain special character',
  })
  password: string;
}

/**
 * DTO para requisição de refresh token
 * Contém o refresh token anterior para renovação
 */
export class RefreshTokenRequestDto {
  @IsNotEmpty({ message: 'Refresh token is required' })
  refreshToken: string;
}
