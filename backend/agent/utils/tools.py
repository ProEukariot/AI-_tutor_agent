from langchain.tools import tool
from agent.utils.rag.vector_store import get_documents


@tool
def knowledge_base_search(query: str):
    """Search the knowledge base for the query"""

    conversion_id = "123"
    docs = get_documents(conversion_id, query)

    contents = [doc.page_content for doc in docs]

    return contents
