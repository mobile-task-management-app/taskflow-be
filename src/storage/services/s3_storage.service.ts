import { Inject, Injectable } from '@nestjs/common';
import { S3_STORAGE } from '../providers/s3.provider';
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3StorageService {
  private readonly bucketName: string;

  constructor(
    @Inject(S3_STORAGE) private readonly s3Client: S3Client,
    private readonly configService: ConfigService,
  ) {
    this.bucketName = this.configService.getOrThrow<string>('s3.bucket');
  }

  /**
   * Generates a URL for a client to DOWNLOAD/VIEW a file
   * @param key The storage key (path) in S3
   * @param expiresIn Seconds until the link expires (default 1 hour)
   */
  async getPresignedDownloadUrl(
    key: string,
    expiresIn: number = 3600,
  ): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    return getSignedUrl(this.s3Client, command, { expiresIn });
  }

  /**
   * Generates a URL for a client to UPLOAD (PUT) a file directly to S3
   * @param key The destination path in S3
   * @param contentType The MIME type of the file (e.g., 'image/png')
   * @param expiresIn Seconds until the link expires (default 15 mins)
   */
  async getPresignedUploadUrl(
    key: string,
    contentType: string,
    expiresIn: number = 900,
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: contentType,
    });

    return getSignedUrl(this.s3Client, command, { expiresIn });
  }
}
