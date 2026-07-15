import time

from google import genai

from app.config import settings


class LLMService:
    """
    Centralized service responsible for all communication
    with the Gemini API.

    Features:
    - Centralized LLM access
    - Retry & Recovery
    - Exponential Backoff
    - Configurable model
    """

    MAX_RETRIES = 3

    def __init__(self):

        if not settings.GEMINI_API_KEY:
            raise ValueError(
                "GEMINI_API_KEY is missing in the .env file."
            )

        self.client = genai.Client(
            api_key=settings.GEMINI_API_KEY
        )

        self.model = settings.GEMINI_MODEL

    def generate(self, prompt: str) -> str:

        if not prompt.strip():
            raise ValueError("Prompt cannot be empty.")

        last_exception = None

        for attempt in range(1, self.MAX_RETRIES + 1):

            try:

                print(
                    f"\n[LLM] Attempt {attempt}/{self.MAX_RETRIES} "
                    f"using {self.model}"
                )

                response = self.client.models.generate_content(
                    model=self.model,
                    contents=prompt,
                )

                text = response.text.strip()

                text = text.replace("```json", "")
                text = text.replace("```", "")
                text = text.strip()

                print("[LLM] Success")

                return text

            except Exception as e:

                last_exception = e

                print(f"[LLM] Attempt {attempt} failed")

                if attempt < self.MAX_RETRIES:

                    wait_time = 2 ** attempt

                    print(
                        f"[LLM] Retrying in {wait_time} seconds..."
                    )

                    time.sleep(wait_time)

        raise RuntimeError(
            f"Gemini API Error after "
            f"{self.MAX_RETRIES} attempts:\n{last_exception}"
        )