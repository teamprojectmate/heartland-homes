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
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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

	@ApiOperation({ summary: 'Create a new payment' })
	@ApiResponse({ status: 201, description: 'Payment created successfully' })
	@ApiResponse({ status: 400, description: 'Bad request — invalid input' })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@Post()
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	create(@Body() dto: CreatePaymentDto, @CurrentUser() user: JwtPayload) {
		return this.paymentsService.create(dto, user.sub);
	}

	@ApiOperation({ summary: 'Get payments (own for user, all for manager)' })
	@ApiResponse({ status: 200, description: 'List of payments' })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@Get()
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	findPayments(@CurrentUser() user: JwtPayload, @Query() dto: SearchPaymentDto) {
		if (user.role === Role.MANAGER) {
			return this.paymentsService.findAll(dto);
		}
		return this.paymentsService.findByUser(user.sub, dto);
	}

	@ApiOperation({ summary: 'Cancel a payment' })
	@ApiResponse({ status: 200, description: 'Payment cancelled successfully' })
	@ApiResponse({ status: 401, description: 'Unauthorized' })
	@ApiResponse({ status: 404, description: 'Payment not found' })
	@Get('cancel')
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	cancel(@Query('id', ParseIntPipe) id: number) {
		return this.paymentsService.cancel(id);
	}

	@ApiOperation({ summary: 'Handle Stripe webhook event' })
	@ApiResponse({ status: 200, description: 'Webhook processed successfully' })
	@ApiResponse({ status: 400, description: 'Invalid webhook signature' })
	@Post('webhook')
	handleWebhook(@RawBody() payload: Buffer, @Headers('stripe-signature') signature: string) {
		return this.paymentsService.handleStripeWebhook(payload, signature);
	}
}
