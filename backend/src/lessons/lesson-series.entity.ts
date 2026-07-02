import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Lesson } from './lesson.entity';

@Entity('lesson_series')
export class LessonSeries {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar' })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({ type: 'varchar' })
  location!: string;

  @Column({ type: 'int' })
  capacity!: number;

  @Column({ name: 'interval_weeks', type: 'int', default: 1 })
  intervalWeeks!: number;

  @Column({ name: 'duration_minutes', type: 'int' })
  durationMinutes!: number;

  @Column({ name: 'start_date', type: 'datetime' })
  startDate!: Date;

  @Column({ name: 'end_date', type: 'datetime' })
  endDate!: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @OneToMany(() => Lesson, (lesson) => lesson.series)
  lessons!: Lesson[];
}
