from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import sessions, credits, ventures

app = FastAPI(title="GSF Python Backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(sessions.router)
app.include_router(credits.router)
app.include_router(ventures.router)


@app.get("/health")
async def health():
    return {"status": "ok"}
