from datetime import date
from typing import List, Optional
from dacite import from_dict
from pydantic import BaseModel, Field

from taskmanagerapi.core.exceptions.project_exception import (
    ProjectException,
    ProjectExceptionType,
)
from taskmanagerapi.modules.projects.api.schemas.project_schema import ProjectSchema
from taskmanagerapi.modules.projects.services.dtos.create_project_dto import (
    CreateProjectInputDTO,
)

ALLOW_lOGO_EXTENSION = ["png", "jpg"]


class CreateProjectRequestSchema(BaseModel):
    name: str = Field(
        ..., description="The official name of the project.", min_length=3
    )
    description: str = Field(
        "",
        description="A detailed summary of the project's purpose, scope, and goals.",
        max_length=100,
    )

    start_date: Optional[date] = Field(
        None, description="The optional planned or actual start date for the project."
    )
    end_date: Optional[date] = Field(
        None,
        description="The optional planned or actual completion date for the project.",
    )
    tag_ids: List[str] = Field(
        [],
        description="A list of string IDs used to categorize or label the project (e.g., ['backend', 'urgent']).",
    )
    has_logo: bool = Field(False, description="if project have logo true")

    logo_extension: Optional[str] = Field(None, description="logo extension")

    def to_dto(self) -> CreateProjectInputDTO:
        if self.has_logo:
            if not self.logo_extension:
                raise ProjectException(
                    ProjectExceptionType.PROJECT_LOGO_EXTENSION_IS_REQUIRED
                )

            if self.logo_extension not in ALLOW_lOGO_EXTENSION:
                raise ProjectException(
                    ProjectExceptionType.PROJECT_LOGO_EXTENSION_NOT_ALLOWED
                )
        return from_dict(CreateProjectInputDTO, self.model_dump())


class CreateProjectResponseSchema(ProjectSchema):
    logo_put_url: Optional[str] = Field(None, description="put logo url")
