from dataclasses import asdict
from logging import Logger
import mimetypes
from taskmanagerapi.core.context.user_context import UserContext
from taskmanagerapi.core.storage.storage_service import GCSStorageService
from taskmanagerapi.modules.projects.db.models.project_create import ProjectCreate
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
from taskmanagerapi.modules.projects.services.dtos.create_project_dto import (
    CreateProjectInputDTO,
    CreateProjectOutputDTO,
)


class ProjectService:
    def __init__(
        self,
        project_repo: ProjectRepository,
        logger: Logger,
        project_participant_repo: ProjectParticipantRepository,
        storage_service: GCSStorageService,
    ):
        self.project_repo = project_repo
        self.logger = logger
        self.project_participant_repo = project_participant_repo
        self.storage_service = storage_service

    def get_mime_type_from_ext(self, extension):
        """
        Guesses the MIME type based on a file extension (e.g., '.png').
        Returns the MIME type string or None if the type is unknown.
        """
        # The guess_type function returns a tuple: (mime_type, encoding)
        mime_type, _ = mimetypes.guess_type(extension)
        return mime_type

    async def create_project(
        self, dto: CreateProjectInputDTO, user: UserContext
    ) -> CreateProjectOutputDTO:
        project_create = ProjectCreate(
            name=dto.name,
            description=dto.description,
            owner_id=user.id,
            start_date=dto.start_date,
            end_date=dto.end_date,
            tag_ids=dto.tag_ids,
        )
        async with self.project_repo.with_transaction():
            project = await self.project_repo.create_project(project_create)
            project_participant_create = ProjectParticipantCreate(
                user_id=user.id, project_id=project.id, role=ProjectParitipantRole.OWNER
            )
            await self.project_participant_repo.create_project_participant(
                project_participant_create
            )
        self.logger.info(f"user id={user.id} created project project_id={project.id}")
        output = CreateProjectOutputDTO(**asdict(project))
        if dto.has_logo:
            output.logo_put_url = self.storage_service.get_presign_url_put(
                project.logo_storage_path,
                content_type=self.get_mime_type_from_ext(project.logo_extension),
            )
        return output
