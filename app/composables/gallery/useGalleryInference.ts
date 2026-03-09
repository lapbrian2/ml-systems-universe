/**
 * Gallery Inference Composable
 *
 * Connects the browser to the GPU server via the Vercel bridge.
 * Manages the request lifecycle: debouncing, loading state, error handling,
 * and caching the last result for the reveal animation.
 */

export interface InferenceResult {
  image: string // base64 data URI
  width: number
  height: number
  elapsed_seconds: number
  prompt_used: string
  seed: number
}

export function useGalleryInference() {
  const isGenerating = ref(false)
  const lastResult = ref<InferenceResult | null>(null)
  const error = ref<string | null>(null)
  const generationCount = ref(0)

  let abortController: AbortController | null = null

  /**
   * Send spatial + prompt data to the GPU server via /api/generate.
   */
  async function generate(
    prompt: string,
    spatialData?: { coordinates?: { x: number; y: number; z: number }; gesture?: string },
    options?: { width?: number; height?: number; steps?: number; seed?: number },
  ): Promise<InferenceResult | null> {
    // Cancel any in-flight request
    if (abortController) {
      abortController.abort()
    }
    abortController = new AbortController()

    isGenerating.value = true
    error.value = null

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          spatial_data: spatialData ?? undefined,
          width: options?.width ?? 512,
          height: options?.height ?? 512,
          steps: options?.steps ?? 30,
          seed: options?.seed ?? undefined,
        }),
        signal: abortController.signal,
      })

      if (!response.ok) {
        const detail = await response.text().catch(() => 'Unknown error')
        throw new Error(`Generation failed (${response.status}): ${detail}`)
      }

      const result: InferenceResult = await response.json()
      lastResult.value = result
      generationCount.value++
      return result
    }
    catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        return null // Request was intentionally cancelled
      }
      const message = err instanceof Error ? err.message : 'Unknown error'
      error.value = message
      console.error('[Gallery Inference]', message)
      return null
    }
    finally {
      isGenerating.value = false
      abortController = null
    }
  }

  /**
   * Convert a base64 data URI result into a Three.js-ready texture.
   */
  async function resultToTexture(result: InferenceResult): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = result.image
    })
  }

  function cancel() {
    abortController?.abort()
    isGenerating.value = false
  }

  return {
    isGenerating: readonly(isGenerating),
    lastResult: readonly(lastResult),
    error: readonly(error),
    generationCount: readonly(generationCount),
    generate,
    resultToTexture,
    cancel,
  }
}
