from dataclasses import dataclass

from app.modules.projects.db.models.project_participant_role import (
    ProjectParitipantRole,
)


@dataclass
class ProjectParticipantCreate:
    user_id: int
    project_id: int
    role: ProjectParitipantRole
