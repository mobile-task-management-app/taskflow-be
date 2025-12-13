import { Inject, Injectable } from '@nestjs/common';
import { Pool, PoolClient } from 'pg';
import { PG_POOL_PROVIDER } from 'src/common/providers/pg.provider';
import { plainToInstance } from 'class-transformer';
import { CreateUserConfirmSignUp } from '../models/create_user_confirm_sign_up';
import { UserConfirmSignUp } from '../models/user_confirm_sign_up';

@Injectable()
export class UserConfirmSignRepository {
  constructor(
    @Inject(PG_POOL_PROVIDER)
    private readonly pgPool: Pool,
  ) {}

  async create(
    data: CreateUserConfirmSignUp,
    client?: PoolClient,
  ): Promise<UserConfirmSignUp> {
    const sql = `
      INSERT INTO user_confirm_sign_up (
        first_name,
        last_name,
        email,
        password,
        phone_number,
        date_of_birth,
        otp,
        expire_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING
        id,
        first_name,
        last_name,
        email,
        password,
        phone_number,
        date_of_birth,
        otp,
        expire_at,
        created_at,
        updated_at
    `;

    const values = [
      data.firstName,
      data.lastName,
      data.email,
      data.password,
      data.phoneNumber,
      data.dateOfBirth,
      data.otp,
      data.expireAt,
    ];

    const executor = client ?? this.pgPool;
    const { rows } = await executor.query(sql, values);

    return plainToInstance(UserConfirmSignUp, rows[0], {
      excludeExtraneousValues: true,
    });
  }

  async findByOtp(otp: string): Promise<UserConfirmSignUp | null> {
    const sql = `
      SELECT
        id,
        first_name,
        last_name,
        email,
        password,
        phone_number,
        date_of_birth,
        otp,
        expire_at,
        created_at,
        updated_at
      FROM user_confirm_sign_up
      WHERE otp = $1
      LIMIT 1
    `;

    const { rows } = await this.pgPool.query(sql, [otp]);

    if (rows.length === 0) return null;

    return plainToInstance(UserConfirmSignUp, rows[0], {
      excludeExtraneousValues: true,
    });
  }

  async deleteByOtp(otp: string, client?: PoolClient): Promise<void> {
    const executor = client ?? this.pgPool;

    await executor.query(`DELETE FROM user_confirm_sign_up WHERE otp = $1`, [
      otp,
    ]);
  }
}
