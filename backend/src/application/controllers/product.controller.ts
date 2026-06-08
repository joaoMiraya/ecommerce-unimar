import {
  Controller,
  Body,
  HttpStatus,
  UseGuards,
  Delete,
  Post,
  Logger,
} from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUserId } from '../decorators/current-user.decorator';
import {
  type CreateProductInput,
  CreateProductUseCase,
} from '../services/create-product.use-case';
import { CreateProductRequestDto } from '../dtos/product/create-product.dto';
import { DeleteProductUseCase } from '../services/delete-product.use-case';

@Controller('products')
export class ProductController {
  private logger = new Logger();
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
  ) {}

  @Delete('')
  @UseGuards(JwtAuthGuard)
  async delete(@Body() productId: string) {
    await this.deleteProductUseCase.execute(productId);
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
    this.logger.warn(product);
    const productDto: CreateProductInput = {
      ...product,
      userId,
    };

    await this.createProductUseCase.execute(productDto);

    return {
      status: HttpStatus.ACCEPTED,
    };
  }
}
