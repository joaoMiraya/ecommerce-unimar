import { Injectable } from '@nestjs/common';
import type { IAddressRepository } from '../repositories/address.repository';
import { AddressEntity } from '../entities/address.entity';

@Injectable()
export class AddressDomainService {
  constructor(private readonly addressRepository: IAddressRepository) {}

  createAddress(
    city: string,
    neighborhood: string,
    street: string,
    number: string,
    zipCode: string,
  ): AddressEntity {
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

  // async updateUserInfo(
  //   userId: string,
  //   name: string,
  //   email: string,
  // ): Promise<UserEntity> {
  //   const user = await this.addressRepository.findById(userId);

  //   if (!user) {
  //     throw new Error(`User with id ${userId} not found`);
  //   }

  //   if (!user.isActive) {
  //     throw new Error('Cannot update inactive user');
  //   }

  //   if (email !== user.email) {
  //     const emailExists = await this.addressRepository.emailExists(email);
  //     if (emailExists) {
  //       throw new Error(`Email ${email} already registered`);
  //     }
  //   }

  //   user.updateInfo(name, email);

  //   return user;
  // }
}
