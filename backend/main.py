import dotenv

dotenv.load_dotenv()

from agent.agent import agent
from langchain_core.messages import HumanMessage, AIMessage

inputs = {
    "messages": [
        HumanMessage("Explain me the concept of foreign keys"),
    ]
}

for chunk in agent.stream(
    inputs,
    stream_mode="updates",
):
    for node, values in chunk.items():
        print("*" * 100)
        print("\n\n")
        print(f"Receiving update from node: '{node}'")
        print(values["messages"][-1].content)
        print("\n\n")
