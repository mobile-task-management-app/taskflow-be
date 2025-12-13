export default () => ({
  db: {
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 5432),
    user: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'postgres',
    name: process.env.DB_NAME ?? 'app_db',

    pool: {
      max: Number(process.env.DB_POOL_MAX ?? 10),
      idleTimeout: Number(process.env.DB_POOL_IDLE_TIMEOUT ?? 30_000),
      connectionTimeout: Number(
        process.env.DB_POOL_CONNECTION_TIMEOUT ?? 2_000,
      ),
    },
  },
  mail: {
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: process.env.MAIL_SECURE === 'true',
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD,
    from: process.env.MAIL_FROM,
  },
});
