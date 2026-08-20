from app.agents.analyzer import Analyzer
from app.agents.planner import Planner
from app.agents.executor import Executor
from app.agents.reflection import Reflection

from app.models.orchestration import OrchestrationResult

from app.tools.document_tool import DocumentTool


class Orchestrator:
    """
    Coordinates the complete autonomous AI workflow.
    """

    def __init__(self):
        self.analyzer = Analyzer()
        self.planner = Planner()
        self.executor = Executor()
        self.reflection = Reflection()
        self.document_tool = DocumentTool()

    def run(self, user_request: str, on_progress=None) -> OrchestrationResult:
        """
        on_progress: optional callable(stage: str, status: str, message: str) -> None
        Called at real stage start/completion boundaries. Purely additive —
        when omitted, behavior is byte-for-byte identical to before.
        """

        def _emit(stage, status, message):
            if on_progress:
                on_progress(stage, status, message)

        print("\n========== ANALYZING REQUEST ==========")
        _emit("analyzer", "running", "Analyzing requirements...")

        analysis = self.analyzer.analyze(user_request)

        print("✓ Analysis completed")
        _emit("analyzer", "completed", "Requirements analyzed successfully.")

        print("\n========== PLANNING ==========")
        _emit("planner", "running", "Planning document structure...")

        planning = self.planner.create_plan(analysis)

        print("✓ Planning completed")
        _emit("planner", "completed", "Document plan created.")

        print("\n========== EXECUTION ==========")
        _emit("executor", "running", "Generating document content...")

        execution = self.executor.execute(
            analysis=analysis,
            plan=planning,
        )

        print("✓ Document generated")
        _emit("executor", "completed", "Document content generated.")

        print("\n========== REFLECTION ==========")
        _emit("reflection", "running", "Reviewing generated document...")

        reflection = self.reflection.review(
            execution.generated_content
        )

        print("✓ Reflection completed")
        _emit("reflection", "completed", "Document review completed.")

        final_document = (
            reflection.improved_content
            if reflection.improved_content
            else execution.generated_content
        )
        print("\n========== SAVING DOCUMENT ==========")

        saved_files = self.document_tool.save(
            user_request=user_request,
            analysis=analysis,
            planning=planning,
            reflection=reflection,
            final_document=final_document,
        )

        print("✓ TXT saved")
        print("✓ Markdown saved")
        print("✓ PDF saved")
        print("✓ DOCX saved")

        print("\n========== WORKFLOW COMPLETED ==========")

        return OrchestrationResult(
            analysis=analysis,
            planning=planning,
            executed_steps=[execution],
            reflection=reflection,
            final_document=final_document,
            txt_path=saved_files["txt"],
            md_path=saved_files["md"],
            pdf_path=saved_files["pdf"],
            docx_path=saved_files["docx"],
        )