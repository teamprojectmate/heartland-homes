import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, type TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { SearchPaymentDto } from './dto/search-payment.dto';
import { PaymentsService } from './payments.service';

const mockConstructEvent = jest.fn();

jest.mock('stripe', () =>
	jest.fn().mockImplementation(() => ({
		webhooks: { constructEvent: mockConstructEvent },
		checkout: { sessions: { create: jest.fn() } },
	})),
);

const mockPrismaService = {
	payment: {
		findUnique: jest.fn(),
		findMany: jest.fn(),
		count: jest.fn(),
		update: jest.fn(),
		create: jest.fn(),
		delete: jest.fn(),
	},
	booking: {
		findUnique: jest.fn(),
		update: jest.fn(),
	},
	$transaction: jest.fn(),
};

const configValues: Record<string, string> = {
	STRIPE_SECRET_KEY: 'sk_test_123',
	STRIPE_WEBHOOK_SECRET: 'whsec_test',
};

const mockConfigService = {
	get: jest.fn((key: string) => configValues[key]),
};

describe('PaymentsService', () => {
	let service: PaymentsService;

	beforeEach(async () => {
		jest.clearAllMocks();

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				PaymentsService,
				{ provide: PrismaService, useValue: mockPrismaService },
				{ provide: ConfigService, useValue: mockConfigService },
			],
		}).compile();

		service = module.get(PaymentsService);
	});

	describe('findAll', () => {
		it('should filter payments by status', async () => {
			mockPrismaService.payment.findMany.mockResolvedValue([]);
			mockPrismaService.payment.count.mockResolvedValue(0);
			const dto = Object.assign(new SearchPaymentDto(), { status: 'PAID' as const });

			await service.findAll(dto);

			expect(mockPrismaService.payment.findMany).toHaveBeenCalledWith(
				expect.objectContaining({ where: { status: 'PAID' } }),
			);
		});
	});

	describe('cancel', () => {
		const pendingPayment = { id: 5, status: 'PENDING', booking: { userId: 100 } };

		it('should forbid canceling another user payment', async () => {
			mockPrismaService.payment.findUnique.mockResolvedValue(pendingPayment);

			await expect(service.cancel(5, 999, 'CUSTOMER')).rejects.toThrow(ForbiddenException);
			expect(mockPrismaService.payment.update).not.toHaveBeenCalled();
		});

		it('should let the owner cancel a pending payment', async () => {
			mockPrismaService.payment.findUnique.mockResolvedValue(pendingPayment);
			mockPrismaService.payment.update.mockResolvedValue({ ...pendingPayment, status: 'CANCELED' });

			await service.cancel(5, 100, 'CUSTOMER');

			expect(mockPrismaService.payment.update).toHaveBeenCalledWith({
				where: { id: 5 },
				data: { status: 'CANCELED' },
			});
		});

		it('should let a MANAGER cancel any pending payment', async () => {
			mockPrismaService.payment.findUnique.mockResolvedValue(pendingPayment);
			mockPrismaService.payment.update.mockResolvedValue({ ...pendingPayment, status: 'CANCELED' });

			await expect(service.cancel(5, 1, 'MANAGER')).resolves.toBeDefined();
		});

		it('should not cancel a paid payment', async () => {
			mockPrismaService.payment.findUnique.mockResolvedValue({ ...pendingPayment, status: 'PAID' });

			await expect(service.cancel(5, 100, 'CUSTOMER')).rejects.toThrow(
				'Cannot cancel a paid payment',
			);
		});
	});

	describe('create', () => {
		it('should not create a payment for a canceled booking', async () => {
			mockPrismaService.booking.findUnique.mockResolvedValue({
				id: 1,
				userId: 100,
				status: 'CANCELED',
				payment: null,
			});

			await expect(service.create({ bookingId: 1 }, 100)).rejects.toThrow(
				'Cannot pay for a canceled booking',
			);
			expect(mockPrismaService.payment.create).not.toHaveBeenCalled();
		});
	});

	describe('handleStripeWebhook', () => {
		const payload = Buffer.from('{}');

		it('should throw BadRequestException on an invalid signature', async () => {
			mockConstructEvent.mockImplementation(() => {
				throw new Error('No signatures found');
			});

			await expect(service.handleStripeWebhook(payload, 'bad')).rejects.toThrow(
				BadRequestException,
			);
		});

		it('should ignore a completed session that is not paid yet', async () => {
			mockConstructEvent.mockReturnValue({
				type: 'checkout.session.completed',
				data: { object: { id: 'cs_1', payment_status: 'unpaid', metadata: { paymentId: '5' } } },
			});

			await service.handleStripeWebhook(payload, 'sig');

			expect(mockPrismaService.payment.findUnique).not.toHaveBeenCalled();
			expect(mockPrismaService.$transaction).not.toHaveBeenCalled();
		});

		it('should mark payment PAID and booking CONFIRMED for a paid session', async () => {
			mockConstructEvent.mockReturnValue({
				type: 'checkout.session.completed',
				data: { object: { id: 'cs_1', payment_status: 'paid', metadata: { paymentId: '5' } } },
			});
			mockPrismaService.payment.findUnique.mockResolvedValue({
				id: 5,
				bookingId: 1,
				status: 'PENDING',
			});

			await service.handleStripeWebhook(payload, 'sig');

			expect(mockPrismaService.$transaction).toHaveBeenCalledTimes(1);
			expect(mockPrismaService.payment.update).toHaveBeenCalledWith({
				where: { id: 5 },
				data: { status: 'PAID' },
			});
			expect(mockPrismaService.booking.update).toHaveBeenCalledWith({
				where: { id: 1 },
				data: { status: 'CONFIRMED' },
			});
		});
	});
});
