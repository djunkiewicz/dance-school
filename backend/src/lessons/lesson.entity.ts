import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Reservation } from '../reservations/reservation.entity';
import { LessonSeries } from './lesson-series.entity';

@Entity('lessons')
export class Lesson {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar' })
  title!: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description!: string;

  @Column({
    name: 'start_date',
    type: 'datetime',
  })
  startDate!: Date;

  @Column({
    name: 'end_date',
    type: 'datetime',
  })
  endDate!: Date;

  @Column({ type: 'varchar' })
  location!: string;

  @Column({ type: 'int' })
  capacity!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @ManyToOne(() => LessonSeries, (series) => series.lessons, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'series_id' })
  series!: LessonSeries | null;

  @OneToMany(
    () => Reservation,
    (reservation) => reservation.lesson,
  )
  reservations!: Reservation[];
}