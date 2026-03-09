"""
LoRA Fine-Tuning Pipeline

Train a custom LoRA adapter on your curated dataset to establish
a proprietary visual signature. This produces lightweight weight files
(~10-50MB) that stack on top of any compatible base model.

Usage:
    python train_lora.py --config training_config.yaml

Key principle: 50 perfectly curated images > 5,000 random ones.
The dataset defines your aesthetic — the model just learns the rules.
"""

import argparse
import math
import os
from pathlib import Path

import torch
import torch.nn.functional as F
from PIL import Image
from torch.utils.data import DataLoader, Dataset
from torchvision import transforms


class StyleDataset(Dataset):
    """
    Curated style dataset.

    Expected directory structure:
        dataset_dir/
        ├── images/
        │   ├── 001.png
        │   ├── 002.png
        │   └── ...
        └── captions/
            ├── 001.txt
            ├── 002.txt
            └── ...

    If no captions directory exists, uses the trigger word as the caption
    for all images (useful for pure style transfer).
    """

    def __init__(
        self,
        dataset_dir: str,
        trigger_word: str = "mystyle",
        resolution: int = 512,
    ):
        self.dataset_dir = Path(dataset_dir)
        self.trigger_word = trigger_word
        self.resolution = resolution

        self.image_dir = self.dataset_dir / "images"
        self.caption_dir = self.dataset_dir / "captions"

        if not self.image_dir.exists():
            raise FileNotFoundError(f"Image directory not found: {self.image_dir}")

        self.image_paths = sorted([
            p for p in self.image_dir.iterdir()
            if p.suffix.lower() in {".png", ".jpg", ".jpeg", ".webp"}
        ])

        if len(self.image_paths) == 0:
            raise ValueError(f"No images found in {self.image_dir}")

        print(f"[Dataset] Found {len(self.image_paths)} images")

        self.transform = transforms.Compose([
            transforms.Resize(resolution, interpolation=transforms.InterpolationMode.LANCZOS),
            transforms.CenterCrop(resolution),
            transforms.ToTensor(),
            transforms.Normalize([0.5], [0.5]),
        ])

    def __len__(self) -> int:
        return len(self.image_paths)

    def __getitem__(self, idx: int) -> dict:
        image_path = self.image_paths[idx]
        image = Image.open(image_path).convert("RGB")
        image = self.transform(image)

        # Load caption or use trigger word
        caption_path = self.caption_dir / f"{image_path.stem}.txt"
        if caption_path.exists():
            caption = caption_path.read_text().strip()
            # Prepend trigger word if not already present
            if self.trigger_word not in caption:
                caption = f"{self.trigger_word}, {caption}"
        else:
            caption = f"a painting in the style of {self.trigger_word}"

        return {"image": image, "caption": caption}


