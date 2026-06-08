import { Type } from 'class-transformer';
import { IsNumber, IsString, Min, MinLength } from 'class-validator';

export class CreateProductRequestDto {
  @IsString({ message: 'Nome deve ser uma string' })
  @MinLength(1, { message: 'Nome é obrigatório' })
  name: string;

  @IsString({ message: 'Descrição deve ser uma string' })
  @MinLength(1, { message: 'Descrição é obrigatória' })
  description: string;

  @Type(() => Number)
  @IsNumber({}, { message: 'Preço deve ser um número' })
  @Min(0.01, { message: 'Preço deve ser maior que zero' })
  price: number;

  @Type(() => Number)
  @IsNumber({}, { message: 'Quantidade deve ser um número' })
  @Min(1, { message: 'Quantidade deve ser ao menos 1' })
  stock: number;
}
