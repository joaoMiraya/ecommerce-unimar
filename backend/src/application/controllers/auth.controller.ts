import {
  Controller,
  Post,
  Get,
  Body,
  HttpStatus,
  UseGuards,
  BadRequestException,
  UnauthorizedException,
  Res,
  Req,
} from '@nestjs/common';
import { RegisterDto, AuthSchema } from '../schemas/auth.schema';
import { CreateUserUseCase } from '../services/create-user.use-case';
import { LoginUseCase } from '../services/login.use-case';
import { RefreshTokenUseCase } from '../services/refresh-token.use-case';
import { LogoutUseCase } from '../services/logout.use-case';
import { LoginRequestDto } from '../dtos/auth/auth-requests.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUserId } from '../decorators/current-user.decorator';
import { type Request, type Response } from 'express';
import { GetProfileUseCase } from '../services/get-profile.use-case';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly getProfileUseCase: GetProfileUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly logoutUseCase: LogoutUseCase,
  ) {}

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthSchema> {
    if (registerDto.password !== registerDto.confirmPassword) {
      throw new BadRequestException('Senhas não coincidem');
    }

    try {
      await this.createUserUseCase.execute(registerDto);
      const loginDto: LoginRequestDto = {
        email: registerDto.email,
        password: registerDto.password,
      };

      const response = await this.loginUseCase.execute(loginDto);
      res.cookie('refresh_token', response.refreshToken.value, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        path: '/auth/refresh',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
      });

      return {
        status: HttpStatus.CREATED,
        data: {
          user: response.user,
          accessToken: response.accessToken,
        },
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Falha ao cadastrar usuário',
      );
    }
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginRequestDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthSchema> {
    try {
      const response = await this.loginUseCase.execute(loginDto);

      res.cookie('refresh_token', response.refreshToken.value, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        path: '/api/auth/refresh',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
      });

      return {
        status: HttpStatus.ACCEPTED,
        data: {
          user: response.user,
          accessToken: response.accessToken,
        },
      };
    } catch (error) {
      throw new UnauthorizedException(
        error instanceof Error ? error.message : 'Falha ao realizar login',
      );
    }
  }

  @Post('refresh')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthSchema> {
    const refreshToken = req.cookies?.refresh_token as string;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token não encontrado');
    }

    try {
      const { accessToken, user } = await this.refreshTokenUseCase.execute({
        refreshToken,
      });

      return {
        status: HttpStatus.OK,
        data: {
          user,
          accessToken,
        },
      };
    } catch (error) {
      res.clearCookie('refresh_token', { path: '/api/auth/refresh' });
      throw new UnauthorizedException(
        error instanceof Error ? error.message : 'Falha ao renovar token',
      );
    }
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@CurrentUserId() userId: string) {
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

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUserId() userId: string) {
    // Este endpoint retorna as informações do usuário autenticado
    // As informações vêm do JWT, então aqui apenas confirmamos que o usuário está autenticado
    const user = await this.getProfileUseCase.execute(userId);
    return {
      status: HttpStatus.OK,
      data: {
        user,
      },
    };
  }
}
