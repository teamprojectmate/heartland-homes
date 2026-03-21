import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
	@Transform(({ value }: { value: string }) => value.trim().toLowerCase())
	@IsEmail()
	email!: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(6)
	password!: string;

	@Transform(({ value }: { value: string }) => value.trim())
	@IsString()
	@IsNotEmpty()
	firstName!: string;

	@Transform(({ value }: { value: string }) => value.trim())
	@IsString()
	@IsNotEmpty()
	lastName!: string;
}
