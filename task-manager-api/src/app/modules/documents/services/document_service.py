import asyncio
from concurrent.futures import ThreadPoolExecutor
from dataclasses import asdict
import tempfile
import traceback
from app.core.context.user_context import UserContext
from app.core.exceptions.document_exception import (
    DocumentException,
    DocumentExceptionType,
)
from app.core.exceptions.project_exception import ProjectException, ProjectExceptionType
from app.core.storage.storage_service import GCSStorageService
from app.modules.documents.db.models.document import Document
from app.modules.documents.db.models.document_create import DocumentCreate
from app.modules.documents.db.models.document_import_task import DocumentImportTask
from app.modules.documents.db.models.document_import_task_create import (
    DocumentImportTaskCreate,
)
from app.modules.documents.db.models.document_import_task_status import (
    DocumentImportTaskStatus,
)
from app.modules.documents.db.repositories.document_import_task_repository import (
    DocumentImportTaskRepository,
)
from app.modules.documents.db.repositories.document_repository import DocumentRepository
from app.modules.documents.services.document_embedding_service import (
    DocumentEmbeddingServiceFactory,
)
from app.modules.documents.services.dtos.bulk_upload_project_documents_dto import (
    BulkUploadProjectDocumentsInputDTO,
    BulkUploadProjectDocumentsOutputDTO,
    UploadProjectDocumentOutputDTO,
)
from app.modules.documents.services.dtos.document_metadata_dto import (
    DocumentMetaDataDTO,
)
from app.modules.documents.services.dtos.import_project_document_dto import (
    ImportProjectDocumentInputDTO,
    ImportProjectDocumentOutputDTO,
)
from app.modules.projects.db.models.project_participant_role import (
    ProjectParitipantRole,
)
from app.modules.projects.db.repositories.project_participant_repository import (
    ProjectParticipantRepository,
)
from app.modules.projects.db.repositories.project_repository import ProjectRepository


class DocumentService:
    def __init__(
        self,
        project_repo: ProjectRepository,
        project_participant_repo: ProjectParticipantRepository,
        document_repo: DocumentRepository,
        task_repo: DocumentImportTaskRepository,
        storage_service: GCSStorageService,
        embedding_service_factory: DocumentEmbeddingServiceFactory,
        background_executor: ThreadPoolExecutor,
    ):
        self.project_repo = project_repo
        self.project_participant_repo = project_participant_repo
        self.document_repo = document_repo
        self.storage_service = storage_service
        self.embedding_service_factory = embedding_service_factory
        self.task_repo = task_repo
        self.background_executor = background_executor

    async def bulk_upload_project_document(
        self, ip: BulkUploadProjectDocumentsInputDTO, user: UserContext
    ) -> BulkUploadProjectDocumentsOutputDTO:
        # check if project exist
        project = await self.project_repo.find_project_by_id(ip.project_id)
        if not project:
            raise ProjectException(ProjectExceptionType.PROJECT_NOT_EXIST)

        # check user permission
        project_participant = (
            await self.project_participant_repo.find_project_participant_by_id(
                user.id, ip.project_id
            )
        )
        if not project_participant:
            raise ProjectException(ProjectExceptionType.USER_NOT_BELONG_TO_PROJECT)

        if project_participant.role == ProjectParitipantRole.VIEWER:
            raise ProjectException(
                ProjectExceptionType.USER_PROJECT_PERMISSION_DENIED,
                action="document_import",
                role=ProjectParitipantRole.VIEWER.value,
            )

        document_creates = [
            DocumentCreate(d.name, ip.project_id, user.id, d.extension, d.size)
            for d in ip.documents
        ]
        documents = await self.document_repo.bulk_create_document(document_creates)
        document_outputs: list[UploadProjectDocumentOutputDTO] = []
        for document in documents:
            put_object_url = await self.storage_service.get_presign_url_put(
                document.storage_path, document.get_mime_type()
            )
            document_outputs.append(
                UploadProjectDocumentOutputDTO(
                    put_object_url=put_object_url, **asdict(document)
                )
            )
        return BulkUploadProjectDocumentsOutputDTO(documents=document_outputs)

    async def import_project_document(
        self,
        ip: ImportProjectDocumentInputDTO,
        user: UserContext,
    ) -> ImportProjectDocumentOutputDTO:
        project, document, project_participant = await asyncio.gather(
            self.project_repo.find_project_by_id(ip.project_id),
            self.document_repo.find_document_by_id(ip.document_id),
            self.project_participant_repo.find_project_participant_by_id(
                user.id, ip.project_id
            ),
        )
        if not project:
            raise ProjectException(ProjectExceptionType.PROJECT_NOT_EXIST)

        if not project_participant:
            raise ProjectException(ProjectExceptionType.USER_NOT_BELONG_TO_PROJECT)
        if project_participant.role == ProjectParitipantRole.VIEWER:
            raise ProjectException(
                ProjectExceptionType.USER_PROJECT_PERMISSION_DENIED,
                action="document_import",
                role=ProjectParitipantRole.VIEWER.value,
            )

        if not document:
            raise DocumentException(DocumentExceptionType.DOCUMENT_NOT_EXIST)

        if document.project_id != project.id:
            raise DocumentException(
                DocumentExceptionType.DOCUMENT_NOT_BELONG_TO_PROJECT
            )

        exist_task = (
            await self.task_repo.find_document_import_task_by_project_document_id(
                ip.project_id, ip.document_id
            )
        )
        if exist_task and exist_task.status == DocumentImportTaskStatus.PROCESS:
            raise DocumentException(DocumentExceptionType.DOCUMENT_IMPORT_PROCESSING)

        new_task_create = DocumentImportTaskCreate(
            document_id=ip.document_id,
            user_create_id=user.id,
            status=DocumentImportTaskStatus.PROCESS,
        )
        new_task = await self.task_repo.create_document_import_task(new_task_create)
        # submit task
        self.background_executor.submit(self.background_executor, document, new_task)

        return ImportProjectDocumentOutputDTO(**asdict(new_task))

    def background_import_document(self, document: Document, task: DocumentImportTask):
        try:
            with tempfile.NamedTemporaryFile(
                delete=True, suffix=f".{document.extension}"
            ) as f:
                self.storage_service.download_file(document.storage_path, f)
                embedding_service = (
                    self.embedding_service_factory.get_embedding_service(
                        document.extension
                    )
                )
                metadata = DocumentMetaDataDTO(
                    document.project_id,
                    document.owner_id,
                    document.id,
                    document.extension,
                    document.storage_path,
                )
                embedding_service.embedding_document(f.name, metadata)
                asyncio.run(
                    self.task_repo.update_document_import_status(
                        task.id, DocumentImportTaskStatus.SUCCESS, "success"
                    )
                )
        except Exception as e:
            error_message = (
                f"Document import failed: {str(e)}\n{traceback.format_exc()}"
            )
            self.logger.error(error_message)

            # Update task as failed with error message
            asyncio.run(
                self.task_repo.update_document_import_status(
                    task.id,
                    DocumentImportTaskStatus.FAILED,
                    error_message,
                )
            )
