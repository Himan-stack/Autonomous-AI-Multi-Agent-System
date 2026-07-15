from typing import List
from pydantic import BaseModel, Field


class AnalysisResult(BaseModel):
    """
    Output produced by the Analyzer module.
    Represents the agent's understanding of the user's request.
    """

    document_type: str = Field(
        ...,
        description="Type of document to generate"
    )

    goal: str = Field(
        ...,
        description="Primary objective of the user's request"
    )

    provided_information: List[str] = Field(
        default_factory=list,
        description="Information explicitly provided by the user"
    )

    missing_information: List[str] = Field(
        default_factory=list,
        description="Important information missing from the request"
    )

    assumptions: List[str] = Field(
        default_factory=list,
        description="Reasonable assumptions made by the agent"
    )