import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { AccommodationsService } from './accommodations.service';

const mockPrismaService = {
	accommodation: {
		findUnique: jest.fn(),
		findMany: jest.fn(),
		create: jest.fn(),
		update: jest.fn(),
		delete: jest.fn(),
		count: jest.fn(),
	},
};

const mockAccommodation = {
	id: 1,
	name: 'Mountain Cabin',
	nameUk: null,
	type: 'HOUSE' as const,
	status: 'PERMITTED' as const,
	city: 'Lviv',
	location: '123 Main St',
	locationUk: null,
	latitude: 49.84,
	longitude: 24.03,
	size: '80m2',
	bedrooms: 3,
	dailyRate: 150,
	amenities: ['wifi', 'parking'],
	image: null,
	userId: 10,
	createdAt: new Date(),
	updatedAt: new Date(),
	user: { id: 10, firstName: 'Jane', lastName: 'Smith' },
};

describe('AccommodationsService', () => {
	let service: AccommodationsService;

	beforeEach(async () => {
		jest.clearAllMocks();

		const module: TestingModule = await Test.createTestingModule({
			providers: [AccommodationsService, { provide: PrismaService, useValue: mockPrismaService }],
		}).compile();

		service = module.get<AccommodationsService>(AccommodationsService);
	});

	describe('findOne', () => {
		it('should return accommodation when found', async () => {
			mockPrismaService.accommodation.findUnique.mockResolvedValue(mockAccommodation);

			const result = await service.findOne(1);

			expect(result).toEqual(mockAccommodation);
			expect(mockPrismaService.accommodation.findUnique).toHaveBeenCalledWith(
				expect.objectContaining({ where: { id: 1 } }),
			);
		});

		it('should throw NotFoundException when accommodation is not found', async () => {
			mockPrismaService.accommodation.findUnique.mockResolvedValue(null);

			await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
			await expect(service.findOne(999)).rejects.toThrow('Accommodation not found');
		});
	});

	describe('update', () => {
		it('should throw ForbiddenException when user is not owner and not MANAGER', async () => {
			mockPrismaService.accommodation.findUnique.mockResolvedValue(mockAccommodation);

			await expect(service.update(1, { name: 'Updated' }, 999, 'CUSTOMER')).rejects.toThrow(
				ForbiddenException,
			);
			await expect(service.update(1, { name: 'Updated' }, 999, 'CUSTOMER')).rejects.toThrow(
				'You can only edit your own accommodations',
			);
		});

		it('should allow owner to update their accommodation', async () => {
			mockPrismaService.accommodation.findUnique.mockResolvedValue(mockAccommodation);
			const updated = { ...mockAccommodation, name: 'Updated Cabin' };
			mockPrismaService.accommodation.update.mockResolvedValue(updated);

			const result = await service.update(
				1,
				{ name: 'Updated Cabin' },
				mockAccommodation.userId,
				'CUSTOMER',
			);

			expect(result.name).toBe('Updated Cabin');
			expect(mockPrismaService.accommodation.update).toHaveBeenCalledWith({
				where: { id: 1 },
				data: { name: 'Updated Cabin' },
			});
		});

		it('should allow MANAGER to update any accommodation', async () => {
			mockPrismaService.accommodation.findUnique.mockResolvedValue(mockAccommodation);
			mockPrismaService.accommodation.update.mockResolvedValue(mockAccommodation);

			const result = await service.update(1, { name: 'Updated' }, 999, 'MANAGER');

			expect(result).toEqual(mockAccommodation);
		});
	});

	describe('updateStatus', () => {
		it('should update accommodation status successfully', async () => {
			mockPrismaService.accommodation.findUnique.mockResolvedValue(mockAccommodation);
			const updated = { ...mockAccommodation, status: 'REJECTED' as const };
			mockPrismaService.accommodation.update.mockResolvedValue(updated);

			const result = await service.updateStatus(1, 'REJECTED');

			expect(result.status).toBe('REJECTED');
			expect(mockPrismaService.accommodation.update).toHaveBeenCalledWith({
				where: { id: 1 },
				data: { status: 'REJECTED' },
			});
		});

		it('should throw NotFoundException when accommodation does not exist', async () => {
			mockPrismaService.accommodation.findUnique.mockResolvedValue(null);

			await expect(service.updateStatus(999, 'PERMITTED')).rejects.toThrow(NotFoundException);
		});
	});

	describe('remove', () => {
		it('should delete accommodation and return success message', async () => {
			mockPrismaService.accommodation.findUnique.mockResolvedValue(mockAccommodation);
			mockPrismaService.accommodation.delete.mockResolvedValue(mockAccommodation);

			const result = await service.remove(1);

			expect(result).toEqual({ message: 'Accommodation deleted' });
			expect(mockPrismaService.accommodation.delete).toHaveBeenCalledWith({
				where: { id: 1 },
			});
		});

		it('should throw NotFoundException when accommodation does not exist', async () => {
			mockPrismaService.accommodation.findUnique.mockResolvedValue(null);

			await expect(service.remove(999)).rejects.toThrow(NotFoundException);
		});
	});
});
