from logging import Logger
from math import e
from taskmanagerapi.core.exceptions.auth_exception import (
    AuthException,
    AuthExceptionType,
)
from taskmanagerapi.modules.auth.services.dtos.oauth2_google_dto import (
    GoogleOauth2OutputDTO,
)
from taskmanagerapi.modules.auth.services.dtos.sign_in_dto import (
    SignInInputDTO,
    SignInOutputDTO,
)
from taskmanagerapi.modules.auth.services.dtos.sign_up_dto import (
    SignUpInputDTO,
    SignUpOutputDTO,
)
from taskmanagerapi.modules.auth.services.google_oauth2_service import (
    GoogleOauth2Service,
)
from taskmanagerapi.modules.auth.services.jwt_service import (
    AccessTokenPayload,
    JwtService,
    RefreshTokenPayload,
)
from taskmanagerapi.modules.users.db.models.user import User
from taskmanagerapi.modules.users.db.models.user_create import UserCreate
from taskmanagerapi.modules.users.db.models.user_update import UserUpdate
from taskmanagerapi.modules.users.db.repositories.user_repository import UserRepository


class AuthService:
    def __init__(
        self,
        user_repo: UserRepository,
        jwt_service: JwtService,
        oauth2_service: GoogleOauth2Service,
        logger: Logger,
    ):
        self.user_repo = user_repo
        self.jwt_service = jwt_service
        self.oauth2_service = oauth2_service
        self.logger = logger

    async def authenticate_user_with_google(self, code: str):
        oauth2_token = await self.oauth2_service.exchange_token(code)
        google_user_info = await self.oauth2_service.get_user_info(
            oauth2_token.access_token
        )
        user = await self.user_repo.find_user_by_email(google_user_info.email)
        if not user:
            self.logger.info(f"creating new user for email: {google_user_info.email}")
            user = User.user_with_google(google_user_info)
            user.google_refresh_token = oauth2_token.refresh_token
            user = await self.user_repo.create_user(user)
            self.logger.info(f"created new user with id: {user.id}")
        access_token = self.jwt_service.generate_access_token(
            AccessTokenPayload(user.id)
        )
        refresh_token = self.jwt_service.generate_refresh_token(
            RefreshTokenPayload(user.id)
        )
        self.logger.info(f"user {user.id} authenticated with google successfully")
        return GoogleOauth2OutputDTO(
            access_token=access_token, refresh_token=refresh_token
        )

    async def sign_up(self, dto: SignUpInputDTO) -> SignUpOutputDTO:
        existing_user = await self.user_repo.find_user_by_email(dto.email)
        if existing_user:
            raise AuthException(AuthExceptionType.EMAIL_ALREADY_EXISTS)
        user_create = UserCreate.user_with_auth_local(dto)

        async with self.user_repo.with_transaction():
            new_user = await self.user_repo.create_user(user_create)
            self.logger.info(f"user {new_user.id} created")

            access_token = self.jwt_service.generate_access_token(
                AccessTokenPayload(new_user.id)
            )
            refresh_token = self.jwt_service.generate_refresh_token(
                RefreshTokenPayload(new_user.id)
            )
            update_user = UserUpdate(new_user.id, current_refresh_token=refresh_token)
            new_user = await self.user_repo.update_user(update_user)

        self.logger.info(f"user {new_user.id} sign up successfully")
        return SignUpOutputDTO(access_token=access_token, refresh_token=refresh_token)

    async def sign_in(self, dto: SignInInputDTO) -> SignInOutputDTO:
        user = await self.user_repo.find_user_by_email(dto.email)
        if not user:
            raise AuthException(AuthExceptionType.INVALID_EMAIL_OR_PASSWORD)
        if not user.verify_password(dto.password):
            raise AuthException(AuthExceptionType.INVALID_EMAIL_OR_PASSWORD)

        access_token = self.jwt_service.generate_access_token(
            AccessTokenPayload(user.id)
        )
        refresh_token = self.jwt_service.generate_refresh_token(
            RefreshTokenPayload(user.id)
        )
        update_user = UserUpdate(user.id, current_refresh_token=refresh_token)
        await self.user_repo.update_user(update_user)
        return SignInOutputDTO(access_token=access_token, refresh_token=refresh_token)
