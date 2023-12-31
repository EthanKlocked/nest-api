import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { TransformInterceptor } from './transform.interceptor';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.useGlobalPipes(new ValidationPipe({
		whitelist: true,
		forbidNonWhitelisted: true,
		transform: true
	}));

	const config = new DocumentBuilder()
		.setTitle('Nest API')
		.setDescription('Nestjs API document made by Ethan Kim')
		.setVersion('1.0')
		.build();

	app.useGlobalInterceptors(new TransformInterceptor);

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);
	
	await app.listen(3000);
}
bootstrap();
