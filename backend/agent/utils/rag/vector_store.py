from langchain_qdrant import QdrantVectorStore
from qdrant_client import QdrantClient
from langchain_openai import OpenAIEmbeddings
from langchain_core.documents import Document
from qdrant_client.models import VectorParams, Distance
from langchain_core.stores import InMemoryByteStore

import os
from agent.utils.rag.splitters import text_splitter


import cohere

# from langchain_cohere import CohereRerank
# from langchain_community.retrievers import ContextualCompressionRetriever

QDRANT_URL = os.getenv("QDRANT_URL")

client = QdrantClient(url=QDRANT_URL)
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
co = cohere.ClientV2()

vector_size = 1536
distance = Distance.COSINE

# TODO:use global store
# new store instance will lead to new mappings and retrievers each time
# store = InMemoryByteStore()


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

    # Split documents into smaller chunks
    split_docs = text_splitter.split_documents(docs)

    # Add documents to vector store
    vector_store.add_documents(split_docs)


def get_documents(collection_name: str, query: str):
    vector_store = QdrantVectorStore(
        client=client,
        collection_name=collection_name,
        embedding=embeddings,
    )

    retriever = vector_store.as_retriever(search_kwargs={"k": 15})

    retrieved_docs = retriever.invoke(query)

    compressed_docs = co.rerank(
        model="rerank-v3.5", query=query, documents=retrieved_docs, top_n=5
    )

    # return retrieved_docs
    return compressed_docs
