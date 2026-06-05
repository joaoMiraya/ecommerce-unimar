import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  Matches,
} from 'class-validator';
import { UserAuthDto } from '../dtos/auth';

// DTOs para validação de entrada
export class RegisterDto {
  @IsString({ message: 'Nome deve ser uma string' })
  @MinLength(3, { message: 'Nome deve ter pelo menos 3 caracteres' })
  @MaxLength(100, { message: 'Nome não pode exceder 100 caracteres' })
  name: string;

  @IsEmail({}, { message: 'Email deve ser válido' })
  email: string;

  @IsString({ message: 'Senha deve ser uma string' })
  @MinLength(8, { message: 'Senha deve ter pelo menos 8 caracteres' })
  @MaxLength(50, { message: 'Senha não pode exceder 50 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Senha deve conter: letras maiúsculas, minúsculas e números',
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

export class LoginDto {
  @IsEmail({}, { message: 'Email deve ser válido' })
  email: string;

  @IsString({ message: 'Senha deve ser uma string' })
  @MinLength(1, { message: 'Senha é obrigatória' })
  password: string;
}

export class RefreshTokenDto {
  @IsString({ message: 'Refresh token deve ser uma string' })
  @MinLength(1, { message: 'Refresh token é obrigatório' })
  refreshToken: string;
}

// Tipo para resposta
export type AuthSchema = {
  status: number;
  data: LoginSchema;
};

export type LoginSchema = {
  user: UserAuthDto;
  accessToken: string;
};
