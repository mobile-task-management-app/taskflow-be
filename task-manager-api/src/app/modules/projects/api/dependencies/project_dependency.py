from logging import Logger
from asyncpg import Connection
from fastapi import Depends

from app.core.dependencies import get_db_conn, get_gcs_storage_service, get_logger
from app.core.storage.storage_service import GCSStorageService
from app.modules.projects.api.dependencies.project_participant_dependency import (
    get_project_participant_repository,
)
from app.modules.projects.db.repositories.project_participant_repository import (
    ProjectParticipantRepository,
)
from app.modules.projects.db.repositories.project_repository import ProjectRepository
from app.modules.projects.services.project_service import ProjectService


def get_project_repository(db_conn: Connection = Depends(get_db_conn)):
    return ProjectRepository(db_conn)


def get_project_service(
    project_repo: ProjectRepository = Depends(get_project_repository),
    logger: Logger = Depends(get_logger),
    project_participant_repo: ProjectParticipantRepository = Depends(
        get_project_participant_repository
    ),
    storage_service: GCSStorageService = Depends(get_gcs_storage_service),
):
    return ProjectService(
        project_repo, logger, project_participant_repo, storage_service
    )
