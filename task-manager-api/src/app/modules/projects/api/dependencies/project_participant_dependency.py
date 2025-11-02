from asyncpg import Connection
from fastapi import Depends

from app.core.dependencies import get_db_conn
from app.modules.projects.db.repositories.project_participant_repository import (
    ProjectParticipantRepository,
)


def get_project_participant_repository(db_conn: Connection = Depends(get_db_conn)):
    return ProjectParticipantRepository(db_conn)
