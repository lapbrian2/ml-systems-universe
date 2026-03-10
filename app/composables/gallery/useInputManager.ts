/**
 * Unified Input Manager
 *
 * Auto-detects the best available input source and provides a single
 * interface to the rest of the gallery system. Priority order:
 *
 *   1. Hardware depth camera (RealSense/Kinect via WebSocket)
 *   2. MediaPipe browser hand tracking (webcam)
 *   3. Mouse/touch fallback
 *
 * All sources output the same normalized data:
 *   { position, gesture, bodyPresent, confidence }
 *
 * The gallery components never need to know which input is active.
 */

import { useDepthCamera, type InputSource } from '~/composables/gallery/useDepthCamera'
import { useMotionTracking } from '~/composables/gallery/useMotionTracking'
import type { Gesture } from '~/composables/gallery/useMotionTracking'

export interface UnifiedInput {
  handPosition: { x: number; y: number; z: number } | null
  gesture: Gesture | null
  bodyPresent: boolean
  bodyDistance: number
  confidence: number
  source: InputSource
}

export function useInputManager() {
  const depthCamera = useDepthCamera()
  const motionTracking = useMotionTracking()

  const input = reactive<UnifiedInput>({
    handPosition: null,
    gesture: null,
    bodyPresent: false,
    bodyDistance: Infinity,
    confidence: 0,
    source: 'mouse',
  })

  const isInitialized = ref(false)

  /**
   * Initialize input sources in priority order.
   * Tries hardware first, falls back down the chain.
   */
  async function init(config: {
    source: 'auto' | 'hardware' | 'mediapipe' | 'mouse'
    depthServerUrl: string
  }) {
    // Hardware depth camera
    if (config.source === 'auto' || config.source === 'hardware') {
      const connected = await depthCamera.connect(config.depthServerUrl)
      if (connected) {
        input.source = 'hardware'
        isInitialized.value = true
        console.log('[InputManager] Using hardware depth camera')
        return
      }
    }

    // MediaPipe browser fallback
    if (config.source === 'auto' || config.source === 'mediapipe') {
      try {
        await motionTracking.init()
        input.source = 'mediapipe'
        isInitialized.value = true
        console.log('[InputManager] Using MediaPipe browser tracking')
        return
      }
      catch {
        console.warn('[InputManager] MediaPipe unavailable')
      }
    }

    // Mouse fallback (always available)
    input.source = 'mouse'
    isInitialized.value = true
    console.log('[InputManager] Using mouse/touch fallback')
  }

  /**
   * Poll the active input source. Call this each frame.
   */
  function update() {
    if (depthCamera.isConnected.value) {
      // Hardware path
      const hand = depthCamera.getPrimaryHand()
      const body = depthCamera.getNearestBody()

      input.handPosition = hand?.position ?? null
      input.gesture = hand?.gesture ?? null
      input.bodyPresent = body.present
      input.bodyDistance = body.distance
      input.confidence = hand ? 0.95 : 0
      input.source = 'hardware'
    }
    else if (motionTracking.tracking.isActive) {
      // MediaPipe path
      const palm = motionTracking.tracking.palmCenter
      input.handPosition = palm ? motionTracking.toWorldCoordinates(palm) : null
      input.gesture = motionTracking.tracking.gesture
      input.bodyPresent = motionTracking.tracking.handsDetected > 0
      input.bodyDistance = 1.5 // Estimated for webcam
      input.confidence = palm ? 0.8 : 0
      input.source = 'mediapipe'
    }
    else {
      // Mouse is handled by GalleryInteractionLayer writing directly to
      // motionTracking state — we just read it here
      const palm = motionTracking.tracking.palmCenter
      input.handPosition = palm ? motionTracking.toWorldCoordinates(palm) : null
      input.gesture = motionTracking.tracking.gesture
      input.bodyPresent = motionTracking.tracking.handsDetected > 0
      input.bodyDistance = 1.0
      input.confidence = palm ? 0.5 : 0
      input.source = 'mouse'
    }
  }

  function dispose() {
    depthCamera.disconnect()
    motionTracking.dispose()
  }

  return {
    input: readonly(input),
    isInitialized: readonly(isInitialized),
    init,
    update,
    dispose,
  }
}
