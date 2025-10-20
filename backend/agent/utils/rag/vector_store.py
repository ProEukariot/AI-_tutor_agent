from langchain_qdrant import QdrantVectorStore
from qdrant_client import QdrantClient
from langchain_openai import OpenAIEmbeddings
from langchain_core.documents import Document
from qdrant_client.models import VectorParams, Distance
from langchain.storage import InMemoryStore
from langchain.retrievers import ParentDocumentRetriever
from agent.utils.rag.splitters import child_splitter
import os


QDRANT_URL = os.getenv("QDRANT_URL")

client = QdrantClient(url=QDRANT_URL)
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

vector_size = 1536
distance = Distance.COSINE

# TODO:use global store
# new store instance will lead to new mappings and retrievers each time
store = InMemoryStore()



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

    parent_document_retriever = ParentDocumentRetriever(
        vectorstore=vector_store,
        docstore=store,
        child_splitter=child_splitter,
    )

    parent_document_retriever.add_documents(docs)


def get_documents(collection_name: str, query: str):
    vector_store = QdrantVectorStore(
        client=client,
        collection_name=collection_name,
        embedding=embeddings,
    )

    retriever = vector_store.as_retriever(search_kwargs={"k": 10})
    parent_document_retriever = ParentDocumentRetriever(
        vectorstore=vector_store,
        docstore=store,
        child_splitter=child_splitter,
    )

    return parent_document_retriever.invoke(query)
