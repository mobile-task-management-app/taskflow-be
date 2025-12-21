import { Global, Inject, Module, OnModuleDestroy } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { PG_POOL_PROVIDER, PgProvider } from './providers/pg.provider';
import { Pool } from 'pg';
import { JwtStrategy } from './guards/strategies/jwt.strategy';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtAuthGuard } from './guards/jwt_auth.guard';
import { AllExceptionFilter } from './filters/all_exception.filter';
import { HttpExceptionFilter } from './filters/http_exception.filter';
import { TransformResponseInterceptor } from './interceptors/transform_response.interceptor';
import { PgService } from './pg/pg.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env.local', '.env'],
    }),
  ],
  providers: [
    PgProvider,
    PgService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
    // Global HTTP Exception Filter (handles HttpException)
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    { provide: APP_INTERCEPTOR, useClass: TransformResponseInterceptor },
  ],
  exports: [PG_POOL_PROVIDER, JwtStrategy, PgService],
})
export class CommonModule implements OnModuleDestroy {
  constructor(
    @Inject(PG_POOL_PROVIDER)
    private readonly pool: Pool,
  ) {}
  async onModuleDestroy() {
    await this.pool.end();
  }
}
