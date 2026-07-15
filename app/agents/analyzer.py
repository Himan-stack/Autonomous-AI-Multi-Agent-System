import json

from app.models.analysis import AnalysisResult
from app.prompts.analyzer_prompt import get_analyzer_prompt
from app.tools.llm_router import LLMRouter


class Analyzer:
    """
    Responsible for understanding the user's request.

    It converts a natural language request into a structured
    AnalysisResult.
    """

    def __init__(self):
        self.llm = LLMRouter()

    def analyze(self, user_request: str) -> AnalysisResult:
        """
        Analyze the user's request using Gemini.
        """

        prompt = get_analyzer_prompt(user_request)

        response = self.llm.generate(prompt)

        try:
            data = json.loads(response)

            return AnalysisResult(**data)

        except json.JSONDecodeError as e:
            raise ValueError(
                f"Analyzer returned invalid JSON: {e}"
            )

        except Exception as e:
            raise RuntimeError(
                f"Analyzer failed: {e}"
            )