import {
	BadRequestException,
	ConflictException,
	ForbiddenException,
	NotFoundException,
} from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import type { Payment } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { BookingsService } from './bookings.service';

const mockPrismaService = {
	booking: {
		findUnique: jest.fn(),
		findFirst: jest.fn(),
		findMany: jest.fn(),
		create: jest.fn(),
		update: jest.fn(),
		delete: jest.fn(),
		count: jest.fn(),
	},
	accommodation: {
		findUnique: jest.fn(),
	},
};

const mockBooking = {
	id: 1,
	accommodationId: 10,
	userId: 100,
	checkInDate: new Date('2026-05-01'),
	checkOutDate: new Date('2026-05-05'),
	status: 'PENDING' as const,
	createdAt: new Date(),
	updatedAt: new Date(),
	accommodation: { id: 10, name: 'Test Place' },
	user: { id: 100, firstName: 'John', lastName: 'Doe', email: 'john@test.com' },
	payment: null,
};

const mockAccommodation = {
	id: 10,
	name: 'Test Place',
	type: 'HOUSE' as const,
	status: 'PERMITTED' as const,
	city: 'Kyiv',
	dailyRate: 100,
	amenities: [],
	userId: 200,
	createdAt: new Date(),
	updatedAt: new Date(),
};

