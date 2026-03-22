import { Body, Controller, Delete, Get, Param, ParseIntPipe, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser, type JwtPayload } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
	constructor(private usersService: UsersService) {}

	@ApiOperation({ summary: 'Get current user profile' })
	@ApiResponse({ status: 200, description: 'Current user profile returned' })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@Get('me')
	getMe(@CurrentUser() user: JwtPayload) {
		return this.usersService.findMe(user.sub);
	}

	@ApiOperation({ summary: 'Update current user profile' })
	@ApiResponse({ status: 200, description: 'Profile updated successfully' })
	@ApiResponse({ status: 400, description: 'Bad request — invalid input' })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@Put('me')
	updateMe(@CurrentUser() user: JwtPayload, @Body() dto: UpdateUserDto) {
		return this.usersService.updateMe(user.sub, dto);
	}

	@ApiOperation({ summary: 'Get all users (manager only)' })
	@ApiResponse({ status: 200, description: 'List of all users' })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@ApiResponse({ status: 403, description: 'Forbidden — manager role required' })
	@Get()
	@UseGuards(RolesGuard)
	@Roles(Role.MANAGER)
	findAll() {
		return this.usersService.findAll();
	}

	@ApiOperation({ summary: 'Update user role (manager only)' })
	@ApiResponse({ status: 200, description: 'User role updated successfully' })
	@ApiResponse({ status: 400, description: 'Bad request — invalid input' })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@ApiResponse({ status: 403, description: 'Forbidden — manager role required' })
	@ApiResponse({ status: 404, description: 'User not found' })
	@Put(':id/role')
	@UseGuards(RolesGuard)
	@Roles(Role.MANAGER)
	updateRole(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRoleDto) {
		return this.usersService.updateRole(id, dto.role);
	}

	@ApiOperation({ summary: 'Delete user (manager only)' })
	@ApiResponse({ status: 200, description: 'User deleted successfully' })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@ApiResponse({ status: 403, description: 'Forbidden — manager role required' })
	@ApiResponse({ status: 404, description: 'User not found' })
	@Delete(':id')
	@UseGuards(RolesGuard)
	@Roles(Role.MANAGER)
	remove(@Param('id', ParseIntPipe) id: number) {
		return this.usersService.remove(id);
	}
}
