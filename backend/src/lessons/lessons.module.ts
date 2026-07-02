import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LessonsController } from './lessons.controller';
import { LessonsService } from './lessons.service';
import { LessonSeriesController } from './lesson-series.controller';
import { LessonSeriesService } from './lesson-series.service';
import { Lesson } from './lesson.entity';
import { LessonSeries } from './lesson-series.entity';
import { GuardsModule } from '../auth/guards/guards.module';

@Module({
  imports: [TypeOrmModule.forFeature([Lesson, LessonSeries]), GuardsModule],
  controllers: [LessonSeriesController, LessonsController],
  providers: [LessonsService, LessonSeriesService],
})
export class LessonsModule {}
