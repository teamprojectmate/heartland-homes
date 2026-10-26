import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateAccommodationDto } from '../accommodations/dto/create-accommodation.dto';
import { LoginDto } from '../auth/dto/login.dto';
import { RegisterDto } from '../auth/dto/register.dto';
import { SearchPaymentDto } from '../payments/dto/search-payment.dto';

/** Bad input must end as a 400 validation error, never as a TypeError (500) thrown in a @Transform. */
const errorFields = async (cls: new () => object, plain: object): Promise<string[]> => {
	const errors = await validate(plainToInstance(cls, plain));
	return errors.map((error) => error.property);
};

const validAccommodation = {
	name: 'Cozy flat',
	type: 'APARTMENT',
	city: 'Kyiv',
	dailyRate: 1200,
	amenities: ['wifi'],
};

describe('DTO input handling', () => {
	it('reports a missing email on login instead of crashing', async () => {
		await expect(errorFields(LoginDto, { password: 'secret' })).resolves.toContain('email');
	});

	it('reports a non-string email on registration instead of crashing', async () => {
		await expect(
			errorFields(RegisterDto, { email: 42, password: 'secret12', firstName: 'A', lastName: 'B' }),
		).resolves.toContain('email');
	});

	it('trims and lower-cases a valid email', () => {
		const dto = plainToInstance(LoginDto, { email: '  John@Test.COM ', password: 'x' });
		expect(dto.email).toBe('john@test.com');
	});

	it('accepts an accommodation without the optional location', async () => {
		await expect(errorFields(CreateAccommodationDto, validAccommodation)).resolves.toEqual([]);
	});

	it('reports a non-string accommodation name instead of crashing', async () => {
		await expect(
			errorFields(CreateAccommodationDto, { ...validAccommodation, name: 5 }),
		).resolves.toContain('name');
	});

	it('rejects a zero daily rate (a free stay would break the Stripe payment)', async () => {
		await expect(
			errorFields(CreateAccommodationDto, { ...validAccommodation, dailyRate: 0 }),
		).resolves.toContain('dailyRate');
	});

	it('rejects coordinates outside the valid range', async () => {
		await expect(
			errorFields(CreateAccommodationDto, { ...validAccommodation, latitude: 120, longitude: 50 }),
		).resolves.toContain('latitude');
	});

	it('rejects a password longer than bcrypt can hash', async () => {
		await expect(
			errorFields(RegisterDto, {
				email: 'a@test.com',
				password: 'x'.repeat(73),
				firstName: 'A',
				lastName: 'B',
			}),
		).resolves.toContain('password');
	});

	it('limits the password by bytes, not characters (40 Cyrillic letters = 80 bytes)', async () => {
		const register = (password: string) =>
			errorFields(RegisterDto, { email: 'a@test.com', password, firstName: 'A', lastName: 'B' });

		await expect(register('ж'.repeat(40))).resolves.toContain('password');
		await expect(register('ж'.repeat(36))).resolves.toEqual([]);
	});

	it('accepts the status filter used by the admin payments page', async () => {
		await expect(
			errorFields(SearchPaymentDto, { page: '0', size: '5', status: 'PAID' }),
		).resolves.toEqual([]);
	});
});
