from dataclasses import dataclass

from taskmanagerapi.modules.auth.services.dtos.token_dto import TokenDTO


@dataclass
class SignUpInputDTO:
    first_name: str
    last_name: str
    email: str
    password: str


@dataclass
class SignUpOutputDTO(TokenDTO):
    pass
