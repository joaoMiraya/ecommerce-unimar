import { Inject, Injectable } from '@nestjs/common';
import { type IUnitOfWork } from '../../domain/shared/repositories/unit-of-work.interface';
import { UserDomainService } from '../../domain/user/services/user.service';
import { UNIT_OF_WORK_TOKEN } from '../di/tokens';
import { UserEntity } from 'src/domain/user/entities/user.entity';

/**
 * Use Case para buscar informações completas do usuário
 */
@Injectable()
export class GetProfileUseCase {
  constructor(
    @Inject(UNIT_OF_WORK_TOKEN)
    private readonly unitOfWork: IUnitOfWork,
    private readonly userDomainService: UserDomainService,
  ) {}

  async execute(id: string): Promise<UserEntity> {
    return this.unitOfWork.execute(async () => {
      const user = await this.userDomainService.getUserById(id);
      if (!user) {
        throw new Error('User not found');
      }

      return user;
    });
  }
}
