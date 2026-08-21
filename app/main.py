import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.agent import router as agent_router
from app.routes.download import router as download_router

app = FastAPI(
    title="Autonomous AI Agent",
    description="Multi-Agent Autonomous AI System",
    version="1.0.0"
)

# Comma-separated list of allowed origins, e.g.:
#   ALLOWED_ORIGINS=https://3-108-215-197.sslip.io,http://localhost:5173
# Defaults to the local dev origins so nothing breaks locally when the
# env var is unset. In production, Caddy serves frontend + backend from
# the same HTTPS origin, so most real requests are same-origin anyway;
# this only matters if something calls the API cross-origin directly.
_default_origins = "http://localhost:5173,http://localhost:5174"
allowed_origins = [
    o.strip()
    for o in os.getenv("ALLOWED_ORIGINS", _default_origins).split(",")
    if o.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(agent_router)
app.include_router(download_router)

@app.get("/")
def home():
    return {
        "status": "running",
        "message": "🚀 Autonomous AI Agent API is running successfully!"
    }