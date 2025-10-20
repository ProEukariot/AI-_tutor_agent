from langchain.tools import tool
from agent.utils.rag.vector_store import get_documents

eval_context_file = "root/py/proj/backend/temp.txt"


def write_to_temp(contents: list[str]):
    with open(eval_context_file, "w") as file:
        for item in contents:
            file.write(item + "\n")


def read_from_temp():
    lines_read = []
    with open(eval_context_file, "r") as file:
        lines_read = [line.strip() for line in file]

    return lines_read


@tool
def knowledge_base_search(query: str):
    """Search the knowledge base for the query"""

    # conversion_id is hardcoded for now
    # TODO: get conversion_id from the api request or DB
    # RAGAS will use conversion_id=123 for evaluation

    conversion_id = "123"
    docs = get_documents(conversion_id, query)

    contents = [doc.page_content for doc in docs]

    # write to temp file for evaluation
    write_to_temp(contents)

    return contents
