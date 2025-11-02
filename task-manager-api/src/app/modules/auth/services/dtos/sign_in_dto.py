from dataclasses import dataclass

from app.modules.auth.services.dtos.token_dto import TokenDTO


@dataclass
class SignInInputDTO:
    email: str
    password: str


@dataclass
class SignInOutputDTO(TokenDTO):
    pass
