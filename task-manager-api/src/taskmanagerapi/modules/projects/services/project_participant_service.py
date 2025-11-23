from dataclasses import asdict
from logging import Logger
from taskmanagerapi.core.context.user_context import UserContext
from taskmanagerapi.core.exceptions.project_exception import (
    ProjectException,
    ProjectExceptionType,
)
from taskmanagerapi.modules.projects.db.models.project_participant_create import (
    ProjectParticipantCreate,
)
from taskmanagerapi.modules.projects.db.models.project_participant_role import (
    ProjectParitipantRole,
)
from taskmanagerapi.modules.projects.db.repositories.project_participant_repository import (
    ProjectParticipantRepository,
)
from taskmanagerapi.modules.projects.db.repositories.project_repository import (
    ProjectRepository,
)
from taskmanagerapi.modules.projects.services.dtos.create_project_participant_dto import (
    CreateProjectParticipantInputDTO,
    CreateProjectParticipantOuputDTO,
)


class ProjectParticipantService:
    def __init__(
        self,
        project_repo: ProjectRepository,
        project_participant_repo: ProjectParticipantRepository,
        logger: Logger,
    ):
        self.project_repo = project_repo
        self.project_participant_repo = project_participant_repo
        self.logger = logger

    async def create_project_participant(
        self, dto: CreateProjectParticipantInputDTO, user: UserContext
    ) -> CreateProjectParticipantOuputDTO:
        project = await self.project_repo.find_project_by_id(dto.project_id)
        if not project:
            raise ProjectException(ProjectExceptionType.PROJECT_NOT_EXIST)
        # check user permission
        owner_project_participant = (
            await self.project_participant_repo.find_project_participant_by_id(
                user.id, dto.project_id
            )
        )
        if (
            not owner_project_participant
            or owner_project_participant.role != ProjectParitipantRole.OWNER
        ):
            raise ProjectException(
                ProjectExceptionType.USER_CANNOT_ADD_PROJECT_PARTICIPANT
            )
        # check participant exist
        exist_participant = (
            await self.project_participant_repo.find_project_participant_by_id(
                dto.user_id, dto.project_id
            )
        )
        if exist_participant:
            raise ProjectException(ProjectExceptionType.PROJECT_PARTIPANT_EXIST)

        create_project_participant = ProjectParticipantCreate(
            user_id=dto.user_id, project_id=dto.project_id, role=dto.role
        )
        new_project_participant = (
            await self.project_participant_repo.create_project_participant(
                create_project_participant
            )
        )
        self.logger.info(
            f"user {user.id} add participant {dto.user_id} to project {dto.project_id} with role {dto.role.value}"
        )
        return CreateProjectParticipantOuputDTO(**asdict(new_project_participant))
