from app.tools.llm_service import LLMService
from app.tools.groq_service import GroqService


class LLMRouter:
    """
    Central router for all LLM requests.

    Strategy:
    1. Try Gemini
    2. If Gemini fails, automatically use Groq
    """

    def __init__(self):
        self.gemini = LLMService()
        self.groq = GroqService()

    def generate(self, prompt: str) -> str:

        if not isinstance(prompt, str):
            raise TypeError("Prompt must be a string.")

        if not prompt.strip():
            raise ValueError("Prompt cannot be empty.")

        try:

            print("\n[Router] Using Gemini...\n")

            return self.gemini.generate(prompt)

        except Exception as gemini_error:

            print(f"\n[Router] Gemini failed:\n{gemini_error}\n")
            print("[Router] Switching to Groq...\n")

            try:

                return self.groq.generate(prompt)

            except Exception as groq_error:

                raise RuntimeError(
                    "Both LLM providers are currently unavailable."
                ) from groq_error