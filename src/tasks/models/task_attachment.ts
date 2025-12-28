import { Expose } from 'class-transformer';
import * as mime from 'mime-types';

export class TaskAttachment {
  @Expose({ name: 'storage_key' })
  storageKey: string;

  @Expose()
  name: string;

  @Expose()
  size: number;

  @Expose()
  extension: string;

  constructor(args: Partial<TaskAttachment>) {
    Object.assign(this, args);
  }

  /**
   * Returns the MIME type based on the file extension.
   * Falls back to 'application/octet-stream' if unknown.
   */
  getMimeType(): string {
    if (!this.extension) {
      return 'application/octet-stream';
    }

    // mime.lookup can take a full path, a filename, or just an extension
    return mime.lookup(this.extension) || 'application/octet-stream';
  }
}
