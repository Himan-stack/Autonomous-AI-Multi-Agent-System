from pydantic import BaseModel, Field


class AgentRequest(BaseModel):
    request: str = Field(
        ...,
        min_length=10,
        max_length=5000,
        description="Natural language request for the autonomous AI agent"
    )