import {
	type ArgumentsHost,
	Catch,
	type ExceptionFilter,
	HttpException,
	HttpStatus,
	Logger,
} from '@nestjs/common';
import type { Response } from 'express';

function extractMessage(response: string | object): string | string[] {
	if (typeof response === 'string') {
		return response;
	}

	if ('message' in response) {
		return (response as { message: string | string[] }).message;
	}

	return 'Internal server error';
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
	private readonly logger = new Logger(GlobalExceptionFilter.name);

	catch(exception: unknown, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();

		let status = HttpStatus.INTERNAL_SERVER_ERROR;
		let message: string | string[] = 'Internal server error';

		if (exception instanceof HttpException) {
			status = exception.getStatus();
			message = extractMessage(exception.getResponse());
		} else {
			this.logger.error(
				'Unhandled exception',
				exception instanceof Error ? exception.stack : String(exception),
			);
		}

		response.status(status).json({
			statusCode: status,
			message,
			timestamp: new Date().toISOString(),
		});
	}
}
