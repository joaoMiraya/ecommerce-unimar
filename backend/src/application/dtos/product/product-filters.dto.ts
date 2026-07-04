import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class ProductFiltersRequestDto {
  @IsString({ message: 'Nome deve ser uma string' })
  @IsOptional()
  name?: string;

  @IsString({ message: 'Vendedor deve ser uma string' })
  @IsOptional()
  seller?: string;

  @IsString({ message: 'ID do vendedor deve ser uma string' })
  @IsOptional()
  sellerId?: string;

  @Type(() => Number)
  @IsNumber({}, { message: 'Preço deve ser um número' })
  @Min(0.01, { message: 'Preço deve ser maior que zero' })
  @IsOptional()
  min_price?: number;

  @Type(() => Number)
  @IsNumber({}, { message: 'Preço deve ser um número' })
  @Min(0.01, { message: 'Preço deve ser maior que zero' })
  @IsOptional()
  max_price?: number;

  @Type(() => Number)
  @IsNumber({}, { message: 'Page deve ser um número' })
  @Min(1, { message: 'Page deve ser maior que zero' })
  @IsOptional()
  page?: number;

  @Type(() => Number)
  @IsNumber({}, { message: 'Limit deve ser um número' })
  @Min(1, { message: 'Limit deve ser maior que zero' })
  @IsOptional()
  limit?: number;
}
