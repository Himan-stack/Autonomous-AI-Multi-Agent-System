from app.agents.analyzer import Analyzer
from app.agents.planner import Planner
from app.agents.executor import Executor


request = "Create a business proposal for launching an AI healthcare startup."


# Step 1
analysis = Analyzer().analyze(request)

# Step 2
plan = Planner().create_plan(analysis)

# Step 3
executor = Executor()

previous_sections = ""

print("\n========== EXECUTION ==========\n")

for step in plan.execution_plan[:3]:
    # Execute only the first three tasks for testing

    result = executor.execute_step(
        analysis=analysis,
        plan=plan,
        current_step=step,
        previous_sections=previous_sections
    )

    print("=" * 70)
    print(result.current_step)
    print("=" * 70)

    print(result.generated_content)
    print()

    previous_sections += "\n\n" + result.generated_content