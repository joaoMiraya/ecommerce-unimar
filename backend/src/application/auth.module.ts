import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

// Controllers
import { AuthController } from './controllers/auth.controller';

// Use Cases
import { CreateUserUseCase } from './services/create-user.use-case';
import { LoginUseCase } from './services/login.use-case';
import { RefreshTokenUseCase } from './services/refresh-token.use-case';
import { LogoutUseCase } from './services/logout.use-case';

// Repositories
import { AuthRepositoryImpl } from '../infrastruct/database/repositories/auth.repository.impl';

// Mappers
import { AuthMapper } from './mappers/auth.mapper';

// Guards
import { JwtAuthGuard } from './guards/jwt-auth.guard';

// Entities
import { LoginSessionEntity } from '../domain/auth/entities/login-session.entity';

// Tokens
import { AUTH_REPOSITORY_TOKEN } from './di/tokens';

// Infrastructure Modules
import { DatabaseModule } from '../infrastruct/database/database.module';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([LoginSessionEntity]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: {
        expiresIn: '1h',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    // Use Cases
    CreateUserUseCase,
    LoginUseCase,
    RefreshTokenUseCase,
    LogoutUseCase,

    // Repositories
    {
      provide: AUTH_REPOSITORY_TOKEN,
      useClass: AuthRepositoryImpl,
    },

    // Mappers
    AuthMapper,

    // Guards
    JwtAuthGuard,
  ],
  exports: [JwtAuthGuard, AuthMapper, AUTH_REPOSITORY_TOKEN, JwtModule],
})
export class AuthModule {}
