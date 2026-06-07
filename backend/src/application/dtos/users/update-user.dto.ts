import { IsEmail, IsNotEmpty } from 'class-validator';

/**
 * DTO para atualizar o User
 */
export class UpdateUserRequestDto {
  @IsEmail({}, { message: 'Email must be valid' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;
  @IsNotEmpty({ message: 'Name is required' })
  name: string;
}

export class UpdateUserDto {
  @IsEmail({}, { message: 'Email must be valid' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;
  @IsNotEmpty({ message: 'UserId is required' })
  userId: string;
  @IsNotEmpty({ message: 'Name is required' })
  name: string;
}
