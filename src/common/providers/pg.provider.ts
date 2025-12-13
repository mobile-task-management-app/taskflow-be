import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

export const PG_POOL_PROVIDER = Symbol('PG_POOL');

export const PgProvider: Provider = {
  provide: PG_POOL_PROVIDER,
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    const pool = new Pool({
      host: configService.get<string>('db.host', { infer: true }),
      port: configService.get<number>('db.port', { infer: true }),
      user: configService.get<string>('db.user', { infer: true }),
      password: configService.get<string>('db.password', { infer: true }),
      database: configService.get<string>('db.name', { infer: true }),

      max: configService.get<number>('db.pool.max', 10),
      idleTimeoutMillis: configService.get<number>(
        'db.pool.idleTimeout',
        30_000,
      ),
      connectionTimeoutMillis: configService.get<number>(
        'db.pool.connectionTimeout',
        2_000,
      ),
    });

    // Verify DB connection on startup
    await pool.query('SELECT 1');

    return pool;
  },
};
