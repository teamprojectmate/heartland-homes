import { AccommodationType } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
	ArrayNotEmpty,
	IsArray,
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	Min,
} from 'class-validator';

export class CreateAccommodationDto {
	@Transform(({ value }: { value: string }) => value.trim())
	@IsString()
	@IsNotEmpty()
	name!: string;

	@IsEnum(AccommodationType)
	type!: AccommodationType;

	@Transform(({ value }: { value: string }) => value.trim())
	@IsString()
	@IsNotEmpty()
	city!: string;

	@Transform(({ value }: { value: string }) => value.trim())
	@IsString()
	@IsOptional()
	location?: string;

	@Transform(({ value }: { value: string }) => (value ? parseFloat(value) : undefined))
	@IsNumber()
	@IsOptional()
	latitude?: number;

	@Transform(({ value }: { value: string }) => (value ? parseFloat(value) : undefined))
	@IsNumber()
	@IsOptional()
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
	@Min(0)
	dailyRate!: number;

	@IsArray()
	@ArrayNotEmpty()
	@IsString({ each: true })
	amenities!: string[];

	@IsString()
	@IsOptional()
	image?: string;
}
