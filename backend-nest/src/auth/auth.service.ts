import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { Role, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import type { LoginDto } from './dto/login.dto';
import type { RegisterDto } from './dto/register.dto';

const SALT_ROUNDS = 10;
const REFRESH_TOKEN_EXPIRATION = '7d';

export interface AuthResponse {
	token: string;
	refreshToken: string;
	user: {
		id: number;
		email: string;
		firstName: string;
		lastName: string;
		role: Role;
	};
}

@Injectable()
export class AuthService {
	private readonly jwtSecret: string;

	constructor(
		private prisma: PrismaService,
		private jwtService: JwtService,
		private configService: ConfigService,
	) {
		this.jwtSecret = this.configService.getOrThrow<string>('JWT_SECRET');
	}

	async register(dto: RegisterDto): Promise<AuthResponse> {
		const existing = await this.prisma.user.findUnique({
			where: { email: dto.email },
		});

		if (existing) {
			throw new ConflictException('Email already registered');
		}

		const hashedPassword = await bcrypt.hash(dto.password, SALT_ROUNDS);

		const user = await this.prisma.user.create({
			data: {
				email: dto.email,
				password: hashedPassword,
				firstName: dto.firstName,
				lastName: dto.lastName,
			},
		});

		return this.buildAuthResponse(user);
	}

	async login(dto: LoginDto): Promise<AuthResponse> {
		const user = await this.prisma.user.findUnique({
			where: { email: dto.email },
		});

		if (!user) {
			throw new UnauthorizedException('Invalid credentials');
		}

		const isPasswordValid = await bcrypt.compare(dto.password, user.password);

		if (!isPasswordValid) {
			throw new UnauthorizedException('Invalid credentials');
		}

		return this.buildAuthResponse(user);
	}

	async refresh(refreshToken: string): Promise<AuthResponse> {
		let payload: { sub: number; email: string; role: Role };

		try {
			payload = this.jwtService.verify(refreshToken, { secret: this.jwtSecret });
		} catch {
			throw new UnauthorizedException('Invalid or expired refresh token');
		}

		const user = await this.prisma.user.findUnique({
			where: { id: payload.sub },
		});

		if (!user || !user.refreshToken) {
			throw new UnauthorizedException('Invalid or expired refresh token');
		}

		const isValid = await bcrypt.compare(refreshToken, user.refreshToken);

		if (!isValid) {
			throw new UnauthorizedException('Invalid or expired refresh token');
		}

		return this.buildAuthResponse(user);
	}

	async logout(userId: number): Promise<void> {
		await this.prisma.user.update({
			where: { id: userId },
			data: { refreshToken: null },
		});
	}

	private async buildAuthResponse(user: User): Promise<AuthResponse> {
		const jwtPayload = { sub: user.id, email: user.email, role: user.role };

		const token = this.jwtService.sign(jwtPayload);
		const refreshToken = this.jwtService.sign(jwtPayload, {
			expiresIn: REFRESH_TOKEN_EXPIRATION,
		});

		const hashedRefreshToken = await bcrypt.hash(refreshToken, SALT_ROUNDS);
		await this.prisma.user.update({
			where: { id: user.id },
			data: { refreshToken: hashedRefreshToken },
		});

		return {
			token,
			refreshToken,
			user: {
				id: user.id,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
				role: user.role,
			},
		};
	}
}
