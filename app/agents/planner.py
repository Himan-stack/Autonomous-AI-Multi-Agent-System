import json
from urllib import response

from app.models.analysis import AnalysisResult
from app.models.planning import PlanningResult
from app.prompts.planner_prompt import get_planner_prompt
from app.tools.llm_router import LLMRouter


class Planner:
    """
    Converts AnalysisResult into an autonomous execution plan.
    """

    def __init__(self):
        self.llm = LLMRouter()

    def create_plan(
        self,
        analysis: AnalysisResult
    ) -> PlanningResult:

        prompt = get_planner_prompt(analysis)

        response = self.llm.generate(prompt)
        print("\n========== RAW LLM RESPONSE ==========\n")
        print(response)
        print("\n=====================================\n")

        data = json.loads(response)

        return PlanningResult(**data
            )