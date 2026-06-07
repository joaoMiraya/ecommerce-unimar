import {
  Controller,
  Body,
  HttpStatus,
  UseGuards,
  Delete,
  Put,
  Logger,
  Post,
} from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUserId } from '../decorators/current-user.decorator';
import { DisableUserUseCase } from '../services/disable-user.use-case';
import { LogoutUseCase } from '../services/logout.use-case';
import { UpdateUserUseCase } from '../services/update-user.use-case';
import { CreateAddressUseCase } from '../services/create-address.use-case';
import {
  type CreateAddressInput,
  CreateAddressRequestDto,
  UpdateAddressRequestDto,
} from '../dtos/address/create-address.dto';
import {
  UpdateUserDto,
  UpdateUserRequestDto,
} from '../dtos/users/update-user.dto';
import { UpdateAddressUseCase } from '../services/update-address.use-case';

@Controller('users')
export class UsersController {
  private logger = new Logger();
  constructor(
    private readonly disableUserUseCase: DisableUserUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly createAddressUseCase: CreateAddressUseCase,
    private readonly updateAddressUseCase: UpdateAddressUseCase,
  ) {}

  @Delete('')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUserId() userId: string) {
    await this.logoutUseCase.execute(userId);
    await this.disableUserUseCase.execute(userId);
    return {
      status: HttpStatus.ACCEPTED,
    };
  }

  @Put('')
  @UseGuards(JwtAuthGuard)
  async update(
    @CurrentUserId() userId: string,
    @Body() user: UpdateUserRequestDto,
  ) {
    const userDto: UpdateUserDto = {
      userId,
      name: user.name,
      email: user.email,
    };

    await this.updateUserUseCase.execute(userDto);

    return {
      status: HttpStatus.ACCEPTED,
    };
  }

  @Post('address')
  @UseGuards(JwtAuthGuard)
  async creaeAddress(
    @CurrentUserId() userId: string,
    @Body() address: CreateAddressInput,
  ) {
    const addressDto: CreateAddressRequestDto = {
      userId,
      ...address,
    };

    await this.createAddressUseCase.execute(addressDto);

    return {
      status: HttpStatus.ACCEPTED,
    };
  }

  @Put('address')
  @UseGuards(JwtAuthGuard)
  async updateAddress(@Body() address: UpdateAddressRequestDto) {
    this.logger.warn(address);
    await this.updateAddressUseCase.execute(address);

    return {
      status: HttpStatus.ACCEPTED,
    };
  }
}
