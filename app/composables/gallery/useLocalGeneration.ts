/**
 * Local Generation via ComfyUI
 *
 * For physical installations where you don't want cloud dependency,
 * ComfyUI runs on the same machine (or a local GPU box on LAN)
 * and provides the same generation capabilities via its API.
 *
 * This composable talks directly to ComfyUI's REST API:
 *   POST http://localhost:8188/prompt  → queue a workflow
 *   GET  http://localhost:8188/history → poll for results
 *   WS   ws://localhost:8188/ws       → real-time progress
 *
 * ComfyUI workflow is defined as JSON — no cloud needed.
 * Supports ControlNet, LoRA, custom nodes, the entire ecosystem.
 */

import type { InferenceResult } from '~/composables/gallery/useGalleryInference'

export interface ComfyWorkflow {
  prompt: Record<string, unknown>  // ComfyUI workflow JSON
  client_id: string
}

export function useLocalGeneration() {
  const isConnected = ref(false)
  const isGenerating = ref(false)
  const progress = ref(0)
  const error = ref<string | null>(null)

  let ws: WebSocket | null = null
  let clientId = ''

  /**
   * Connect to a local ComfyUI instance.
   */
  async function connect(baseUrl: string = 'http://localhost:8188'): Promise<boolean> {
    clientId = crypto.randomUUID()

    try {
      // Test REST API
      const res = await fetch(`${baseUrl}/system_stats`, {
        signal: AbortSignal.timeout(5000),
      })
      if (!res.ok) return false

      // Connect WebSocket for progress updates
      const wsUrl = baseUrl.replace('http', 'ws') + `/ws?clientId=${clientId}`
      ws = new WebSocket(wsUrl)

      return new Promise((resolve) => {
        ws!.onopen = () => {
          isConnected.value = true
          console.log('[ComfyUI] Connected')
          resolve(true)
        }

        ws!.onmessage = (event) => {
          try {
            const msg = JSON.parse(event.data)
            if (msg.type === 'progress') {
              progress.value = msg.data.value / msg.data.max
            }
          }
          catch { /* ignore */ }
        }

        ws!.onerror = () => resolve(false)
        ws!.onclose = () => { isConnected.value = false }

        setTimeout(() => resolve(false), 5000)
      })
    }
    catch {
      return false
    }
  }

  /**
   * Build a ControlNet + LoRA workflow for spatial generation.
   *
   * This constructs the ComfyUI workflow JSON programmatically,
   * equivalent to what you'd wire up in the node editor.
   */
  function buildWorkflow(params: {
    prompt: string
    negativePrompt?: string
    depthImage?: string     // base64
    normalsImage?: string   // base64
    loraName?: string
    loraStrength?: number
    width?: number
    height?: number
    steps?: number
    cfg?: number
    seed?: number
  }): Record<string, unknown> {
    const seed = params.seed ?? Math.floor(Math.random() * 2 ** 32)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const workflow: Record<string, { class_type: string; inputs: Record<string, any> }> = {
      // KSampler
      '3': {
        class_type: 'KSampler',
        inputs: {
          seed,
          steps: params.steps ?? 30,
          cfg: params.cfg ?? 8.5,
          sampler_name: 'euler_ancestral',
          scheduler: 'normal',
          denoise: 1,
          model: ['4', 0],
          positive: ['6', 0],
          negative: ['7', 0],
          latent_image: ['5', 0],
        },
      },
      // Checkpoint loader
      '4': {
        class_type: 'CheckpointLoaderSimple',
        inputs: {
          ckpt_name: 'sd_xl_base_1.0.safetensors',
        },
      },
      // Empty latent
      '5': {
        class_type: 'EmptyLatentImage',
        inputs: {
          width: params.width ?? 512,
          height: params.height ?? 512,
          batch_size: 1,
        },
      },
      // Positive prompt
      '6': {
        class_type: 'CLIPTextEncode',
        inputs: {
          text: params.prompt,
          clip: ['4', 1],
        },
      },
      // Negative prompt
      '7': {
        class_type: 'CLIPTextEncode',
        inputs: {
          text: params.negativePrompt ?? 'blurry, low quality, distorted',
          clip: ['4', 1],
        },
      },
      // VAE Decode
      '8': {
        class_type: 'VAEDecode',
        inputs: {
          samples: ['3', 0],
          vae: ['4', 2],
        },
      },
      // Save (we'll grab from history)
      '9': {
        class_type: 'SaveImage',
        inputs: {
          filename_prefix: 'gallery',
          images: ['8', 0],
        },
      },
    }

    // Add LoRA if specified
    if (params.loraName) {
      workflow['10'] = {
        class_type: 'LoraLoader',
        inputs: {
          lora_name: params.loraName,
          strength_model: params.loraStrength ?? 0.8,
          strength_clip: params.loraStrength ?? 0.8,
          model: ['4', 0],
          clip: ['4', 1],
        },
      }
      // Rewire sampler and CLIP to use LoRA output
      workflow['3']!.inputs.model = ['10', 0]
      workflow['6']!.inputs.clip = ['10', 1]
      workflow['7']!.inputs.clip = ['10', 1]
    }

    // Add ControlNet depth if provided
    if (params.depthImage) {
      workflow['11'] = {
        class_type: 'ControlNetLoader',
        inputs: {
          control_net_name: 'control_v11f1p_sd15_depth.pth',
        },
      }
      workflow['12'] = {
        class_type: 'LoadImageBase64',
        inputs: {
          image: params.depthImage.split(',').pop() ?? '',
        },
      }
      workflow['13'] = {
        class_type: 'ControlNetApply',
        inputs: {
          conditioning: ['6', 0],
          control_net: ['11', 0],
          image: ['12', 0],
          strength: 0.75,
        },
      }
      workflow['3']!.inputs.positive = ['13', 0]
    }

    return workflow
  }

  /**
   * Queue a generation and wait for the result.
   */
  async function generate(
    params: Parameters<typeof buildWorkflow>[0],
    baseUrl: string = 'http://localhost:8188',
  ): Promise<InferenceResult | null> {
    if (!isConnected.value) return null

    isGenerating.value = true
    progress.value = 0
    error.value = null

    try {
      const workflow = buildWorkflow(params)
      const start = performance.now()

      // Queue the prompt
      const queueRes = await fetch(`${baseUrl}/prompt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: workflow,
          client_id: clientId,
        }),
      })

      if (!queueRes.ok) {
        throw new Error(`ComfyUI rejected workflow: ${await queueRes.text()}`)
      }

      const { prompt_id } = await queueRes.json()

      // Poll for completion
      const result = await pollForResult(prompt_id, baseUrl)
      const elapsed = (performance.now() - start) / 1000

      if (!result) {
        throw new Error('Generation produced no output')
      }

      return {
        image: result,
        width: params.width ?? 512,
        height: params.height ?? 512,
        elapsed_seconds: Math.round(elapsed * 1000) / 1000,
        prompt_used: params.prompt,
        seed: params.seed ?? 0,
      }
    }
    catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
      return null
    }
    finally {
      isGenerating.value = false
      progress.value = 0
    }
  }

  async function pollForResult(
    promptId: string,
    baseUrl: string,
    maxWait: number = 120000,
  ): Promise<string | null> {
    const deadline = Date.now() + maxWait

    while (Date.now() < deadline) {
      const res = await fetch(`${baseUrl}/history/${promptId}`)
      if (!res.ok) {
        await new Promise(r => setTimeout(r, 500))
        continue
      }

      const history = await res.json()
      const entry = history[promptId]

      if (entry?.outputs) {
        // Find the SaveImage output
        for (const nodeOutput of Object.values(entry.outputs) as Record<string, unknown>[]) {
          const images = nodeOutput?.images as Array<Record<string, string>> | undefined
          if (images?.[0]) {
            const img = images[0]
            // Fetch the actual image
            const imgRes = await fetch(
              `${baseUrl}/view?filename=${img.filename}&subfolder=${img.subfolder ?? ''}&type=${img.type ?? 'output'}`,
            )
            if (imgRes.ok) {
              const blob = await imgRes.blob()
              return await blobToDataUri(blob)
            }
          }
        }
      }

      await new Promise(r => setTimeout(r, 500))
    }

    return null
  }

  function blobToDataUri(blob: Blob): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.readAsDataURL(blob)
    })
  }

  function disconnect() {
    ws?.close()
    isConnected.value = false
  }

  return {
    isConnected: readonly(isConnected),
    isGenerating: readonly(isGenerating),
    progress: readonly(progress),
    error: readonly(error),
    connect,
    generate,
    buildWorkflow,
    disconnect,
  }
}
