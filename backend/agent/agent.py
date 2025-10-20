from langgraph.graph import StateGraph, START, END

# from IPython.display import Image, display
from agent.utils.state import MasterState, TutorState, ReflectionState
from agent.utils.nodes import reflection_llm, tool_node, tutor_llm


def route_to_tool_node(state: TutorState):
    return "tool_node" if state["messages"][-1].tool_calls else END


def refine_response(state: MasterState):
    return END if state["decision"] == "FINISH" else "tutor"


tutor_agent = StateGraph(TutorState)

tutor_agent.add_node("tutor_llm", tutor_llm)
tutor_agent.add_node("tool_node", tool_node)


tutor_agent.add_edge(START, "tutor_llm")
tutor_agent.add_edge("tool_node", "tutor_llm")

tutor_agent.add_conditional_edges("tutor_llm", route_to_tool_node)

tutor_agent = tutor_agent.compile()


# ##################

reflection_agent = StateGraph(ReflectionState)

reflection_agent.add_node("reflection_llm", reflection_llm)

reflection_agent.add_edge(START, "reflection_llm")
reflection_agent.add_edge("reflection_llm", END)

reflection_agent = reflection_agent.compile()

# ##################

agent = StateGraph(MasterState)

agent.add_node("tutor", tutor_agent)
agent.add_node("reflection", reflection_agent)

agent.add_edge(START, "tutor")
agent.add_edge("tutor", "reflection")

agent.add_conditional_edges("reflection", refine_response)

agent = agent.compile()
