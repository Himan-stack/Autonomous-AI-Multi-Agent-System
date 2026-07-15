from pydantic import BaseModel
from typing import List, Dict

from app.models.analysis import AnalysisResult
from app.models.planning import PlanningResult
from app.models.execution import ExecutionResult
from app.models.reflection import ReflectionResult


class OrchestrationResult(BaseModel):
    """
    Represents the complete output of the autonomous AI workflow.
    """

    analysis: AnalysisResult

    planning: PlanningResult

    executed_steps: List[ExecutionResult]

    reflection: ReflectionResult

    final_document: str

    txt_path: str

    md_path: str

    pdf_path: str

    docx_path: str