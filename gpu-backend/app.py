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
from pipeline.spatial_conditioner import (
    generate_conditioned,
    load_controlnet_pipeline,
    parse_spatial_input,
)
from pipeline.depth_extruder import load_depth_model, process_for_gallery

app = FastAPI(title="Gallery GPU Inference", version="2.0.0")

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
    extrude_3d: bool = Field(False, description="Return point cloud data for volumetric display")
    point_cloud_resolution: int = Field(256, ge=64, le=512)
    point_cloud_density: float = Field(0.8, ge=0.1, le=1.0)
    depth_scale: float = Field(2.0, ge=0.5, le=5.0)


class ConditionedGenerateRequest(BaseModel):
    """Spatially-conditioned generation — uses ControlNet + LoRA."""
    structured_prompt: str = Field(..., min_length=1, max_length=1000)
    negative_prompt: str = ""
    control_images: dict = Field(default_factory=dict)
    parameters: dict = Field(default_factory=dict)


PIPELINE_MODE = os.getenv("PIPELINE_MODE", "basic")  # 'basic' or 'spatial'


@app.on_event("startup")
async def startup() -> None:
    """Pre-load model weights into GPU memory on container boot."""
    model_name = os.getenv("MODEL_NAME", "default")
    lora_path = os.getenv("LORA_WEIGHTS_PATH", "")

    if PIPELINE_MODE == "spatial":
        base_model = os.getenv("BASE_MODEL", "stabilityai/stable-diffusion-2-1-base")
        load_controlnet_pipeline(base_model, lora_path or None)
    else:
        load_model(model_name)

    # Always load depth model for 3D extrusion
    if os.getenv("ENABLE_DEPTH", "true").lower() == "true":
        depth_quality = os.getenv("DEPTH_QUALITY", "vitl")
        load_depth_model(depth_quality)


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

        # Optional: extrude into 3D point cloud for volumetric display
        if body.extrude_3d:
            import base64, io
            from PIL import Image as PILImage

            # Decode the generated image
            img_data = result["image"].split(",", 1)[1]
            img_bytes = base64.b64decode(img_data)
            img = PILImage.open(io.BytesIO(img_bytes)).convert("RGB")

            volume_data = process_for_gallery(
                img,
                depth_scale=body.depth_scale,
                resolution=body.point_cloud_resolution,
                density=body.point_cloud_density,
            )
            result["volume"] = volume_data

        return result
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))


@app.post("/generate/conditioned")
async def conditioned_endpoint(request: Request, body: ConditionedGenerateRequest):
    """Spatially-conditioned generation with ControlNet + LoRA."""
    verify_auth(request)
    try:
        spatial_input = parse_spatial_input(body.model_dump())
        result = generate_conditioned(spatial_input)
        return result
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))


@app.get("/health")
async def health():
    """Health check for container orchestrators."""
    return {"status": "ok", "pipeline_mode": PIPELINE_MODE}
