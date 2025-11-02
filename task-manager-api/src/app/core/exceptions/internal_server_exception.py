from app.core.exceptions.app_exception import AppException


class InternalException(AppException):
    def __init__(self, e: Exception):
        super().__init__("internal error", 500, "internal")
        self.e = e
