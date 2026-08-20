from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.agent import router as agent_router
from app.routes.download import router as download_router

app = FastAPI(
    title="Autonomous AI Agent",
    description="Multi-Agent Autonomous AI System",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
	"http://localhost:5174",
    ],
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