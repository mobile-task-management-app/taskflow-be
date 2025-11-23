from enum import Enum
from typing import Callable
import asyncpg
from asyncpg import Connection, Pool
from asyncpg.transaction import Transaction

from taskmanagerapi.core.configs.db_config import DBConfig
from abc import ABC

from taskmanagerapi.modules.projects.db.models.project_participant_role import (
    ProjectParitipantRole,
)


async def register_db_enum(
    conn: asyncpg.Connection,
    enum_class: Enum,
    pg_type_name: str,
    schema: str = "public",
):
    """Helper to register a type codec for a PostgreSQL ENUM."""

    # 1. The encoder converts the Python Enum value to a string for PostgreSQL
    encoder: Callable = lambda e: e.value

    # 2. The decoder converts the string retrieved from PostgreSQL back into
    #    the correct Python Enum class.
    decoder = enum_class

    await conn.set_type_codec(
        pg_type_name,
        schema=schema,
        encoder=encoder,
        decoder=decoder,
        format="text",
    )


async def init_db_pool(db_cfg: DBConfig) -> Pool:
    return await asyncpg.create_pool(
        dsn=db_cfg.endpoint,
        min_size=db_cfg.min_size,
        max_size=db_cfg.max_size,
        init=lambda conn: register_db_enum(
            conn, ProjectParitipantRole, "project_participant_role"
        ),
        statement_cache_size=0,
    )


class BaseRepository(ABC):
    def __init__(self, conn: Connection):
        self._conn = conn

    def with_transaction(self) -> Transaction:
        return self._conn.transaction()
