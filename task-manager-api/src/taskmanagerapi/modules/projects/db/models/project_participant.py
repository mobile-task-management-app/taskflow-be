from dataclasses import dataclass
from datetime import datetime

from taskmanagerapi.modules.projects.db.models.project_participant_create import (
    ProjectParticipantCreate,
)


@dataclass
class ProjectParticipant(ProjectParticipantCreate):
    created_at: datetime
    updated_at: datetime
