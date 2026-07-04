import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './application/controllers/app.controller';
import { LoggerMiddleware } from './application/middlewares/logger.middleware';

// Infrastructure
import AppDataSource from './infrastruct/database/config/data-source';
import { DatabaseModule } from './infrastruct/database/database.module';

// Modules
import { AuthModule } from './application/auth.module';
import { UsersModule } from './application/users.module';
import { ProductModule } from './application/product.module';
import { OrderModule } from './application/order.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    DatabaseModule,
    AuthModule,
    UsersModule,
    ProductModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [],
  exports: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
