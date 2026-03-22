import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@ApiOperation({ summary: 'Register a new user' })
	@ApiResponse({ status: 201, description: 'User registered successfully' })
	@ApiResponse({ status: 400, description: 'Bad request — invalid input' })
	@ApiResponse({ status: 409, description: 'User with this email already exists' })
	@Post('registration')
	register(@Body() dto: RegisterDto) {
		return this.authService.register(dto);
	}

	@ApiOperation({ summary: 'Log in with email and password' })
	@ApiResponse({ status: 200, description: 'Login successful' })
	@ApiResponse({ status: 400, description: 'Bad request — invalid input' })
	@ApiResponse({ status: 401, description: 'Invalid credentials' })
	@Post('login')
	login(@Body() dto: LoginDto) {
		return this.authService.login(dto);
	}
}
