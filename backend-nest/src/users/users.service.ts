import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import type { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { UpdateUserDto } from './dto/update-user.dto';

const USER_SELECT = {
	id: true,
	email: true,
	firstName: true,
	lastName: true,
	role: true,
	createdAt: true,
} as const;

@Injectable()
export class UsersService {
	constructor(private prisma: PrismaService) {}

	async findAll() {
		return this.prisma.user.findMany({
			select: USER_SELECT,
			orderBy: { createdAt: 'desc' },
		});
	}

	async findMe(userId: number) {
		const user = await this.prisma.user.findUnique({
			where: { id: userId },
			select: USER_SELECT,
		});

		if (!user) {
			throw new NotFoundException('User not found');
		}

		return user;
	}

	async updateMe(userId: number, dto: UpdateUserDto) {
		return this.prisma.user.update({
			where: { id: userId },
			data: dto,
			select: USER_SELECT,
		});
	}

	async updateRole(userId: number, role: Role, actorId: number) {
		if (userId === actorId) {
			throw new BadRequestException('You cannot change your own role');
		}

		const user = await this.prisma.user.findUnique({
			where: { id: userId },
		});

		if (!user) {
			throw new NotFoundException('User not found');
		}

		return this.prisma.user.update({
			where: { id: userId },
			data: { role },
			select: USER_SELECT,
		});
	}

	async remove(userId: number, actorId: number) {
		if (userId === actorId) {
			throw new BadRequestException('You cannot delete your own account here');
		}

		const user = await this.prisma.user.findUnique({
			where: { id: userId },
		});

		if (!user) {
			throw new NotFoundException('User not found');
		}

		// Deleting cascades to the user's own bookings and to every booking on accommodations they own,
		// with their payments — never wipe records of money already paid
		const paidBookings = await this.prisma.booking.count({
			where: {
				payment: { status: 'PAID' },
				OR: [{ userId }, { accommodation: { userId } }],
			},
		});

		if (paidBookings > 0) {
			throw new ConflictException('User has paid bookings and cannot be deleted');
		}

		await this.prisma.user.delete({ where: { id: userId } });
		return { message: 'User deleted' };
	}
}
