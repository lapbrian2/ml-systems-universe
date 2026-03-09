<script setup lang="ts">
/**
 * GalleryCanvas — The Unified Core Renderer
 *
 * Orchestrates the complete museum installation experience.
 * Uses the unified input system (hardware/MediaPipe/mouse),
 * installation config (kiosk settings), and dual generation
 * backends (cloud GPU / local ComfyUI).
 *
 * State machine:
 *   attract → idle → tracking → generating → reveal → cooldown → idle
 *       ↑                                                         │
 *       └─────────── (no interaction for N seconds) ──────────────┘
 */

import * as THREE from 'three'
import { useGalleryScene } from '~/composables/gallery/useGalleryScene'
import { useGalleryAnimations } from '~/composables/gallery/useGalleryAnimations'
import { useInputManager } from '~/composables/gallery/useInputManager'
import { useForceFields } from '~/composables/gallery/useForceFields'
import { useGalleryInference } from '~/composables/gallery/useGalleryInference'
import { useLocalGeneration } from '~/composables/gallery/useLocalGeneration'
import { useSpatialPipeline } from '~/composables/gallery/useSpatialPipeline'
import { useInstallationConfig } from '~/composables/gallery/useInstallationConfig'

import fluidVertexShader from '~/assets/shaders/fluid-particles.vert?raw'
import fluidFragmentShader from '~/assets/shaders/fluid-particles.frag?raw'

const canvasRef = ref<HTMLCanvasElement | null>(null)

// Core systems
const scene = useGalleryScene()
const animations = useGalleryAnimations()
const inputManager = useInputManager()
const forceFields = useForceFields()
const cloudInference = useGalleryInference()
const localGen = useLocalGeneration()
const spatial = useSpatialPipeline()
const { settings } = useInstallationConfig()

// Scene objects
let ambientParticles: THREE.Points | null = null
let artVolumeMesh: THREE.Points | null = null
let artPlane: THREE.Mesh | null = null
let fluidMaterial: THREE.ShaderMaterial | null = null

// Timing
let lastInteractionTime = 0
let cooldownEndTime = 0
let trackingTimer: ReturnType<typeof setTimeout> | null = null

// ─── Scene Construction ─────────────────────────────────────────

function createAmbientParticles(threeScene: THREE.Scene): THREE.Points {
  const count = 15000
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const restoreSpeeds = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    const i3 = i * 3
    const radius = 3 + Math.random() * 4
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)

    positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
    positions[i3 + 2] = radius * Math.cos(phi)

    colors[i3] = 0.2 + Math.random() * 0.3
    colors[i3 + 1] = 0.1 + Math.random() * 0.2
    colors[i3 + 2] = 0.6 + Math.random() * 0.4

    restoreSpeeds[i] = 0.02 + Math.random() * 0.08
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('aRestoreSpeed', new THREE.BufferAttribute(restoreSpeeds, 1))
  geometry.setAttribute('aVelocity', new THREE.BufferAttribute(new Float32Array(count * 3), 3))

  // Use fluid shader for force field response
  const uniforms = forceFields.createUniforms()
  fluidMaterial = new THREE.ShaderMaterial({
    vertexShader: fluidVertexShader,
    fragmentShader: fluidFragmentShader,
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  })

  const points = new THREE.Points(geometry, fluidMaterial)
  threeScene.add(points)
  return points
}

function createArtPlane(threeScene: THREE.Scene): THREE.Mesh {
  const geometry = new THREE.PlaneGeometry(4, 4)
  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
  })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(0, 1.6, 0)
  threeScene.add(mesh)
  return mesh
}

