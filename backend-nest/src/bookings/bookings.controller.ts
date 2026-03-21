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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
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

	@Get('my')
	findMyBookings(@CurrentUser() user: JwtPayload, @Query() dto: SearchBookingDto) {
		return this.bookingsService.findMyBookings(user.sub, dto);
	}

	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.bookingsService.findOne(id);
	}

	@Get()
	@UseGuards(RolesGuard)
	@Roles(Role.MANAGER)
	findAll(@Query() dto: SearchBookingDto) {
		return this.bookingsService.findAll(dto);
	}

	@Post()
	create(@Body() dto: CreateBookingDto, @CurrentUser() user: JwtPayload) {
		return this.bookingsService.create(dto, user.sub);
	}

	@Put(':id')
	update(
		@Param('id', ParseIntPipe) id: number,
		@Body() dto: UpdateBookingDto,
		@CurrentUser() user: JwtPayload,
	) {
		return this.bookingsService.update(id, dto, user.sub, user.role);
	}

	@Delete(':id')
	remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: JwtPayload) {
		return this.bookingsService.remove(id, user.sub, user.role);
	}

	@Post(':id/payment')
	processPayment(@Param('id', ParseIntPipe) id: number) {
		return this.paymentsService.processPayment(id);
	}
}
