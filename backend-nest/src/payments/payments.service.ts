import {
	BadGatewayException,
	BadRequestException,
	Injectable,
	Logger,
	NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Prisma } from '@prisma/client';
import Stripe from 'stripe';
import { PaginatedResponse } from '../common/dto/pagination.dto';
import { PrismaService } from '../prisma/prisma.service';
import type { CreatePaymentDto } from './dto/create-payment.dto';
import type { SearchPaymentDto } from './dto/search-payment.dto';

const MS_PER_DAY = 1000 * 60 * 60 * 24;
const STRIPE_AMOUNT_MULTIPLIER = 100;
const NUMERIC_PATTERN = /^\d+$/;

const PAYMENT_INCLUDE = {
	booking: { include: { accommodation: true } },
} as const;

@Injectable()
export class PaymentsService {
	private readonly logger = new Logger(PaymentsService.name);
	private stripe: Stripe | null = null;

	constructor(
		private prisma: PrismaService,
		private configService: ConfigService,
	) {
		const stripeKey = this.configService.get<string>('STRIPE_SECRET_KEY');
		if (stripeKey?.startsWith('sk_')) {
			this.stripe = new Stripe(stripeKey);
		}
	}

	async findAll(dto: SearchPaymentDto) {
		const where: Prisma.PaymentWhereInput = {};

		if (dto.userId) {
			where.booking = { userId: dto.userId };
		}

		const [items, total] = await Promise.all([
			this.prisma.payment.findMany({
				where,
				skip: dto.skip,
				take: dto.size,
				orderBy: { id: 'desc' },
				include: PAYMENT_INCLUDE,
			}),
			this.prisma.payment.count({ where }),
		]);

		return new PaginatedResponse(items, total, dto.page, dto.size);
	}

	async findByUser(userId: number, dto: SearchPaymentDto) {
		const where: Prisma.PaymentWhereInput = {
			booking: { userId },
		};

		const [items, total] = await Promise.all([
			this.prisma.payment.findMany({
				where,
				skip: dto.skip,
				take: dto.size,
				orderBy: { id: 'desc' },
				include: PAYMENT_INCLUDE,
			}),
			this.prisma.payment.count({ where }),
		]);

		return new PaginatedResponse(items, total, dto.page, dto.size);
	}

	async create(dto: CreatePaymentDto, userId: number) {
		const booking = await this.prisma.booking.findUnique({
			where: { id: dto.bookingId },
			include: { accommodation: true, payment: true },
		});

		if (!booking) {
			throw new NotFoundException('Booking not found');
		}

		if (booking.userId !== userId) {
			throw new BadRequestException('You can only pay for your own bookings');
		}

		if (booking.payment) {
			throw new BadRequestException('Payment already exists for this booking');
		}

		const nights = Math.ceil(
			(booking.checkOutDate.getTime() - booking.checkInDate.getTime()) / MS_PER_DAY,
		);
		const amount = nights * booking.accommodation.dailyRate;

		const payment = await this.prisma.payment.create({
			data: {
				bookingId: booking.id,
				amount,
				currency: 'UAH',
				status: 'PENDING',
			},
		});

		this.logger.log(`Payment #${payment.id} created: ${amount} UAH for booking #${booking.id}`);

		let sessionUrl: string | null = null;

		if (this.stripe) {
			const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:5173');

			try {
				const session = await this.stripe.checkout.sessions.create({
					payment_method_types: ['card'],
					line_items: [
						{
							price_data: {
								currency: 'uah',
								product_data: {
									name: booking.accommodation.name,
									description: `${nights} night(s) in ${booking.accommodation.city}`,
								},
								unit_amount: Math.round(amount * STRIPE_AMOUNT_MULTIPLIER),
							},
							quantity: 1,
						},
					],
					mode: 'payment',
					success_url: `${frontendUrl}/payment-success?bookingId=${booking.id}`,
					cancel_url: `${frontendUrl}/payment-cancel?bookingId=${booking.id}`,
					metadata: {
						paymentId: String(payment.id),
						bookingId: String(booking.id),
					},
				});

				sessionUrl = session.url;

				await this.prisma.payment.update({
					where: { id: payment.id },
					data: { stripeSessionId: session.id },
				});
			} catch (err: unknown) {
				this.logger.error(
					'Stripe session creation failed',
					err instanceof Error ? err.message : String(err),
				);

				await this.prisma.payment.update({
					where: { id: payment.id },
					data: { status: 'FAILED' },
				});

				throw new BadGatewayException('Payment service temporarily unavailable');
			}
		}

		return {
			...payment,
			sessionUrl,
		};
	}

	async cancel(paymentId: number) {
		const payment = await this.prisma.payment.findUnique({
			where: { id: paymentId },
		});

		if (!payment) {
			throw new NotFoundException('Payment not found');
		}

		if (payment.status === 'PAID') {
			throw new BadRequestException('Cannot cancel a paid payment');
		}

		this.logger.log(`Payment #${paymentId} canceled`);

		return this.prisma.payment.update({
			where: { id: paymentId },
			data: { status: 'CANCELED' },
		});
	}

	async processPayment(bookingId: number) {
		const booking = await this.prisma.booking.findUnique({
			where: { id: bookingId },
			include: { payment: true },
		});

		if (!booking) {
			throw new NotFoundException('Booking not found');
		}

		if (!booking.payment) {
			throw new BadRequestException('No payment found for this booking');
		}

		if (booking.payment.status === 'PAID') {
			throw new BadRequestException('Payment already processed');
		}

		this.logger.log(
			`Payment #${booking.payment.id} processed: PAID, booking #${bookingId}: CONFIRMED`,
		);

		return this.prisma.$transaction([
			this.prisma.payment.update({
				where: { id: booking.payment.id },
				data: { status: 'PAID' },
			}),
			this.prisma.booking.update({
				where: { id: bookingId },
				data: { status: 'CONFIRMED' },
			}),
		]);
	}

	async handleStripeWebhook(payload: Buffer, signature: string) {
		const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');

		if (!this.stripe || !webhookSecret) {
			this.logger.warn('Stripe not configured, skipping webhook');
			return;
		}

		let event: Stripe.Event;
		try {
			event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
		} catch (err: unknown) {
			this.logger.error(
				'Invalid Stripe webhook signature',
				err instanceof Error ? err.message : String(err),
			);
			return;
		}

		if (event.type === 'checkout.session.completed') {
			const session = event.data.object;
			const rawPaymentId = session.metadata?.['paymentId'];

			if (!rawPaymentId || !NUMERIC_PATTERN.test(rawPaymentId)) {
				this.logger.warn(`Webhook: invalid paymentId in metadata: ${rawPaymentId}`);
				return;
			}

			const paymentId = Number(rawPaymentId);
			const payment = await this.prisma.payment.findUnique({
				where: { id: paymentId },
			});

			if (!payment) {
				this.logger.warn(`Webhook: payment #${paymentId} not found`);
				return;
			}

			if (payment.status === 'PAID') {
				this.logger.log(`Webhook: payment #${paymentId} already processed, skipping`);
				return;
			}

			await this.prisma.$transaction([
				this.prisma.payment.update({
					where: { id: payment.id },
					data: { status: 'PAID' },
				}),
				this.prisma.booking.update({
					where: { id: payment.bookingId },
					data: { status: 'CONFIRMED' },
				}),
			]);

			this.logger.log(
				`Webhook: payment #${paymentId} → PAID, booking #${payment.bookingId} → CONFIRMED`,
			);
		}
	}
}
