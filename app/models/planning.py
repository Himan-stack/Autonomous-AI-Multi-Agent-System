from typing import List
from pydantic import BaseModel, Field


class PlanningResult(BaseModel):
    """
    Output produced by the Planning module.
    Represents the autonomous execution plan.
    """

    execution_plan: List[str] = Field(
        default_factory=list,
        description="Ordered list of tasks the agent will execute"
    )

    estimated_steps: int = Field(
        ...,
        description="Total number of planned steps"
    )

    planning_notes: str = Field(
        default="",
        description="Additional planning decisions or notes"
    )