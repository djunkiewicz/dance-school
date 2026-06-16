import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { Reservation } from './reservation.entity';
import { GuardsModule } from '../auth/guards.module';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation]), GuardsModule],
  controllers: [ReservationsController],
  providers: [ReservationsService],
})
export class ReservationsModule {}
