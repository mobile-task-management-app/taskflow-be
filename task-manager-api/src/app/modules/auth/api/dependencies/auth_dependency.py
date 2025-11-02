from logging import Logger
from asyncpg import Connection
from fastapi import Depends

from app.core.configs.core_config import CoreConfig

from app.core.dependencies import get_db_conn, get_logger, get_server_config
from app.modules.auth.services.auth_service import AuthService
from app.modules.auth.services.google_oauth2_service import GoogleOauth2Service
from app.modules.auth.services.jwt_service import JwtService
from app.modules.users.db.repositories.user_repository import UserRepository


def get_user_repository(db_conn: Connection = Depends(get_db_conn)):
    return UserRepository(db_conn)


def get_jwt_service(cfg: CoreConfig = Depends(get_server_config)):
    return JwtService(cfg.jwt)


def get_google_oauth2_service(cfg: CoreConfig = Depends(get_server_config)):
    return GoogleOauth2Service(cfg.oauth2)


def get_auth_services(
    user_repository: UserRepository = Depends(get_user_repository),
    jwt_service: JwtService = Depends(get_jwt_service),
    google_oauth2_service: GoogleOauth2Service = Depends(get_google_oauth2_service),
    logger: Logger = Depends(get_logger),
):
    return AuthService(
        user_repo=user_repository,
        jwt_service=jwt_service,
        oauth2_service=google_oauth2_service,
        logger=logger,
    )
