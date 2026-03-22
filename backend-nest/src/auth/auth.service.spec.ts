import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, type TestingModule } from '@nestjs/testing';
import type { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
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
	},
};

const mockJwtService = {
	sign: jest.fn().mockReturnValue('mock-jwt-token'),
};

const mockUser: User = {
	id: 1,
	email: 'john@test.com',
	password: 'hashed-password',
	firstName: 'John',
	lastName: 'Doe',
	role: 'CUSTOMER',
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

		it('should create user, hash password, and return token', async () => {
			mockPrismaService.user.findUnique.mockResolvedValue(null);
			mockedBcrypt.hash.mockResolvedValue('hashed-password' as never);
			mockPrismaService.user.create.mockResolvedValue(mockUser);

			const result = await service.register(registerDto);

			expect(result).toEqual({
				token: 'mock-jwt-token',
				user: {
					id: mockUser.id,
					email: mockUser.email,
					firstName: mockUser.firstName,
					lastName: mockUser.lastName,
					role: mockUser.role,
				},
			});
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

		it('should return token and user when credentials are correct', async () => {
			mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
			mockedBcrypt.compare.mockResolvedValue(true as never);

			const result = await service.login(loginDto);

			expect(result).toEqual({
				token: 'mock-jwt-token',
				user: {
					id: mockUser.id,
					email: mockUser.email,
					firstName: mockUser.firstName,
					lastName: mockUser.lastName,
					role: mockUser.role,
				},
			});
			expect(mockedBcrypt.compare).toHaveBeenCalledWith('password123', mockUser.password);
		});
	});
});
