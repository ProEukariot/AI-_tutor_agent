import logging
from langchain_openai import ChatOpenAI
from agent.utils.state import ReflectionOutput, ReflectionState, TutorState
from agent.utils.prompts import reflection_prompt, tutor_prompt, reflection_message
from langchain_core.messages import HumanMessage, ToolMessage
from agent.utils.tools import knowledge_base_search
from langgraph.prebuilt import ToolNode

llm = ChatOpenAI(model="gpt-4.1-nano", temperature=0.8)
tools = [knowledge_base_search]

tool_node = ToolNode(tools)


def tutor_llm(state: TutorState):
    """Llm call to explain the topic"""

    messages = state["messages"]

    chain = tutor_prompt | llm.bind_tools(tools)

    response = chain.invoke({"messages": messages})

    return {
        "messages": [response],
    }


def reflection_llm(state: ReflectionState):
    """Llm call to reflect on the tutor's response"""

    messages = state["messages"]

    question = messages[0].content
    llm_response = messages[-1].content

    chain = reflection_prompt | llm.with_structured_output(ReflectionOutput)

    response = chain.invoke({"question": question, "llm_response": llm_response})

    reflection = reflection_message.format_messages(
        critique=response.critique,
        improvement_suggestions=response.improvement_suggestions,
    )

    return {
        "messages": reflection,
        "decision": response.decision,
    }
