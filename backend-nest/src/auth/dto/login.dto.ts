import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
	@Transform(({ value }: { value: string }) => value.trim().toLowerCase())
	@IsEmail()
	email!: string;

	@IsString()
	@IsNotEmpty()
	password!: string;
}
