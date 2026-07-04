import {
  Controller,
  Body,
  HttpStatus,
  UseGuards,
  Delete,
  Post,
  Get,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUserId } from '../decorators/current-user.decorator';
import {
  type CreateProductInput,
  CreateProductUseCase,
} from '../services/create-product.use-case';
import { CreateProductRequestDto } from '../dtos/product/create-product.dto';
import { DeleteProductUseCase } from '../services/delete-product.use-case';
import { GetProductsUseCase } from '../services/get-products.use-case';
import { ProductFiltersRequestDto } from '../dtos/product/product-filters.dto';

@Controller('products')
export class ProductController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly getProductsUseCase: GetProductsUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
  ) {}

  @Delete('')
  @UseGuards(JwtAuthGuard)
  async delete(@Body() productId: string, @CurrentUserId() userId: string) {
    await this.deleteProductUseCase.execute(productId, userId);
    return {
      status: HttpStatus.ACCEPTED,
    };
  }

  // @Put('')
  // @UseGuards(JwtAuthGuard)
  // async update(
  //   @CurrentUserId() userId: string,
  //   @Body() user: UpdateUserRequestDto,
  // ) {
  //   const userDto: UpdateUserDto = {
  //     userId,
  //     name: user.name,
  //     email: user.email,
  //   };

  //   await this.updateUserUseCase.execute(userDto);

  //   return {
  //     status: HttpStatus.ACCEPTED,
  //   };
  // }

  @Post('')
  @UseGuards(JwtAuthGuard)
  async create(
    @CurrentUserId() userId: string,
    @Body() product: CreateProductRequestDto,
  ) {
    const productDto: CreateProductInput = {
      ...product,
      userId,
    };

    await this.createProductUseCase.execute(productDto);

    return {
      status: HttpStatus.ACCEPTED,
    };
  }

  @Get('')
  async getAll(@Query() filters: ProductFiltersRequestDto) {
    const products = await this.getProductsUseCase.execute(filters);

    return {
      status: HttpStatus.ACCEPTED,
      data: {
        products,
      },
    };
  }

  @Get('own')
  @UseGuards(JwtAuthGuard)
  async getUserProducts(
    @CurrentUserId() userId: string,
    @Query() filters: ProductFiltersRequestDto,
  ) {
    const filter: ProductFiltersRequestDto = {
      ...filters,
      sellerId: userId,
    };

    const products = await this.getProductsUseCase.execute(filter);

    return {
      status: HttpStatus.ACCEPTED,
      data: {
        products,
      },
    };
  }
}
