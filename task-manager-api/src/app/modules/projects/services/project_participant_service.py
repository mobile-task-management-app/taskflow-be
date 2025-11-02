from dataclasses import asdict
from logging import Logger
from app.core.context.user_context import UserContext
from app.core.exceptions.project_exception import ProjectException, ProjectExceptionType
from app.modules.projects.db.models.project_participant_create import (
    ProjectParticipantCreate,
)
from app.modules.projects.db.models.project_participant_role import (
    ProjectParitipantRole,
)
from app.modules.projects.db.repositories.project_participant_repository import (
    ProjectParticipantRepository,
)
from app.modules.projects.db.repositories.project_repository import ProjectRepository
from app.modules.projects.services.dtos.create_project_participant_dto import (
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
