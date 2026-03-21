import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AccommodationsModule } from './accommodations/accommodations.module';
import { AuthModule } from './auth/auth.module';
import { BookingsModule } from './bookings/bookings.module';
import { validate } from './config/env.validation';
import { PaymentsModule } from './payments/payments.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';

const THROTTLE_TTL_MS = 60_000;
const THROTTLE_LIMIT = 60;

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			validate,
		}),
		ThrottlerModule.forRoot({
			throttlers: [{ ttl: THROTTLE_TTL_MS, limit: THROTTLE_LIMIT }],
		}),
		PrismaModule,
		AuthModule,
		UsersModule,
		AccommodationsModule,
		BookingsModule,
		PaymentsModule,
	],
})
export class AppModule {}
