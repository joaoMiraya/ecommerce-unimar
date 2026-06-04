import {
  Controller,
  Post,
  Get,
  Body,
  HttpStatus,
  ValidationPipe,
  UseGuards,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { type RegisterSchema, RegisterDto } from '../schemas/auth.schema';
import { CreateUserUseCase } from '../services/create-user.use-case';
import { LoginUseCase } from '../services/login.use-case';
import { RefreshTokenUseCase } from '../services/refresh-token.use-case';
import { LogoutUseCase } from '../services/logout.use-case';
import { LoginRequestDto } from '../dtos/auth/auth-requests.dto';
import { RefreshTokenRequestDto } from '../dtos/auth/auth-requests.dto';
import { AuthMapper } from '../mappers/auth.mapper';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUserId } from '../decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly authMapper: AuthMapper,
  ) {}

  @Post('register')
  async register(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    registerDto: RegisterDto,
  ): Promise<RegisterSchema> {
    if (registerDto.password !== registerDto.confirmPassword) {
      throw new BadRequestException('Senhas não coincidem');
    }

    await this.createUserUseCase.execute(registerDto);

    return {
      status: HttpStatus.CREATED,
      data: {
        message: 'Usuário criado com sucesso',
      },
    };
  }

  @Post('login')
  async login(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    loginDto: LoginRequestDto,
  ) {
    try {
      return await this.loginUseCase.execute(loginDto);
    } catch (error) {
      throw new UnauthorizedException(
        error instanceof Error ? error.message : 'Falha ao realizar login',
      );
    }
  }

  @Post('refresh-token')
  async refreshToken(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    refreshTokenDto: RefreshTokenRequestDto,
  ) {
    try {
      return await this.refreshTokenUseCase.execute(refreshTokenDto);
    } catch (error) {
      throw new UnauthorizedException(
        error instanceof Error ? error.message : 'Falha ao renovar token',
      );
    }
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@CurrentUserId() userId: string | undefined) {
    if (!userId) {
      throw new UnauthorizedException('Usuário não autenticado');
    }

    await this.logoutUseCase.execute(userId);

    return {
      status: HttpStatus.OK,
      data: {
        message: 'Logout realizado com sucesso',
      },
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@CurrentUserId() userId: string | undefined) {
    // Este endpoint retorna as informações do usuário autenticado
    // As informações vêm do JWT, então aqui apenas confirmamos que o usuário está autenticado
    return {
      status: HttpStatus.OK,
      data: {
        message: 'Perfil do usuário',
        userId,
      },
    };
  }
}
