from dacite import from_dict
from pydantic import BaseModel, EmailStr, Field

from taskmanagerapi.modules.auth.services.dtos.sign_up_dto import (
    SignUpInputDTO,
    SignUpOutputDTO,
)


class SignUpRequestSchema(BaseModel):
    email: EmailStr = Field(
        ...,
        description="email",
    )
    password: str = Field(..., min_length=8, description="password")
    first_name: str = Field(..., description="first name")
    last_name: str = Field(..., description="last name")

    def to_dto(self) -> SignUpInputDTO:
        dto = from_dict(SignUpInputDTO, self.model_dump())
        return dto


class SignUpResponseSchema(BaseModel):
    access_token: str = Field(
        ...,
        description="JWT access token issued upon successful authentication",
    )
    refresh_token: str = Field(
        ...,
        description="JWT refresh token issued upon successful authentication",
    )

    @classmethod
    def from_dto(cls, dto: SignUpOutputDTO) -> "SignUpResponseSchema":
        return cls(
            access_token=dto.access_token,
            refresh_token=dto.refresh_token,
        )
