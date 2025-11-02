from fastapi import APIRouter, Depends

from app.core.context.user_context import UserContext
from app.core.dependencies import get_user_context
from app.core.schemas.app_response_schema import AppResponseSchema
from app.modules.projects.api.dependencies.project_dependency import get_project_service
from app.modules.projects.api.schemas.create_project_schema import (
    CreateProjectRequestSchema,
    CreateProjectResponseSchema,
)
from app.modules.projects.services.project_service import ProjectService


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
