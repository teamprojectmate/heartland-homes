import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreatePaymentDto {
	@IsInt()
	@IsPositive()
	bookingId!: number;

	@IsString()
	@IsOptional()
	paymentType?: string;
}