function loadVolumetricArt(data: string, count: number, threeScene: THREE.Scene): THREE.Points {
  // Decode base64 → interleaved Float32Array
  const binary = atob(data)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  const buffer = new Float32Array(bytes.buffer)

  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const restoreSpeeds = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    const src = i * 6
    const dst = i * 3
    positions[dst] = buffer[src]
    positions[dst + 1] = buffer[src + 1]
    positions[dst + 2] = buffer[src + 2]
    colors[dst] = buffer[src + 3]
    colors[dst + 1] = buffer[src + 4]
    colors[dst + 2] = buffer[src + 5]
    restoreSpeeds[i] = 0.02 + Math.random() * 0.08
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('aRestoreSpeed', new THREE.BufferAttribute(restoreSpeeds, 1))
  geometry.setAttribute('aVelocity', new THREE.BufferAttribute(new Float32Array(count * 3), 3))

  const uniforms = forceFields.createUniforms()
  const material = new THREE.ShaderMaterial({
    vertexShader: fluidVertexShader,
    fragmentShader: fluidFragmentShader,
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  })

  const points = new THREE.Points(geometry, material)
  points.position.set(0, 1.6, 0)
  threeScene.add(points)
  return points
}

// ─── Generation ─────────────────────────────────────────────────

async function triggerGeneration() {
  if (!ambientParticles || !scene.context.value) return
  if (animations.state.value !== 'idle' && animations.state.value !== 'tracking') return

  const ctx = scene.context.value
  const genTimeline = animations.playGenerating(ambientParticles)

  // Capture 3D scene → structured generation inputs
  const snapshot = spatial.captureSnapshot(ctx.scene, ctx.camera)
  const inputs = spatial.toGenerationInputs(snapshot, settings.generation.defaultPromptPrefix)

  let result: any = null

  if (settings.generation.backend === 'local' && localGen.isConnected.value) {
    // Local ComfyUI path
    result = await localGen.generate({
      prompt: inputs.structuredPrompt,
      negativePrompt: inputs.negativePrompt,
      depthImage: inputs.controlImages.depth,
      loraName: settings.generation.defaultPromptPrefix,
      width: inputs.parameters.width,
      height: inputs.parameters.height,
      steps: inputs.parameters.steps,
      cfg: inputs.parameters.guidance_scale,
    }, settings.generation.localComfyUrl)
  }
  else {
    // Cloud GPU path — try conditioned first, fallback to basic
    try {
      const response = await fetch(settings.generation.cloudUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          structured_prompt: inputs.structuredPrompt,
          negative_prompt: inputs.negativePrompt,
          control_images: inputs.controlImages,
          parameters: { ...inputs.parameters, extrude_3d: settings.generation.autoExtrude3d },
        }),
        signal: AbortSignal.timeout(180_000),
      })
      if (response.ok) result = await response.json()
    }
    catch {
      // Fallback to basic endpoint
      result = await cloudInference.generate(
        inputs.structuredPrompt,
        inputManager.input.handPosition
          ? { coordinates: inputManager.input.handPosition, gesture: inputManager.input.gesture ?? undefined }
          : undefined,
        { ...inputs.parameters, extrude_3d: settings.generation.autoExtrude3d } as any,
      )
    }
  }

  await genTimeline.then?.()

  if (result && ctx) {
    // Volume data available → render as interactive point cloud
    if (result.volume?.point_cloud) {
      if (artVolumeMesh) {
        ctx.scene.remove(artVolumeMesh)
        artVolumeMesh.geometry.dispose()
      }
      artVolumeMesh = loadVolumetricArt(
        result.volume.point_cloud,
        result.volume.point_count,
        ctx.scene,
      )
    }

    // Also map flat image onto the art plane as a backdrop
    if (result.image && artPlane) {
      const img = await cloudInference.resultToTexture(result)
      const texture = new THREE.Texture(img)
      texture.needsUpdate = true
      ;(artPlane.material as THREE.MeshBasicMaterial).map = texture
      ;(artPlane.material as THREE.MeshBasicMaterial).needsUpdate = true
    }

    animations.playReveal(artPlane!, ambientParticles, ctx.camera)
    cooldownEndTime = Date.now() + settings.generation.cooldownSeconds * 1000
  }
  else {
    animations.playIdle(ambientParticles, ctx.camera)
  }
}

// ─── Gesture Watcher ────────────────────────────────────────────

