"""
FastAPI server for GPU inference.
Deploy this container to RunPod, Modal, or any GPU cloud provider.

Usage (local dev):
    uvicorn app:app --host 0.0.0.0 --port 8000

Usage (production):
    Set GPU_API_SECRET env var to secure the endpoint.
"""

import os

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from handler import generate, load_model

app = FastAPI(title="Gallery GPU Inference", version="1.0.0")

# CORS — in production, lock this to your Vercel domain
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["POST"],
    allow_headers=["Authorization", "Content-Type"],
)

# Shared secret between Vercel edge function and this server
GPU_API_SECRET = os.getenv("GPU_API_SECRET", "")


def verify_auth(request: Request) -> None:
    """Verify the request comes from our Vercel bridge."""
    if not GPU_API_SECRET:
        return  # No secret set — dev mode, allow all
    token = request.headers.get("Authorization", "").removeprefix("Bearer ").strip()
    if token != GPU_API_SECRET:
        raise HTTPException(status_code=401, detail="Unauthorized")


class GenerateRequest(BaseModel):
    prompt: str = Field(..., min_length=1, max_length=500)
    spatial_data: dict | None = None
    width: int = Field(512, ge=256, le=1024)
    height: int = Field(512, ge=256, le=1024)
    steps: int = Field(30, ge=1, le=100)
    guidance_scale: float = Field(7.5, ge=1.0, le=20.0)
    seed: int | None = None


@app.on_event("startup")
async def startup() -> None:
    """Pre-load model weights into GPU memory on container boot."""
    model_name = os.getenv("MODEL_NAME", "default")
    load_model(model_name)


@app.post("/generate")
async def generate_endpoint(request: Request, body: GenerateRequest):
    verify_auth(request)
    try:
        result = generate(
            prompt=body.prompt,
            spatial_data=body.spatial_data,
            width=body.width,
            height=body.height,
            steps=body.steps,
            guidance_scale=body.guidance_scale,
            seed=body.seed,
        )
        return result
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))


@app.get("/health")
async def health():
    """Health check for container orchestrators."""
    return {"status": "ok"}
