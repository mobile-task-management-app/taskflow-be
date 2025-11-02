from logging import Logger
from typing import Protocol
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings

from app.modules.documents.services.dtos.document_metadata_dto import (
    DocumentMetaDataDTO,
)
from app.modules.documents.services.pdf_document_embedding_service import (
    PDFDocumentEmbeddingService,
)
from app.modules.documents.services.qdrant_vectore_store_service import (
    QdrantVectorStoreService,
)


class DocumentEmbeddingService(Protocol):
    def embedding_document(
        self, input_path: str, metadata: DocumentMetaDataDTO
    ) -> None: ...


class DocumentEmbeddingServiceFactory:
    def __init__(
        self,
        qdrant_service: QdrantVectorStoreService,
        splitter: RecursiveCharacterTextSplitter,
        logger: Logger,
    ):
        self.services: dict[str, DocumentEmbeddingService] = {
            "pdf": PDFDocumentEmbeddingService(splitter, qdrant_service, logger)
        }

    def get_embedding_service(self, extension: str) -> DocumentEmbeddingService:
        """
        Return an embedding service for the given file extension.
        Logs a warning if unsupported.
        """
        extension = extension.lower().strip(".")

        return self.services.get(extension)
