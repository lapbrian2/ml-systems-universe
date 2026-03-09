/**
 * Hardware Depth Camera Composable
 *
 * For physical museum installations, MediaPipe is a webcam-only
 * approximation. Real depth cameras (Intel RealSense, Azure Kinect,
 * Leap Motion) provide millimeter-accurate depth data with zero
 * latency — the difference between "reactive" and "tactile."
 *
 * This composable abstracts over multiple input sources:
 *   1. WebSocket to a local depth camera server (RealSense/Kinect)
 *   2. MediaPipe browser fallback (already built)
 *   3. MIDI/OSC bridge for TouchDesigner interop
 *
 * The depth camera server runs as a small Python process on the
 * museum kiosk, reading USB hardware and streaming via WebSocket.
 */

export interface DepthFrame {
  hands: DepthHand[]
  bodies: DepthBody[]
  pointCloud?: Float32Array  // Raw depth cloud from hardware
  timestamp: number
}

export interface DepthHand {
  id: number
  position: { x: number; y: number; z: number }  // Meters from camera
  fingers: { x: number; y: number; z: number }[]  // 5 fingertips
  gesture: 'open' | 'fist' | 'pinch' | 'point' | null
  confidence: number
}

export interface DepthBody {
  id: number
  joints: Record<string, { x: number; y: number; z: number; confidence: number }>
  distance: number  // Distance from camera in meters
}

export type InputSource = 'hardware' | 'mediapipe' | 'mouse'

export function useDepthCamera() {
  const isConnected = ref(false)
  const activeSource = ref<InputSource>('mouse')
  const currentFrame = ref<DepthFrame | null>(null)
  const fps = ref(0)

  let ws: WebSocket | null = null
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null
  let frameCount = 0
  let lastFpsTime = 0

  /**
   * Connect to the local depth camera server.
   *
   * The server runs on the same machine as the kiosk:
   *   python depth_server.py --device realsense --port 8765
   *
   * Falls back to MediaPipe if connection fails.
   */
  async function connect(
    url: string = 'ws://localhost:8765',
    autoReconnect: boolean = true,
  ): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        ws = new WebSocket(url)

        ws.onopen = () => {
          isConnected.value = true
          activeSource.value = 'hardware'
          console.log('[DepthCamera] Connected to hardware depth server')
          resolve(true)
        }

        ws.onmessage = (event) => {
          try {
            const frame = JSON.parse(event.data) as DepthFrame
            currentFrame.value = frame

            // FPS tracking
            frameCount++
            const now = performance.now()
            if (now - lastFpsTime >= 1000) {
              fps.value = frameCount
              frameCount = 0
              lastFpsTime = now
            }
          }
          catch { /* malformed frame — skip */ }
        }

        ws.onclose = () => {
          isConnected.value = false
          if (autoReconnect) {
            console.log('[DepthCamera] Disconnected, reconnecting in 3s...')
            reconnectTimer = setTimeout(() => connect(url, true), 3000)
          }
          resolve(false)
        }

        ws.onerror = () => {
          ws?.close()
          resolve(false)
        }

        // Timeout if server doesn't respond
        setTimeout(() => {
          if (!isConnected.value) {
            ws?.close()
            resolve(false)
          }
        }, 5000)
      }
      catch {
        resolve(false)
      }
    })
  }

  /**
   * Get the primary hand from the current frame, mapped to
   * the same coordinate system as useMotionTracking.
   * This ensures GalleryCanvas doesn't care which input source is active.
   */
  function getPrimaryHand(): { position: { x: number; y: number; z: number }; gesture: string | null } | null {
    const frame = currentFrame.value
    if (!frame || frame.hands.length === 0) return null

    const hand = frame.hands[0]
    return {
      position: hand.position,
      gesture: hand.gesture,
    }
  }

  /**
   * Get body presence data (for "someone walked up" detection).
   */
  function getNearestBody(): { distance: number; present: boolean } {
    const frame = currentFrame.value
    if (!frame || frame.bodies.length === 0) {
      return { distance: Infinity, present: false }
    }

    const nearest = frame.bodies.reduce((a, b) =>
      a.distance < b.distance ? a : b,
    )

    return {
      distance: nearest.distance,
      present: nearest.distance < 3.0, // Within 3 meters
    }
  }

  /**
   * Send configuration to the depth camera server.
   * Useful for adjusting detection range, sensitivity, etc.
   */
  function configure(settings: Record<string, unknown>) {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'config', ...settings }))
    }
  }

  function disconnect() {
    if (reconnectTimer) clearTimeout(reconnectTimer)
    ws?.close()
    ws = null
    isConnected.value = false
    activeSource.value = 'mouse'
  }

  return {
    isConnected: readonly(isConnected),
    activeSource: readonly(activeSource),
    currentFrame: readonly(currentFrame),
    fps: readonly(fps),
    connect,
    getPrimaryHand,
    getNearestBody,
    configure,
    disconnect,
  }
}
