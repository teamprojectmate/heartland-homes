import { UnauthorizedException } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import { REFRESH_TOKEN_TYPE } from '../auth.constants';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
	const configService = {
		getOrThrow: jest.fn().mockReturnValue('test-jwt-secret'),
	} as unknown as ConfigService;
	const strategy = new JwtStrategy(configService);

	it('should return the user for an access token', () => {
		expect(strategy.validate({ sub: 1, email: 'a@test.com', role: 'CUSTOMER' })).toEqual({
			sub: 1,
			email: 'a@test.com',
			role: 'CUSTOMER',
		});
	});

	it('should reject a refresh token used as an access token', () => {
		expect(() =>
			strategy.validate({
				sub: 1,
				email: 'a@test.com',
				role: 'CUSTOMER',
				tokenType: REFRESH_TOKEN_TYPE,
			}),
		).toThrow(UnauthorizedException);
	});
});
