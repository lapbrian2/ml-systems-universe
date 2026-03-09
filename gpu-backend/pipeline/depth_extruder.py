"""
Dimensional Translation — Depth Estimation & Point Cloud Extraction

Takes a flat generated image and extrudes it into 3D:
  Generated Image → Depth Anything → Depth Map → Point Cloud Data

The point cloud is sent back to the frontend as a compact binary buffer
that Three.js can directly ingest as a BufferGeometry.

This is what turns a 2D Crespo-like biological texture into an
Anadol-like data sculpture the viewer can walk through.
"""

import base64
import io
import struct
from dataclasses import dataclass

import numpy as np
import torch
from PIL import Image

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

_depth_model = None
_depth_transform = None


def load_depth_model(model_type: str = "vitl") -> None:
    """
    Load Depth Anything V2 for monocular depth estimation.

    Args:
        model_type: 'vits' (fast), 'vitb' (balanced), 'vitl' (quality)
    """
    global _depth_model, _depth_transform

    from transformers import AutoModelForDepthEstimation, AutoImageProcessor

    model_id = f"depth-anything/Depth-Anything-V2-{model_type.capitalize()}-hf"

    _depth_transform = AutoImageProcessor.from_pretrained(model_id)
    _depth_model = AutoModelForDepthEstimation.from_pretrained(
        model_id, torch_dtype=torch.float32
    ).to(DEVICE)
    _depth_model.eval()

    print(f"[Depth] Loaded {model_id}")


def estimate_depth(image: Image.Image) -> np.ndarray:
    """
    Run depth estimation on a generated image.

    Returns:
        Depth map as float32 numpy array, normalized to [0, 1].
        Shape: (H, W). 0 = near, 1 = far.
    """
    if _depth_model is None or _depth_transform is None:
        raise RuntimeError("Depth model not loaded. Call load_depth_model() first.")

    inputs = _depth_transform(images=image, return_tensors="pt").to(DEVICE)

    with torch.no_grad():
        outputs = _depth_model(**inputs)
        depth = outputs.predicted_depth

    # Interpolate to original size
    depth = torch.nn.functional.interpolate(
        depth.unsqueeze(1),
        size=image.size[::-1],  # (H, W)
        mode="bicubic",
        align_corners=False,
    ).squeeze()

    depth_np = depth.cpu().numpy()

    # Normalize to [0, 1]
    d_min, d_max = depth_np.min(), depth_np.max()
    if d_max - d_min > 0:
        depth_np = (depth_np - d_min) / (d_max - d_min)
    else:
        depth_np = np.zeros_like(depth_np)

    return depth_np.astype(np.float32)


@dataclass
class PointCloudData:
    """Compact point cloud for WebGL transport."""
    positions: np.ndarray   # (N, 3) float32 — x, y, z
    colors: np.ndarray      # (N, 3) float32 — r, g, b normalized
    count: int
    bounds: dict            # { min: [x,y,z], max: [x,y,z] }


def image_to_point_cloud(
    image: Image.Image,
    depth_map: np.ndarray,
    resolution: int = 256,
    depth_scale: float = 2.0,
    density: float = 1.0,
) -> PointCloudData:
    """
    Extrude a 2D image into a 3D point cloud using its depth map.

    Each pixel becomes a point in 3D space:
    - X, Y from pixel coordinates (centered, normalized)
    - Z from depth value (scaled)
    - Color from the original image pixel

    Args:
        image: The generated art image.
        depth_map: Corresponding depth map (H, W), normalized [0, 1].
        resolution: Downsample to this resolution for point density control.
        depth_scale: How far to extrude in Z (higher = deeper relief).
        density: 0.0–1.0, fraction of pixels to include as points.
    """
    # Resize to target resolution
    img_resized = image.resize((resolution, resolution), Image.Resampling.LANCZOS)
    depth_resized = Image.fromarray((depth_map * 255).astype(np.uint8)).resize(
        (resolution, resolution), Image.Resampling.LANCZOS
    )

    img_array = np.array(img_resized, dtype=np.float32) / 255.0  # (H, W, 3)
    depth_array = np.array(depth_resized, dtype=np.float32) / 255.0  # (H, W)

    h, w = depth_array.shape

    # Create grid of (x, y) coordinates
    ys, xs = np.mgrid[0:h, 0:w]

    # Normalize to [-1, 1] range centered at origin
    xs_norm = (xs.astype(np.float32) / w - 0.5) * 2.0
    ys_norm = -(ys.astype(np.float32) / h - 0.5) * 2.0  # Flip Y for 3D
    zs = (1.0 - depth_array) * depth_scale  # Invert: near = high Z

    # Flatten
    positions = np.stack([xs_norm.ravel(), ys_norm.ravel(), zs.ravel()], axis=-1)
    colors = img_array.reshape(-1, 3)

    # Subsample for density control
    total = positions.shape[0]
    keep = max(1, int(total * density))

    if keep < total:
        indices = np.random.choice(total, keep, replace=False)
        indices.sort()
        positions = positions[indices]
        colors = colors[indices]

    bounds = {
        "min": positions.min(axis=0).tolist(),
        "max": positions.max(axis=0).tolist(),
    }

    return PointCloudData(
        positions=positions,
        colors=colors,
        count=positions.shape[0],
        bounds=bounds,
    )


def point_cloud_to_buffer(cloud: PointCloudData) -> str:
    """
    Pack point cloud into a compact base64 binary buffer for WebGL.

    Format: interleaved float32 array [x, y, z, r, g, b, x, y, z, r, g, b, ...]
    Total size: N * 6 * 4 bytes

    This can be directly loaded into a Three.js Float32BufferAttribute.
    """
    # Interleave positions and colors
    interleaved = np.empty((cloud.count, 6), dtype=np.float32)
    interleaved[:, 0:3] = cloud.positions
    interleaved[:, 3:6] = cloud.colors

    raw_bytes = interleaved.tobytes()
    return base64.b64encode(raw_bytes).decode()


def process_for_gallery(
    image: Image.Image,
    depth_scale: float = 2.0,
    resolution: int = 256,
    density: float = 0.8,
) -> dict:
    """
    Full pipeline: image → depth → point cloud → transport-ready package.

    Returns a dict ready to send back through the Vercel bridge:
    {
        "point_cloud": base64 buffer,
        "point_count": int,
        "bounds": { min, max },
        "depth_map": base64 image (for ControlNet feedback loops),
    }
    """
    # Estimate depth
    depth_map = estimate_depth(image)

    # Generate point cloud
    cloud = image_to_point_cloud(
        image, depth_map,
        resolution=resolution,
        depth_scale=depth_scale,
        density=density,
    )

    # Pack for transport
    buffer = point_cloud_to_buffer(cloud)

    # Also send the depth map as an image for potential ControlNet feedback
    depth_img = Image.fromarray((depth_map * 255).astype(np.uint8))
    depth_buffer = io.BytesIO()
    depth_img.save(depth_buffer, format="PNG")
    depth_b64 = base64.b64encode(depth_buffer.getvalue()).decode()

    return {
        "point_cloud": buffer,
        "point_count": cloud.count,
        "bounds": cloud.bounds,
        "depth_map": f"data:image/png;base64,{depth_b64}",
        "stride": 6,  # floats per vertex (x,y,z,r,g,b)
    }
