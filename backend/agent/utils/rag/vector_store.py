from langchain_qdrant import QdrantVectorStore
from qdrant_client import QdrantClient
from langchain_openai import OpenAIEmbeddings
from langchain_core.documents import Document
from qdrant_client.models import VectorParams, Distance

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

    # Extract page_content from documents and filter out empty/whitespace-only content
    doc_contents = [doc.page_content.strip() for doc in retrieved_docs if doc.page_content.strip()]
    
    # If no valid documents found, return empty list
    if not doc_contents:
        print("No valid documents found after filtering")
        return []


    compressed_docs = co.rerank(
        model="rerank-v3.5", query=query, documents=doc_contents, top_n=5
    )
    
    # Cohere rerank returns a list of results with index and relevance_score
    # Convert back to Document objects for consistency with the rest of the system
    reranked_docs = []
    for result in compressed_docs.results:
        if result.index < len(retrieved_docs):
            # Create a new Document with the reranked content
            original_doc = retrieved_docs[result.index]
            reranked_docs.append(Document(
                page_content=original_doc.page_content,
                metadata=original_doc.metadata
            ))
    
    return reranked_docs
