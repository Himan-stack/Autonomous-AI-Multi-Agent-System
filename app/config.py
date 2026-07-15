from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()


class Settings:
    """
    Centralized application configuration.
    """

    # ---------- Gemini ----------
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    GEMINI_MODEL = os.getenv(
        "GEMINI_MODEL",
        "gemini-2.5-flash"
    )

    # ---------- Groq ----------
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")
    GROQ_MODEL = os.getenv(
        "GROQ_MODEL",
        "llama-3.3-70b-versatile"
    )


settings = Settings()