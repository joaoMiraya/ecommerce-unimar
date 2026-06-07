import { IsNotEmpty } from 'class-validator';

/**
 * DTO para criar um endereço
 */
export class CreateAddressRequestDto {
  @IsNotEmpty({ message: 'UserId is required' })
  userId: string;
  @IsNotEmpty({ message: 'City is required' })
  city: string;
  @IsNotEmpty({ message: 'City is required' })
  street: string;
  @IsNotEmpty({ message: 'Street is required' })
  neighborhood: string;
  @IsNotEmpty({ message: 'Number is required' })
  number: string;
  @IsNotEmpty({ message: 'ZipCode is required' })
  zipCode: string;
}

export class UpdateAddressRequestDto {
  @IsNotEmpty({ message: 'Id is required' })
  id: string;
  @IsNotEmpty({ message: 'City is required' })
  city: string;
  @IsNotEmpty({ message: 'City is required' })
  street: string;
  @IsNotEmpty({ message: 'Street is required' })
  neighborhood: string;
  @IsNotEmpty({ message: 'Number is required' })
  number: string;
  @IsNotEmpty({ message: 'ZipCode is required' })
  zipCode: string;
}

export interface CreateAddressInput {
  city: string;
  neighborhood: string;
  street: string;
  number: string;
  zipCode: string;
}

export interface FullAddress {
  id: string;
  city: string;
  neighborhood: string;
  street: string;
  number: string;
  zipCode: string;
}
