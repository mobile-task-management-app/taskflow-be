from dataclasses import dataclass
from datetime import datetime

from app.modules.documents.db.models.document import Document


@dataclass
class UploadDocumentDTO:
    name: str
    extension: str
    size: str


@dataclass
class BulkUploadProjectDocumentsInputDTO:
    project_id: int
    documents: list[UploadDocumentDTO]


@dataclass
class UploadProjectDocumentOutputDTO(Document):
    put_object_url: str
    expire_at: datetime


@dataclass
class BulkUploadProjectDocumentsOutputDTO:
    documents: list[UploadProjectDocumentOutputDTO]
