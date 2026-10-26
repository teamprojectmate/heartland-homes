import { Transform } from 'class-transformer';
import { IsByteLength, IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { normalizeEmail, trimString } from '../../common/transforms';

const PASSWORD_MIN_LENGTH = 6;
/** bcrypt only uses the first 72 bytes (not characters) of a password; longer input would be silently cut. */
const PASSWORD_MAX_BYTES = 72;

export class RegisterDto {
	@Transform(normalizeEmail)
	@IsEmail()
	email!: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(PASSWORD_MIN_LENGTH)
	@IsByteLength(0, PASSWORD_MAX_BYTES)
	password!: string;

	@Transform(trimString)
	@IsString()
	@IsNotEmpty()
	firstName!: string;

	@Transform(trimString)
	@IsString()
	@IsNotEmpty()
	lastName!: string;
}
