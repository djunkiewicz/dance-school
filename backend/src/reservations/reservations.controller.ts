import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { Reservation } from './reservation.entity';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Get()
  findAll(): Promise<Reservation[]> {
    return this.reservationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Reservation | null> {
    return this.reservationsService.findOne(id);
  }

  @Post()
  create(@Body() reservationData: Partial<Reservation>): Promise<Reservation> {
    return this.reservationsService.create(reservationData);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateData: Partial<Reservation>): Promise<Reservation | null> {
    return this.reservationsService.update(id, updateData);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.reservationsService.remove(id);
  }
}
