import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';
import { User } from './user.entity';

jest.mock('bcrypt');

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: any;

  const mockQueryBuilder = {
    addSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
  };

  beforeEach(async () => {
    usersRepository = {
      update: jest.fn(),
      findOneBy: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: usersRepository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);

    jest.clearAllMocks();
    usersRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
  });

  describe('update', () => {
    it('strips role and passwordHash before saving', async () => {
      usersRepository.update.mockResolvedValue({});
      usersRepository.findOneBy.mockResolvedValue({ id: 1, firstName: 'Jan', role: 'user' });

      await service.update(1, { firstName: 'Jan', role: 'admin' as any, passwordHash: 'hack' });

      expect(usersRepository.update).toHaveBeenCalledWith(1, { firstName: 'Jan' });
    });

    it('allows updating safe fields', async () => {
      usersRepository.update.mockResolvedValue({});
      usersRepository.findOneBy.mockResolvedValue({ id: 1, firstName: 'Nowe', lastName: 'Nazwisko' });

      const result = await service.update(1, { firstName: 'Nowe', lastName: 'Nazwisko' });

      expect(usersRepository.update).toHaveBeenCalledWith(1, { firstName: 'Nowe', lastName: 'Nazwisko' });
      expect(result?.firstName).toBe('Nowe');
    });
  });

  describe('changePassword', () => {
    it('throws NotFoundException when user not found', async () => {
      mockQueryBuilder.getOne.mockResolvedValue(null);
      await expect(service.changePassword(1, 'old', 'new')).rejects.toThrow(NotFoundException);
    });

    it('throws UnauthorizedException when old password is wrong', async () => {
      mockQueryBuilder.getOne.mockResolvedValue({ id: 1, passwordHash: 'hash' });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      await expect(service.changePassword(1, 'wrongPass', 'newPass')).rejects.toThrow(UnauthorizedException);
    });

    it('hashes and saves new password on success', async () => {
      mockQueryBuilder.getOne.mockResolvedValue({ id: 1, passwordHash: 'old_hash' });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue('new_hash');
      usersRepository.update.mockResolvedValue({});

      await service.changePassword(1, 'oldPass', 'newPass');

      expect(bcrypt.hash).toHaveBeenCalledWith('newPass', 10);
      expect(usersRepository.update).toHaveBeenCalledWith(1, { passwordHash: 'new_hash' });
    });
  });
});
