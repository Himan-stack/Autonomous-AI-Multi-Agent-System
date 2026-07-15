from app.agents.analyzer import Analyzer
from app.agents.planner import Planner

request = (
    "Create a business proposal for launching an AI healthcare startup."
)

analyzer = Analyzer()
analysis = analyzer.analyze(request)

planner = Planner()
plan = planner.create_plan(analysis)

print("\n========== ANALYSIS ==========\n")
print(analysis)

print("\n========== EXECUTION PLAN ==========\n")

for i, step in enumerate(plan.execution_plan, start=1):
    print(f"{i}. {step}")

print("\nEstimated Steps:", plan.estimated_steps)
print("Planning Notes:", plan.planning_notes)