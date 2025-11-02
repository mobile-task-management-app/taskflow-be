from logging import Logger
from attr import asdict
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.document_loaders import PyPDFLoader
from langchain_core.documents import Document

from app.modules.documents.services.dtos.document_metadata_dto import (
    DocumentMetaDataDTO,
)
from app.modules.documents.services.qdrant_vectore_store_service import (
    QdrantVectorStoreService,
)


class PDFDocumentEmbeddingService:
    def __init__(
        self,
        splitter: RecursiveCharacterTextSplitter,
        qdrant_service: QdrantVectorStoreService,
        logger: Logger,
        batch_size: int = 50,
    ):
        self.splitter = splitter
        self.qdrant_service = qdrant_service
        self.logger = logger
        self.batch_size = batch_size

    def embedding_document(
        self, input_path: str, metadata: DocumentMetaDataDTO
    ) -> None:
        """
        Lazy load a PDF, split into chunks, embed using Gemini,
        and store embeddings in Qdrant.
        """
        self.logger.info(f"Loading PDF: {input_path}")
        loader = PyPDFLoader(input_path)

        batch: list[Document] = []
        total_chunks = 0

        for page in loader.lazy_load():
            page_chunks = self.splitter.split_documents([page])
            batch.extend(page_chunks)

            if len(batch) >= self.batch_size:
                self.logger.info(f"Embedding batch of {len(batch)} chunks...")
                self.qdrant_service.embed_and_store(batch)
                total_chunks += len(batch)
                batch = []

        # Flush remaining chunks
        if batch:
            self.logger.info(f"Embedding final batch of {len(batch)} chunks...")
            self.qdrant_service.embed_and_store(batch, asdict(metadata))
            total_chunks += len(batch)

        self.logger.info(
            f"Stored {total_chunks} chunks in Qdrant collection '{self.qdrant_service.collection_name}'"
        )
