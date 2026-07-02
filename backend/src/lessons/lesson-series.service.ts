import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { LessonSeries } from './lesson-series.entity';
import { Lesson } from './lesson.entity';

@Injectable()
export class LessonSeriesService {
  constructor(private dataSource: DataSource) {}

  async findAll(): Promise<LessonSeries[]> {
    return this.dataSource.getRepository(LessonSeries).find();
  }

  async findOne(id: number): Promise<LessonSeries | null> {
    return this.dataSource.getRepository(LessonSeries).findOne({
      where: { id },
      relations: { lessons: true },
    });
  }

  async createSeries(data: Partial<LessonSeries>): Promise<LessonSeries> {
    return this.dataSource.transaction(async (manager) => {
      const series = manager.create(LessonSeries, data);
      const savedSeries = await manager.save(LessonSeries, series);

      const lessons: Lesson[] = [];
      const endDate = new Date(savedSeries.endDate);
      let currentDate = new Date(savedSeries.startDate);

      while (currentDate <= endDate) {
        const lessonStart = new Date(currentDate);
        const lessonEnd = new Date(currentDate.getTime() + savedSeries.durationMinutes * 60_000);

        lessons.push(
          manager.create(Lesson, {
            title: savedSeries.title,
            description: savedSeries.description,
            location: savedSeries.location,
            capacity: savedSeries.capacity,
            startDate: lessonStart,
            endDate: lessonEnd,
            series: savedSeries,
          }),
        );

        currentDate.setDate(currentDate.getDate() + savedSeries.intervalWeeks * 7);
      }

      await manager.save(Lesson, lessons);
      return savedSeries;
    });
  }

  async remove(id: number): Promise<void> {
    const series = await this.findOne(id);
    if (!series) throw new NotFoundException('Series not found');
    await this.dataSource.getRepository(LessonSeries).delete(id);
  }
}
