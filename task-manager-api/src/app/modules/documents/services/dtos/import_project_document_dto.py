from dataclasses import dataclass

from app.modules.documents.db.models.document_import_task import DocumentImportTask


@dataclass
class ImportProjectDocumentInputDTO:
    project_id: int
    document_id: int


class ImportProjectDocumentOutputDTO(DocumentImportTask):
    pass
