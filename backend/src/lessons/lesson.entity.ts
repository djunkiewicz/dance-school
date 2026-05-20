import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Reservation } from '../reservations/reservation.entity';

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

  @OneToMany(
    () => Reservation,
    (reservation) => reservation.lesson,
  )
  reservations!: Reservation[];
}