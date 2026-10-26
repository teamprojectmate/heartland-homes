import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import type { Role } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { JwtPayload } from '../../common/decorators/current-user.decorator';
import { REFRESH_TOKEN_TYPE } from '../auth.constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(configService: ConfigService) {
		const secret = configService.getOrThrow<string>('JWT_SECRET');
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: secret,
		});
	}

	validate(payload: { sub: number; email: string; role: Role; tokenType?: string }): JwtPayload {
		if (payload.tokenType === REFRESH_TOKEN_TYPE) {
			throw new UnauthorizedException('Refresh token cannot be used for API access');
		}
		return { sub: payload.sub, email: payload.email, role: payload.role };
	}
}
