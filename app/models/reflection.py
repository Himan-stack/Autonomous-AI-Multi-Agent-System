from pydantic import BaseModel, Field


class ReflectionResult(BaseModel):
    """
    Output produced by the Reflection module.
    Represents the quality review of generated content.
    """

    approved: bool = Field(
        ...,
        description="Whether the generated content passed review"
    )

    feedback: str = Field(
        default="",
        description="Feedback from the reflection process"
    )

    improved_content: str = Field(
        default="",
        description="Improved version of the generated content"
    )