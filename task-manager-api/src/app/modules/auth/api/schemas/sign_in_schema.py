from dacite import from_dict
from pydantic import BaseModel, EmailStr, Field

from app.modules.auth.services.dtos.sign_in_dto import SignInInputDTO, SignInOutputDTO


class SignInRequestSchema(BaseModel):
    email: EmailStr = Field(
        ...,
        description="email",
    )
    password: str = Field(..., min_length=8, description="password")

    def to_dto(self) -> SignInInputDTO:
        dto = from_dict(SignInInputDTO, self.model_dump())
        return dto


class SignInResponseSchema(BaseModel):
    access_token: str = Field(
        ...,
        description="JWT access token issued upon successful authentication",
    )
    refresh_token: str = Field(
        ...,
        description="JWT refresh token issued upon successful authentication",
    )

    @classmethod
    def from_dto(cls, dto: SignInOutputDTO) -> "SignInResponseSchema":
        return cls(
            access_token=dto.access_token,
            refresh_token=dto.refresh_token,
        )
