import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LessonsService } from './lessons.service';
import { Lesson } from './lesson.entity';

describe('LessonsService', () => {
  let service: LessonsService;
  let lessonsRepository: any;

  const mockQueryBuilder = {
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  };

  beforeEach(async () => {
    lessonsRepository = {
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
      findOneBy: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LessonsService,
        { provide: getRepositoryToken(Lesson), useValue: lessonsRepository },
      ],
    }).compile();

    service = module.get<LessonsService>(LessonsService);

    jest.clearAllMocks();
    lessonsRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
  });

  describe('findAll', () => {
    it('returns all lessons when no filters provided', async () => {
      const lessons = [{ id: 1 }, { id: 2 }];
      mockQueryBuilder.getMany.mockResolvedValue(lessons);

      const result = await service.findAll();

      expect(mockQueryBuilder.andWhere).not.toHaveBeenCalled();
      expect(result).toEqual(lessons);
    });

    it('applies from filter when provided', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([]);

      await service.findAll('2026-09-01');

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('lesson.startDate >= :from', { from: '2026-09-01' });
    });

    it('applies both from and to filters when provided', async () => {
      mockQueryBuilder.getMany.mockResolvedValue([]);

      await service.findAll('2026-09-01', '2026-09-30');

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('lesson.startDate >= :from', { from: '2026-09-01' });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('lesson.startDate <= :to', { to: '2026-09-30' });
    });
  });

  describe('create', () => {
    it('creates and saves a lesson', async () => {
      const lessonData = { title: 'Salsa', capacity: 10 };
      const saved = { id: 1, ...lessonData };
      lessonsRepository.create.mockReturnValue(lessonData);
      lessonsRepository.save.mockResolvedValue(saved);

      const result = await service.create(lessonData);

      expect(lessonsRepository.create).toHaveBeenCalledWith(lessonData);
      expect(result).toEqual(saved);
    });
  });

  describe('remove', () => {
    it('deletes lesson by id', async () => {
      lessonsRepository.delete.mockResolvedValue({});

      await service.remove(1);

      expect(lessonsRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});
