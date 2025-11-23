from asyncpg import Connection
from taskmanagerapi.core.db import BaseRepository

from taskmanagerapi.modules.projects.db.models.project_participant import (
    ProjectParticipant,
)
from taskmanagerapi.modules.projects.db.models.project_participant_create import (
    ProjectParticipantCreate,
)


class ProjectParticipantRepository(BaseRepository):
    def __init__(self, conn: Connection):
        super().__init__(conn)

    async def create_project_participant(
        self, create_participant: ProjectParticipantCreate
    ) -> ProjectParticipant:
        q = """
            INSERT INTO project_participants(user_id, project_id, role, created_at, updated_at)
            VALUES ($1, $2, $3, now(), now())
            RETURNING *
        """
        record = await self._conn.fetchrow(
            q,
            create_participant.user_id,
            create_participant.project_id,
            create_participant.role,
        )
        return ProjectParticipant(**record)

    async def find_project_participant_by_id(
        self, user_id: int, project_id: int
    ) -> ProjectParticipant:
        q = """
            SELECT *
            FROM project_participants
            WHERE user_id    = $1
              AND project_id = $2
        """
        record = await self._conn.fetchrow(
            q,
            user_id,
            project_id,
        )
        return ProjectParticipant(**record) if record is not None else None
