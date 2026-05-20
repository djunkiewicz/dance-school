import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { LessonsModule } from './lessons/lessons.module';
import { ReservationsModule } from './reservations/reservations.module';
import { DatabaseModule } from './config/database.module';

@Module({
  imports: [DatabaseModule, UsersModule, LessonsModule, ReservationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
