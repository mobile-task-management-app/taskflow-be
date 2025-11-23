from enum import Enum

from taskmanagerapi.core.exceptions.app_exception import AppException


class CommonExceptionType(Enum):
    INVALID_ARGUMENT = {"message": "{field} invalid: {reason}", "status": 400}


class AuthException(AppException):
    def __init__(self, exeption_type: CommonExceptionType, **kwargs):
        super().__init__(
            exeption_type.value["message"].format(**kwargs),
            exeption_type.value["status"],
            "common",
        )
