import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { Reservation } from './reservation.entity';
import { Lesson } from '../lessons/lesson.entity';

describe('ReservationsService', () => {
  let service: ReservationsService;
  let reservationsRepository: any;
  let lessonsRepository: any;

  beforeEach(async () => {
    reservationsRepository = {
      findOne: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
    };

    lessonsRepository = {
      findOneBy: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationsService,
        { provide: getRepositoryToken(Reservation), useValue: reservationsRepository },
        { provide: getRepositoryToken(Lesson), useValue: lessonsRepository },
      ],
    }).compile();

    service = module.get<ReservationsService>(ReservationsService);
  });

  describe('createForUser', () => {
    it('throws ConflictException when active reservation already exists', async () => {
      reservationsRepository.findOne.mockResolvedValue({ id: 1, status: 'active' });
      await expect(service.createForUser(1, 1)).rejects.toThrow(ConflictException);
    });

    it('throws NotFoundException when lesson does not exist', async () => {
      reservationsRepository.findOne.mockResolvedValue(null);
      lessonsRepository.findOneBy.mockResolvedValue(null);
      await expect(service.createForUser(1, 999)).rejects.toThrow(NotFoundException);
    });

    it('throws BadRequestException when lesson is at full capacity', async () => {
      reservationsRepository.findOne.mockResolvedValue(null);
      lessonsRepository.findOneBy.mockResolvedValue({ id: 1, capacity: 5 });
      reservationsRepository.count.mockResolvedValue(5);
      await expect(service.createForUser(1, 1)).rejects.toThrow(BadRequestException);
    });

    it('creates reservation when all checks pass', async () => {
      const mockReservation = { id: 1, user: { id: 1 }, lesson: { id: 1 }, status: 'pending' };
      reservationsRepository.findOne.mockResolvedValue(null);
      lessonsRepository.findOneBy.mockResolvedValue({ id: 1, capacity: 10 });
      reservationsRepository.count.mockResolvedValue(3);
      reservationsRepository.create.mockReturnValue(mockReservation);
      reservationsRepository.save.mockResolvedValue(mockReservation);

      const result = await service.createForUser(1, 1);
      expect(result).toEqual(mockReservation);
    });
  });

  describe('cancelForUser', () => {
    it('throws NotFoundException when reservation does not exist', async () => {
      reservationsRepository.findOne.mockResolvedValue(null);
      await expect(service.cancelForUser(1, 999)).rejects.toThrow(NotFoundException);
    });

    it('throws ForbiddenException when reservation belongs to different user', async () => {
      reservationsRepository.findOne.mockResolvedValue({ id: 1, user: { id: 2 }, status: 'active' });
      await expect(service.cancelForUser(1, 1)).rejects.toThrow(ForbiddenException);
    });

    it('returns unchanged reservation when already cancelled', async () => {
      const cancelled = { id: 1, user: { id: 1 }, status: 'cancelled' };
      reservationsRepository.findOne.mockResolvedValue(cancelled);

      const result = await service.cancelForUser(1, 1);

      expect(result).toEqual(cancelled);
      expect(reservationsRepository.update).not.toHaveBeenCalled();
    });

    it('cancels active reservation successfully', async () => {
      const active = { id: 1, user: { id: 1 }, status: 'active' };
      const cancelled = { id: 1, user: { id: 1 }, status: 'cancelled' };
      reservationsRepository.findOne
        .mockResolvedValueOnce(active)
        .mockResolvedValueOnce(cancelled);
      reservationsRepository.update.mockResolvedValue({});

      const result = await service.cancelForUser(1, 1);

      expect(reservationsRepository.update).toHaveBeenCalledWith(1, { status: 'cancelled' });
      expect(result.status).toBe('cancelled');
    });
  });
});
