from enum import Enum


class DocumentImportTaskStatus(str, Enum):
    PROCESS = "process"
    SUCCESS = "success"
    FAILURE = "failure"
