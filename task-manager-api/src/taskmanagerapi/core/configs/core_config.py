from typing import Literal
from pydantic_settings import BaseSettings

from taskmanagerapi.core.configs.db_config import DBConfig
from taskmanagerapi.core.configs.gcs_config import GCSConfig
from taskmanagerapi.core.configs.google_oauth2_config import GoogleOauth2Config
from taskmanagerapi.core.configs.jwt_config import JWTConfig
from taskmanagerapi.core.configs.logger_config import LoggerConfig


class CoreConfig(BaseSettings):
    app_name: str = "task-manager-api"
    host: str = "0.0.0.0"
    port: int = 8000
    env: Literal["dev", "stg", "prd"] = "dev"
    db: DBConfig
    jwt: JWTConfig
    oauth2: GoogleOauth2Config
    logger: LoggerConfig
    gcs: GCSConfig

    class Config:
        env_nested_delimiter = "__"
        env = ".env"
