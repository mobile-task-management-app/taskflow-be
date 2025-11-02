class AppException(Exception):
    def __init__(self, message: str, status: int, feature: str):
        super().__init__(message)
        self.feature = feature
        self.message = message
        self.status = status
