import { Inject, Injectable } from '@nestjs/common';
import { Pool, PoolClient } from 'pg';
import { plainToInstance, instanceToPlain } from 'class-transformer';
import { PG_POOL_PROVIDER } from 'src/common/providers/pg.provider';
import { Task } from '../models/task';
import { TaskStatus } from '../models/task_status';

import {
  buildPGFilterCondition,
  buildUpdateSetClause,
} from 'src/common/utils/pg.utils';
import { CreateTask } from '../models/create_task';
import { UpdateTask } from '../models/update_task';
import { SearchProjectTaskInput } from '../services/inputs/search_project_task.input';
import { TaskAttachment } from '../models/task_attachment';
import { SearchTaskInput } from '../services/inputs/search_task.input';

@Injectable()
export class TaskRepository {
  constructor(
    @Inject(PG_POOL_PROVIDER)
    private readonly pgPool: Pool,
  ) {}

  async createTask(taskData: CreateTask, client?: PoolClient): Promise<Task> {
    const sql = `
      INSERT INTO tasks (
        owner_id,
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
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING
        id, owner_id, project_id, title, description, status, 
        priority, category_ids, attachments, 
        start_date, end_date, created_at, updated_at
    `;

    const params = [
      taskData.ownerId,
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
        , owner_id
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

  async updateTaskAttachments(
    id: number,
    attachments: TaskAttachment[],
    client?: PoolClient,
  ): Promise<Task | null> {
    const rawAttachments = JSON.stringify(instanceToPlain(attachments));
    const sql = `
      UPDATE tasks
      SET attachments = $2, updated_at = NOW()
      WHERE id = $1
      RETURNING 
        id
      , owner_id
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
    const { rows } = await executor.query(sql, [id, rawAttachments]);

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

  async searchTasks(
    cond: SearchProjectTaskInput | SearchTaskInput,
  ): Promise<Task[]> {
    const [whereClause, args] = buildPGFilterCondition(cond);

    const sql = `
    SELECT
      id,
      owner_id,
      title,
      project_id AS project_id,
      status,
      priority,
      category_ids AS category_ids,
      attachments,
      description,
      start_date AS start_date,
      end_date AS end_date,
      created_at,
      updated_at
    FROM tasks
    WHERE ${whereClause}
    ORDER BY ${cond.sort || 'created_at'} ${cond.asc ? 'ASC' : 'DESC'}
  `;

    // 3. Thực thi query
    const { rows } = await this.pgPool.query(sql, [...args]);

    // 4. Transform từ plain object sang class instance
    return plainToInstance(Task, rows, {
      excludeExtraneousValues: true,
    });
  }
  async updateTask(
    taskId: number,
    updateData: UpdateTask,
    client?: PoolClient,
  ): Promise<Task> {
    // 1. Generate the SET clause. We start at $2 because $1 is reserved for taskId.
    const [setClause, params] = buildUpdateSetClause(updateData, 2);

    // 2. If no fields were provided for update, just return the existing task

    const sql = `
    UPDATE tasks
    SET 
      ${setClause},
      updated_at = NOW()
    WHERE id = $1
    RETURNING
      id,
      owner_id,
      title,
      description,
      priority,
      status,
      category_ids,
      start_date,
      end_date,
      project_id,
      created_at,
      updated_at
  `;

    const executor = client ?? this.pgPool;

    // 3. Execute query with taskId as $1 and the rest of the params following
    const { rows } = await executor.query(sql, [taskId, ...params]);

    // 4. Transform the database row back into a Task class instance
    return plainToInstance(Task, rows[0], {
      excludeExtraneousValues: true,
    });
  }
}
