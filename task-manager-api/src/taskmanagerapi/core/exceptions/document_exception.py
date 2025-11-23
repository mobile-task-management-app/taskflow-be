from enum import Enum

from taskmanagerapi.core.exceptions.app_exception import AppException


class DocumentExceptionType(Enum):
    DOCUMENT_NOT_EXIST = {
        "message": "document not exist",
        "status": 404,
    }
    DOCUMENT_NOT_BELONG_TO_PROJECT = {
        "message": "document not belong to project",
        "status": 400,
    }
    DOCUMENT_IMPORT_PROCESSING = {
        "message": "document is importing",
        "status": 409,
    }


class DocumentException(AppException):
    def __init__(self, exeption_type: DocumentExceptionType, **kwargs):
        super().__init__(
            exeption_type.value["message"].format(**kwargs),
            exeption_type.value["status"],
            "projects",
        )
