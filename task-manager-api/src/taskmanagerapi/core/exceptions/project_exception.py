from enum import Enum

from taskmanagerapi.core.exceptions.app_exception import AppException


class ProjectExceptionType(Enum):
    PROJECT_NOT_EXIST = {
        "message": "project not exist",
        "status": 404,
    }
    USER_CANNOT_ADD_PROJECT_PARTICIPANT = {
        "message": "user cannot add project participant",
        "status": 403,
    }
    PROJECT_PARTIPANT_EXIST = {"message": "project participant exist", "status": 400}
    PROJECT_LOGO_EXTENSION_IS_REQUIRED = {
        "message": "logo extension is required",
        "status": 400,
    }
    PROJECT_LOGO_EXTENSION_NOT_ALLOWED = {
        "message": "logo extension not allowed",
        "status": 400,
    }
    USER_NOT_BELONG_TO_PROJECT = {
        "message": "user not belong to project",
        "status": 403,
    }
    USER_PROJECT_PERMISSION_DENIED = {
        "message": "user have no permission for {action}, user role: {role}",
        "status": 403,
    }


class ProjectException(AppException):
    def __init__(self, exeption_type: ProjectExceptionType, **kwargs):
        super().__init__(
            exeption_type.value["message"].format(**kwargs),
            exeption_type.value["status"],
            "projects",
        )
