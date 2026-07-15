from pydantic import BaseModel, Field


class ExecutionResult(BaseModel):
    """
    Output produced after executing ONE task
    from the execution plan.
    """

    current_step: str = Field(
        ...,
        description="The task that was executed."
    )

    generated_content: str = Field(
        ...,
        description="Content generated for this task."
    )

    completed: bool = Field(
        ...,
        description="Whether this task executed successfully."
    )

    execution_summary: str = Field(
        ...,
        description="Short summary of this execution step."
    )