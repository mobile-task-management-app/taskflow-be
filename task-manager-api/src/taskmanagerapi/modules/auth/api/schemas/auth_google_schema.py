from pydantic import BaseModel, Field

from taskmanagerapi.modules.auth.services.dtos.token_dto import TokenDTO


class AuthGoolgleRequestSchema(BaseModel):
    code: str = Field(
        ...,
        description="auth code",
    )
    code_verifier: str = Field(
        ...,
        description="code verifier",
    )


class AuthGoogleResponseSchema(BaseModel):
    access_token: str = Field(
        ...,
        description="JWT access token issued upon successful authentication",
    )
    refresh_token: str = Field(
        ...,
        description="JWT refresh token issued upon successful authentication",
    )

    @classmethod
    def from_dto(cls, dto: TokenDTO) -> "AuthGoogleResponseSchema":
        return cls(
            access_token=dto.access_token,
            refresh_token=dto.refresh_token,
        )