def train(
    dataset_dir: str,
    output_dir: str,
    base_model: str = "stabilityai/stable-diffusion-2-1-base",
    trigger_word: str = "mystyle",
    resolution: int = 512,
    train_batch_size: int = 1,
    num_epochs: int = 100,
    learning_rate: float = 1e-4,
    lora_rank: int = 8,
    lora_alpha: int = 16,
    save_every_n_epochs: int = 25,
    seed: int = 42,
) -> None:
    """
    Train a LoRA adapter.

    Args:
        dataset_dir: Path to your curated dataset.
        output_dir: Where to save LoRA weights.
        base_model: HuggingFace model ID or local path.
        trigger_word: Unique token that activates your style.
        resolution: Training resolution (match your target output).
        train_batch_size: Batch size (1 for small datasets).
        num_epochs: Number of training epochs.
        learning_rate: LoRA learning rate (1e-4 is a good starting point).
        lora_rank: LoRA rank — lower = smaller file, higher = more capacity.
        lora_alpha: LoRA alpha — scaling factor, typically 2x rank.
        save_every_n_epochs: Checkpoint frequency.
        seed: Random seed for reproducibility.
    """
    from diffusers import AutoencoderKL, DDPMScheduler, UNet2DConditionModel
    from diffusers.loaders import AttnProcsLayers
    from diffusers.models.attention_processor import LoRAAttnProcessor
    from transformers import CLIPTextModel, CLIPTokenizer

    torch.manual_seed(seed)
    device = "cuda" if torch.cuda.is_available() else "cpu"
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)

    print(f"[Train] Device: {device}")
    print(f"[Train] Base model: {base_model}")
    print(f"[Train] Trigger word: '{trigger_word}'")
    print(f"[Train] LoRA rank: {lora_rank}, alpha: {lora_alpha}")

    # Load base model components
    tokenizer = CLIPTokenizer.from_pretrained(base_model, subfolder="tokenizer")
    text_encoder = CLIPTextModel.from_pretrained(
        base_model, subfolder="text_encoder", torch_dtype=torch.float32
    ).to(device)
    vae = AutoencoderKL.from_pretrained(
        base_model, subfolder="vae", torch_dtype=torch.float32
    ).to(device)
    unet = UNet2DConditionModel.from_pretrained(
        base_model, subfolder="unet", torch_dtype=torch.float32
    ).to(device)
    noise_scheduler = DDPMScheduler.from_pretrained(base_model, subfolder="scheduler")

    # Freeze everything except LoRA layers
    text_encoder.requires_grad_(False)
    vae.requires_grad_(False)
    unet.requires_grad_(False)

    # Inject LoRA into UNet attention layers
    lora_attn_procs = {}
    for name in unet.attn_processors.keys():
        cross_attention_dim = (
            None
            if name.endswith("attn1.processor")
            else unet.config.cross_attention_dim
        )
        if name.startswith("mid_block"):
            hidden_size = unet.config.block_out_channels[-1]
        elif name.startswith("up_blocks"):
            block_id = int(name[len("up_blocks.")])
            hidden_size = list(reversed(unet.config.block_out_channels))[block_id]
        elif name.startswith("down_blocks"):
            block_id = int(name[len("down_blocks.")])
            hidden_size = unet.config.block_out_channels[block_id]
        else:
            continue

        lora_attn_procs[name] = LoRAAttnProcessor(
            hidden_size=hidden_size,
            cross_attention_dim=cross_attention_dim,
            rank=lora_rank,
        )

    unet.set_attn_processor(lora_attn_procs)
    lora_layers = AttnProcsLayers(unet.attn_processors)

    # Dataset & dataloader
    dataset = StyleDataset(dataset_dir, trigger_word=trigger_word, resolution=resolution)
    dataloader = DataLoader(dataset, batch_size=train_batch_size, shuffle=True)

    # Optimizer — only LoRA parameters
    optimizer = torch.optim.AdamW(lora_layers.parameters(), lr=learning_rate, weight_decay=1e-2)

    # Learning rate scheduler
    total_steps = num_epochs * math.ceil(len(dataset) / train_batch_size)
    lr_scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=total_steps)

    print(f"[Train] Dataset: {len(dataset)} images")
    print(f"[Train] Total steps: {total_steps}")
    print(f"[Train] Starting training...\n")

    global_step = 0

    for epoch in range(num_epochs):
        epoch_loss = 0.0

        for batch in dataloader:
            # Encode images to latent space
            latents = vae.encode(batch["image"].to(device)).latent_dist.sample()
            latents = latents * vae.config.scaling_factor

            # Sample noise
            noise = torch.randn_like(latents)
            timesteps = torch.randint(
                0, noise_scheduler.config.num_train_timesteps,
                (latents.shape[0],), device=device,
            ).long()

            # Add noise to latents
            noisy_latents = noise_scheduler.add_noise(latents, noise, timesteps)

            # Encode text
            tokens = tokenizer(
                batch["caption"],
                max_length=tokenizer.model_max_length,
                padding="max_length",
                truncation=True,
                return_tensors="pt",
            ).input_ids.to(device)
            encoder_hidden_states = text_encoder(tokens)[0]

            # Predict noise
            noise_pred = unet(noisy_latents, timesteps, encoder_hidden_states).sample

            # Loss
            loss = F.mse_loss(noise_pred.float(), noise.float(), reduction="mean")

            loss.backward()
            torch.nn.utils.clip_grad_norm_(lora_layers.parameters(), 1.0)
            optimizer.step()
            lr_scheduler.step()
            optimizer.zero_grad()

            epoch_loss += loss.item()
            global_step += 1

        avg_loss = epoch_loss / max(len(dataloader), 1)
        print(f"  Epoch {epoch + 1}/{num_epochs} | Loss: {avg_loss:.6f} | LR: {lr_scheduler.get_last_lr()[0]:.2e}")

        # Save checkpoint
        if (epoch + 1) % save_every_n_epochs == 0:
            checkpoint_path = output_path / f"checkpoint-epoch-{epoch + 1}"
            unet.save_attn_procs(str(checkpoint_path))
            print(f"  → Saved checkpoint: {checkpoint_path}")

    # Save final weights
    final_path = output_path / "final"
    unet.save_attn_procs(str(final_path))
    print(f"\n[Train] Complete. Final LoRA weights: {final_path}")
    print(f"[Train] Trigger word: '{trigger_word}'")
    print(f"[Train] To use: pipeline.load_lora_weights('{final_path}')")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train a custom LoRA style adapter")
    parser.add_argument("--dataset", required=True, help="Path to curated dataset directory")
    parser.add_argument("--output", required=True, help="Output directory for LoRA weights")
    parser.add_argument("--base-model", default="stabilityai/stable-diffusion-2-1-base")
    parser.add_argument("--trigger-word", default="mystyle", help="Unique style activation token")
    parser.add_argument("--resolution", type=int, default=512)
    parser.add_argument("--epochs", type=int, default=100)
    parser.add_argument("--lr", type=float, default=1e-4)
    parser.add_argument("--rank", type=int, default=8, help="LoRA rank")
    parser.add_argument("--alpha", type=int, default=16, help="LoRA alpha")
    parser.add_argument("--batch-size", type=int, default=1)
    parser.add_argument("--save-every", type=int, default=25)
    parser.add_argument("--seed", type=int, default=42)

    args = parser.parse_args()

    train(
        dataset_dir=args.dataset,
        output_dir=args.output,
        base_model=args.base_model,
        trigger_word=args.trigger_word,
        resolution=args.resolution,
        train_batch_size=args.batch_size,
        num_epochs=args.epochs,
        learning_rate=args.lr,
        lora_rank=args.rank,
        lora_alpha=args.alpha,
        save_every_n_epochs=args.save_every,
        seed=args.seed,
    )
