from dataclasses import dataclass

from app.modules.auth.services.dtos.token_dto import TokenDTO


@dataclass
class Oauth2Token:
    access_token: str
    refresh_token: str


@dataclass
class GoogleUserInfo:
    fist_name: str
    last_name: str
    email: str
    image: str


@dataclass
class GoogleOauth2OutputDTO(TokenDTO):
    pass
