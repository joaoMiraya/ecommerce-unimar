import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './controllers/users.controller';
import { DisableUserUseCase } from './services/disable-user.use-case';
import {
  ADDRESS_REPOSITORY_TOKEN,
  AUTH_REPOSITORY_TOKEN,
  USER_REPOSITORY_TOKEN,
} from './di/tokens';
import { DatabaseModule } from '../infrastruct/database/database.module';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserRepositoryImpl } from 'src/infrastruct/database/repositories/user.repository.impl';
import { LogoutUseCase } from './services/logout.use-case';
import { AuthRepositoryImpl } from 'src/infrastruct/database/repositories/auth.repository.impl';
import { UpdateUserUseCase } from './services/update-user.use-case';
import { LoginSessionEntity } from 'src/domain/auth/entities';
import { CreateAddressUseCase } from './services/create-address.use-case';
import { AddressRepositoryImpl } from '../infrastruct/database/repositories/address.repository.impl';
import { AddressDomainService } from 'src/domain/address/services/address.service';
import { UpdateAddressUseCase } from './services/update-address.use-case';

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
  controllers: [UsersController],
  providers: [
    // Use Cases
    DisableUserUseCase,
    LogoutUseCase,
    UpdateUserUseCase,
    CreateAddressUseCase,
    UpdateAddressUseCase,

    // Domain Services
    AddressDomainService,

    // Repositories
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: UserRepositoryImpl,
    },
    {
      provide: AUTH_REPOSITORY_TOKEN,
      useClass: AuthRepositoryImpl,
    },
    {
      provide: ADDRESS_REPOSITORY_TOKEN,
      useClass: AddressRepositoryImpl,
    },
    // Guards
    JwtAuthGuard,
  ],
  exports: [
    JwtAuthGuard,
    JwtModule,
    AUTH_REPOSITORY_TOKEN,
    USER_REPOSITORY_TOKEN,
    ADDRESS_REPOSITORY_TOKEN,
  ],
})
export class UsersModule {}
