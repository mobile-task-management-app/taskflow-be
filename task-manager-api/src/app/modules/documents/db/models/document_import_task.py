from dataclasses import dataclass
from datetime import datetime
from app.modules.documents.db.models.document_import_task_create import (
    DocumentImportTaskCreate,
)


@dataclass(kw_only=True)
class DocumentImportTask(DocumentImportTaskCreate):
    id: int
    created_at: datetime
    updated_at: datetime
