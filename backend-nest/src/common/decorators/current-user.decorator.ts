import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { Role } from '@prisma/client';

export interface JwtPayload {
	sub: number;
	email: string;
	role: Role;
}

export const CurrentUser = createParamDecorator(
	(
		data: keyof JwtPayload | undefined,
		ctx: ExecutionContext,
	): JwtPayload | JwtPayload[keyof JwtPayload] => {
		const request = ctx.switchToHttp().getRequest<{ user: JwtPayload }>();
		const user = request.user;
		return data ? user[data] : user;
	},
);
