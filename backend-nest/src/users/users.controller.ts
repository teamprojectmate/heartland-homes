import { Body, Controller, Delete, Get, Param, ParseIntPipe, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
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

	@Get('me')
	getMe(@CurrentUser() user: JwtPayload) {
		return this.usersService.findMe(user.sub);
	}

	@Put('me')
	updateMe(@CurrentUser() user: JwtPayload, @Body() dto: UpdateUserDto) {
		return this.usersService.updateMe(user.sub, dto);
	}

	@Get()
	@UseGuards(RolesGuard)
	@Roles(Role.MANAGER)
	findAll() {
		return this.usersService.findAll();
	}

	@Put(':id/role')
	@UseGuards(RolesGuard)
	@Roles(Role.MANAGER)
	updateRole(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRoleDto) {
		return this.usersService.updateRole(id, dto.role);
	}

	@Delete(':id')
	@UseGuards(RolesGuard)
	@Roles(Role.MANAGER)
	remove(@Param('id', ParseIntPipe) id: number) {
		return this.usersService.remove(id);
	}
}
