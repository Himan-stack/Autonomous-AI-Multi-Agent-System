from app.models.analysis import AnalysisResult
from app.models.planning import PlanningResult
from app.models.execution import ExecutionResult
from app.models.reflection import ReflectionResult


analysis = AnalysisResult(
    document_type="Business Proposal",
    goal="Launch AI Startup"
)

planning = PlanningResult(
    execution_plan=[
        "Analyze request",
        "Generate outline",
        "Write proposal"
    ],
    estimated_steps=3
)

execution = ExecutionResult(
    generated_content="Sample proposal...",
    execution_summary="Proposal generated successfully."
)

reflection = ReflectionResult(
    approved=True,
    feedback="Looks good.",
    improved_content="Sample proposal..."
)

print("✅ Analysis Model")
print(analysis)

print("\n✅ Planning Model")
print(planning)

print("\n✅ Execution Model")
print(execution)

print("\n✅ Reflection Model")
print(reflection)