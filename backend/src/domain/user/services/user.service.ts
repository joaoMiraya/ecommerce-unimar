import { Inject, Injectable } from '@nestjs/common';
import type { IUserRepository } from '../repositories/user.repository';
import { UserEntity } from '../entities/user.entity';
import { Email } from 'src/domain/shared/value-objects/email';
import { Password } from 'src/domain/shared/value-objects/password';
import { USER_REPOSITORY_TOKEN } from '../../../application/di/tokens';

@Injectable()
export class UserDomainService {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
  ) {}

  async createUser(
    name: string,
    email: string,
    password: string,
  ): Promise<UserEntity> {
    const emailVO = Email.create(email);
    const emailExists = await this.userRepository.emailExists(emailVO.value);

    if (emailExists) {
      throw new Error(`Email ${email} already registered`);
    }

    if (!name || name.trim().length === 0) {
      throw new Error('User name is required');
    }

    const passwordVO = Password.create(password);
    const hashedPassword = (await passwordVO).value;

    const user = new UserEntity({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      isActive: true,
    });

    return user;
  }

  async getUserByEmail(email: Email): Promise<UserEntity | null> {
    const user = await this.userRepository.findByEmail(email.value);

    if (user && !user.isActive) {
      throw new Error('User account is deactivated');
    }

    return user;
  }

  async getUserById(id: string): Promise<UserEntity | null> {
    const user = await this.userRepository.findById(id);

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
