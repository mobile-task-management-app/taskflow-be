from asyncpg import Connection

from taskmanagerapi.core.db import BaseRepository
from taskmanagerapi.modules.documents.db.models.document import Document
from taskmanagerapi.modules.documents.db.models.document_create import DocumentCreate


class DocumentRepository(BaseRepository):
    def __init__(self, conn: Connection):
        super().__init__(conn=conn)

    async def bulk_create_document(self, document_creates: list[DocumentCreate]):
        names = [d.name for d in document_creates]
        project_ids = [d.project_id for d in document_creates]
        owner_ids = [d.owner_id for d in document_creates]
        extensions = [d.extension for d in document_creates]
        sizes = [d.size for d in document_creates]

        q = f"""
            WITH data AS (
                SELECT
                    unnest($1::text[]) AS name,
                    unnest($2::int[]) AS project_id,
                    unnest($3::int[]) AS owner_id,
                    unnest($4::text[]) AS extension,
                    unnest($5::int[]) AS size
            ),
            numbered AS (
                SELECT
                    name, project_id, owner_id, extension, size,
                    nextval('documents_id_seq') AS id
                FROM data
            )
            INSERT INTO documents (id, name, project_id, owner_id, extension, size, storage_path, created_at, updated_at)
            SELECT
                id,
                name,
                project_id,
                owner_id,
                extension,
                size,
                format('${DocumentCreate.get_storage_path_template()}', project_id, id, project_id, id, extension),
                now(),
                now()
            FROM numbered
            RETURNING *;
        """

        records = await self._conn.fetch(
            q, names, project_ids, owner_ids, extensions, sizes
        )
        return [Document(**r) for r in records]

    async def find_document_by_id(self, id: int) -> Document:
        q = "SELECT * FROM documents WHERE id = $1"
        record = await self._conn.fetchrow(q, id)
        d = Document(**record) if record else None
        return d
