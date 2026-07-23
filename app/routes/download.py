from pathlib import Path

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

router = APIRouter(tags=["Downloads"])

BASE_DIR = Path("docs/generated")


@router.get("/download/{filename}")
def download_file(filename: str):

    file_path = (BASE_DIR / filename).resolve()

    if BASE_DIR.resolve() not in file_path.parents:
        raise HTTPException(
            status_code=400,
            detail="Invalid Filename"
        )

    return FileResponse(
        path=file_path,
        filename=filename,
        media_type="application/octet-stream",
    )