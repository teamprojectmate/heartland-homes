import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
	@Transform(({ value }: { value: string }) => value?.trim())
	@IsString()
	@IsOptional()
	firstName?: string;

	@Transform(({ value }: { value: string }) => value?.trim())
	@IsString()
	@IsOptional()
	lastName?: string;
}