watch(
  () => inputManager.input.gesture,
  (gesture) => {
    if (gesture === 'pinch' && animations.state.value === 'idle' && ambientParticles) {
      if (Date.now() < cooldownEndTime) return // Respect cooldown
      if (trackingTimer) clearTimeout(trackingTimer)
      trackingTimer = setTimeout(triggerGeneration, settings.input.gestureDebounce)
    }
  },
)

// ─── Attract Mode ───────────────────────────────────────────────

watch(
  () => inputManager.input.bodyPresent,
  (present) => {
    if (present) {
      lastInteractionTime = Date.now()
      if (animations.state.value === 'loading') {
        // First visitor — transition from attract to idle
        if (ambientParticles && scene.context.value) {
          animations.playIdle(ambientParticles, scene.context.value.camera)
        }
      }
    }
  },
)

// ─── Render Loop ────────────────────────────────────────────────

onMounted(async () => {
  if (!canvasRef.value) return

  const ctx = scene.init(canvasRef.value)
  spatial.initOffscreenRenderers()

  ambientParticles = createAmbientParticles(ctx.scene)
  artPlane = createArtPlane(ctx.scene)

  // Frame update
  scene.onFrame((delta, elapsed) => {
    // Poll unified input
    inputManager.update()

    // Update force fields from hand position
    if (inputManager.input.handPosition) {
      forceFields.updateFromTracking(
        inputManager.input.handPosition,
        inputManager.input.gesture,
        0,
      )
      lastInteractionTime = Date.now()
    }
    else {
      forceFields.updateFromTracking(null, null, 0)
    }

    // Apply force fields to ambient particles
    if (fluidMaterial) {
      fluidMaterial.uniforms.uTime.value = elapsed
      forceFields.applyToMaterial(fluidMaterial, delta)
    }

    // Apply force fields to volumetric art (if present)
    if (artVolumeMesh) {
      const artMat = artVolumeMesh.material as THREE.ShaderMaterial
      artMat.uniforms.uTime.value = elapsed
      forceFields.applyToMaterial(artMat, delta)
    }

    // Hand tracking → particle response
    if (inputManager.input.handPosition && ambientParticles && animations.state.value !== 'generating') {
      animations.playTracking(ambientParticles, inputManager.input.handPosition)
    }

    // Idle timeout → attract mode
    if (
      settings.kiosk.attractMode
      && animations.state.value === 'idle'
      && Date.now() - lastInteractionTime > settings.kiosk.idleTimeoutSeconds * 1000
    ) {
      // Slow ambient drift — the "waiting for a visitor" state
      if (ambientParticles) {
        const breathe = Math.sin(elapsed * 0.3) * 0.1
        ambientParticles.rotation.y += delta * 0.05
        ambientParticles.position.y = 1.6 + breathe
      }
    }
  })

  scene.startLoop()
  lastInteractionTime = Date.now()
  animations.playIdle(ambientParticles, ctx.camera)

  // Initialize input system (auto-detects best source)
  await inputManager.init({
    source: settings.input.source,
    depthServerUrl: settings.input.depthServerUrl,
  })

  // Connect to local ComfyUI if configured
  if (settings.generation.backend === 'local') {
    const connected = await localGen.connect(settings.generation.localComfyUrl)
    if (!connected) {
      console.warn('[Gallery] ComfyUI unavailable — falling back to cloud')
    }
  }

  window.addEventListener('resize', scene.handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', scene.handleResize)
  if (trackingTimer) clearTimeout(trackingTimer)
  animations.killAll()
  inputManager.dispose()
  localGen.disconnect()
  cloudInference.cancel()
  spatial.dispose()

  if (artVolumeMesh && scene.context.value) {
    scene.context.value.scene.remove(artVolumeMesh)
    artVolumeMesh.geometry.dispose()
    ;(artVolumeMesh.material as THREE.ShaderMaterial).dispose()
  }

  scene.dispose()
})
</script>

<template>
  <canvas ref="canvasRef" class="gallery-canvas" />
</template>

<style scoped>
.gallery-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
}
</style>
