import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './reservation.entity';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private reservationsRepository: Repository<Reservation>,
  ) {}

  async findAll(): Promise<Reservation[]> {
    return this.reservationsRepository.find({ relations: { user: true, lesson: true } });
  }

  async findOne(id: number): Promise<Reservation | null> {
    return this.reservationsRepository.findOne({ where: { id }, relations: { user: true, lesson: true } });
  }

  async create(reservationData: Partial<Reservation>): Promise<Reservation> {
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
