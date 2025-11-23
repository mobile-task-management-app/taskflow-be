from taskmanagerapi.modules.projects.db.models.project import Project


class GetProjectByIdInputDTO:
    id: int


class GetProjectByIdOutputDTO(Project):
    pass
