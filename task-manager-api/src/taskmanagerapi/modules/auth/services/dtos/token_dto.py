from dataclasses import dataclass


@dataclass
class TokenDTO:
    access_token: str
    refresh_token: str


@dataclass
class AccessTokenPayload:
    user_id: int


@dataclass
class RefreshTokenPayload:
    user_id: int
