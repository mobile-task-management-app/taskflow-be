import { S3Client } from '@aws-sdk/client-s3';
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const S3_STORAGE = Symbol('S3_STORAGE');

export const S3StorageProvider: Provider = {
  provide: S3_STORAGE,
  useFactory: (configService: ConfigService) => {
    return new S3Client({
      region: configService.getOrThrow('s3.region'),
      endpoint: configService.getOrThrow('s3.endpoint'),
      credentials: {
        accessKeyId: configService.getOrThrow('s3.accessKey'),
        secretAccessKey: configService.getOrThrow('s3.secretKey'),
      },
      forcePathStyle: true,
    });
  },
  inject: [ConfigService],
};
