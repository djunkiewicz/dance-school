import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { LessonsModule } from './lessons/lessons.module';
import { ReservationsModule } from './reservations/reservations.module';
import { DatabaseModule } from './config/database.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [DatabaseModule, UsersModule, LessonsModule, ReservationsModule, AuthModule],
})
export class AppModule {}
