/**
 * Vercel Edge Function — The Bridge
 *
 * This is the secure middleman between the browser and the GPU server.
 * It holds the API secret so the frontend never sees it, validates the
 * incoming request, and proxies it to the GPU inference endpoint.
 *
 * The browser calls: POST /api/generate
 * This function calls: POST <GPU_INFERENCE_URL>/generate
 */

import { defineEventHandler, readBody, createError } from 'h3'

interface GeneratePayload {
  prompt: string
  spatial_data?: {
    coordinates?: { x: number; y: number; z: number }
    gesture?: string
  }
  width?: number
  height?: number
  steps?: number
  guidance_scale?: number
  seed?: number
}

export default defineEventHandler(async (event) => {
  // Only accept POST
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

  // Read and validate the payload from the frontend
  const body = await readBody<GeneratePayload>(event)

  if (!body?.prompt || typeof body.prompt !== 'string' || body.prompt.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'Missing or invalid prompt' })
  }

  if (body.prompt.length > 500) {
    throw createError({ statusCode: 400, statusMessage: 'Prompt exceeds 500 characters' })
  }

  // Clamp numeric fields to safe ranges
  const payload: GeneratePayload = {
    prompt: body.prompt.trim(),
    spatial_data: body.spatial_data ?? undefined,
    width: clamp(body.width ?? 512, 256, 1024),
    height: clamp(body.height ?? 512, 256, 1024),
    steps: clamp(body.steps ?? 30, 1, 100),
    guidance_scale: clamp(body.guidance_scale ?? 7.5, 1.0, 20.0),
    seed: body.seed ?? undefined,
  }

  // Proxy to the GPU server
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (gpuSecret) {
    headers['Authorization'] = `Bearer ${gpuSecret}`
  }

  try {
    const response = await fetch(`${gpuUrl}/generate`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(120_000), // 2 minute timeout for heavy inference
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
      throw err // Re-throw our own createError instances
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
