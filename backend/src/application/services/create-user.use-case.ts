import { Inject, Injectable } from '@nestjs/common';
import type { IUserRepository } from '../../domain/user/repositories/user.repository';
import type { IUnitOfWork } from '../../domain/shared/repositories/unit-of-work.interface';
import { UserDomainService } from '../../domain/user/services/user.service';
import { UserEntity } from '../../domain/user/entities/user.entity';
import { UNIT_OF_WORK_TOKEN, USER_REPOSITORY_TOKEN } from '../di/tokens';

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(UNIT_OF_WORK_TOKEN)
    private readonly unitOfWork: IUnitOfWork,
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
    private readonly userDomainService: UserDomainService,
  ) {}

  async execute(input: CreateUserInput): Promise<UserEntity> {
    const { name, email, password } = input;

    return this.unitOfWork.execute(async () => {
      const user = await this.userDomainService.createUser(
        name,
        email,
        password,
      );
      return this.userRepository.save(user);
    });
  }
}
