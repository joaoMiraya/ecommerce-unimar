import { Injectable } from '@nestjs/common';
import type { IUserRepository } from '../repositories/user.repository';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserDomainService {
  constructor(private readonly userRepository: IUserRepository) {}

  async createUser(
    name: string,
    email: string,
    password: string,
  ): Promise<UserEntity> {
    const emailExists = await this.userRepository.emailExists(email);
    if (emailExists) {
      throw new Error(`Email ${email} already registered`);
    }

    if (!name || name.trim().length === 0) {
      throw new Error('User name is required');
    }

    if (!email || email.trim().length === 0) {
      throw new Error('User email is required');
    }

    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    const user = new UserEntity({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      isActive: true,
    });

    return user;
  }

  async getUserByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.userRepository.findByEmail(email);

    if (user && !user.isActive) {
      throw new Error('User account is deactivated');
    }

    return user;
  }

  async updateUserInfo(
    userId: string,
    name: string,
    email: string,
  ): Promise<UserEntity> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }

    if (!user.isActive) {
      throw new Error('Cannot update inactive user');
    }

    if (email !== user.email) {
      const emailExists = await this.userRepository.emailExists(email);
      if (emailExists) {
        throw new Error(`Email ${email} already registered`);
      }
    }

    user.updateInfo(name, email);

    return user;
  }

  async deactivateUser(userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }

    user.deactivate();
    await this.userRepository.save(user);
  }

  async activateUser(userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }

    user.activate();
    await this.userRepository.save(user);
  }
}
