import operator
from typing import Annotated, Any, Literal, Optional, TypedDict
from pydantic import BaseModel, Field
from langchain_core.messages import BaseMessage
from langchain_core.documents import Document


class TutorState(TypedDict):
    messages: Annotated[list[BaseMessage], operator.add]
    retrieved_docs: list[Document]


class ReflectionOutput(BaseModel):
    decision: Literal["FINISH", "REFINE_ANSWER"] = Field(
        description="The decision to make"
    )
    critique: str = Field(description="A critique of the Tutor Agent's response")
    improvement_suggestions: str = Field(
        description="Suggestions for the Tutor Agent to improve its response"
    )


class ReflectionState(TypedDict):
    decision: str
    messages: Annotated[list[BaseMessage], operator.add]


class MasterState(TypedDict):
    messages: Annotated[list[BaseMessage], operator.add]
    decision: str
