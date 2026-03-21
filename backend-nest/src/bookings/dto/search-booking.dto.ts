import { BookingStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsPositive } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class SearchBookingDto extends PaginationDto {
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@IsPositive()
	userId?: number;

	@IsEnum(BookingStatus)
	@IsOptional()
	status?: BookingStatus;
}
