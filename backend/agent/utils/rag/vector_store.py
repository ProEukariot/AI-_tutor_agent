from langchain_qdrant import QdrantVectorStore
from qdrant_client import QdrantClient
from langchain_openai import OpenAIEmbeddings
from langchain_core.documents import Document
from qdrant_client.models import VectorParams, Distance
import os


QDRANT_URL = os.getenv("QDRANT_URL")

client = QdrantClient(url=QDRANT_URL)
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

vector_size = 1536
distance = Distance.COSINE


def add_documents(collection_name: str, docs: list[Document]):
    if not client.collection_exists(collection_name):
        client.create_collection(
            collection_name=collection_name,
            vectors_config=VectorParams(size=vector_size, distance=distance),
        )

    vector_store = QdrantVectorStore(
        client=client,
        collection_name=collection_name,
        embedding=embeddings,
    )

    vector_store.add_documents(docs)


def get_documents(collection_name: str, query: str):
    vector_store = QdrantVectorStore(
        client=client,
        collection_name=collection_name,
        embedding=embeddings,
    )

    retriever = vector_store.as_retriever(search_kwargs={"k": 10})

    return retriever.invoke(query)
