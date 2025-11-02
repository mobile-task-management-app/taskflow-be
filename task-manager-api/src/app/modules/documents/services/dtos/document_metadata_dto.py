from dataclasses import dataclass


@dataclass
class DocumentMetaDataDTO:
    project_id: int
    owner_id: int
    document_id: int
    extension: str
    storage_path: str
