import { BookingStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsOptional, IsPositive } from 'class-validator';

export class UpdateBookingDto {
	@IsInt()
	@IsPositive()
	@IsOptional()
	accommodationId?: number;

	@Type(() => Date)
	@IsDate()
	@IsOptional()
	checkInDate?: Date;

	@Type(() => Date)
	@IsDate()
	@IsOptional()
	checkOutDate?: Date;

	@IsEnum(BookingStatus)
	@IsOptional()
	status?: BookingStatus;
}
