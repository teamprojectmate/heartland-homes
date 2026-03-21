import { plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, validateSync } from 'class-validator';

export class EnvironmentVariables {
	@IsString()
	@IsNotEmpty()
	DATABASE_URL!: string;

	@IsString()
	@IsNotEmpty()
	JWT_SECRET!: string;

	@IsString()
	@IsOptional()
	JWT_EXPIRATION: string = '1h';

	@IsNumber()
	@IsOptional()
	PORT: number = 3000;

	@IsString()
	@IsOptional()
	FRONTEND_URL: string = 'http://localhost:5173';

	@IsString()
	@IsOptional()
	STRIPE_SECRET_KEY?: string;

	@IsString()
	@IsOptional()
	STRIPE_WEBHOOK_SECRET?: string;
}

export function validate(config: Record<string, unknown>) {
	const validated = plainToInstance(EnvironmentVariables, config, {
		enableImplicitConversion: true,
	});

	const errors = validateSync(validated, {
		skipMissingProperties: false,
	});

	if (errors.length > 0) {
		throw new Error(errors.toString());
	}

	return validated;
}
