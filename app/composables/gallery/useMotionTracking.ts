/**
 * Motion Tracking Composable
 *
 * Uses MediaPipe Hands (running in-browser) to detect visitor gestures
 * and map hand positions into 3D coordinates for the gallery scene.
 *
 * This runs entirely on the visitor's device (or the museum kiosk's
 * webcam) — no data leaves the browser. The GPU server only receives
 * the processed coordinates, never the camera feed.
 */

interface MediaPipeLandmark {
  x: number
  y: number
  z: number
}

interface MediaPipeResults {
  multiHandLandmarks?: MediaPipeLandmark[][]
  multiHandedness?: Array<{ label: string }>
}

interface MediaPipeWindow {
  Hands: new (config: { locateFile: (file: string) => string }) => {
    setOptions: (opts: Record<string, unknown>) => void
    onResults: (cb: (r: MediaPipeResults) => void) => void
    send: (input: { image: HTMLVideoElement }) => Promise<void>
    close: () => void
  }
  Camera: new (el: HTMLVideoElement, config: { onFrame: () => Promise<void>; width: number; height: number }) => {
    start: () => Promise<void>
    stop: () => void
  }
}

export interface HandLandmark {
  x: number // 0–1 normalized
  y: number // 0–1 normalized
  z: number // depth estimate
}

export interface TrackingState {
  isActive: boolean
  handsDetected: number
  primaryHand: HandLandmark | null
  palmCenter: { x: number; y: number; z: number } | null
  gesture: string | null // 'open' | 'fist' | 'point' | 'pinch'
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = src
    script.crossOrigin = 'anonymous'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`Failed to load: ${src}`))
    document.head.appendChild(script)
  })
}

export function useMotionTracking() {
  const tracking = reactive<TrackingState>({
    isActive: false,
    handsDetected: 0,
    primaryHand: null,
    palmCenter: null,
    gesture: null,
  })

  let videoEl: HTMLVideoElement | null = null
  let hands: { setOptions: (opts: Record<string, unknown>) => void; onResults: (cb: (r: MediaPipeResults) => void) => void; send: (input: { image: HTMLVideoElement }) => Promise<void>; close: () => void } | null = null
  let camera: { start: () => Promise<void>; stop: () => void } | null = null
  const animationId: number | null = null

  /**
   * Initialize webcam and MediaPipe Hands.
   * Call this once when the gallery page mounts.
   */
  async function init(): Promise<void> {
    if (typeof window === 'undefined') return

    // Load MediaPipe from CDN at runtime (not bundled)
    await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js')
    await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js')

    const mp = window as unknown as MediaPipeWindow
    if (!mp.Hands || !mp.Camera) {
      throw new Error('MediaPipe failed to load from CDN')
    }

    // Create hidden video element for the webcam feed
    videoEl = document.createElement('video')
    videoEl.setAttribute('playsinline', '')
    videoEl.style.display = 'none'
    document.body.appendChild(videoEl)

    hands = new mp.Hands({
      locateFile: (file: string) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    })

    hands!.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.5,
    })

    hands!.onResults(onResults)

    camera = new mp.Camera(videoEl, {
      onFrame: async () => {
        if (videoEl && hands) await hands.send({ image: videoEl })
      },
      width: 640,
      height: 480,
    })

    await camera.start()
    tracking.isActive = true
  }

  function onResults(results: MediaPipeResults): void {
    if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
      tracking.handsDetected = 0
      tracking.primaryHand = null
      tracking.palmCenter = null
      tracking.gesture = null
      return
    }

    tracking.handsDetected = results.multiHandLandmarks.length
    const landmarks: HandLandmark[] = results.multiHandLandmarks[0]!
    tracking.primaryHand = landmarks[9]! // Middle finger MCP — center of palm

    // Compute palm center from wrist + finger MCPs
    const wrist = landmarks[0]!
    const indexMcp = landmarks[5]!
    const middleMcp = landmarks[9]!
    const ringMcp = landmarks[13]!
    const pinkyMcp = landmarks[17]!

    tracking.palmCenter = {
      x: (wrist.x + indexMcp.x + middleMcp.x + ringMcp.x + pinkyMcp.x) / 5,
      y: (wrist.y + indexMcp.y + middleMcp.y + ringMcp.y + pinkyMcp.y) / 5,
      z: (wrist.z + indexMcp.z + middleMcp.z + ringMcp.z + pinkyMcp.z) / 5,
    }

    // Simple gesture detection
    tracking.gesture = detectGesture(landmarks)
  }

  /**
   * Map normalized hand coordinates to Three.js world space.
   * Centers the range so (0.5, 0.5) → (0, 0) in 3D.
   */
  function toWorldCoordinates(
    hand: { x: number; y: number; z: number },
    scale: number = 10,
  ): { x: number; y: number; z: number } {
    return {
      x: (hand.x - 0.5) * scale,
      y: -(hand.y - 0.5) * scale, // Flip Y (screen → 3D)
      z: hand.z * scale * 0.5,
    }
  }

  function detectGesture(landmarks: HandLandmark[]): string {
    const tips = [landmarks[8]!, landmarks[12]!, landmarks[16]!, landmarks[20]!]
    const mcps = [landmarks[5]!, landmarks[9]!, landmarks[13]!, landmarks[17]!]

    // Count extended fingers (tip above MCP in Y)
    let extended = 0
    for (let i = 0; i < 4; i++) {
      if (tips[i]!.y < mcps[i]!.y) extended++
    }

    // Check thumb separately
    const thumbExtended = landmarks[4]!.x < landmarks[3]!.x

    if (extended === 0 && !thumbExtended) return 'fist'
    if (extended === 1 && tips[0]!.y < mcps[0]!.y) return 'point'
    if (extended >= 3 && thumbExtended) return 'open'

    // Pinch: thumb tip close to index tip
    const dx = landmarks[4]!.x - landmarks[8]!.x
    const dy = landmarks[4]!.y - landmarks[8]!.y
    if (Math.sqrt(dx * dx + dy * dy) < 0.05) return 'pinch'

    return 'open'
  }

  function dispose() {
    tracking.isActive = false
    if (animationId) cancelAnimationFrame(animationId)
    camera?.stop()
    hands?.close()
    if (videoEl) {
      videoEl.srcObject = null
      videoEl.remove()
    }
  }

  return {
    tracking: readonly(tracking),
    init,
    toWorldCoordinates,
    dispose,
  }
}
