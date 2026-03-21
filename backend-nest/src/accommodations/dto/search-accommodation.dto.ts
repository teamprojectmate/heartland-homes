import { AccommodationStatus, AccommodationType } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class SearchAccommodationDto extends PaginationDto {
	@Transform(({ value }: { value: string }) => value?.trim())
	@IsString()
	@IsOptional()
	city?: string;

	@IsEnum(AccommodationType)
	@IsOptional()
	type?: AccommodationType;

	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	@Min(0)
	minDailyRate?: number;

	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	@Min(0)
	maxDailyRate?: number;

	@IsEnum(AccommodationStatus)
	@IsOptional()
	status?: AccommodationStatus;
}
