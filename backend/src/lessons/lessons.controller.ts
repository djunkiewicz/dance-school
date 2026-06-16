import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { Lesson } from './lesson.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Get()
  findAll(): Promise<Lesson[]> {
    return this.lessonsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Lesson | null> {
    return this.lessonsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  create(@Body() lessonData: Partial<Lesson>): Promise<Lesson> {
    return this.lessonsService.create(lessonData);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put(':id')
  update(@Param('id') id: number, @Body() updateData: Partial<Lesson>): Promise<Lesson | null> {
    return this.lessonsService.update(id, updateData);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.lessonsService.remove(id);
  }
}
