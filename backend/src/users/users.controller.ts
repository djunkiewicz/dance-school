import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  findMe(@Request() req: any): Promise<User | null> {
    return this.usersService.findOne(req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get(':id')
  findOne(@Param('id') id: number): Promise<User | null> {
    return this.usersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  create(@Body() userData: Partial<User>): Promise<User> {
    return this.usersService.create(userData);
  }

  @UseGuards(JwtAuthGuard)
  @Post('me/password')
  changePassword(@Request() req: any, @Body() body: { oldPassword: string; newPassword: string }): Promise<void> {
    return this.usersService.changePassword(req.user.id, body.oldPassword, body.newPassword);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: number, @Body() updateData: Partial<User>, @Request() req: any): Promise<User | null> {
    if (req.user.id !== Number(id) && req.user.role !== 'admin') {
      throw new ForbiddenException('You can only update your own profile');
    }
    return this.usersService.update(id, updateData);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.usersService.remove(id);
  }
}
