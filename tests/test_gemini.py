from app.tools.llm_service import LLMService


def main():
    print("=" * 50)
    print("Testing Gemini Connection...")
    print("=" * 50)

    llm = LLMService()

    prompt = "Say hello in one sentence."

    response = llm.generate(prompt)

    print("\nGemini Response:\n")
    print(response)


if __name__ == "__main__":
    main()