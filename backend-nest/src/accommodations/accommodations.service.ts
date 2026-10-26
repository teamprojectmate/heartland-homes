import {
	ConflictException,
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import type { AccommodationStatus, Prisma, Role } from '@prisma/client';
import { PaginatedResponse } from '../common/dto/pagination.dto';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateAccommodationDto } from './dto/create-accommodation.dto';
import type { SearchAccommodationDto } from './dto/search-accommodation.dto';
import type { UpdateAccommodationDto } from './dto/update-accommodation.dto';

const ACCOMMODATION_INCLUDE = {
	user: { select: { id: true, firstName: true, lastName: true } },
} as const;

const ALLOWED_SORT_FIELDS = ['name', 'city', 'dailyRate', 'createdAt', 'type'] as const;
const DEFAULT_ORDER: Prisma.AccommodationOrderByWithRelationInput = { createdAt: 'desc' };

@Injectable()
export class AccommodationsService {
	constructor(private prisma: PrismaService) {}

	async search(dto: SearchAccommodationDto) {
		const where: Prisma.AccommodationWhereInput = {};

		if (dto.city) {
			where.city = { contains: dto.city, mode: 'insensitive' };
		}

		if (dto.type) {
			where.type = dto.type;
		}

		if (dto.status) {
			where.status = dto.status;
		}

		if (dto.minDailyRate !== undefined || dto.maxDailyRate !== undefined) {
			where.dailyRate = {};
			if (dto.minDailyRate !== undefined) {
				where.dailyRate.gte = dto.minDailyRate;
			}
			if (dto.maxDailyRate !== undefined) {
				where.dailyRate.lte = dto.maxDailyRate;
			}
		}

		const orderBy = this.parseSort(dto.sort);

		const [items, total] = await Promise.all([
			this.prisma.accommodation.findMany({
				where,
				skip: dto.skip,
				take: dto.size,
				orderBy,
				include: ACCOMMODATION_INCLUDE,
			}),
			this.prisma.accommodation.count({ where }),
		]);

		return new PaginatedResponse(items, total, dto.page, dto.size);
	}

	async findAll(dto: SearchAccommodationDto) {
		const [items, total] = await Promise.all([
			this.prisma.accommodation.findMany({
				skip: dto.skip,
				take: dto.size,
				orderBy: DEFAULT_ORDER,
				include: ACCOMMODATION_INCLUDE,
			}),
			this.prisma.accommodation.count(),
		]);

		return new PaginatedResponse(items, total, dto.page, dto.size);
	}

	async findMyAccommodations(userId: number) {
		return this.prisma.accommodation.findMany({
			where: { userId },
			orderBy: DEFAULT_ORDER,
		});
	}

	async findOne(id: number) {
		const accommodation = await this.prisma.accommodation.findUnique({
			where: { id },
			include: ACCOMMODATION_INCLUDE,
		});

		if (!accommodation) {
			throw new NotFoundException('Accommodation not found');
		}

		return accommodation;
	}

	async create(dto: CreateAccommodationDto, userId: number) {
		return this.prisma.accommodation.create({
			data: {
				...dto,
				userId,
			},
		});
	}

	async update(id: number, dto: UpdateAccommodationDto, userId: number, userRole: Role) {
		const accommodation = await this.findOne(id);

		const isManager = userRole === 'MANAGER';

		if (accommodation.userId !== userId && !isManager) {
			throw new ForbiddenException('You can only edit your own accommodations');
		}

		// An owner's edit goes back to moderation, so an approved listing cannot be changed unchecked
		const data: Prisma.AccommodationUpdateInput = isManager
			? dto
			: { ...dto, status: 'REQUIRES_VERIFICATION' };

		return this.prisma.accommodation.update({ where: { id }, data });
	}

	async updateStatus(id: number, status: AccommodationStatus) {
		await this.findOne(id);

		return this.prisma.accommodation.update({
			where: { id },
			data: { status },
		});
	}

	async getBookedDates(accommodationId: number) {
		await this.findOne(accommodationId);

		return this.prisma.booking.findMany({
			where: {
				accommodationId,
				status: { not: 'CANCELED' },
				checkOutDate: { gte: new Date() },
			},
			select: { checkInDate: true, checkOutDate: true },
			orderBy: { checkInDate: 'asc' },
		});
	}

	async remove(id: number, userId: number, userRole: Role) {
		const accommodation = await this.findOne(id);

		if (accommodation.userId !== userId && userRole !== 'MANAGER') {
			throw new ForbiddenException('You can only delete your own accommodations');
		}

		// Deleting cascades to bookings and payments — never wipe records of money already paid
		const paidBookings = await this.prisma.booking.count({
			where: { accommodationId: id, payment: { status: 'PAID' } },
		});

		if (paidBookings > 0) {
			throw new ConflictException('Accommodation has paid bookings and cannot be deleted');
		}

		await this.prisma.accommodation.delete({ where: { id } });
		return { message: 'Accommodation deleted' };
	}

	private parseSort(sort?: string): Prisma.AccommodationOrderByWithRelationInput {
		if (!sort) {
			return DEFAULT_ORDER;
		}

		const [field, direction] = sort.split(',');

		if (!field) {
			return DEFAULT_ORDER;
		}

		const order = direction?.toLowerCase() === 'asc' ? 'asc' : 'desc';

		if (ALLOWED_SORT_FIELDS.includes(field as (typeof ALLOWED_SORT_FIELDS)[number])) {
			return { [field]: order };
		}

		return DEFAULT_ORDER;
	}
}
