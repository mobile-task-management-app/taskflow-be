from fastapi import APIRouter, Depends

from app.core.schemas.app_response_schema import AppResponseSchema
from app.modules.auth.api.dependencies.auth_dependency import get_auth_services
from app.modules.auth.api.schemas.auth_google_schema import (
    AuthGoogleResponseSchema,
    AuthGoolgleRequestSchema,
)
from app.modules.auth.api.schemas.sign_in_schema import (
    SignInRequestSchema,
    SignInResponseSchema,
)
from app.modules.auth.api.schemas.sign_up_schema import (
    SignUpRequestSchema,
    SignUpResponseSchema,
)
from app.modules.auth.services.auth_service import AuthService


router = APIRouter()


@router.post(
    "/google-auth",
    status_code=201,
    response_model=AppResponseSchema[AuthGoogleResponseSchema],
)
async def exchange_code(
    request: AuthGoolgleRequestSchema,
    auth_service: AuthService = Depends(get_auth_services),
):
    result = await auth_service.authenticate_user_with_google(request.code)
    response = AuthGoogleResponseSchema.from_dto(result)
    return AppResponseSchema(
        success=True, message="auth with google success", data=response
    )


@router.post(
    "/sign-up", status_code=201, response_model=AppResponseSchema[SignUpResponseSchema]
)
async def sign_up(
    request: SignUpRequestSchema, auth_service: AuthService = Depends(get_auth_services)
):
    result = await auth_service.sign_up(request.to_dto())
    response = SignUpResponseSchema.from_dto(result)
    return AppResponseSchema(success=True, message="sign up success", data=response)


@router.post(
    "/sign-in", status_code=201, response_model=AppResponseSchema[SignInResponseSchema]
)
async def sign_up(
    request: SignInRequestSchema, auth_service: AuthService = Depends(get_auth_services)
):
    result = await auth_service.sign_in(request.to_dto())
    response = SignInResponseSchema.from_dto(result)
    return AppResponseSchema(success=True, message="sign in success", data=response)
