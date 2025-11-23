from dataclasses import asdict
from asyncpg import Connection

from taskmanagerapi.core.db import BaseRepository
from taskmanagerapi.modules.users.db.models.user import User
from taskmanagerapi.modules.users.db.models.user_create import UserCreate
from taskmanagerapi.modules.users.db.models.user_update import UserUpdate


class UserRepository(BaseRepository):
    def __init__(self, conn: Connection):
        super().__init__(conn=conn)

    async def find_user_by_email(self, email) -> User:
        q = "SELECT * FROM users WHERE email = $1"
        record = await self._conn.fetchrow(q, email)
        u = User(**record) if record else None
        return u

    async def create_user(self, user: UserCreate) -> User:
        q = """
        INSERT INTO users (first_name, last_name, email, password, auth_provider, image, google_refresh_token,created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, now(), now())
        RETURNING *
        """
        record = await self._conn.fetchrow(
            q,
            user.first_name,
            user.last_name,
            user.email,
            user.password,
            user.auth_provider,
            user.image,
            user.google_refresh_token,
        )
        return User(**record)

    async def update_user(self, user_update: UserUpdate) -> User:
        fields_to_update = [
            (k, v)
            for k, v in asdict(user_update).items()
            if k != "id" and v is not None
        ]
        args = []
        update_stmts = []
        for i, (k, v) in enumerate(fields_to_update, start=1):
            update_stmts.append(f"{k} = ${i}")
            args.append(v)

        update_stmts.append("updated_at = now()")

        set_stmt = ",".join(update_stmts)

        args.append(user_update.id)

        q = f"""
        UPDATE users 
        SET {set_stmt}
        WHERE id = ${len(args)}
        RETURNING *
        """
        record = await self._conn.fetchrow(q, *args)
        return User(**record)
