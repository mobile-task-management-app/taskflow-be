from dataclasses import dataclass

from app.modules.projects.db.models.project_participant import ProjectParticipant
from app.modules.projects.db.models.project_participant_role import (
    ProjectParitipantRole,
)


@dataclass
class CreateProjectParticipantInputDTO:
    user_id: int
    project_id: int
    role: ProjectParitipantRole


@dataclass
class CreateProjectParticipantOuputDTO(ProjectParticipant):
    pass
