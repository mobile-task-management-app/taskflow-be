from dataclasses import dataclass

from app.modules.documents.db.models.document_import_task_status import (
    DocumentImportTaskStatus,
)


@dataclass(kw_only=True)
class DocumentImportTaskCreate:
    document_id: int
    user_create_id: int
    status: DocumentImportTaskStatus
    detail: str = ""
