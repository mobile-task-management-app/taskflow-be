from logging import Logger
from typing import AsyncGenerator
import asyncpg
from fastapi import Depends, Request
from pydantic_core import CoreConfig

from app.core.context.user_context import UserContext
from app.core.server import Server
from app.core.storage.storage_service import GCSStorageService


async def get_db_conn(request: Request) -> AsyncGenerator[asyncpg.Connection]:
    server: Server = request.app.state.server
    async with server.db.acquire() as conn:
        yield conn


def get_server_config(request: Request) -> CoreConfig:
    cfg: CoreConfig = request.app.state.server.cfg
    return cfg


def get_logger(request: Request) -> Logger:
    logger: Logger = request.app.state.server.logger
    return logger


def get_gcs_storage_service(
    request: Request, cfg: CoreConfig = Depends(get_server_config)
) -> GCSStorageService:
    server: Server = request.app.state.server
    return GCSStorageService(server.gcs_client, cfg.gcs)


def get_user_context(request: Request) -> UserContext:
    user: UserContext = request.state.user
    return user
