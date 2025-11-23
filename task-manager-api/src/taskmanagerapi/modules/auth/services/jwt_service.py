from dataclasses import asdict, dataclass
import datetime
from taskmanagerapi.core.configs.jwt_config import JWTConfig
from taskmanagerapi.core.exceptions.auth_exception import (
    AuthException,
    AuthExceptionType,
)
import jwt

from taskmanagerapi.modules.auth.services.dtos.token_dto import (
    AccessTokenPayload,
    RefreshTokenPayload,
)


class JwtService:
    def __init__(self, jwt_config: JWTConfig):
        self.jwt_config = jwt_config

    def _encode(self, payload: AccessTokenPayload | RefreshTokenPayload) -> str:
        if isinstance(payload, AccessTokenPayload):
            secret = self.jwt_config.access_token_secret
            age = self.jwt_config.access_token_age
            token_type = "access_token"
        else:
            secret = self.jwt_config.refresh_token_secret
            age = self.jwt_config.refresh_token_age
            token_type = "refresh_token"
        claims = asdict(payload)
        claims.update(
            {
                "exp": datetime.datetime.now() + datetime.timedelta(seconds=age),
                "type": token_type,
            }
        )
        return jwt.encode(claims, secret, algorithm="HS256")

    def _decode(
        self, token: str, token_type: str
    ) -> AccessTokenPayload | RefreshTokenPayload:
        if token_type == "access_token":
            secret = self.jwt_config.access_token_secret
        else:
            secret = self.jwt_config.refresh_token_secret
        try:
            decoded = jwt.decode(token, secret, algorithms=["HS256"])
            if token_type == "access_token":
                return AccessTokenPayload(user_id=decoded["user_id"])
            else:
                return RefreshTokenPayload(user_id=decoded["user_id"])
        except jwt.ExpiredSignatureError:
            raise AuthException(AuthExceptionType.EXPIRE_TOKEN)
        except jwt.InvalidTokenError as e:
            raise AuthException(AuthExceptionType.INVALID_TOKEN)

    def generate_access_token(self, payload: AccessTokenPayload) -> str:
        return self._encode(payload)

    def generate_refresh_token(self, payload: RefreshTokenPayload) -> str:
        return self._encode(payload)

    def verify_access_token(self, token: str) -> AccessTokenPayload:
        return self._decode(token, "access_token")  # type: ignore

    def verify_refresh_token(self, token: str) -> RefreshTokenPayload:
        return self._decode(token, "refresh_token")  # type: ignore
