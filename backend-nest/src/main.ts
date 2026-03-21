import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';

const DEFAULT_PORT = 3000;
const DEFAULT_FRONTEND_URL = 'http://localhost:5173';

function parseCorsOrigins(configService: ConfigService): string[] {
	const raw = configService.get<string>('FRONTEND_URL', DEFAULT_FRONTEND_URL);
	return raw.split(',').map((url) => url.trim());
}

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		rawBody: true,
	});
	const configService = app.get(ConfigService);

	app.use(helmet());

	app.enableCors({
		origin: parseCorsOrigins(configService),
		credentials: true,
	});

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
		}),
	);

	app.useGlobalFilters(new GlobalExceptionFilter());

	const swaggerConfig = new DocumentBuilder()
		.setTitle('Heartland Homes API')
		.setDescription('Accommodation booking API')
		.setVersion('1.0')
		.addBearerAuth()
		.build();

	const document = SwaggerModule.createDocument(app, swaggerConfig);
	SwaggerModule.setup('api/docs', app, document);

	const port = configService.get<number>('PORT', DEFAULT_PORT);
	await app.listen(port);
}

bootstrap();
