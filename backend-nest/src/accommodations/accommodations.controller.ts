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
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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

	@ApiOperation({ summary: 'Search accommodations by filters' })
	@ApiResponse({ status: 200, description: 'Search results returned' })
	@Get('search')
	search(@Query() dto: SearchAccommodationDto) {
		return this.accommodationsService.search(dto);
	}

	@ApiOperation({ summary: 'Get current user accommodations' })
	@ApiResponse({ status: 200, description: 'List of user accommodations' })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@Get('me')
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	findMyAccommodations(@CurrentUser() user: JwtPayload) {
		return this.accommodationsService.findMyAccommodations(user.sub);
	}

	@ApiOperation({ summary: 'Get booked dates for an accommodation' })
	@ApiResponse({ status: 200, description: 'List of booked date ranges' })
	@ApiResponse({ status: 404, description: 'Accommodation not found' })
	@Get(':id/booked-dates')
	getBookedDates(@Param('id', ParseIntPipe) id: number) {
		return this.accommodationsService.getBookedDates(id);
	}

	@ApiOperation({ summary: 'Get accommodation by ID' })
	@ApiResponse({ status: 200, description: 'Accommodation found' })
	@ApiResponse({ status: 404, description: 'Accommodation not found' })
	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.accommodationsService.findOne(id);
	}

	@ApiOperation({ summary: 'Get all accommodations with pagination' })
	@ApiResponse({ status: 200, description: 'Paginated list of accommodations' })
	@Get()
	findAll(@Query() dto: PaginationDto) {
		const searchDto = Object.assign(new SearchAccommodationDto(), dto);
		return this.accommodationsService.findAll(searchDto);
	}

	@ApiOperation({ summary: 'Create a new accommodation' })
	@ApiResponse({ status: 201, description: 'Accommodation created successfully' })
	@ApiResponse({ status: 400, description: 'Bad request — invalid input' })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@Post()
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	create(@Body() dto: CreateAccommodationDto, @CurrentUser() user: JwtPayload) {
		return this.accommodationsService.create(dto, user.sub);
	}

	@ApiOperation({ summary: 'Update accommodation by ID' })
	@ApiResponse({ status: 200, description: 'Accommodation updated successfully' })
	@ApiResponse({ status: 400, description: 'Bad request — invalid input' })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@ApiResponse({ status: 403, description: 'Forbidden — not the owner' })
	@ApiResponse({ status: 404, description: 'Accommodation not found' })
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

	@ApiOperation({ summary: 'Update accommodation status (manager only)' })
	@ApiResponse({ status: 200, description: 'Status updated successfully' })
	@ApiResponse({ status: 400, description: 'Bad request — invalid status' })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@ApiResponse({ status: 403, description: 'Forbidden — manager role required' })
	@ApiResponse({ status: 404, description: 'Accommodation not found' })
	@Patch(':id/status')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.MANAGER)
	@ApiBearerAuth()
	updateStatus(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateStatusDto) {
		return this.accommodationsService.updateStatus(id, dto.status);
	}

	@ApiOperation({ summary: 'Delete accommodation (manager only)' })
	@ApiResponse({ status: 200, description: 'Accommodation deleted successfully' })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@ApiResponse({ status: 403, description: 'Forbidden — manager role required' })
	@ApiResponse({ status: 404, description: 'Accommodation not found' })
	@Delete(':id')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.MANAGER)
	@ApiBearerAuth()
	remove(@Param('id', ParseIntPipe) id: number) {
		return this.accommodationsService.remove(id);
	}
}
