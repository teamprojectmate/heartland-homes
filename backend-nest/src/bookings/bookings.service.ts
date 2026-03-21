import {
	BadRequestException,
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

		const overlapping = await this.prisma.booking.findFirst({
			where: {
				accommodationId: dto.accommodationId,
				status: { not: 'CANCELED' },
				checkInDate: { lt: dto.checkOutDate },
				checkOutDate: { gt: dto.checkInDate },
			},
		});

		if (overlapping) {
			throw new BadRequestException('These dates are already booked');
		}

		return this.prisma.booking.create({
			data: {
				accommodationId: dto.accommodationId,
				userId,
				checkInDate: dto.checkInDate,
				checkOutDate: dto.checkOutDate,
			},
			include: BOOKING_INCLUDE,
		});
	}

	async update(id: number, dto: UpdateBookingDto, userId: number, userRole: Role) {
		const booking = await this.findOne(id);

		if (booking.userId !== userId && userRole !== 'MANAGER') {
			throw new ForbiddenException('You can only edit your own bookings');
		}

		if (booking.payment?.status === 'PAID') {
			throw new BadRequestException('Cannot modify a paid booking');
		}

		if (dto.checkInDate && dto.checkOutDate) {
			this.validateDates(dto.checkInDate, dto.checkOutDate);
		}

		return this.prisma.booking.update({
			where: { id },
			data: dto,
			include: BOOKING_INCLUDE,
		});
	}

	async remove(id: number, userId: number, userRole: Role) {
		const booking = await this.findOne(id);

		if (booking.userId !== userId && userRole !== 'MANAGER') {
			throw new ForbiddenException('You can only cancel your own bookings');
		}

		await this.prisma.booking.delete({ where: { id } });
		return { message: 'Booking deleted' };
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
