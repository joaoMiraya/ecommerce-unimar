import { Inject, Injectable } from '@nestjs/common';
import type { IUserRepository } from '../../domain/user/repositories/user.repository';
import type { IUnitOfWork } from '../../domain/shared/repositories/unit-of-work.interface';
import { UserDomainService } from '../../domain/user/services/user.service';
import { UNIT_OF_WORK_TOKEN, USER_REPOSITORY_TOKEN } from '../di/tokens';
import { UpdateUserDto } from '../dtos/users/update-user.dto';
import { UserEntity } from 'src/domain/user/entities/user.entity';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(UNIT_OF_WORK_TOKEN)
    private readonly unitOfWork: IUnitOfWork,
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
    private readonly userDomainService: UserDomainService,
  ) {}

  async execute(input: UpdateUserDto): Promise<UserEntity> {
    const { name, email, userId } = input;

    return this.unitOfWork.execute(async () => {
      const user = await this.userDomainService.updateUserInfo(
        userId,
        name,
        email,
      );
      return this.userRepository.save(user);
    });
  }
}
