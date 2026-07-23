from pathlib import Path
import time

from fastapi import APIRouter, HTTPException

from app.agents.orchestrator import Orchestrator
from app.models.request import AgentRequest
from app.models.response import AgentResponse


router = APIRouter()

orchestrator = Orchestrator()


@router.post(
    "/agent",
    response_model=AgentResponse,
    tags=["Autonomous Agent"],
)
def run_agent(payload: AgentRequest):

    start_time = time.time()

    try:

        result = orchestrator.run(payload.request)

        execution_time = round(
            time.time() - start_time,
            2,
        )

        return AgentResponse(
            request=payload.request,
            document_type=result.analysis.document_type,
            assumptions=result.analysis.assumptions,
            execution_plan=result.planning.execution_plan,
            status="Success",
            execution_time=f"{execution_time} sec",
            generated_files={
                "docx": Path(result.docx_path).name,
                "pdf": Path(result.pdf_path).name,
                "txt": Path(result.txt_path).name,
                "md": Path(result.md_path).name,
            },
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e),
        )