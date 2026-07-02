import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(email: string, username: string, password: string, firstName?: string, lastName?: string) {
    const existing = await this.usersService.findByEmail(email);
    if (existing) throw new ConflictException('Email already taken');

    const existingUsername = await this.usersService.findByUsername(username);
    if (existingUsername) throw new ConflictException('Username already taken');

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.usersService.create({ email, username, passwordHash, firstName, lastName });

    return { message: 'Account created', userId: user.id };
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmailWithPassword(email);
    if (!user) throw new UnauthorizedException('Invalid email or password');

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) throw new UnauthorizedException('Invalid email or password');

    const payload = { sub: user.id, email: user.email, role: user.role };
    return { access_token: this.jwtService.sign(payload) };
  }
}
