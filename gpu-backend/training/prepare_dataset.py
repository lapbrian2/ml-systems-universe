"""
Dataset Preparation & Curation Tool

Prepares a raw image collection into a training-ready dataset.
Handles resizing, deduplication, quality filtering, and optional
auto-captioning for LoRA fine-tuning.

Usage:
    python prepare_dataset.py --input ./raw_images --output ./curated_dataset
    python prepare_dataset.py --input ./raw_images --output ./curated_dataset --auto-caption

Directory structure produced:
    curated_dataset/
    ├── images/
    │   ├── 001.png
    │   ├── 002.png
    │   └── ...
    ├── captions/
    │   ├── 001.txt
    │   ├── 002.txt
    │   └── ...
    └── metadata.json
"""

import argparse
import hashlib
import json
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter, ImageStat


def compute_image_hash(img: Image.Image, hash_size: int = 16) -> str:
    """Perceptual hash for deduplication."""
    resized = img.resize((hash_size, hash_size), Image.Resampling.LANCZOS).convert("L")
    pixels = np.array(resized)
    avg = pixels.mean()
    bits = (pixels > avg).flatten()
    return "".join(str(int(b)) for b in bits)


def assess_quality(img: Image.Image) -> dict:
    """
    Basic quality metrics for filtering.
    Returns scores that help curate the dataset.
    """
    stat = ImageStat.Stat(img)

    # Brightness — avoid pure black or blown-out white
    brightness = sum(stat.mean[:3]) / 3 / 255

    # Contrast — standard deviation of pixel values
    contrast = sum(stat.stddev[:3]) / 3 / 255

    # Sharpness — Laplacian variance
    gray = img.convert("L")
    laplacian = gray.filter(ImageFilter.Kernel(
        size=(3, 3),
        kernel=[-1, -1, -1, -1, 8, -1, -1, -1, -1],
        scale=1,
        offset=128,
    ))
    sharpness = ImageStat.Stat(laplacian).var[0]

    # Resolution adequacy
    min_dim = min(img.size)

    return {
        "brightness": round(brightness, 3),
        "contrast": round(contrast, 3),
        "sharpness": round(sharpness, 1),
        "min_dimension": min_dim,
        "aspect_ratio": round(img.width / img.height, 2),
    }


def prepare_dataset(
    input_dir: str,
    output_dir: str,
    resolution: int = 512,
    min_dimension: int = 384,
    min_sharpness: float = 50.0,
    deduplicate: bool = True,
    auto_caption: bool = False,
    trigger_word: str = "mystyle",
) -> dict:
    """
    Process raw images into a curated training dataset.

    Args:
        input_dir: Directory of raw input images.
        output_dir: Output directory for processed dataset.
        resolution: Target resolution for training images.
        min_dimension: Minimum acceptable image dimension.
        min_sharpness: Minimum sharpness score (filters blurry images).
        deduplicate: Remove perceptually similar images.
        auto_caption: Generate captions using BLIP (requires extra deps).
        trigger_word: Prepended to all captions.
    """
    input_path = Path(input_dir)
    output_path = Path(output_dir)
    image_dir = output_path / "images"
    caption_dir = output_path / "captions"

    image_dir.mkdir(parents=True, exist_ok=True)
    caption_dir.mkdir(parents=True, exist_ok=True)

    # Collect all images
    extensions = {".png", ".jpg", ".jpeg", ".webp", ".tiff", ".bmp"}
    raw_images = [p for p in input_path.rglob("*") if p.suffix.lower() in extensions]
    print(f"[Prepare] Found {len(raw_images)} raw images")

    # Optional: load BLIP for auto-captioning
    captioner = None
    if auto_caption:
        try:
            from transformers import BlipForConditionalGeneration, BlipProcessor

            print("[Prepare] Loading BLIP captioning model...")
            captioner_processor = BlipProcessor.from_pretrained(
                "Salesforce/blip-image-captioning-base"
            )
            captioner_model = BlipForConditionalGeneration.from_pretrained(
                "Salesforce/blip-image-captioning-base"
            )
            captioner = (captioner_processor, captioner_model)
            print("[Prepare] BLIP loaded")
        except ImportError:
            print("[Prepare] Warning: transformers not available, skipping auto-caption")

    seen_hashes: set[str] = set()
    accepted = 0
    rejected_reasons: dict[str, int] = {
        "too_small": 0,
        "too_blurry": 0,
        "duplicate": 0,
        "corrupt": 0,
    }

    metadata = {
        "trigger_word": trigger_word,
        "resolution": resolution,
        "images": [],
    }

    for raw_path in sorted(raw_images):
        try:
            img = Image.open(raw_path).convert("RGB")
        except Exception:
            rejected_reasons["corrupt"] += 1
            continue

        # Quality assessment
        quality = assess_quality(img)

        if quality["min_dimension"] < min_dimension:
            rejected_reasons["too_small"] += 1
            continue

        if quality["sharpness"] < min_sharpness:
            rejected_reasons["too_blurry"] += 1
            continue

        # Deduplication
        if deduplicate:
            img_hash = compute_image_hash(img)
            if img_hash in seen_hashes:
                rejected_reasons["duplicate"] += 1
                continue
            seen_hashes.add(img_hash)

        # Resize and save
        accepted += 1
        filename = f"{accepted:04d}.png"

        # Center-crop to square, then resize
        size = min(img.size)
        left = (img.width - size) // 2
        top = (img.height - size) // 2
        cropped = img.crop((left, top, left + size, top + size))
        resized = cropped.resize((resolution, resolution), Image.Resampling.LANCZOS)
        resized.save(image_dir / filename, "PNG")

        # Caption
        caption = f"a painting in the style of {trigger_word}"
        if captioner:
            processor, model = captioner
            inputs = processor(img, return_tensors="pt")
            out = model.generate(**inputs, max_new_tokens=50)
            auto_cap = processor.decode(out[0], skip_special_tokens=True)
            caption = f"{trigger_word}, {auto_cap}"

        (caption_dir / f"{accepted:04d}.txt").write_text(caption)

        metadata["images"].append({
            "filename": filename,
            "source": str(raw_path.name),
            "quality": quality,
            "caption": caption,
        })

    # Save metadata
    (output_path / "metadata.json").write_text(json.dumps(metadata, indent=2))

    print(f"\n[Prepare] Results:")
    print(f"  Accepted: {accepted}")
    for reason, count in rejected_reasons.items():
        if count > 0:
            print(f"  Rejected ({reason}): {count}")
    print(f"\n  Output: {output_path}")
    print(f"  Trigger word: '{trigger_word}'")

    return metadata


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Prepare dataset for LoRA training")
    parser.add_argument("--input", required=True, help="Raw images directory")
    parser.add_argument("--output", required=True, help="Output dataset directory")
    parser.add_argument("--resolution", type=int, default=512)
    parser.add_argument("--min-dimension", type=int, default=384)
    parser.add_argument("--min-sharpness", type=float, default=50.0)
    parser.add_argument("--no-deduplicate", action="store_true")
    parser.add_argument("--auto-caption", action="store_true")
    parser.add_argument("--trigger-word", default="mystyle")

    args = parser.parse_args()

    prepare_dataset(
        input_dir=args.input,
        output_dir=args.output,
        resolution=args.resolution,
        min_dimension=args.min_dimension,
        min_sharpness=args.min_sharpness,
        deduplicate=not args.no_deduplicate,
        auto_caption=args.auto_caption,
        trigger_word=args.trigger_word,
    )
