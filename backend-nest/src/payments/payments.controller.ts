import {
	Body,
	Controller,
	Get,
	Headers,
	ParseIntPipe,
	Post,
	Query,
	RawBody,
	UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, type JwtPayload } from '../common/decorators/current-user.decorator';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { SearchPaymentDto } from './dto/search-payment.dto';
import { PaymentsService } from './payments.service';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
	constructor(private paymentsService: PaymentsService) {}

	@Post()
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	create(@Body() dto: CreatePaymentDto, @CurrentUser() user: JwtPayload) {
		return this.paymentsService.create(dto, user.sub);
	}

	@Get()
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	findPayments(@CurrentUser() user: JwtPayload, @Query() dto: SearchPaymentDto) {
		if (user.role === Role.MANAGER) {
			return this.paymentsService.findAll(dto);
		}
		return this.paymentsService.findByUser(user.sub, dto);
	}

	@Get('cancel')
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	cancel(@Query('id', ParseIntPipe) id: number) {
		return this.paymentsService.cancel(id);
	}

	@Post('webhook')
	handleWebhook(@RawBody() payload: Buffer, @Headers('stripe-signature') signature: string) {
		return this.paymentsService.handleStripeWebhook(payload, signature);
	}
}
