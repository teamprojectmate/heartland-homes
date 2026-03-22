import type { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

/**
 * E2E tests for Heartland Homes API.
 *
 * These tests use a mocked PrismaService to test the full HTTP pipeline:
 * request → routing → guards → pipes → controller → service → response
 *
 * No real database is required.
 */

const mockAccommodation = {
	id: 1,
	name: 'Test Hotel',
	nameUk: 'Тестовий Готель',
	type: 'HOTEL',
	status: 'PERMITTED',
	city: 'Kyiv',
	location: 'Test St, 1',
	locationUk: 'вул. Тестова, 1',
	latitude: 50.45,
	longitude: 30.52,
	size: '40m²',
	bedrooms: 1,
	dailyRate: 200,
	amenities: ['WiFi'],
	image: null,
	userId: 1,
	createdAt: new Date(),
	updatedAt: new Date(),
	user: { id: 1, firstName: 'Admin', lastName: 'User' },
};

const mockUser = {
	id: 1,
	email: 'test@test.com',
	password: '$2b$10$hashedpassword',
	firstName: 'Test',
	lastName: 'User',
	role: 'CUSTOMER',
	createdAt: new Date(),
	updatedAt: new Date(),
};

const mockPrisma = {
	accommodation: {
		findUnique: jest.fn(),
		findMany: jest.fn().mockResolvedValue([mockAccommodation]),
		count: jest.fn().mockResolvedValue(1),
		create: jest.fn(),
		update: jest.fn(),
		delete: jest.fn(),
		findFirst: jest.fn(),
	},
	booking: {
		findUnique: jest.fn(),
		findMany: jest.fn().mockResolvedValue([]),
		count: jest.fn().mockResolvedValue(0),
		create: jest.fn(),
		update: jest.fn(),
		delete: jest.fn(),
		findFirst: jest.fn(),
	},
	user: {
		findUnique: jest.fn(),
		findMany: jest.fn().mockResolvedValue([]),
		create: jest.fn(),
		update: jest.fn(),
		delete: jest.fn(),
		count: jest.fn().mockResolvedValue(0),
	},
	payment: {
		findUnique: jest.fn(),
		findMany: jest.fn().mockResolvedValue([]),
		count: jest.fn().mockResolvedValue(0),
		create: jest.fn(),
		update: jest.fn(),
	},
	$connect: jest.fn(),
	$disconnect: jest.fn(),
};

describe('Heartland Homes API (e2e)', () => {
	let app: INestApplication<App>;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		})
			.overrideProvider(PrismaService)
			.useValue(mockPrisma)
			.compile();

		app = moduleFixture.createNestApplication();
		app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
		await app.init();
	});

	afterAll(async () => {
		await app.close();
	});

	beforeEach(() => {
		jest.clearAllMocks();
		mockPrisma.accommodation.findMany.mockResolvedValue([mockAccommodation]);
		mockPrisma.accommodation.count.mockResolvedValue(1);
	});

	// ── Public endpoints ──

	describe('GET /accommodations/search', () => {
		it('should return paginated accommodations', async () => {
			const response = await request(app.getHttpServer())
				.get('/accommodations/search')
				.expect(200);

			expect(response.body).toHaveProperty('content');
			expect(response.body).toHaveProperty('totalPages');
			expect(response.body).toHaveProperty('totalElements');
		});

		it('should filter by city', async () => {
			await request(app.getHttpServer())
				.get('/accommodations/search?city=Kyiv')
				.expect(200);

			expect(mockPrisma.accommodation.findMany).toHaveBeenCalledWith(
				expect.objectContaining({
					where: expect.objectContaining({
						city: expect.objectContaining({ contains: 'Kyiv' }),
					}),
				}),
			);
		});
	});

	describe('GET /accommodations/:id', () => {
		it('should return accommodation by id', async () => {
			mockPrisma.accommodation.findUnique.mockResolvedValue(mockAccommodation);
			const response = await request(app.getHttpServer())
				.get('/accommodations/1')
				.expect(200);

			expect(response.body.name).toBe('Test Hotel');
		});

		it('should return 404 for non-existent accommodation', async () => {
			mockPrisma.accommodation.findUnique.mockResolvedValue(null);
			await request(app.getHttpServer())
				.get('/accommodations/99999')
				.expect(404);
		});
	});

	// ── Auth endpoints ──

	describe('POST /auth/registration', () => {
		it('should return 400 for invalid body', async () => {
			await request(app.getHttpServer())
				.post('/auth/registration')
				.send({ email: 'invalid' })
				.expect(400);
		});

		it('should return 409 for duplicate email', async () => {
			mockPrisma.user.findUnique.mockResolvedValue(mockUser);
			await request(app.getHttpServer())
				.post('/auth/registration')
				.send({
					email: 'test@test.com',
					password: 'password123',
					firstName: 'Test',
					lastName: 'User',
				})
				.expect(409);
		});
	});

	describe('POST /auth/login', () => {
		it('should return 401 for wrong credentials', async () => {
			mockPrisma.user.findUnique.mockResolvedValue(null);
			await request(app.getHttpServer())
				.post('/auth/login')
				.send({ email: 'wrong@test.com', password: 'wrong' })
				.expect(401);
		});

		it('should return 400 or 401 for missing fields', async () => {
			const response = await request(app.getHttpServer())
				.post('/auth/login')
				.send({});

			expect([400, 401]).toContain(response.status);
		});
	});

	// ── Protected endpoints (no auth) ──

	describe('Protected endpoints without token', () => {
		it('GET /bookings should return 401', async () => {
			await request(app.getHttpServer())
				.get('/bookings')
				.expect(401);
		});

		it('POST /bookings should return 401', async () => {
			await request(app.getHttpServer())
				.post('/bookings')
				.send({ accommodationId: 1, checkInDate: '2026-06-01', checkOutDate: '2026-06-05' })
				.expect(401);
		});

		it('GET /bookings/my should return 401', async () => {
			await request(app.getHttpServer())
				.get('/bookings/my')
				.expect(401);
		});

		it('GET /users/me should return 401', async () => {
			await request(app.getHttpServer())
				.get('/users/me')
				.expect(401);
		});
	});

	// ── Validation ──

	describe('Input validation', () => {
		it('POST /auth/registration should reject short password', async () => {
			const response = await request(app.getHttpServer())
				.post('/auth/registration')
				.send({
					email: 'new@test.com',
					password: '12',
					firstName: 'A',
					lastName: 'B',
				})
				.expect(400);

			expect(response.body.message).toBeDefined();
		});

		it('GET /accommodations/invalid-id should return 400', async () => {
			await request(app.getHttpServer())
				.get('/accommodations/abc')
				.expect(400);
		});
	});
});
