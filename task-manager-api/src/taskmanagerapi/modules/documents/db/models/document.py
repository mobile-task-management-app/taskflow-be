from dataclasses import dataclass
from datetime import datetime
import mimetypes
from taskmanagerapi.modules.documents.db.models.document_create import DocumentCreate


@dataclass
class Document(DocumentCreate):
    id: int
    storage_path: str
    created_at: datetime
    updated_at: datetime

    def get_mime_type(self) -> str:
        return mimetypes.guess_type(self.name)
