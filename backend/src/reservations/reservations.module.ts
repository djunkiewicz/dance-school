import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { Reservation } from './reservation.entity';
import { Lesson } from '../lessons/lesson.entity';
import { GuardsModule } from '../auth/guards/guards.module';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation, Lesson]), GuardsModule],
  controllers: [ReservationsController],
  providers: [ReservationsService],
})
export class ReservationsModule {}
