import { BadRequestException, ConflictException } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from './users.service';

const mockPrismaService = {
	user: {
		findUnique: jest.fn(),
		update: jest.fn(),
		delete: jest.fn(),
	},
	booking: {
		count: jest.fn(),
	},
};

const MANAGER_ID = 1;
const CUSTOMER = { id: 5, email: 'c@test.com', role: 'CUSTOMER' };

describe('UsersService', () => {
	let service: UsersService;

	beforeEach(async () => {
		jest.clearAllMocks();

		const module: TestingModule = await Test.createTestingModule({
			providers: [UsersService, { provide: PrismaService, useValue: mockPrismaService }],
		}).compile();

		service = module.get(UsersService);
	});

	describe('updateRole', () => {
		it('should not let a manager change their own role', async () => {
			await expect(service.updateRole(MANAGER_ID, 'CUSTOMER', MANAGER_ID)).rejects.toThrow(
				BadRequestException,
			);
			expect(mockPrismaService.user.update).not.toHaveBeenCalled();
		});

		it('should change the role of another user', async () => {
			mockPrismaService.user.findUnique.mockResolvedValue(CUSTOMER);
			mockPrismaService.user.update.mockResolvedValue({ ...CUSTOMER, role: 'MANAGER' });

			await service.updateRole(CUSTOMER.id, 'MANAGER', MANAGER_ID);

			expect(mockPrismaService.user.update).toHaveBeenCalledWith(
				expect.objectContaining({ where: { id: CUSTOMER.id }, data: { role: 'MANAGER' } }),
			);
		});
	});

	describe('remove', () => {
		it('should not let a manager delete themselves', async () => {
			await expect(service.remove(MANAGER_ID, MANAGER_ID)).rejects.toThrow(BadRequestException);
		});

		it('should refuse to delete a user with paid bookings', async () => {
			mockPrismaService.user.findUnique.mockResolvedValue(CUSTOMER);
			mockPrismaService.booking.count.mockResolvedValue(1);

			await expect(service.remove(CUSTOMER.id, MANAGER_ID)).rejects.toThrow(ConflictException);
			expect(mockPrismaService.user.delete).not.toHaveBeenCalled();
		});

		it('should also count paid bookings of other customers on accommodations the user owns', async () => {
			mockPrismaService.user.findUnique.mockResolvedValue(CUSTOMER);
			mockPrismaService.booking.count.mockResolvedValue(0);

			await service.remove(CUSTOMER.id, MANAGER_ID);

			expect(mockPrismaService.booking.count).toHaveBeenCalledWith({
				where: {
					payment: { status: 'PAID' },
					OR: [{ userId: CUSTOMER.id }, { accommodation: { userId: CUSTOMER.id } }],
				},
			});
		});

		it('should delete a user without paid bookings', async () => {
			mockPrismaService.user.findUnique.mockResolvedValue(CUSTOMER);
			mockPrismaService.booking.count.mockResolvedValue(0);

			await expect(service.remove(CUSTOMER.id, MANAGER_ID)).resolves.toEqual({
				message: 'User deleted',
			});
		});
	});
});
