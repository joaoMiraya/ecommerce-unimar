import { Inject, Injectable } from '@nestjs/common';
import { type IUnitOfWork } from '../../domain/shared/repositories/unit-of-work.interface';
import { UserDomainService } from '../../domain/user/services/user.service';
import { UNIT_OF_WORK_TOKEN } from '../di/tokens';

/**
 * Use Case para buscar informações completas do usuário
 */
@Injectable()
export class DisableUserUseCase {
  constructor(
    @Inject(UNIT_OF_WORK_TOKEN)
    private readonly unitOfWork: IUnitOfWork,
    private readonly userDomainService: UserDomainService,
  ) {}

  async execute(id: string): Promise<void> {
    return this.unitOfWork.execute(async () => {
      try {
        return await this.userDomainService.deactivateUser(id);
      } catch {
        throw new Error('User not found');
      }
    });
  }
}