describe('BookingsService', () => {
	let service: BookingsService;

	beforeEach(async () => {
		jest.clearAllMocks();

		const module: TestingModule = await Test.createTestingModule({
			providers: [BookingsService, { provide: PrismaService, useValue: mockPrismaService }],
		}).compile();

		service = module.get<BookingsService>(BookingsService);
	});

	describe('findOne', () => {
		it('should return a booking when found', async () => {
			mockPrismaService.booking.findUnique.mockResolvedValue(mockBooking);

			const result = await service.findOne(1);

			expect(result).toEqual(mockBooking);
			expect(mockPrismaService.booking.findUnique).toHaveBeenCalledWith(
				expect.objectContaining({ where: { id: 1 } }),
			);
		});

		it('should throw NotFoundException when booking is not found', async () => {
			mockPrismaService.booking.findUnique.mockResolvedValue(null);

			await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
		});
	});

	describe('create', () => {
		const futureCheckIn = new Date();
		futureCheckIn.setDate(futureCheckIn.getDate() + 10);

		const futureCheckOut = new Date();
		futureCheckOut.setDate(futureCheckOut.getDate() + 15);

		const createDto = {
			accommodationId: 10,
			checkInDate: futureCheckIn,
			checkOutDate: futureCheckOut,
		};

		it('should throw BadRequestException when check-out is before check-in', async () => {
			const invalidDto = {
				accommodationId: 10,
				checkInDate: futureCheckOut,
				checkOutDate: futureCheckIn,
			};

			await expect(service.create(invalidDto, 100)).rejects.toThrow(BadRequestException);
			await expect(service.create(invalidDto, 100)).rejects.toThrow(
				'Check-out date must be after check-in date',
			);
		});

		it('should throw BadRequestException when check-in is in the past', async () => {
			const pastDate = new Date('2020-01-01');
			const pastDto = {
				accommodationId: 10,
				checkInDate: pastDate,
				checkOutDate: futureCheckOut,
			};

			await expect(service.create(pastDto, 100)).rejects.toThrow(BadRequestException);
			await expect(service.create(pastDto, 100)).rejects.toThrow(
				'Check-in date cannot be in the past',
			);
		});

		it('should throw NotFoundException when accommodation does not exist', async () => {
			mockPrismaService.accommodation.findUnique.mockResolvedValue(null);

			await expect(service.create(createDto, 100)).rejects.toThrow(NotFoundException);
			await expect(service.create(createDto, 100)).rejects.toThrow('Accommodation not found');
		});

		it('should throw BadRequestException when accommodation is not PERMITTED', async () => {
			mockPrismaService.accommodation.findUnique.mockResolvedValue({
				...mockAccommodation,
				status: 'REQUIRES_VERIFICATION',
			});

			await expect(service.create(createDto, 100)).rejects.toThrow(BadRequestException);
			await expect(service.create(createDto, 100)).rejects.toThrow(
				'Accommodation is not available for booking',
			);
		});

		it('should throw ConflictException when dates overlap with existing booking', async () => {
			mockPrismaService.accommodation.findUnique.mockResolvedValue(mockAccommodation);
			mockPrismaService.booking.findFirst.mockResolvedValue(mockBooking);

			await expect(service.create(createDto, 100)).rejects.toThrow(ConflictException);
			await expect(service.create(createDto, 100)).rejects.toThrow(
				'Selected dates are not available',
			);
		});

		it('should create a booking when all validations pass', async () => {
			mockPrismaService.accommodation.findUnique.mockResolvedValue(mockAccommodation);
			mockPrismaService.booking.findFirst.mockResolvedValue(null);
			mockPrismaService.booking.create.mockResolvedValue(mockBooking);

			const result = await service.create(createDto, 100);

			expect(result).toEqual(mockBooking);
			expect(mockPrismaService.booking.create).toHaveBeenCalledWith(
				expect.objectContaining({
					data: expect.objectContaining({
						accommodationId: 10,
						userId: 100,
					}),
				}),
			);
		});
	});

	describe('update', () => {
		it('should throw ForbiddenException when user is not owner and not MANAGER', async () => {
			mockPrismaService.booking.findUnique.mockResolvedValue(mockBooking);

			await expect(service.update(1, {}, 999, 'CUSTOMER')).rejects.toThrow(ForbiddenException);
			await expect(service.update(1, {}, 999, 'CUSTOMER')).rejects.toThrow(
				'You can only edit your own bookings',
			);
		});

		it('should throw BadRequestException when booking has PAID payment', async () => {
			const bookingWithPaidPayment = {
				...mockBooking,
				payment: { status: 'PAID' } as Payment,
			};
			mockPrismaService.booking.findUnique.mockResolvedValue(bookingWithPaidPayment);

			await expect(service.update(1, {}, mockBooking.userId, 'CUSTOMER')).rejects.toThrow(
				BadRequestException,
			);
			await expect(service.update(1, {}, mockBooking.userId, 'CUSTOMER')).rejects.toThrow(
				'Cannot modify a paid booking',
			);
		});

		it('should allow MANAGER to edit any booking', async () => {
			mockPrismaService.booking.findUnique.mockResolvedValue(mockBooking);
			mockPrismaService.booking.update.mockResolvedValue(mockBooking);

			const result = await service.update(1, {}, 999, 'MANAGER');

			expect(result).toEqual(mockBooking);
		});

		it('should allow owner to update their booking', async () => {
			mockPrismaService.booking.findUnique.mockResolvedValue(mockBooking);
			mockPrismaService.booking.update.mockResolvedValue(mockBooking);

			const result = await service.update(1, {}, mockBooking.userId, 'CUSTOMER');

			expect(result).toEqual(mockBooking);
		});
	});

	describe('remove', () => {
		it('should throw ForbiddenException when user is not owner and not MANAGER', async () => {
			mockPrismaService.booking.findUnique.mockResolvedValue(mockBooking);

			await expect(service.remove(1, 999, 'CUSTOMER')).rejects.toThrow(ForbiddenException);
			await expect(service.remove(1, 999, 'CUSTOMER')).rejects.toThrow(
				'You can only cancel your own bookings',
			);
		});

		it('should delete booking when user is the owner', async () => {
			mockPrismaService.booking.findUnique.mockResolvedValue(mockBooking);
			mockPrismaService.booking.delete.mockResolvedValue(mockBooking);

			const result = await service.remove(1, mockBooking.userId, 'CUSTOMER');

			expect(result).toEqual({ message: 'Booking deleted' });
			expect(mockPrismaService.booking.delete).toHaveBeenCalledWith({
				where: { id: 1 },
			});
		});

		it('should allow MANAGER to delete any booking', async () => {
			mockPrismaService.booking.findUnique.mockResolvedValue(mockBooking);
			mockPrismaService.booking.delete.mockResolvedValue(mockBooking);

			const result = await service.remove(1, 999, 'MANAGER');

			expect(result).toEqual({ message: 'Booking deleted' });
		});
	});
});
