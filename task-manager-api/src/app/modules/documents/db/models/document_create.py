from dataclasses import dataclass


@dataclass
class DocumentCreate:
    name: str
    project_id: int
    owner_id: int
    extension: str
    size: int

    @classmethod
    def get_storage_path_template(cls) -> str:
        return "/projects/%d/documents/%d/%d_documents_%d.%s"
