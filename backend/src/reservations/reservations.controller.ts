import { Controller, Get, Post, Put, Patch, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { Reservation } from './reservation.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  findAll(): Promise<Reservation[]> {
    return this.reservationsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  findMy(@Request() req): Promise<Reservation[]> {
    return this.reservationsService.findByUserId(req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Reservation | null> {
    return this.reservationsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('my')
  createForUser(@Request() req, @Body() body: { lessonId: number }): Promise<Reservation> {
    return this.reservationsService.createForUser(req.user.id, body.lessonId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  create(@Body() reservationData: Partial<Reservation>): Promise<Reservation> {
    return this.reservationsService.create(reservationData);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put(':id')
  update(@Param('id') id: number, @Body() updateData: Partial<Reservation>): Promise<Reservation | null> {
    return this.reservationsService.update(id, updateData);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('my/:id/cancel')
  cancel(@Request() req: any, @Param('id') id: number): Promise<Reservation> {
    return this.reservationsService.cancelForUser(req.user.id, id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.reservationsService.remove(id);
  }
}
