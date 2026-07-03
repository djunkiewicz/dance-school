import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email });
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.email = :email', { email })
      .getOne();
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ username });
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }

  async update(id: number, updateData: Partial<User>): Promise<User | null> {
    const { role, passwordHash, ...safeData } = updateData;
    await this.usersRepository.update(id, safeData);
    return this.findOne(id);
  }

  async changePassword(id: number, oldPassword: string, newPassword: string): Promise<void> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.id = :id', { id })
      .getOne();
    if (!user) throw new NotFoundException('User not found');
    const isMatch = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isMatch) throw new UnauthorizedException('Invalid current password');
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await this.usersRepository.update(id, { passwordHash });
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}