import { AccommodationStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateStatusDto {
	@IsEnum(AccommodationStatus)
	status!: AccommodationStatus;
}
