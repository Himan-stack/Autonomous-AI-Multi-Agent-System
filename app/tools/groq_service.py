from pydoc import text
from tracemalloc import start

from groq import Groq

from app.config import settings


class GroqService:
    """
    Handles all communication with the Groq API.
    """

    def __init__(self):

        if not settings.GROQ_API_KEY:
            raise ValueError(
                "GROQ_API_KEY is missing in the .env file."
            )

        self.client = Groq(
            api_key=settings.GROQ_API_KEY
        )

        # Fast, reliable and free
        self.model = settings.GROQ_MODEL

    def generate(self, prompt: str) -> str:

        if not prompt.strip():
            raise ValueError("Prompt cannot be empty.")

        response = self.client.chat.completions.create(

            model=self.model,

            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],

            temperature=0.4,
        )

        text = response.choices[0].message.content

        if text is None:
            raise RuntimeError("Groq returned an empty response.")

        text = text.strip()

        # Remove markdown code fences
        text = text.replace("```json", "")
        text = text.replace("```", "")
        text = text.strip()
        start = text.find("{")
        end = text.rfind("}")

        if start != -1 and end != -1:
            text = text[start:end + 1]

        return text