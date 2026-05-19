import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { Lesson } from './lesson.entity';

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

  @Post()
  create(@Body() lessonData: Partial<Lesson>): Promise<Lesson> {
    return this.lessonsService.create(lessonData);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateData: Partial<Lesson>): Promise<Lesson | null> {
    return this.lessonsService.update(id, updateData);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.lessonsService.remove(id);
  }
}
