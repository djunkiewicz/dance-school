import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LessonsController } from './lessons.controller';
import { LessonsService } from './lessons.service';
import { Lesson } from './lesson.entity';
import { GuardsModule } from '../auth/guards.module';

@Module({
  imports: [TypeOrmModule.forFeature([Lesson]), GuardsModule],
  controllers: [LessonsController],
  providers: [LessonsService],
})
export class LessonsModule {}
