/**
 * Vercel Bridge — Spatially-Conditioned Generation
 *
 * Receives structured spatial data + ControlNet images from the
 * frontend's useSpatialPipeline composable and proxies to the
 * GPU server's /generate/conditioned endpoint.
 *
 * POST /api/generate-conditioned
 */

import { defineEventHandler, readBody, createError } from 'h3'

interface ConditionedPayload {
  structured_prompt: string
  negative_prompt?: string
  control_images?: {
    depth?: string    // base64 data URI
    normals?: string  // base64 data URI
    canny?: string    // base64 data URI
  }
  parameters?: {
    width?: number
    height?: number
    steps?: number
    guidance_scale?: number
    controlnet_conditioning_scale?: number
    seed?: number
  }
}

export default defineEventHandler(async (event) => {
  if (event.method !== 'POST') {
    throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' })
  }

  const config = useRuntimeConfig()
  const gpuUrl = config.gpuInferenceUrl
  const gpuSecret = config.gpuApiSecret

  if (!gpuUrl) {
    throw createError({
      statusCode: 500,
      statusMessage: 'GPU inference URL not configured',
    })
  }

  const body = await readBody<ConditionedPayload>(event)

  if (!body?.structured_prompt || body.structured_prompt.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'Missing structured_prompt' })
  }

  // Clamp parameters
  const params = body.parameters ?? {}
  const payload: ConditionedPayload = {
    structured_prompt: body.structured_prompt.slice(0, 1000),
    negative_prompt: body.negative_prompt?.slice(0, 500) ?? '',
    control_images: body.control_images ?? {},
    parameters: {
      width: clamp(params.width ?? 512, 256, 1024),
      height: clamp(params.height ?? 512, 256, 1024),
      steps: clamp(params.steps ?? 35, 1, 100),
      guidance_scale: clamp(params.guidance_scale ?? 8.5, 1.0, 20.0),
      controlnet_conditioning_scale: clamp(params.controlnet_conditioning_scale ?? 0.75, 0.0, 2.0),
      seed: params.seed ?? undefined,
    },
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (gpuSecret) {
    headers['Authorization'] = `Bearer ${gpuSecret}`
  }

  try {
    const response = await fetch(`${gpuUrl}/generate/conditioned`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(180_000), // 3 min — ControlNet is heavier
    })

    if (!response.ok) {
      const detail = await response.text().catch(() => 'Unknown error')
      throw createError({
        statusCode: response.status,
        statusMessage: `GPU server error: ${detail}`,
      })
    }

    return await response.json()
  }
  catch (err: unknown) {
    if (err && typeof err === 'object' && 'statusCode' in err) {
      throw err
    }

    const message = err instanceof Error ? err.message : 'Unknown error'
    throw createError({
      statusCode: 502,
      statusMessage: `Failed to reach GPU server: ${message}`,
    })
  }
})

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}
