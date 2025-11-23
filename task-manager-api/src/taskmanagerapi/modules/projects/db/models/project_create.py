from dataclasses import dataclass, field
from datetime import date
from typing import Optional


@dataclass(kw_only=True)
class ProjectCreate:
    name: str
    description: str
    owner_id: str
    logo_extension: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    tag_ids: list[str] = field(default_factory=list)
