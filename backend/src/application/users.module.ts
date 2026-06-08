import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { DisableUserUseCase } from './services/disable-user.use-case';
import { DatabaseModule } from '../infrastruct/database/database.module';
import { UpdateUserUseCase } from './services/update-user.use-case';
import { CreateAddressUseCase } from './services/create-address.use-case';
import { UpdateAddressUseCase } from './services/update-address.use-case';
import { AuthModule } from './auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [UsersController],
  providers: [
    DisableUserUseCase,
    UpdateUserUseCase,
    CreateAddressUseCase,
    UpdateAddressUseCase,
  ],
})
export class UsersModule {}
