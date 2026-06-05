import { Inject, Injectable } from '@nestjs/common';
import type { IUnitOfWork } from '../../domain/shared/repositories/unit-of-work.interface';
import { UNIT_OF_WORK_TOKEN, ADDRESS_REPOSITORY_TOKEN } from '../di/tokens';
import type { IAddressRepository } from 'src/domain/address/repositories/address.repository';
import { AddressDomainService } from 'src/domain/address/services/address.service';
import { AddressEntity } from 'src/domain/address/entities/address.entity';

export interface CreateAddressInput {
  city: string;
  neighborhood: string;
  street: string;
  number: string;
  zipCode: string;
}

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(UNIT_OF_WORK_TOKEN)
    private readonly unitOfWork: IUnitOfWork,
    @Inject(ADDRESS_REPOSITORY_TOKEN)
    private readonly addressRepository: IAddressRepository,
    private readonly addressDomainService: AddressDomainService,
  ) {}

  async execute(input: CreateAddressInput): Promise<AddressEntity> {
    const { city, neighborhood, street, number, zipCode } = input;

    return this.unitOfWork.execute(async () => {
      const address = this.addressDomainService.createAddress(
        city,
        neighborhood,
        street,
        number,
        zipCode,
      );
      return this.addressRepository.save(address);
    });
  }
}
