import { Inject, Injectable } from '@nestjs/common';
import { Pool, PoolClient } from 'pg';
import { plainToInstance } from 'class-transformer';
import { PG_POOL_PROVIDER } from 'src/common/providers/pg.provider';
import { CreateUser } from '../models/create_user';
import { User } from '../models/user';

@Injectable()
export class UserRepository {
  constructor(
    @Inject(PG_POOL_PROVIDER)
    private readonly pgPool: Pool,
  ) {}

  async createUser(createUser: CreateUser, client?: PoolClient): Promise<User> {
    const sql = `
      INSERT INTO users (
        first_name,
        last_name,
        email,
        password,
        phone_number,
        date_of_birth
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING
        id,
        first_name,
        last_name,
        email,
        password,
        phone_number,
        date_of_birth,
        last_login_at,
        created_at,
        updated_at
    `;

    const params = [
      createUser.firstName,
      createUser.lastName,
      createUser.email,
      createUser.password,
      createUser.phoneNumber,
      createUser.dateOfBirth,
    ];

    const executor = client ?? this.pgPool;

    const { rows } = await executor.query(sql, params);

    return plainToInstance(User, rows[0], {
      excludeExtraneousValues: true,
    });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const sql = `
      SELECT
        id,
        first_name,
        last_name,
        email,
        password,
        phone_number,
        date_of_birth,
        last_login_at,
        created_at,
        updated_at
      FROM users
      WHERE email = $1
      LIMIT 1
    `;

    const { rows } = await this.pgPool.query(sql, [email]);

    if (rows.length === 0) {
      return null;
    }

    return plainToInstance(User, rows[0], {
      excludeExtraneousValues: true,
    });
  }

  async findUserById(id: number): Promise<User | null> {
    const sql = `
      SELECT
        id,
        first_name,
        last_name,
        email,
        password,
        phone_number,
        date_of_birth,
        last_login_at,
        created_at,
        updated_at
      FROM users
      WHERE id = $1
      LIMIT 1
    `;

    const { rows } = await this.pgPool.query(sql, [id]);

    if (rows.length === 0) {
      return null;
    }

    return plainToInstance(User, rows[0], {
      excludeExtraneousValues: true,
    });
  }
}
