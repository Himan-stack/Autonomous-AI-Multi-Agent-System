from app.tools.groq_service import GroqService

llm = GroqService()

response = llm.generate(
    "Say hello in one sentence."
)

print(response)