from typing import List, Optional, Dict, Any
from langchain_community.vectorstores import Qdrant
from langchain_core.documents import Document
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from qdrant_client import QdrantClient


class QdrantVectorStoreService:
    def __init__(
        self,
        qdrant_client: QdrantClient,
        embedding_client: GoogleGenerativeAIEmbeddings,
        collection_name: str = "documents",
    ):
        self.qdrant_client = qdrant_client
        self.embedding_client = embedding_client
        self.collection_name = collection_name

        self.vectorstore = Qdrant(
            client=self.qdrant_client,
            collection_name=self.collection_name,
            embeddings=self.embedding_client,
        )

    def embed_and_store(
        self,
        chunks: List[Document],
        metadata: Optional[Dict[str, Any]] = None,
    ) -> int:
        """
        Embed and store document chunks with optional metadata in Qdrant.
        Each chunk can also have its own metadata that will be merged.
        """
        if not chunks:
            print("No chunks provided to embed.")
            return 0

        # Merge shared metadata into each document
        if metadata:
            for chunk in chunks:
                chunk.metadata = {**metadata, **(chunk.metadata or {})}

        print(f"Embedding and storing {len(chunks)} chunks...")
        self.vectorstore.add_documents(chunks)
        print(f"Stored {len(chunks)} chunks in collection '{self.collection_name}'")

        return len(chunks)

    def search(self, query: str, k: int = 5, filters: Optional[Dict[str, Any]] = None):
        """
        Perform similarity search in Qdrant.
        Optionally filter by metadata.
        """
        if filters:
            return self.vectorstore.similarity_search_with_score(
                query, k=k, filter=filters
            )
        return self.vectorstore.similarity_search(query, k=k)
