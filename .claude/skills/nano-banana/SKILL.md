---
name: nano-banana
description: Generates AI images using the nano-banana CLI powered by Google Gemini models. Supports multi-resolution (512-4K), aspect ratios, reference image editing, style transfer, and transparent asset generation. Use when asked to generate images, create sprites, make assets, produce artwork, create mockups, or any image generation task.
allowed-tools: Bash
---

# nano-banana - AI Image Generation

Generate images from text prompts using Google Gemini 3.1 Flash (default) or Gemini 3 Pro via the `nano-banana` CLI.

## First-Time Setup

If `nano-banana` is not installed, run:

```bash
git clone https://github.com/kingbootoshi/nano-banana-2-skill.git ~/tools/nano-banana-2
cd ~/tools/nano-banana-2 && bun install && bun link
mkdir -p ~/.local/bin && ln -sf ~/tools/nano-banana-2/src/cli.ts ~/.local/bin/nano-banana
```

The user must have a Gemini API key. Set it up:

```bash
mkdir -p ~/.nano-banana
echo "GEMINI_API_KEY=<key>" > ~/.nano-banana/.env
```

Get a free key at: https://aistudio.google.com/apikey

Requires: `bun`, `ffmpeg` (for transparency mode), `imagemagick` (for auto-crop).

## Command Syntax

```
nano-banana "prompt" [options]
```

Always run via bun if direct execution fails:

```bash
bun run ~/.local/bin/nano-banana "prompt" [options]
```

## Options

| Flag | Default | Description |
|------|---------|-------------|
| `-o, --output` | `nano-gen-{timestamp}` | Output filename (no extension) |
| `-s, --size` | `1K` | Resolution: `512`, `1K`, `2K`, `4K` |
| `-a, --aspect` | model default | Ratio: `1:1`, `16:9`, `9:16`, `4:3`, `3:4`, `3:2`, `2:3`, `4:5`, `5:4`, `21:9` |
| `-m, --model` | `flash` | Model: `flash`/`nb2`, `pro`/`nb-pro`, or full model ID |
| `-d, --dir` | cwd | Output directory |
| `-r, --ref` | - | Reference image path (repeatable for multiple refs) |
| `-t, --transparent` | - | Green screen generation + background removal |
| `--api-key` | - | Override API key |
| `--costs` | - | Show cost summary |

## Models & Pricing

| Alias | Model ID | Best For | ~Cost/1K |
|-------|----------|----------|----------|
| `flash` | `gemini-3.1-flash-image-preview` | Speed, volume, iteration | $0.067 |
| `pro` | `gemini-3-pro-image-preview` | Max quality, complex scenes | $0.134 |

Size costs (Flash): 512 ~$0.045 | 1K ~$0.067 | 2K ~$0.101 | 4K ~$0.151

## Common Workflows

### Basic Generation
```bash
nano-banana "minimal dashboard UI with dark theme" -o dashboard -s 1K
nano-banana "cinematic landscape at sunset" -a 16:9 -s 2K
```

### Reference Image Editing
```bash
nano-banana "change background to white" -r dark-ui.png -o light-ui
nano-banana "combine these two styles" -r style1.png -r style2.png -o combined
```

### Transparent Assets
```bash
nano-banana "robot mascot character" -t -o mascot
nano-banana "pixel art treasure chest" -t -o chest
```

The `-t` flag auto-prompts green screen, then uses FFmpeg colorkey + despill for clean PNG transparency.

### Batch Generation
Run multiple commands sequentially or use a loop:
```bash
for style in "cyberpunk" "watercolor" "minimal"; do
  nano-banana "${style} city scene" -o "city-${style}" -s 2K
done
```

### High Quality with Pro
```bash
nano-banana "detailed portrait" --model pro -s 2K -a 9:16
```

## Reference Image Tips

- First `-r`: primary style/content source
- Additional `-r`: secondary influences
- Last `-r` with a blank image: controls exact output dimensions
- Example for exact dimensions:
  ```bash
  nano-banana "pixel art character 256x256" -r style.png -r blank-256x256.png -o sprite
  ```

## Output

Images save to the current directory (or `-d` path) as PNG/JPEG. Cost is logged to `~/.nano-banana/costs.json`. View with `nano-banana --costs`.
