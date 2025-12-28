import { Inject, Injectable } from '@nestjs/common';
import { Pool, PoolClient } from 'pg';
import { plainToInstance, instanceToPlain } from 'class-transformer';
import { PG_POOL_PROVIDER } from 'src/common/providers/pg.provider';
import { Task } from '../models/task';
import { TaskStatus } from '../models/task_status';

import { buildUpdateSetClause } from 'src/common/utils/pg.utils';
import { CreateTask } from '../models/create_task';
import { UpdateTask } from '../models/update_task';

@Injectable()
export class TaskRepository {
  constructor(
    @Inject(PG_POOL_PROVIDER)
    private readonly pgPool: Pool,
  ) {}

  async createTask(taskData: CreateTask, client?: PoolClient): Promise<Task> {
    const sql = `
      INSERT INTO tasks (
        project_id,
        title,
        description,
        status,
        priority,
        category_ids,
        attachments,
        start_date,
        end_date
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING
        id, project_id, title, description, status, 
        priority, category_ids, attachments, 
        start_date, end_date, created_at, updated_at
    `;

    const params = [
      taskData.projectId,
      taskData.title,
      taskData.description,
      taskData.status ?? TaskStatus.TODO,
      taskData.priority,
      taskData.categoryIds || [],
      JSON.stringify(taskData.attachments || []), // Store objects as JSONB
      taskData.startDate,
      taskData.endDate,
    ];

    const executor = client ?? this.pgPool;
    const { rows } = await executor.query(sql, params);

    return plainToInstance(Task, rows[0], {
      excludeExtraneousValues: true,
    });
  }

  async findTaskById(id: number): Promise<Task | null> {
    const sql = `
      SELECT
          id
        , project_id
        , title
        , description
        , status
        , priority
        , category_ids
        , attachments
        , start_date
        , end_date
        , created_at
        , updated_at
      FROM tasks 
      WHERE id = $1 
      LIMIT 1
    `;

    const { rows } = await this.pgPool.query(sql, [id]);

    if (rows.length === 0) return null;

    return plainToInstance(Task, rows[0], {
      excludeExtraneousValues: true,
    });
  }

  async updateTask(
    id: number,
    updateData: UpdateTask,
    client?: PoolClient,
  ): Promise<Task | null> {
    // Transform class to plain to handle snake_case keys for the utility
    const plainUpdate = instanceToPlain(updateData);

    // Convert arrays to strings if they exist in the update payload
    if (plainUpdate.attachments)
      plainUpdate.attachments = JSON.stringify(plainUpdate.attachments);
    if (plainUpdate.category_ids)
      plainUpdate.category_ids = JSON.stringify(plainUpdate.category_ids);

    const [setClause, params] = buildUpdateSetClause(plainUpdate, 2);

    if (!setClause) return this.findTaskById(id);

    const sql = `
      UPDATE tasks
      SET ${setClause}, updated_at = NOW()
      WHERE id = $1
      RETURNING 
        id
      , project_id
      , title
      , description
      , status
      , priority
      , category_ids
      , attachments
      , start_date
      , end_date
      , created_at
      , updated_at
    `;

    const executor = client ?? this.pgPool;
    const { rows } = await executor.query(sql, [id, ...params]);

    if (rows.length === 0) return null;

    return plainToInstance(Task, rows[0], {
      excludeExtraneousValues: true,
    });
  }

  async deleteTask(id: number, client?: PoolClient): Promise<boolean> {
    const sql = `DELETE FROM tasks WHERE id = $1`;
    const executor = client ?? this.pgPool;
    const result = await executor.query(sql, [id]);
    return (result.rowCount ?? 0) > 0;
  }
}
