import { Inject, Injectable } from '@nestjs/common';
import { Pool, PoolClient } from 'pg';
import { plainToInstance } from 'class-transformer';
import { PG_POOL_PROVIDER } from 'src/common/providers/pg.provider';
import { Project } from '../models/project';
import { ProjectStatus } from '../models/project_status';
import { CreateProject } from '../models/create_project';
import { SearchProjectInput } from '../services/inputs/search_project.input';
import {
  buildPGFilterCondition,
  buildUpdateSetClause,
} from 'src/common/utils/pg.utils';
import { UpdateProject } from '../models/update_project';

@Injectable()
export class ProjectRepository {
  constructor(
    @Inject(PG_POOL_PROVIDER)
    private readonly pgPool: Pool,
  ) {}

  async createProject(
    projectData: CreateProject,
    client?: PoolClient,
  ): Promise<Project> {
    const sql = `
      INSERT INTO projects (
        name,
        description,
        owner_id,
        status,
        start_date,
        end_date
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING
        id,
        name,
        description,
        owner_id,
        status,
        start_date,
        end_date,
        created_at,
        updated_at
    `;

    const params = [
      projectData.name,
      projectData.description,
      projectData.ownerId,
      projectData.status ?? ProjectStatus.NOT_YET,
      projectData.startDate,
      projectData.endDate,
    ];

    const executor = client ?? this.pgPool;
    const { rows } = await executor.query(sql, params);

    return plainToInstance(Project, rows[0], {
      excludeExtraneousValues: true,
    });
  }

  async findProjectById(id: number): Promise<Project | null> {
    const sql = `
      SELECT
        id,
        name,
        description,
        owner_id,
        status,
        start_date,
        end_date,
        created_at,
        updated_at
      FROM projects
      WHERE id = $1
      LIMIT 1
    `;

    const { rows } = await this.pgPool.query(sql, [id]);

    if (rows.length === 0) {
      return null;
    }

    return plainToInstance(Project, rows[0], {
      excludeExtraneousValues: true,
    });
  }

  async updateProject(
    id: number,
    updateData: UpdateProject,
    client?: PoolClient,
  ): Promise<Project | null> {
    const [setClause, params] = buildUpdateSetClause(updateData, 2);

    if (!setClause) {
      return this.findProjectById(id);
    }
    const sql = `
    UPDATE projects
    SET 
      ${setClause},
      updated_at = NOW()
    WHERE id = $1
    RETURNING
      id,
      name,
      description,
      owner_id,
      status,
      start_date,
      end_date,
      created_at,
      updated_at
  `;

    const executor = client ?? this.pgPool;
    const { rows } = await executor.query(sql, [id, ...params]);

    if (rows.length === 0) {
      return null;
    }

    return plainToInstance(Project, rows[0], {
      excludeExtraneousValues: true,
    });
  }

  async update(id: number, updateData: UpdateProject): Promise<void> {
    // Start at 2, because $1 is reserved for the ID
    const [setClause, params] = buildUpdateSetClause(updateData, 2);

    if (!setClause) return; // Nothing to update

    const sql = `
    UPDATE projects 
    SET ${setClause}, updated_at = NOW() 
    WHERE id = $1
  `;

    await this.pgPool.query(sql, [id, ...params]);
  }

  async deleteProject(id: number, client?: PoolClient): Promise<boolean> {
    const sql = `DELETE FROM projects WHERE id = $1`;
    const executor = client ?? this.pgPool;
    const result = await executor.query(sql, [id]);

    return (result.rowCount ?? 0) > 0;
  }

  async searchProject(cond: SearchProjectInput): Promise<Project[]> {
    const [whereClause, args] = buildPGFilterCondition(cond);
    const sql = `
      SELECT
        id,
        name,
        description,
        owner_id,
        status,
        start_date,
        end_date,
        created_at,
        updated_at
      FROM projects
      WHERE ${whereClause}
      ORDER BY ${cond.sort} ${cond.asc ? 'ASC' : 'DESC'}
    `;
    const { rows } = await this.pgPool.query(sql, [...args]);
    return plainToInstance(Project, rows, {
      excludeExtraneousValues: true,
    });
  }
}
