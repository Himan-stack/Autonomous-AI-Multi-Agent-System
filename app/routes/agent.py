from pathlib import Path
import json
import queue
import threading
import time

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from starlette.concurrency import run_in_threadpool

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


def _sse(event: str, data: dict) -> str:
    return f"event: {event}\ndata: {json.dumps(data)}\n\n"


async def _agent_stream_generator(payload: AgentRequest):
    """
    Runs the REAL (unmodified) orchestrator pipeline on a background thread
    and forwards its real on_progress callbacks as SSE events, in order,
    as they actually happen. No simulated stages, no timers, no delays.
    """

    start_time = time.time()
    q: "queue.Queue" = queue.Queue()

    SENTINEL_DONE = object()

    def on_progress(stage: str, status: str, message: str):
        q.put({"stage": stage, "status": status, "message": message})

    def _run():
        try:
            result = orchestrator.run(payload.request, on_progress=on_progress)
            q.put(("__result__", result))
        except Exception as exc:
            q.put(("__error__", str(exc)))
        finally:
            q.put(SENTINEL_DONE)

    worker = threading.Thread(target=_run, daemon=True)
    worker.start()

    while True:
        # Blocking queue.get() is moved to a worker thread so the
        # FastAPI event loop is never blocked while waiting for the
        # next real progress event from the synchronous pipeline.
        item = await run_in_threadpool(q.get)

        if item is SENTINEL_DONE:
            break

        if isinstance(item, tuple) and item[0] == "__result__":
            result = item[1]
            execution_time = round(time.time() - start_time, 2)

            final_payload = {
                "request": payload.request,
                "document_type": result.analysis.document_type,
                "assumptions": result.analysis.assumptions,
                "execution_plan": result.planning.execution_plan,
                "status": "Success",
                "execution_time": f"{execution_time} sec",
                "generated_files": {
                    "docx": Path(result.docx_path).name,
                    "pdf": Path(result.pdf_path).name,
                    "txt": Path(result.txt_path).name,
                    "md": Path(result.md_path).name,
                },
            }
            yield _sse("complete", final_payload)

        elif isinstance(item, tuple) and item[0] == "__error__":
            yield _sse("error", {"message": item[1]})

        else:
            # Real stage progress event: {"stage", "status", "message"}
            yield _sse("status", item)


@router.post(
    "/agent/stream",
    tags=["Autonomous Agent"],
)
def run_agent_stream(payload: AgentRequest):
    """
    Streaming counterpart of /agent. Emits real-time SSE progress events
    (analyzer -> planner -> executor -> reflection) as the actual
    orchestrator pipeline executes, then a final `complete` event with
    the same result shape as the existing /agent response, or an
    `error` event if the pipeline raises.

    /agent remains fully intact and unaffected by this route.
    """
    return StreamingResponse(
        _agent_stream_generator(payload),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )