import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            findByUsername: jest.fn(),
            findByEmailWithPassword: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: { sign: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
  });

  describe('register', () => {
    it('throws ConflictException when email already taken', async () => {
      usersService.findByEmail.mockResolvedValue({ id: 1 } as any);
      await expect(service.register('test@test.com', 'user', 'password')).rejects.toThrow(ConflictException);
    });

    it('throws ConflictException when username already taken', async () => {
      usersService.findByEmail.mockResolvedValue(null);
      usersService.findByUsername.mockResolvedValue({ id: 1 } as any);
      await expect(service.register('test@test.com', 'user', 'password')).rejects.toThrow(ConflictException);
    });

    it('creates user with hashed password and returns userId', async () => {
      usersService.findByEmail.mockResolvedValue(null);
      usersService.findByUsername.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');
      usersService.create.mockResolvedValue({ id: 5 } as any);

      const result = await service.register('test@test.com', 'user', 'password123');

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(usersService.create).toHaveBeenCalledWith(
        expect.objectContaining({ passwordHash: 'hashed_password' }),
      );
      expect(result).toEqual({ message: 'Account created', userId: 5 });
    });
  });

  describe('login', () => {
    it('throws UnauthorizedException when user not found', async () => {
      usersService.findByEmailWithPassword.mockResolvedValue(null);
      await expect(service.login('test@test.com', 'password')).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException when password does not match', async () => {
      usersService.findByEmailWithPassword.mockResolvedValue({ id: 1, passwordHash: 'hash' } as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      await expect(service.login('test@test.com', 'wrong')).rejects.toThrow(UnauthorizedException);
    });

    it('returns access_token on valid credentials', async () => {
      usersService.findByEmailWithPassword.mockResolvedValue({
        id: 1,
        email: 'test@test.com',
        role: 'user',
        passwordHash: 'hash',
      } as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwtService.sign.mockReturnValue('token123');

      const result = await service.login('test@test.com', 'password');
      expect(result).toEqual({ access_token: 'token123' });
    });
  });
});
