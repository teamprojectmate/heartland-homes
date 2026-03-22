import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
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
import { PaymentsService } from '../payments/payments.service';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { SearchBookingDto } from './dto/search-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@ApiTags('bookings')
@ApiBearerAuth()
@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
	constructor(
		private bookingsService: BookingsService,
		private paymentsService: PaymentsService,
	) {}

	@ApiOperation({ summary: 'Get current user bookings' })
	@ApiResponse({ status: 200, description: 'List of user bookings' })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@Get('my')
	findMyBookings(@CurrentUser() user: JwtPayload, @Query() dto: SearchBookingDto) {
		return this.bookingsService.findMyBookings(user.sub, dto);
	}

	@ApiOperation({ summary: 'Get booking by ID' })
	@ApiResponse({ status: 200, description: 'Booking found' })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@ApiResponse({ status: 404, description: 'Booking not found' })
	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.bookingsService.findOne(id);
	}

	@ApiOperation({ summary: 'Get all bookings (manager only)' })
	@ApiResponse({ status: 200, description: 'List of all bookings' })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@ApiResponse({ status: 403, description: 'Forbidden — manager role required' })
	@Get()
	@UseGuards(RolesGuard)
	@Roles(Role.MANAGER)
	findAll(@Query() dto: SearchBookingDto) {
		return this.bookingsService.findAll(dto);
	}

	@ApiOperation({ summary: 'Create a new booking' })
	@ApiResponse({ status: 201, description: 'Booking created successfully' })
	@ApiResponse({ status: 400, description: 'Bad request — invalid input' })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@ApiResponse({ status: 409, description: 'Conflict — dates overlap with existing booking' })
	@Post()
	create(@Body() dto: CreateBookingDto, @CurrentUser() user: JwtPayload) {
		return this.bookingsService.create(dto, user.sub);
	}

	@ApiOperation({ summary: 'Update booking by ID' })
	@ApiResponse({ status: 200, description: 'Booking updated successfully' })
	@ApiResponse({ status: 400, description: 'Bad request — invalid input' })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@ApiResponse({ status: 403, description: 'Forbidden — not the owner' })
	@ApiResponse({ status: 404, description: 'Booking not found' })
	@Put(':id')
	update(
		@Param('id', ParseIntPipe) id: number,
		@Body() dto: UpdateBookingDto,
		@CurrentUser() user: JwtPayload,
	) {
		return this.bookingsService.update(id, dto, user.sub, user.role);
	}

	@ApiOperation({ summary: 'Cancel booking by ID' })
	@ApiResponse({ status: 200, description: 'Booking cancelled successfully' })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@ApiResponse({ status: 403, description: 'Forbidden — not the owner' })
	@ApiResponse({ status: 404, description: 'Booking not found' })
	@Delete(':id')
	remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: JwtPayload) {
		return this.bookingsService.remove(id, user.sub, user.role);
	}

	@ApiOperation({ summary: 'Process payment for a booking' })
	@ApiResponse({ status: 201, description: 'Payment initiated successfully' })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@ApiResponse({ status: 404, description: 'Booking not found' })
	@Post(':id/payment')
	processPayment(@Param('id', ParseIntPipe) id: number) {
		return this.paymentsService.processPayment(id);
	}
}
