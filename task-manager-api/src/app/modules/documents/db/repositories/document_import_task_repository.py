from asyncpg import Connection
from app.core.db import BaseRepository
from app.modules.documents.db.models.document_import_task import DocumentImportTask
from app.modules.documents.db.models.document_import_task_create import (
    DocumentImportTaskCreate,
)
from app.modules.documents.db.models.document_import_task_status import (
    DocumentImportTaskStatus,
)


class DocumentImportTaskRepository(BaseRepository):
    def __init__(self, conn: Connection):
        super().__init__(conn)

    async def create_document_import_task(
        self, document_import_task: DocumentImportTaskCreate
    ) -> DocumentImportTask:
        q = """
            INSERT INTO document_import_tasks (document_id, user_create_id, status, detail, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, now(), now())
            RETURNING *
        """
        record = await self._conn.fetchrow(
            q,
            document_import_task.document_id,
            document_import_task.user_create_id,
            document_import_task.status,
        )
        return DocumentImportTask(**record)

    async def update_document_import_status(
        self, task_id: int, status: DocumentImportTaskStatus, detail: str
    ):
        q = """
            UPDATE document_import_tasks
            SET status = $2
            ,   detail = $3
            ,   updated_at = now()
            WHERE 1 = 1
            AND  id = $1
            RETURNING *
        """
        record = await self._conn.fetchrow(q, task_id, status, detail)
        return DocumentImportTask(**record)

    async def find_document_import_task_by_project_document_id(
        self, project_id: int, document_id: int
    ) -> DocumentImportTask:
        q = """
            SELECT * 
            FROM document_import_tasks
            WHERE 1 = 1
            AND project_id = $1
            AND document_id = $2
        """
        record = await self._conn.fetchrow(q, project_id, document_id)
        return DocumentImportTask(**record) if record else None
