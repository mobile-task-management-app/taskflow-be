import { Expose, Transform } from 'class-transformer';
import { IsNotEmpty, IsString, IsOptional, IsDate } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'; // Import these
import { CreateProjectInput } from '../services/inputs/create_project.input';

export class AddProjectRequestDTO {
  @ApiProperty({
    description: 'The name of the project',
    example: 'Mobile App Redesign',
  })
  @Expose()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'A brief description of the project',
    example: 'Revamping the user interface for the core mobile application.',
  })
  @Expose()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    name: 'start_date', // Matches your @Expose name
    description: 'Project start date in Unix timestamp (seconds)',
    example: 1704345731,
    type: Number, // Shows as number in Swagger since input is a timestamp
  })
  @Expose({ name: 'start_date' })
  @IsOptional()
  @Transform(({ value }) => (value ? new Date(Number(value) * 1000) : value), {
    toClassOnly: true,
  })
  @IsDate()
  startDate?: Date;

  @ApiPropertyOptional({
    name: 'end_date',
    description: 'Project end date in Unix timestamp (seconds)',
    example: 1706937731,
    type: Number,
  })
  @Expose({ name: 'end_date' })
  @IsOptional()
  @Transform(({ value }) => (value ? new Date(Number(value) * 1000) : value), {
    toClassOnly: true,
  })
  @IsDate()
  endDate?: Date;

  toCreateProjectInput(): CreateProjectInput {
    return new CreateProjectInput({ ...this });
  }
}
