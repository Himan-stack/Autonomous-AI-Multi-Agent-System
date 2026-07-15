from app.models.analysis import AnalysisResult
from app.models.planning import PlanningResult
from app.models.execution import ExecutionResult

from app.prompts.writer_prompt import get_writer_prompt
from app.tools.llm_router import LLMRouter


class Executor:
    """
    Executes the COMPLETE execution plan
    in a single LLM call.
    """

    def __init__(self):
        self.llm = LLMRouter()

    def execute(
        self,
        analysis: AnalysisResult,
        plan: PlanningResult,
    ) -> ExecutionResult:

        prompt = get_writer_prompt(
            analysis=analysis,
            plan=plan,
        )

        generated_text = self.llm.generate(prompt)

        return ExecutionResult(
            current_step="Complete Document Generation",
            generated_content=generated_text.strip(),
            completed=True,
            execution_summary="Successfully generated the complete document."
        )