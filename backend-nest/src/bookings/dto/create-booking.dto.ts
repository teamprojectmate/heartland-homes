import { Type } from 'class-transformer';
import { IsDate, IsInt, IsPositive } from 'class-validator';

export class CreateBookingDto {
	@IsInt()
	@IsPositive()
	accommodationId!: number;

	@Type(() => Date)
	@IsDate()
	checkInDate!: Date;

	@Type(() => Date)
	@IsDate()
	checkOutDate!: Date;
}
