import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { LessonSeriesService } from './lesson-series.service';
import { LessonSeries } from './lesson-series.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('lessons/series')
export class LessonSeriesController {
  constructor(private readonly lessonSeriesService: LessonSeriesService) {}

  @Get()
  findAll(): Promise<LessonSeries[]> {
    return this.lessonSeriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<LessonSeries | null> {
    return this.lessonSeriesService.findOne(id);
  }

  @Post()
  createSeries(@Body() data: Partial<LessonSeries>): Promise<LessonSeries> {
    return this.lessonSeriesService.createSeries(data);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.lessonSeriesService.remove(id);
  }
}
