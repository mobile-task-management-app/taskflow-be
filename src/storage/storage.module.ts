import { Module } from '@nestjs/common';
import { S3_STORAGE, S3StorageProvider } from './providers/s3.provider';
import { S3StorageService } from './services/s3_storage.service';

@Module({
  providers: [S3StorageProvider, S3StorageService],
  exports: [S3_STORAGE, S3StorageService],
})
export class StorageModule {}
