from app.agents.analyzer import Analyzer

analyzer = Analyzer()

result = analyzer.analyze(
    "Create a business proposal for an AI healthcare startup."
)

print("\n===== ANALYSIS RESULT =====\n")

print(result)