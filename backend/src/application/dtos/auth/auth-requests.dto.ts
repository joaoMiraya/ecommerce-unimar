import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserAuthDto } from './auth-responses.dto';

/**
 * DTO para requisição de registro
 */
export class RegisterDto {
  @IsString({ message: 'Nome deve ser uma string' })
  @MinLength(3, { message: 'Nome deve ter pelo menos 3 caracteres' })
  @MaxLength(100, { message: 'Nome não pode exceder 100 caracteres' })
  name: string;

  @IsEmail({}, { message: 'Email deve ser válido' })
  email: string;

  @IsString({ message: 'Senha deve ser uma string' })
  @MinLength(8, { message: 'Senha deve ter pelo menos 8 caracteres' })
  @MaxLength(128, { message: 'Senha não pode exceder 128 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/, {
    message: 'Senha deve conter: maiúscula, minúscula, número e caractere especial',
  })
  password: string;

  @IsString({ message: 'Confirmação de senha deve ser uma string' })
  confirmPassword: string;

  @IsOptional()
  @IsString({ message: 'Telefone deve ser uma string' })
  @Matches(/^\(\d{2}\) \d{4,5}-\d{4}$/, {
    message: 'Telefone deve estar no formato (XX) XXXXX-XXXX',
  })
  phone?: string;
}

/**
 * DTO para requisição de login
 */
export class LoginRequestDto {
  @IsEmail({}, { message: 'Email deve ser válido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @MinLength(8, { message: 'Senha deve ter pelo menos 8 caracteres' })
  @MaxLength(128, { message: 'Senha não pode exceder 128 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/, {
    message: 'Senha deve conter: maiúscula, minúscula, número e caractere especial',
  })
  password: string;
}

/**
 * DTO para requisição de refresh token
 */
export class RefreshTokenRequestDto {
  @IsNotEmpty({ message: 'Refresh token é obrigatório' })
  refreshToken: string;
}

/**
 * Tipo para resposta de autenticação
 */
export type AuthSchema = {
  status: number;
  data: {
    user: UserAuthDto;
    accessToken: string;
  };
};
