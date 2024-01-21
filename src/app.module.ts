import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { MailModule } from './mail/mail.module';
import { CacheModule } from '@nestjs/cache-manager';
import { AuthModule } from './auth/auth.module';

@Module({
	imports: [
		/********* CONFIG SETTING *********/
		ConfigModule.forRoot({
			cache:true,
			isGlobal:true,
			envFilePath: `.env.${process.env.NODE_ENV}`,
		}),
		/********* CACHE SETTING *********/
		CacheModule.register({
			isGlobal: true
		}),
		/********* DATABASE SETTING *********/
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => {
				const db_path = configService.get<string>('DB_PATH');
				const db_name = configService.get<string>('DB_NAME');
				const db_user = configService.get<string>('DB_USER');
				const db_password = configService.get<string>('DB_PASSWORD');
				return ({
					uri: `mongodb://${db_user}:${encodeURIComponent(db_password)}@${db_path}`,
					dbName: db_name
			  	});
			},
		}),
		/********* CUSTOM MODULES *********/
		UserModule,
		MailModule,
		AuthModule,
	],
	controllers: [AppController],
	providers: [],
})
export class AppModule {}
