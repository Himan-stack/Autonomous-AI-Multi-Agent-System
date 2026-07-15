from typing import Dict, List, Optional

from pydantic import BaseModel


class AgentResponse(BaseModel):
    request: str
    document_type: str
    assumptions: List[str]
    execution_plan: List[str]
    status: str
    execution_time: str

    generated_files: Dict[str, str]
    message: Optional[str] = None