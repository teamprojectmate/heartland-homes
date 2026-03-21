import { Injectable, NotFoundException } from '@nestjs/common';
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

	async updateRole(userId: number, role: Role) {
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

	async remove(userId: number) {
		const user = await this.prisma.user.findUnique({
			where: { id: userId },
		});

		if (!user) {
			throw new NotFoundException('User not found');
		}

		await this.prisma.user.delete({ where: { id: userId } });
		return { message: 'User deleted' };
	}
}
