from fastapi import APIRouter, Depends

from taskmanagerapi.core.context.user_context import UserContext
from taskmanagerapi.core.dependencies import get_user_context
from taskmanagerapi.core.schemas.app_response_schema import AppResponseSchema
from taskmanagerapi.modules.projects.api.dependencies.project_dependency import (
    get_project_service,
)
from taskmanagerapi.modules.projects.api.schemas.create_project_schema import (
    CreateProjectRequestSchema,
    CreateProjectResponseSchema,
)
from taskmanagerapi.modules.projects.services.project_service import ProjectService


router = APIRouter()


@router.post(
    "/add",
    response_model=AppResponseSchema[CreateProjectResponseSchema],
    status_code=201,
)
async def create_project(
    request: CreateProjectRequestSchema,
    project_service: ProjectService = Depends(get_project_service),
    user: UserContext = Depends(get_user_context),
):
    result = await project_service.create_project(request.to_dto(), user)
    response = CreateProjectResponseSchema.model_validate(
        result,
        update={
            "logo_put_url": result.logo_put_url,
        },
    )
    return AppResponseSchema(
        success=True, message="success create project", data=response
    )
