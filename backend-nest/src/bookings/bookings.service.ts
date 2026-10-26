import {
	BadRequestException,
	ConflictException,
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import type { Prisma, Role } from '@prisma/client';
import { PaginatedResponse } from '../common/dto/pagination.dto';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateBookingDto } from './dto/create-booking.dto';
import type { SearchBookingDto } from './dto/search-booking.dto';
import type { UpdateBookingDto } from './dto/update-booking.dto';

const BOOKING_INCLUDE = {
	accommodation: true,
	user: { select: { id: true, firstName: true, lastName: true, email: true } },
	payment: true,
} as const;

@Injectable()
export class BookingsService {
	constructor(private prisma: PrismaService) {}

	async findAll(dto: SearchBookingDto) {
		const where: Prisma.BookingWhereInput = {};

		if (dto.userId) {
			where.userId = dto.userId;
		}

		if (dto.status) {
			where.status = dto.status;
		}

		const [items, total] = await Promise.all([
			this.prisma.booking.findMany({
				where,
				skip: dto.skip,
				take: dto.size,
				orderBy: { createdAt: 'desc' },
				include: BOOKING_INCLUDE,
			}),
			this.prisma.booking.count({ where }),
		]);

		return new PaginatedResponse(items, total, dto.page, dto.size);
	}

	async findMyBookings(userId: number, dto: SearchBookingDto) {
		const where: Prisma.BookingWhereInput = { userId };

		if (dto.status) {
			where.status = dto.status;
		}

		const [items, total] = await Promise.all([
			this.prisma.booking.findMany({
				where,
				skip: dto.skip,
				take: dto.size,
				orderBy: { createdAt: 'desc' },
				include: BOOKING_INCLUDE,
			}),
			this.prisma.booking.count({ where }),
		]);

		return new PaginatedResponse(items, total, dto.page, dto.size);
	}

	async findOne(id: number) {
		const booking = await this.prisma.booking.findUnique({
			where: { id },
			include: BOOKING_INCLUDE,
		});

		if (!booking) {
			throw new NotFoundException('Booking not found');
		}

		return booking;
	}

	async findOneForUser(id: number, userId: number, userRole: Role) {
		const booking = await this.findOne(id);

		if (booking.userId !== userId && userRole !== 'MANAGER') {
			throw new ForbiddenException('You can only view your own bookings');
		}

		return booking;
	}

	async create(dto: CreateBookingDto, userId: number) {
		this.validateDates(dto.checkInDate, dto.checkOutDate);

		const accommodation = await this.prisma.accommodation.findUnique({
			where: { id: dto.accommodationId },
		});

		if (!accommodation) {
			throw new NotFoundException('Accommodation not found');
		}

		if (accommodation.status !== 'PERMITTED') {
			throw new BadRequestException('Accommodation is not available for booking');
		}

		return this.prisma.$transaction(async (tx) => {
			await this.lockAccommodation(tx, dto.accommodationId);
			await this.checkOverlap(tx, dto.accommodationId, dto.checkInDate, dto.checkOutDate);

			return tx.booking.create({
				data: {
					accommodationId: dto.accommodationId,
					userId,
					checkInDate: dto.checkInDate,
					checkOutDate: dto.checkOutDate,
				},
				include: BOOKING_INCLUDE,
			});
		});
	}

	async update(id: number, dto: UpdateBookingDto, userId: number, userRole: Role) {
		const booking = await this.findOne(id);
		const isManager = userRole === 'MANAGER';

		if (booking.userId !== userId && !isManager) {
			throw new ForbiddenException('You can only edit your own bookings');
		}

		if (dto.accommodationId !== undefined && dto.accommodationId !== booking.accommodationId) {
			throw new BadRequestException('Accommodation of a booking cannot be changed');
		}

		const statusChanged = dto.status !== undefined && dto.status !== booking.status;

		// A customer may only cancel their booking; every other status change is the manager's
		if (statusChanged && !isManager && dto.status !== 'CANCELED') {
			throw new ForbiddenException('Only a manager can change booking status');
		}

		if (statusChanged && !isManager && booking.payment?.status === 'PAID') {
			throw new BadRequestException('A paid booking cannot be canceled online');
		}

		// Resolve final dates: use new values or fall back to existing
		const checkIn = dto.checkInDate ?? booking.checkInDate;
		const checkOut = dto.checkOutDate ?? booking.checkOutDate;
		const datesChanged =
			checkIn.getTime() !== booking.checkInDate.getTime() ||
			checkOut.getTime() !== booking.checkOutDate.getTime();
		const reactivated = statusChanged && booking.status === 'CANCELED';

		const data: Prisma.BookingUncheckedUpdateInput = {};
		if (dto.status !== undefined) {
			data.status = dto.status;
		}

		if (!datesChanged && !reactivated) {
			return this.prisma.booking.update({ where: { id }, data, include: BOOKING_INCLUDE });
		}

		if (datesChanged) {
			if (booking.payment?.status === 'PAID') {
				throw new BadRequestException('Cannot modify a paid booking');
			}
			this.validateDates(checkIn, checkOut);
		}

		return this.prisma.$transaction(async (tx) => {
			await this.lockAccommodation(tx, booking.accommodationId);
			await this.checkOverlap(tx, booking.accommodationId, checkIn, checkOut, id);

			return tx.booking.update({
				where: { id },
				data: { ...data, checkInDate: checkIn, checkOutDate: checkOut },
				include: BOOKING_INCLUDE,
			});
		});
	}

	async remove(id: number, userId: number, userRole: Role) {
		const booking = await this.findOne(id);

		if (booking.userId !== userId && userRole !== 'MANAGER') {
			throw new ForbiddenException('You can only cancel your own bookings');
		}

		// Deleting cascades to the payment — never wipe the record of money already paid
		if (booking.payment?.status === 'PAID') {
			throw new ConflictException('A paid booking cannot be deleted');
		}

		await this.prisma.booking.delete({ where: { id } });
		return { message: 'Booking deleted' };
	}

	/**
	 * Row lock on the accommodation serialises concurrent bookings for the same place,
	 * so two requests cannot both pass the overlap check and insert overlapping dates.
	 */
	private async lockAccommodation(
		tx: Prisma.TransactionClient,
		accommodationId: number,
	): Promise<void> {
		await tx.$queryRaw`SELECT id FROM accommodations WHERE id = ${accommodationId} FOR UPDATE`;
	}

	private async checkOverlap(
		tx: Prisma.TransactionClient,
		accommodationId: number,
		checkIn: Date,
		checkOut: Date,
		excludeBookingId?: number,
	): Promise<void> {
		const where: Prisma.BookingWhereInput = {
			accommodationId,
			status: { not: 'CANCELED' },
			checkInDate: { lt: checkOut },
			checkOutDate: { gt: checkIn },
		};

		if (excludeBookingId) {
			where.id = { not: excludeBookingId };
		}

		const overlapping = await tx.booking.findFirst({ where });

		if (overlapping) {
			throw new ConflictException('Selected dates are not available');
		}
	}

	private validateDates(checkIn: Date, checkOut: Date): void {
		if (checkOut <= checkIn) {
			throw new BadRequestException('Check-out date must be after check-in date');
		}

		const now = new Date();
		now.setHours(0, 0, 0, 0);

		if (checkIn < now) {
			throw new BadRequestException('Check-in date cannot be in the past');
		}
	}
}
