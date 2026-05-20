import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Lesson } from '../lessons/lesson.entity';

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(
    () => User,
    (user) => user.reservations,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(
    () => Lesson,
    (lesson) => lesson.reservations,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'lesson_id' })
  lesson!: Lesson;

  @Column({
    type: 'enum',
    enum: ['active', 'cancelled', 'pending'],
    default: 'pending',
  })
  status!: 'active' | 'cancelled' | 'pending';

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}