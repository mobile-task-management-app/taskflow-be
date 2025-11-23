from asyncpg import Connection
from fastapi import Depends

from taskmanagerapi.core.dependencies import get_db_conn
from taskmanagerapi.modules.projects.db.repositories.project_participant_repository import (
    ProjectParticipantRepository,
)


def get_project_participant_repository(db_conn: Connection = Depends(get_db_conn)):
    return ProjectParticipantRepository(db_conn)
