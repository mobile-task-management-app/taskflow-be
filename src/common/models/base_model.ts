import { Expose } from 'class-transformer';

export class BaseModel {
  @Expose({ name: 'id' })
  id: number;

  @Expose({ name: 'created_at' })
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  updatedAt: Date;
}
