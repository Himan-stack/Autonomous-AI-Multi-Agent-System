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

    MAX_RETRIES = 3

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
        prompt = get_reflection_prompt(document)

        for attempt in range(2):

            response = self.llm.generate(prompt)

            print(f"\n========== REFLECTION ATTEMPT {attempt + 1} ==========\n")
            print(response)
            print("\n=============================================\n")

            try:

                data = self._extract_json(response)

                elapsed = round(time.time() - start_time, 2)

                print(f"\n✓ Reflection completed in {elapsed} sec")

                return ReflectionResult(**data)

            except Exception:

                print("Reflection JSON parsing failed.")

                if attempt == 0:
                    print("Retrying Reflection Agent...")

                else:

                    print("\nReflection failed after all retries.")
                    print("Using original document as fallback.\n")

                    return ReflectionResult(
                        quality_score=0,
                        feedback="Reflection skipped because the model returned invalid JSON.",
                        improved_content=document,
                    )

            except Exception as e:

                print(f"Reflection Error: {e}")

                return ReflectionResult(
                    quality_score=0,
                    feedback=f"Reflection failed: {e}",
                    improved_content=document,
                )
        print("\nReflection failed after all retries.")
        print("Using original document as fallback.\n")

        return ReflectionResult(
            approved=False,
            feedback="Reflection skipped because the model returned invalid JSON.",
            improved_content=document,
        )