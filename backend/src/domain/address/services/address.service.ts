import type { IAddressRepository } from '../repositories/address.repository';
import { AddressEntity } from '../entities/address.entity';

export class AddressDomainService {
  constructor(
    private readonly addressRepository: IAddressRepository,
  ) {}

  createAddress(
    userId: string,
    city: string,
    neighborhood: string,
    street: string,
    number: string,
    zipCode: string,
  ): AddressEntity {
    if (!userId || userId.trim().length === 0) {
      throw new Error('UserId is required');
    }
    if (!city || city.trim().length === 0) {
      throw new Error('City is required');
    }
    if (!neighborhood || neighborhood.trim().length === 0) {
      throw new Error('Neighborhood is required');
    }
    if (!street || street.trim().length === 0) {
      throw new Error('Street is required');
    }
    if (!number || number.trim().length === 0) {
      throw new Error('House Number is required');
    }
    if (!zipCode || zipCode.trim().length === 0) {
      throw new Error('Zip-Code is required');
    }

    const address = new AddressEntity({
      userId: userId,
      city: city.trim(),
      neighborhood: neighborhood.trim(),
      street: street.trim(),
      number: number.trim(),
      zipCode: zipCode,
    });

    return address;
  }

  async getAddressByUserId(id: string): Promise<AddressEntity | null> {
    const address = await this.addressRepository.findByUserId(id);

    return address;
  }

  async updateAddressInfo(
    id: string,
    props: Partial<
      Pick<
        AddressEntity,
        'city' | 'street' | 'number' | 'neighborhood' | 'zipCode'
      >
    >,
  ): Promise<AddressEntity> {
    const address = await this.addressRepository.findById(id);

    if (!address) {
      throw new Error(`Address with id ${id} not found`);
    }

    address.updateInfo(props);

    return address;
  }
}
