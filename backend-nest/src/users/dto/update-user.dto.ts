import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { trimString } from '../../common/transforms';

const NAME_MAX_LENGTH = 100;

export class UpdateUserDto {
	@Transform(trimString)
	@IsString()
	@IsNotEmpty()
	@MaxLength(NAME_MAX_LENGTH)
	@IsOptional()
	firstName?: string;

	@Transform(trimString)
	@IsString()
	@IsNotEmpty()
	@MaxLength(NAME_MAX_LENGTH)
	@IsOptional()
	lastName?: string;
}
