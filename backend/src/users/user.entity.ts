import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';

import { Reservation } from '../reservations/reservation.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'varchar',
    unique: true,
  })
  email!: string;

  @Column({
    type: 'varchar',
    unique: true,
  })
  username!: string;

  @Column({
    name: 'first_name',
    type: 'varchar',
    nullable: true,
  })
  firstName!: string;

  @Column({
    name: 'last_name',
    type: 'varchar',
    nullable: true,
  })
  lastName!: string;

  @Column({
    name: 'password_hash',
    type: 'varchar',
  })
  passwordHash!: string;

  @Column({
    type: 'enum',
    enum: ['user', 'admin'],
    default: 'user',
  })
  role!: 'user' | 'admin';

  @Column({
    name: 'created_at',
    type: 'timestamp',
  })
  createdAt!: Date;

  @OneToMany(
    () => Reservation,
    (reservation) => reservation.user,
  )
  reservations!: Reservation[];
}