from concurrent.futures import ThreadPoolExecutor
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.exceptions import RequestValidationError

from taskmanagerapi.core import exception_handler
from taskmanagerapi.core.configs.core_config import CoreConfig
from taskmanagerapi.core.cors import CORS_CONFIG
from taskmanagerapi.core.db import init_db_pool
from taskmanagerapi.core.exceptions.app_exception import AppException
from taskmanagerapi.core.logger import init_logger
from taskmanagerapi.core.middlewares.auth_middleware import AuthMiddleware
from taskmanagerapi.core.server import Server
from taskmanagerapi.core.storage.storage_service import initialize_gcs_client
from taskmanagerapi.modules.auth.api.routes.auth_route import router as auth_router
from taskmanagerapi.modules.projects.api.routes.project_route import (
    router as projects_router,
)

from fastapi.middleware.cors import CORSMiddleware


@asynccontextmanager
async def lifespan(app: FastAPI):
    cfg = CoreConfig()
    db = await init_db_pool(cfg.db)
    logger = init_logger(cfg.logger)
    gcs_client = initialize_gcs_client()
    background_executor = ThreadPoolExecutor(max_workers=10)
    server = Server(db, cfg, logger, gcs_client, background_executor)
    app.state.server = server
    yield
    await db.close()
    background_executor.shutdown(wait=True)


def create_app() -> FastAPI:
    app = FastAPI(root_path="/api/v1", lifespan=lifespan)
    app.add_middleware(CORSMiddleware, **CORS_CONFIG)
    app.add_middleware(AuthMiddleware)
    app.include_router(prefix="/auth", router=auth_router, tags=["auth"])
    app.include_router(prefix="/projects", router=projects_router, tags=["projects"])
    app.add_exception_handler(
        RequestValidationError, exception_handler.pydantic_validation_exception_handler
    )
    app.add_exception_handler(HTTPException, exception_handler.http_exception_handler)
    app.add_exception_handler(AppException, exception_handler.app_exception_handler)
    app.add_exception_handler(Exception, exception_handler.base_exception_handler)

    return app
