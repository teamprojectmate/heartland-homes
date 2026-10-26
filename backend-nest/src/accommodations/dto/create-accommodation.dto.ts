import { AccommodationType } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
	ArrayNotEmpty,
	IsArray,
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsPositive,
	IsString,
	Max,
	Min,
} from 'class-validator';
import { trimString } from '../../common/transforms';

const MAX_LATITUDE = 90;
const MAX_LONGITUDE = 180;

export class CreateAccommodationDto {
	@Transform(trimString)
	@IsString()
	@IsNotEmpty()
	name!: string;

	@Transform(trimString)
	@IsString()
	@IsOptional()
	nameUk?: string;

	@IsEnum(AccommodationType)
	type!: AccommodationType;

	@Transform(trimString)
	@IsString()
	@IsNotEmpty()
	city!: string;

	@Transform(trimString)
	@IsString()
	@IsOptional()
	location?: string;

	@Transform(trimString)
	@IsString()
	@IsOptional()
	locationUk?: string;

	@Transform(({ value }: { value: string }) => (value ? parseFloat(value) : undefined))
	@IsNumber()
	@IsOptional()
	@Min(-MAX_LATITUDE)
	@Max(MAX_LATITUDE)
	latitude?: number;

	@Transform(({ value }: { value: string }) => (value ? parseFloat(value) : undefined))
	@IsNumber()
	@IsOptional()
	@Min(-MAX_LONGITUDE)
	@Max(MAX_LONGITUDE)
	longitude?: number;

	@IsString()
	@IsOptional()
	size?: string;

	@Transform(({ value }: { value: string }) => (value ? parseInt(value, 10) : undefined))
	@IsNumber()
	@IsOptional()
	@Min(1)
	bedrooms?: number;

	@IsNumber()
	@IsPositive()
	dailyRate!: number;

	@IsArray()
	@ArrayNotEmpty()
	@IsString({ each: true })
	amenities!: string[];

	@IsString()
	@IsOptional()
	image?: string;
}
