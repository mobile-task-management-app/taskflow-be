from dataclasses import dataclass
from datetime import datetime
from typing import Optional

from taskmanagerapi.modules.projects.db.models.project_create import ProjectCreate


@dataclass(kw_only=True)
class Project(ProjectCreate):
    id: int
    logo_storage_path: Optional[str] = None
    created_at: datetime
    updated_at: datetime
