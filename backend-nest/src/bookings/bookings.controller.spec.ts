import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { JwtPayload } from '../common/decorators/current-user.decorator';
import { PaymentsService } from '../payments/payments.service';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import type { SearchBookingDto } from './dto/search-booking.dto';

const mockBooking = {
	id: 1,
	accommodationId: 10,
	userId: 100,
	checkInDate: new Date('2026-06-01'),
	checkOutDate: new Date('2026-06-05'),
	status: 'PENDING',
	accommodation: { id: 10, name: 'Test Hotel' },
	user: { id: 100, firstName: 'John', lastName: 'Doe', email: 'john@test.com' },
	payment: null,
};

const mockBookingsService = {
	findAll: jest.fn(),
	findMyBookings: jest.fn(),
	findOne: jest.fn(),
	create: jest.fn(),
	update: jest.fn(),
	remove: jest.fn(),
};

const mockPaymentsService = {
	processPayment: jest.fn(),
};

describe('BookingsController', () => {
	let controller: BookingsController;

	beforeEach(async () => {
		const module = await Test.createTestingModule({
			controllers: [BookingsController],
			providers: [
				{ provide: BookingsService, useValue: mockBookingsService },
				{ provide: PaymentsService, useValue: mockPaymentsService },
			],
		}).compile();

		controller = module.get(BookingsController);
		jest.clearAllMocks();
	});

	const customerUser: JwtPayload = { sub: 100, email: 'john@test.com', role: 'CUSTOMER' };
	const managerUser: JwtPayload = { sub: 1, email: 'admin@test.com', role: 'MANAGER' };

	describe('findOne', () => {
		it('should return a booking by id', async () => {
			mockBookingsService.findOne.mockResolvedValue(mockBooking);
			const result = await controller.findOne(1);
			expect(result).toEqual(mockBooking);
			expect(mockBookingsService.findOne).toHaveBeenCalledWith(1);
		});

		it('should propagate NotFoundException from service', async () => {
			mockBookingsService.findOne.mockRejectedValue(new NotFoundException('Booking not found'));
			await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
		});
	});

	describe('findMyBookings', () => {
		it('should call service with user id', async () => {
			const dto = { page: 0, size: 10 } as SearchBookingDto;
			mockBookingsService.findMyBookings.mockResolvedValue({
				content: [mockBooking],
				totalPages: 1,
			});
			await controller.findMyBookings(customerUser, dto);
			expect(mockBookingsService.findMyBookings).toHaveBeenCalledWith(100, dto);
		});
	});

	describe('findAll', () => {
		it('should call service for admin listing', async () => {
			const dto = { page: 0, size: 10 } as SearchBookingDto;
			mockBookingsService.findAll.mockResolvedValue({ content: [], totalPages: 0 });
			await controller.findAll(dto);
			expect(mockBookingsService.findAll).toHaveBeenCalledWith(dto);
		});
	});

	describe('create', () => {
		it('should pass dto and user id to service', async () => {
			const dto = {
				accommodationId: 10,
				checkInDate: new Date('2026-06-01'),
				checkOutDate: new Date('2026-06-05'),
			};
			mockBookingsService.create.mockResolvedValue(mockBooking);
			const result = await controller.create(dto, customerUser);
			expect(result).toEqual(mockBooking);
			expect(mockBookingsService.create).toHaveBeenCalledWith(dto, 100);
		});
	});

	describe('update', () => {
		it('should pass id, dto, userId and role to service', async () => {
			const dto = { checkInDate: new Date('2026-07-01') };
			mockBookingsService.update.mockResolvedValue({ ...mockBooking, ...dto });
			await controller.update(1, dto, customerUser);
			expect(mockBookingsService.update).toHaveBeenCalledWith(1, dto, 100, 'CUSTOMER');
		});
	});

	describe('remove', () => {
		it('should pass id, userId and role to service', async () => {
			mockBookingsService.remove.mockResolvedValue({ message: 'Booking deleted' });
			const result = await controller.remove(1, managerUser);
			expect(result).toEqual({ message: 'Booking deleted' });
			expect(mockBookingsService.remove).toHaveBeenCalledWith(1, 1, 'MANAGER');
		});
	});

	describe('processPayment', () => {
		it('should delegate to payments service', async () => {
			const mockResult = [
				{ id: 1, status: 'PAID' },
				{ id: 1, status: 'CONFIRMED' },
			];
			mockPaymentsService.processPayment.mockResolvedValue(mockResult);
			const result = await controller.processPayment(1);
			expect(result).toEqual(mockResult);
			expect(mockPaymentsService.processPayment).toHaveBeenCalledWith(1);
		});
	});
});
