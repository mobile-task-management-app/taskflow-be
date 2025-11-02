from dataclasses import dataclass, field
from datetime import date
from typing import List, Optional

from app.modules.projects.db.models.project import Project


@dataclass
class CreateProjectInputDTO:
    name: str
    description: str
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    tag_ids: list[str] = field(default_factory=list)
    has_logo: bool = False
    logo_extension: Optional[str] = None


@dataclass(kw_only=True)
class CreateProjectOutputDTO(Project):
    logo_put_url: Optional[str] = None
