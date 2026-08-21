import json
import time
import re

from app.models.reflection import ReflectionResult
from app.prompts.reflection_prompt import get_reflection_prompt
from app.tools.llm_router import LLMRouter


class Reflection:
    """
    Reviews and improves the generated document.
    """

    MAX_RETRIES = 2

    def __init__(self):
        self.llm = LLMRouter()

    def _extract_json(self, response: str):
        """
        Extract JSON from LLM responses that may contain
        additional text or markdown.
        """

        try:
            return json.loads(response)
        except json.JSONDecodeError:
            pass

        match = re.search(r"\{.*\}", response, re.DOTALL)

        if match:
            return json.loads(match.group())

        raise ValueError("No valid JSON found.")

    def review(self, document: str) -> ReflectionResult:

        start_time = time.time()
        prompt = get_reflection_prompt(document)

        for attempt in range(1, self.MAX_RETRIES + 1):

            try:

                response = self.llm.generate(prompt)

                print(
                    f"\n========== REFLECTION ATTEMPT {attempt} ==========\n"
                )
                print(response)
                print("\n=============================================\n")

                data = self._extract_json(response)

                # Ensure required field exists even if the LLM omits it.
                if "approved" not in data:
                    quality_score = data.get("quality_score", 0)

                    if isinstance(quality_score, (int, float)):
                        data["approved"] = quality_score >= 70
                    else:
                        data["approved"] = False

                result = ReflectionResult(**data)

                elapsed = round(time.time() - start_time, 2)

                print(
                    f"\n✓ Reflection completed in {elapsed} sec"
                )

                return result

            except Exception as e:

                print(
                    f"\n[Reflection] Attempt {attempt} failed: {e}"
                )

                if attempt < self.MAX_RETRIES:
                    print("[Reflection] Retrying...")
                    continue

                print(
                    "\nReflection failed after all retries."
                )
                print(
                    "Using original document as fallback.\n"
                )

                return ReflectionResult(
                    approved=False,
                    feedback=(
                        "Reflection failed. "
                        "The original generated document was retained."
                    ),
                    improved_content=document,
                )
