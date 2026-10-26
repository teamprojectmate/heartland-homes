import { createHash } from 'node:crypto';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, type TestingModule } from '@nestjs/testing';
import type { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { REFRESH_TOKEN_TYPE } from './auth.constants';
import { AuthService } from './auth.service';

jest.mock('bcrypt', () => ({
	hash: jest.fn(),
	compare: jest.fn(),
}));

const mockedBcrypt = jest.mocked(bcrypt);

const mockPrismaService = {
	user: {
		findUnique: jest.fn(),
		create: jest.fn(),
		update: jest.fn(),
	},
};

const mockJwtService = {
	sign: jest.fn().mockReturnValue('mock-jwt-token'),
	verify: jest.fn(),
};

const mockConfigService = {
	getOrThrow: jest.fn().mockReturnValue('test-jwt-secret'),
};

const mockUser: User = {
	id: 1,
	email: 'john@test.com',
	password: 'hashed-password',
	firstName: 'John',
	lastName: 'Doe',
	role: 'CUSTOMER',
	refreshToken: null,
	createdAt: new Date(),
	updatedAt: new Date(),
};

describe('AuthService', () => {
	let service: AuthService;

	beforeEach(async () => {
		jest.clearAllMocks();

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthService,
				{ provide: PrismaService, useValue: mockPrismaService },
				{ provide: JwtService, useValue: mockJwtService },
				{ provide: ConfigService, useValue: mockConfigService },
			],
		}).compile();

		service = module.get<AuthService>(AuthService);
	});

	describe('register', () => {
		const registerDto = {
			email: 'john@test.com',
			password: 'password123',
			firstName: 'John',
			lastName: 'Doe',
		};

		it('should throw ConflictException when email already exists', async () => {
			mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

			await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
			await expect(service.register(registerDto)).rejects.toThrow('Email already registered');
		});

		it('should create user, hash password, and return tokens', async () => {
			mockPrismaService.user.findUnique.mockResolvedValue(null);
			mockedBcrypt.hash.mockResolvedValue('hashed-password' as never);
			mockPrismaService.user.create.mockResolvedValue(mockUser);
			mockPrismaService.user.update.mockResolvedValue(mockUser);

			const result = await service.register(registerDto);

			expect(result.token).toBe('mock-jwt-token');
			expect(result.refreshToken).toBe('mock-jwt-token');
			expect(result.user.id).toBe(mockUser.id);
			expect(result.user.email).toBe(mockUser.email);
			expect(mockedBcrypt.hash).toHaveBeenCalledWith('password123', 10);
			expect(mockPrismaService.user.create).toHaveBeenCalledWith({
				data: {
					email: registerDto.email,
					password: 'hashed-password',
					firstName: registerDto.firstName,
					lastName: registerDto.lastName,
				},
			});
			expect(mockJwtService.sign).toHaveBeenCalledWith({
				sub: mockUser.id,
				email: mockUser.email,
				role: mockUser.role,
			});
		});
	});

	describe('login', () => {
		const loginDto = {
			email: 'john@test.com',
			password: 'password123',
		};

		it('should throw UnauthorizedException when user is not found', async () => {
			mockPrismaService.user.findUnique.mockResolvedValue(null);

			await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
			await expect(service.login(loginDto)).rejects.toThrow('Invalid credentials');
		});

		it('should throw UnauthorizedException when password is wrong', async () => {
			mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
			mockedBcrypt.compare.mockResolvedValue(false as never);

			await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
			await expect(service.login(loginDto)).rejects.toThrow('Invalid credentials');
		});

		it('should return tokens and user when credentials are correct', async () => {
			mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
			mockedBcrypt.compare.mockResolvedValue(true as never);
			mockedBcrypt.hash.mockResolvedValue('hashed-refresh' as never);
			mockPrismaService.user.update.mockResolvedValue(mockUser);

			const result = await service.login(loginDto);

			expect(result.token).toBe('mock-jwt-token');
			expect(result.refreshToken).toBe('mock-jwt-token');
			expect(result.user.id).toBe(mockUser.id);
			expect(mockedBcrypt.compare).toHaveBeenCalledWith('password123', mockUser.password);
		});
	});

	describe('refresh token', () => {
		const sha256 = (value: string): string => createHash('sha256').update(value).digest('hex');

		it('should sign a separate refresh token with tokenType and jti, and store its SHA-256 hash', async () => {
			mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
			mockedBcrypt.compare.mockResolvedValue(true as never);
			mockJwtService.sign.mockReturnValueOnce('access-token').mockReturnValueOnce('refresh-token');

			const result = await service.login({ email: mockUser.email, password: 'password123' });

			expect(result.refreshToken).toBe('refresh-token');
			expect(mockJwtService.sign).toHaveBeenNthCalledWith(
				2,
				expect.objectContaining({
					sub: mockUser.id,
					tokenType: REFRESH_TOKEN_TYPE,
					jti: expect.any(String),
				}),
				expect.objectContaining({ expiresIn: '7d' }),
			);
			expect(mockPrismaService.user.update).toHaveBeenCalledWith({
				where: { id: mockUser.id },
				data: { refreshToken: sha256('refresh-token') },
			});
		});

		it('should reject an access token sent to /auth/refresh', async () => {
			mockJwtService.verify.mockReturnValue({ sub: 1, email: mockUser.email, role: 'CUSTOMER' });

			await expect(service.refresh('access-token')).rejects.toThrow(UnauthorizedException);
			expect(mockPrismaService.user.findUnique).not.toHaveBeenCalled();
		});

		it('should reject a rotated (old) refresh token', async () => {
			mockJwtService.verify.mockReturnValue({ sub: 1, tokenType: REFRESH_TOKEN_TYPE, jti: 'old' });
			mockPrismaService.user.findUnique.mockResolvedValue({
				...mockUser,
				refreshToken: sha256('new-refresh-token'),
			});

			await expect(service.refresh('old-refresh-token')).rejects.toThrow(UnauthorizedException);
		});

		it('should issue new tokens for the current refresh token', async () => {
			mockJwtService.verify.mockReturnValue({ sub: 1, tokenType: REFRESH_TOKEN_TYPE, jti: 'cur' });
			mockPrismaService.user.findUnique.mockResolvedValue({
				...mockUser,
				refreshToken: sha256('current-refresh-token'),
			});

			const result = await service.refresh('current-refresh-token');

			expect(result.user.id).toBe(mockUser.id);
			expect(mockPrismaService.user.update).toHaveBeenCalledTimes(1);
		});

		it('should reject refresh after logout (no stored hash)', async () => {
			mockJwtService.verify.mockReturnValue({ sub: 1, tokenType: REFRESH_TOKEN_TYPE, jti: 'x' });
			mockPrismaService.user.findUnique.mockResolvedValue({ ...mockUser, refreshToken: null });

			await expect(service.refresh('any-token')).rejects.toThrow(UnauthorizedException);
		});
	});
});
