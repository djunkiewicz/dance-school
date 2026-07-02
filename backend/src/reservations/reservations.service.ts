import { Injectable, ConflictException, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Reservation } from './reservation.entity';
import { Lesson } from '../lessons/lesson.entity';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private reservationsRepository: Repository<Reservation>,
    @InjectRepository(Lesson)
    private lessonsRepository: Repository<Lesson>,
  ) {}

  async findAll(): Promise<Reservation[]> {
    return this.reservationsRepository.find({ relations: { user: true, lesson: true } });
  }

  async findByUserId(userId: number): Promise<Reservation[]> {
    return this.reservationsRepository.find({
      where: { user: { id: userId } },
      relations: { user: true, lesson: true },
    });
  }

  async findOne(id: number): Promise<Reservation | null> {
    return this.reservationsRepository.findOne({ where: { id }, relations: { user: true, lesson: true } });
  }

  async createForUser(userId: number, lessonId: number): Promise<Reservation> {
    const existing = await this.reservationsRepository.findOne({
      where: {
        user: { id: userId },
        lesson: { id: lessonId },
        status: Not('cancelled'),
      },
    });

    if (existing) {
      throw new ConflictException('You already have an active reservation for this lesson');
    }

    const lesson = await this.lessonsRepository.findOneBy({ id: lessonId });
    if (!lesson) throw new NotFoundException('Lesson not found');

    const activeCount = await this.reservationsRepository.count({
      where: { lesson: { id: lessonId }, status: Not('cancelled') },
    });

    if (activeCount >= lesson.capacity) {
      throw new BadRequestException('No available spots for this lesson');
    }

    const reservation = this.reservationsRepository.create({
      user: { id: userId },
      lesson: { id: lessonId },
    });
    return this.reservationsRepository.save(reservation);
  }

  async cancelForUser(userId: number, reservationId: number): Promise<Reservation> {
    const reservation = await this.findOne(reservationId);

    if (!reservation) throw new NotFoundException('Reservation not found');
    if (reservation.user.id !== userId) throw new ForbiddenException('This is not your reservation');
    if (reservation.status === 'cancelled') return reservation;

    await this.reservationsRepository.update(reservationId, { status: 'cancelled' });
    return this.findOne(reservationId) as Promise<Reservation>;
  }

  async create(reservationData: Partial<Reservation>): Promise<Reservation> {
    const userId = reservationData.user?.id;
    const lessonId = reservationData.lesson?.id;

    if (userId && lessonId) {
      const existing = await this.reservationsRepository.findOne({
        where: { user: { id: userId }, lesson: { id: lessonId }, status: Not('cancelled') },
      });

      if (existing) {
        throw new ConflictException('An active reservation for this user and lesson already exists');
      }
    }

    const reservation = this.reservationsRepository.create(reservationData);
    return this.reservationsRepository.save(reservation);
  }

  async update(id: number, updateData: Partial<Reservation>): Promise<Reservation | null> {
    await this.reservationsRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.reservationsRepository.delete(id);
  }
}
