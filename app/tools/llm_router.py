from app.tools.llm_service import LLMService
from app.tools.groq_service import GroqService


class LLMRouter:
    """
    Central router for all LLM requests.

    Strategy:
    1. Try Groq first
    2. If Groq fails, automatically use Gemini
    """

    def __init__(self):
        self.groq = GroqService()
        self.gemini = LLMService()

    def generate(self, prompt: str) -> str:

        if not isinstance(prompt, str):
            raise TypeError("Prompt must be a string.")

        if not prompt.strip():
            raise ValueError("Prompt cannot be empty.")

        # ---------------------------------------------------------
        # PRIMARY: GROQ
        # ---------------------------------------------------------
        try:
            print("\n[Router] Using Groq...\n")

            result = self.groq.generate(prompt)

            print("[Router] Groq succeeded.\n")

            return result

        except Exception as groq_error:

            print("\n[Router] Groq failed:")
            print(repr(groq_error))
            print("\n[Router] Switching to Gemini...\n")

        # ---------------------------------------------------------
        # FALLBACK: GEMINI
        # ---------------------------------------------------------
        try:
            print("[Router] Using Gemini...\n")

            result = self.gemini.generate(prompt)

            print("[Router] Gemini succeeded.\n")

            return result

        except Exception as gemini_error:

            print("\n[Router] Gemini failed:")
            print(repr(gemini_error))

            raise RuntimeError(
                "All LLM providers failed. "
                f"Groq error: {groq_error} | "
                f"Gemini error: {gemini_error}"
            ) from gemini_error
