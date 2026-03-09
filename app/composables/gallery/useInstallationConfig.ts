/**
 * Installation Configuration
 *
 * Manages the physical setup of the museum installation:
 * - Display mode (single screen, multi-projector, LED wall)
 * - Projection mapping geometry (edge blending, warping)
 * - Input source priority (hardware depth > MediaPipe > mouse)
 * - Generation backend (cloud GPU vs local ComfyUI)
 * - Kiosk behavior (auto-restart, idle timeout, attract mode)
 *
 * Configured via URL params or a local config file so museum
 * staff can adjust without touching code.
 */

export interface InstallationSettings {
  // Display
  display: {
    mode: 'single' | 'dual' | 'triple' | 'led-wall'
    resolution: { width: number; height: number }
    refreshRate: number
    projectorBlend: number       // Overlap pixels for edge blending
    warpCorrection: boolean      // Keystoning / mesh warping
  }

  // Input
  input: {
    source: 'auto' | 'hardware' | 'mediapipe' | 'mouse'
    depthServerUrl: string       // ws://localhost:8765
    cameraDevice: 'realsense' | 'kinect' | 'webcam'
    interactionRange: number     // Max distance in meters
    gestureDebounce: number      // ms before gesture triggers action
  }

  // Generation
  generation: {
    backend: 'cloud' | 'local'
    cloudUrl: string             // Vercel bridge URL
    localComfyUrl: string        // ComfyUI API URL
    autoExtrude3d: boolean       // Always generate point clouds
    defaultPromptPrefix: string  // Your LoRA trigger word
    cooldownSeconds: number      // Between generations
  }

  // Kiosk
  kiosk: {
    idleTimeoutSeconds: number   // Before attract mode
    attractMode: boolean         // Show ambient animation when idle
    autoRestartHours: number     // Restart app every N hours (0 = never)
    showDebugHud: boolean
    cursorVisible: boolean
  }
}

const DEFAULT_SETTINGS: InstallationSettings = {
  display: {
    mode: 'single',
    resolution: { width: 1920, height: 1080 },
    refreshRate: 60,
    projectorBlend: 0,
    warpCorrection: false,
  },
  input: {
    source: 'auto',
    depthServerUrl: 'ws://localhost:8765',
    cameraDevice: 'webcam',
    interactionRange: 3.0,
    gestureDebounce: 500,
  },
  generation: {
    backend: 'cloud',
    cloudUrl: '/api/generate-conditioned',
    localComfyUrl: 'http://localhost:8188',
    autoExtrude3d: true,
    defaultPromptPrefix: 'mystyle',
    cooldownSeconds: 15,
  },
  kiosk: {
    idleTimeoutSeconds: 30,
    attractMode: true,
    autoRestartHours: 24,
    showDebugHud: false,
    cursorVisible: false,
  },
}

export function useInstallationConfig() {
  const settings = reactive<InstallationSettings>(structuredClone(DEFAULT_SETTINGS))

  /**
   * Load configuration from URL search params.
   * Museum staff can bookmark different configs:
   *   /gallery?mode=dual&input=hardware&backend=local&debug=true
   */
  function loadFromUrl() {
    if (typeof window === 'undefined') return

    const params = new URLSearchParams(window.location.search)

    // Display
    if (params.has('mode')) {
      settings.display.mode = params.get('mode') as any
    }
    if (params.has('blend')) {
      settings.display.projectorBlend = parseInt(params.get('blend')!, 10)
    }

    // Input
    if (params.has('input')) {
      settings.input.source = params.get('input') as any
    }
    if (params.has('camera')) {
      settings.input.cameraDevice = params.get('camera') as any
    }
    if (params.has('depth-server')) {
      settings.input.depthServerUrl = params.get('depth-server')!
    }

    // Generation
    if (params.has('backend')) {
      settings.generation.backend = params.get('backend') as any
    }
    if (params.has('comfy-url')) {
      settings.generation.localComfyUrl = params.get('comfy-url')!
    }
    if (params.has('trigger')) {
      settings.generation.defaultPromptPrefix = params.get('trigger')!
    }
    if (params.has('cooldown')) {
      settings.generation.cooldownSeconds = parseInt(params.get('cooldown')!, 10)
    }

    // Kiosk
    if (params.has('debug')) {
      settings.kiosk.showDebugHud = params.get('debug') === 'true'
    }
    if (params.has('cursor')) {
      settings.kiosk.cursorVisible = params.get('cursor') === 'true'
    }
    if (params.has('idle')) {
      settings.kiosk.idleTimeoutSeconds = parseInt(params.get('idle')!, 10)
    }
  }

  /**
   * Generate a URL with current settings for bookmarking.
   */
  function toUrl(): string {
    const params = new URLSearchParams()

    if (settings.display.mode !== 'single') params.set('mode', settings.display.mode)
    if (settings.display.projectorBlend > 0) params.set('blend', String(settings.display.projectorBlend))
    if (settings.input.source !== 'auto') params.set('input', settings.input.source)
    if (settings.generation.backend !== 'cloud') params.set('backend', settings.generation.backend)
    if (settings.kiosk.showDebugHud) params.set('debug', 'true')

    const query = params.toString()
    return `/gallery${query ? `?${query}` : ''}`
  }

  return {
    settings,
    loadFromUrl,
    toUrl,
  }
}
