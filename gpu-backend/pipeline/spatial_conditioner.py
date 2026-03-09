"""
Spatial Conditioner — Server-Side ControlNet Integration

Receives structured spatial data + control images from the Vercel bridge
and conditions the diffusion pipeline with ControlNet for precise
geometric control over generation.

The generative model becomes a renderer, not an imaginer:
  3D Scene skeleton → ControlNet depth/normals → Your LoRA style → Output
"""

import base64
import io
from dataclasses import dataclass

import numpy as np
import torch
from PIL import Image

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

_controlnet_depth = None
_controlnet_normals = None
_controlnet_pipeline = None


@dataclass
class SpatialInput:
    """Structured spatial data from the Three.js scene."""

    structured_prompt: str
    negative_prompt: str
    depth_image: Image.Image | None
    normal_image: Image.Image | None
    width: int
    height: int
    steps: int
    guidance_scale: float
    controlnet_conditioning_scale: float
    seed: int | None


def load_controlnet_pipeline(base_model_path: str, lora_path: str | None = None) -> None:
    """
    Load the ControlNet-conditioned pipeline.
    Optionally stack your custom LoRA weights on top.
    """
    global _controlnet_depth, _controlnet_normals, _controlnet_pipeline

    from diffusers import (
        ControlNetModel,
        StableDiffusionControlNetPipeline,
        UniPCMultistepScheduler,
    )

    # Load ControlNet models for depth and normal conditioning
    _controlnet_depth = ControlNetModel.from_pretrained(
        "lllyasviel/control_v11f1p_sd15_depth",
        torch_dtype=torch.float16,
    )
    _controlnet_normals = ControlNetModel.from_pretrained(
        "lllyasviel/control_v11p_sd15_normalbae",
        torch_dtype=torch.float16,
    )

    _controlnet_pipeline = StableDiffusionControlNetPipeline.from_pretrained(
        base_model_path,
        controlnet=[_controlnet_depth, _controlnet_normals],
        torch_dtype=torch.float16,
        safety_checker=None,
    ).to(DEVICE)

    # Faster scheduler
    _controlnet_pipeline.scheduler = UniPCMultistepScheduler.from_config(
        _controlnet_pipeline.scheduler.config
    )

    # Memory optimizations
    _controlnet_pipeline.enable_model_cpu_offload()
    _controlnet_pipeline.enable_attention_slicing()

    # Stack LoRA weights if provided
    if lora_path:
        _controlnet_pipeline.load_lora_weights(lora_path)
        print(f"[Spatial Conditioner] LoRA loaded from {lora_path}")


def decode_control_image(data_url: str, size: tuple[int, int] = (512, 512)) -> Image.Image:
    """Decode a base64 data URI into a PIL Image."""
    # Strip data URI prefix
    if "," in data_url:
        data_url = data_url.split(",", 1)[1]
    raw = base64.b64decode(data_url)
    img = Image.open(io.BytesIO(raw)).convert("RGB")
    return img.resize(size, Image.Resampling.LANCZOS)


def parse_spatial_input(payload: dict) -> SpatialInput:
    """Parse the structured payload from the Vercel bridge."""
    control = payload.get("control_images", {})
    params = payload.get("parameters", {})

    width = params.get("width", 512)
    height = params.get("height", 512)
    size = (width, height)

    depth_image = None
    normal_image = None

    if control.get("depth"):
        depth_image = decode_control_image(control["depth"], size)

    if control.get("normals"):
        normal_image = decode_control_image(control["normals"], size)

    return SpatialInput(
        structured_prompt=payload.get("structured_prompt", ""),
        negative_prompt=payload.get("negative_prompt", ""),
        depth_image=depth_image,
        normal_image=normal_image,
        width=width,
        height=height,
        steps=params.get("steps", 35),
        guidance_scale=params.get("guidance_scale", 8.5),
        controlnet_conditioning_scale=params.get("controlnet_conditioning_scale", 0.75),
        seed=params.get("seed"),
    )


def generate_conditioned(spatial_input: SpatialInput) -> dict:
    """
    Run spatially-conditioned generation.

    If ControlNet images are available, uses them for precise geometric control.
    Falls back to prompt-only generation if no control images provided.
    """
    if _controlnet_pipeline is None:
        raise RuntimeError("Pipeline not loaded. Call load_controlnet_pipeline() first.")

    generator = torch.Generator(device=DEVICE)
    if spatial_input.seed is not None:
        generator.manual_seed(spatial_input.seed)

    images = []
    controlnet_conditioning_scales = []

    if spatial_input.depth_image:
        images.append(spatial_input.depth_image)
        controlnet_conditioning_scales.append(spatial_input.controlnet_conditioning_scale)

    if spatial_input.normal_image:
        images.append(spatial_input.normal_image)
        controlnet_conditioning_scales.append(spatial_input.controlnet_conditioning_scale * 0.7)

    if not images:
        # No control images — use depth and normals placeholders
        # Generate a blank conditioning image (neutral)
        blank = Image.new("RGB", (spatial_input.width, spatial_input.height), (128, 128, 128))
        images = [blank, blank]
        controlnet_conditioning_scales = [0.0, 0.0]  # Zero influence

    import time
    start = time.perf_counter()

    result = _controlnet_pipeline(
        prompt=spatial_input.structured_prompt,
        negative_prompt=spatial_input.negative_prompt,
        image=images,
        num_inference_steps=spatial_input.steps,
        guidance_scale=spatial_input.guidance_scale,
        controlnet_conditioning_scale=controlnet_conditioning_scales,
        generator=generator,
        width=spatial_input.width,
        height=spatial_input.height,
    )

    elapsed = time.perf_counter() - start
    output_image: Image.Image = result.images[0]

    # Encode to base64
    buffer = io.BytesIO()
    output_image.save(buffer, format="WEBP", quality=90)
    b64 = base64.b64encode(buffer.getvalue()).decode()

    return {
        "image": f"data:image/webp;base64,{b64}",
        "width": spatial_input.width,
        "height": spatial_input.height,
        "elapsed_seconds": round(elapsed, 3),
        "prompt_used": spatial_input.structured_prompt,
        "seed": generator.initial_seed(),
        "pipeline": "controlnet_conditioned",
    }
