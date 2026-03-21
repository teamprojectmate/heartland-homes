import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Put,
	Query,
	UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser, type JwtPayload } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { PaginationDto } from '../common/dto/pagination.dto';
import { AccommodationsService } from './accommodations.service';
import { CreateAccommodationDto } from './dto/create-accommodation.dto';
import { SearchAccommodationDto } from './dto/search-accommodation.dto';
import { UpdateAccommodationDto } from './dto/update-accommodation.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@ApiTags('accommodations')
@Controller('accommodations')
export class AccommodationsController {
	constructor(private accommodationsService: AccommodationsService) {}

	@Get('search')
	search(@Query() dto: SearchAccommodationDto) {
		return this.accommodationsService.search(dto);
	}

	@Get('me')
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	findMyAccommodations(@CurrentUser() user: JwtPayload) {
		return this.accommodationsService.findMyAccommodations(user.sub);
	}

	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.accommodationsService.findOne(id);
	}

	@Get()
	findAll(@Query() dto: PaginationDto) {
		const searchDto = Object.assign(new SearchAccommodationDto(), dto);
		return this.accommodationsService.findAll(searchDto);
	}

	@Post()
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	create(@Body() dto: CreateAccommodationDto, @CurrentUser() user: JwtPayload) {
		return this.accommodationsService.create(dto, user.sub);
	}

	@Put(':id')
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	update(
		@Param('id', ParseIntPipe) id: number,
		@Body() dto: UpdateAccommodationDto,
		@CurrentUser() user: JwtPayload,
	) {
		return this.accommodationsService.update(id, dto, user.sub, user.role);
	}

	@Patch(':id/status')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.MANAGER)
	@ApiBearerAuth()
	updateStatus(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateStatusDto) {
		return this.accommodationsService.updateStatus(id, dto.status);
	}

	@Delete(':id')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.MANAGER)
	@ApiBearerAuth()
	remove(@Param('id', ParseIntPipe) id: number) {
		return this.accommodationsService.remove(id);
	}
}
