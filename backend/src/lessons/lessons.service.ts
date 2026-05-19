import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from './lesson.entity';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson)
    private lessonsRepository: Repository<Lesson>,
  ) {}

  async findAll(): Promise<Lesson[]> {
    return this.lessonsRepository.find();
  }

  async findOne(id: number): Promise<Lesson | null> {
    return this.lessonsRepository.findOneBy({ id });
  }

  async create(lessonData: Partial<Lesson>): Promise<Lesson> {
    const lesson = this.lessonsRepository.create(lessonData);
    return this.lessonsRepository.save(lesson);
  }

  async update(id: number, updateData: Partial<Lesson>): Promise<Lesson | null> {
    await this.lessonsRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.lessonsRepository.delete(id);
  }
}