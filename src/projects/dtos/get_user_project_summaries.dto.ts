import { Expose, Type } from 'class-transformer';
import { ProjectSummaryResponseDTO } from './project_summary.dto';
import { ApiProperty } from '@nestjs/swagger';

export class GetUserProjectSummariesResponseDTO {
  @Expose({ name: 'project_summaries' })
  @ApiProperty({ type: [ProjectSummaryResponseDTO], name: 'project_summaries' })
  @Type(() => ProjectSummaryResponseDTO)
  projectSummaries: ProjectSummaryResponseDTO[];
  constructor(args: Partial<GetUserProjectSummariesResponseDTO>) {
    Object.assign(this, args);
  }
}
