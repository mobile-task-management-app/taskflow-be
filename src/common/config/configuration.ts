export default () => ({
  db: {
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    user: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'postgres',
    name: process.env.DB_NAME ?? 'app_db',
    pool: {
      max: parseInt(process.env.DB_POOL_MAX ?? '10', 10),
      idleTimeout: parseInt(process.env.DB_POOL_IDLE_TIMEOUT ?? '30000', 10),
      connectionTimeout: parseInt(
        process.env.DB_POOL_CONNECTION_TIMEOUT ?? '2000',
        10,
      ),
    },
  },

  mail: {
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT ?? '587', 10),
    secure: process.env.MAIL_SECURE === 'true',
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD,
    from: process.env.MAIL_FROM,
  },

  jwt: {
    accessToken: {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET ?? 'default_access_secret',
      expiresIn: parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRES_IN ?? '900', 10), // 15 minutes
    },
    refreshToken: {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET ?? 'default_refresh_secret',
      expiresIn: parseInt(
        process.env.JWT_REFRESH_TOKEN_EXPIRES_IN ?? '604800',
        10,
      ), // 7 days
    },
  },
  s3: {
    region: process.env.S3_REGION ?? 'us-west-004',
    endpoint: process.env.S3_ENDPOINT,
    accessKey: process.env.S3_ACCESS_KEY,
    secretKey: process.env.S3_SECRET_KEY,
    bucket: process.env.S3_BUCKET_NAME,
  },
});
