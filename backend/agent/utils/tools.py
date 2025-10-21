from langchain.tools import tool
from agent.utils.rag.vector_store import get_documents


@tool
def knowledge_base_search(query: str):
    """Search the knowledge base for the query"""

    # conversion_id is hardcoded for now
    # TODO: get conversion_id from the api request or DB
    # RAGAS will use conversion_id=123 for evaluation

    conversion_id = "123"
    docs = get_documents(conversion_id, query)

    contents = [doc.page_content for doc in docs]

    return contents
