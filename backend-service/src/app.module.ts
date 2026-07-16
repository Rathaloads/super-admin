import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import configuration from './config/configuration';
import { DatabaseModule } from './database/database.module';
import { WinstonLoggerModule } from './common/logger/winston-logger.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { RedisModule } from './redis/redis.module';
import { FundModule } from './modules/fund/fund.module';
import { ApplicationModule } from './modules/application/application.module';
import { BookkeepingModule } from './modules/bookkeeping/bookkeeping.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: '.env.development',
    }),
    DatabaseModule,
    RedisModule,
    AuthModule,
    WinstonLoggerModule,
    FundModule,
    ApplicationModule,
    BookkeepingModule,
    UserModule,
  ],
  controllers: [],
  providers: [LoggerMiddleware],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
