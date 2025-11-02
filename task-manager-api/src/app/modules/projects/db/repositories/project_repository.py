from asyncpg import Connection
from app.core.db import BaseRepository
from app.modules.projects.db.models.project import Project
from app.modules.projects.db.models.project_create import ProjectCreate


class ProjectRepository(BaseRepository):
    def __init__(self, conn: Connection):
        super().__init__(conn)

    async def create_project(self, project_create: ProjectCreate) -> Project:
        q = """
            WITH next_id AS (
                -- 1. Claim the next ID from the sequence
                SELECT nextval('projects_id_seq') AS id 
            )
            INSERT INTO projects(id, name, owner_id, description, start_date, end_date, logo_extension, logo_storage_path, tag_ids, created_at, updated_at)
            SELECT
                -- Use the claimed ID
                ni.id,
                $1, -- name
                $2, -- owner_id
                $3, -- description
                $4, -- start_date
                $5, -- end_date
                $6, -- logo_extension
                -- 2. Calculate the path (with NULL check)
                CASE 
                    WHEN $6 IS NULL THEN NULL 
                    ELSE 'projects/' || ni.id || '/logo/logo_' || ni.id || $6
                END,
                $7,
                NOW(),
                NOW()
            FROM
                next_id ni
            -- 3. Return the complete, inserted row
            RETURNING *;
        """
        record = await self._conn.fetchrow(
            q,
            project_create.name,
            project_create.owner_id,
            project_create.description,
            project_create.start_date,
            project_create.end_date,
            project_create.logo_extension,
            project_create.tag_ids,
        )
        return Project(**record)

    async def find_project_by_id(self, id: int):
        q = """
            SELECT *
            FROM projects
            WHERE id = $1
        """
        record = await self._conn.fetchrow(q, id)
        return Project(**record) if record is not None else None
