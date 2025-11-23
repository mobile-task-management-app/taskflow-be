from enum import Enum
from taskmanagerapi.core.exceptions.app_exception import AppException


class AuthExceptionType(Enum):
    INVALID_TOKEN = {
        "message": "invalid token",
        "status": 401,
    }
    EXPIRE_TOKEN = {"message": "token expire", "status": 401}
    INVALID_GOOGLE_AUTH_CODE = {"message": "invalid google auth code", "status": 401}

    INVALID_EMAIL_OR_PASSWORD = {
        "message": "invalid email or password",
        "status": 401,
    }
    EMAIL_ALREADY_EXISTS = {
        "message": "email already exists",
        "status": 400,
    }
    INVALID_AUTH_INFO = {"message": "{field} invalid: {reason}", "status": 400}
    MISSING_TOKEN = {
        "message": "missing or invalid Authorization header",
        "status": 400,
    }


class AuthException(AppException):
    def __init__(self, exeption_type: AuthExceptionType, **kwargs):
        super().__init__(
            exeption_type.value["message"].format(**kwargs),
            exeption_type.value["status"],
            "auth",
        )
