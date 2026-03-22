import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CurrentUser, type JwtPayload } from '../common/decorators/current-user.decorator';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

class RefreshTokenDto {
	@IsString()
	@IsNotEmpty()
	refreshToken!: string;
}

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

	@ApiOperation({ summary: 'Refresh access token' })
	@ApiResponse({ status: 200, description: 'Token refreshed successfully' })
	@ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
	@Post('refresh')
	refresh(@Body() dto: RefreshTokenDto) {
		return this.authService.refresh(dto.refreshToken);
	}

	@ApiOperation({ summary: 'Logout and invalidate refresh token' })
	@ApiResponse({ status: 200, description: 'Logged out successfully' })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@Post('logout')
	@UseGuards(JwtAuthGuard)
	logout(@CurrentUser() user: JwtPayload) {
		return this.authService.logout(user.sub);
	}
}
