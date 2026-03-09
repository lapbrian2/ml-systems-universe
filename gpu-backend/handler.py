"""
GPU Inference Handler
Loads model weights and runs generation for the interactive gallery.
Supports both custom GAN and diffusion-based pipelines.
"""

import io
import base64
import time
from pathlib import Path

import torch
from PIL import Image

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
MODELS_DIR = Path(__file__).parent / "models"

# Global model reference — loaded once at startup
_pipeline = None


def load_model(model_name: str = "default") -> None:
    """Load model weights into GPU memory at server startup."""
    global _pipeline

    weights_path = MODELS_DIR / model_name
    if weights_path.exists():
        # Custom weights: load your own GAN / fine-tuned diffusion checkpoint
        from diffusers import StableDiffusionPipeline

        _pipeline = StableDiffusionPipeline.from_pretrained(
            str(weights_path),
            torch_dtype=torch.float16,
            safety_checker=None,
        ).to(DEVICE)
    else:
        # Fallback: pull a public model for development
        from diffusers import StableDiffusionPipeline

        _pipeline = StableDiffusionPipeline.from_pretrained(
            "stabilityai/stable-diffusion-2-1-base",
            torch_dtype=torch.float16,
            safety_checker=None,
        ).to(DEVICE)

    if DEVICE == "cuda":
        _pipeline.enable_attention_slicing()


def generate(
    prompt: str,
    spatial_data: dict | None = None,
    width: int = 512,
    height: int = 512,
    steps: int = 30,
    guidance_scale: float = 7.5,
    seed: int | None = None,
) -> dict:
    """
    Run inference and return the result.

    Args:
        prompt: Text prompt or style descriptor from the frontend.
        spatial_data: Optional 3D coordinates / motion data from the WebGL scene.
        width: Output image width.
        height: Output image height.
        steps: Number of diffusion steps (lower = faster, higher = quality).
        guidance_scale: How closely to follow the prompt.
        seed: Reproducibility seed.

    Returns:
        dict with base64 image, generation time, and metadata.
    """
    if _pipeline is None:
        raise RuntimeError("Model not loaded. Call load_model() first.")

    # Incorporate spatial data into the generation context
    if spatial_data:
        coords = spatial_data.get("coordinates", {})
        x, y, z = coords.get("x", 0), coords.get("y", 0), coords.get("z", 0)
        # Map 3D position to style modifiers
        prompt = f"{prompt}, depth {z:.1f}, angle ({x:.1f}, {y:.1f})"

    generator = torch.Generator(device=DEVICE)
    if seed is not None:
        generator.manual_seed(seed)
    else:
        generator.manual_seed(int(time.time()) % (2**32))

    start = time.perf_counter()

    result = _pipeline(
        prompt=prompt,
        width=width,
        height=height,
        num_inference_steps=steps,
        guidance_scale=guidance_scale,
        generator=generator,
    )

    elapsed = time.perf_counter() - start
    image: Image.Image = result.images[0]

    # Encode to base64 for transport back to the frontend
    buffer = io.BytesIO()
    image.save(buffer, format="WEBP", quality=85)
    b64 = base64.b64encode(buffer.getvalue()).decode()

    return {
        "image": f"data:image/webp;base64,{b64}",
        "width": width,
        "height": height,
        "elapsed_seconds": round(elapsed, 3),
        "prompt_used": prompt,
        "seed": generator.initial_seed(),
    }
