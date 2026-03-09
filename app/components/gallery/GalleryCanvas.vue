<script setup lang="ts">
/**
 * GalleryCanvas — The core WebGL renderer.
 *
 * Initializes the Three.js scene, creates the particle field and art plane,
 * wires up the render loop, and orchestrates the full generation cycle:
 *
 *   idle → tracking → generating → reveal → cooldown → idle
 */

import * as THREE from 'three'
import { useGalleryScene } from '~/composables/gallery/useGalleryScene'
import { useGalleryAnimations } from '~/composables/gallery/useGalleryAnimations'
import { useMotionTracking } from '~/composables/gallery/useMotionTracking'
import { useGalleryInference } from '~/composables/gallery/useGalleryInference'

const canvasRef = ref<HTMLCanvasElement | null>(null)

const scene = useGalleryScene()
const animations = useGalleryAnimations()
const motion = useMotionTracking()
const inference = useGalleryInference()

// Scene objects
let particles: THREE.Points | null = null
let artPlane: THREE.Mesh | null = null

function createParticleField(threeScene: THREE.Scene): THREE.Points {
  const count = 15000
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    const i3 = i * 3
    // Spherical distribution
    const radius = 3 + Math.random() * 4
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)

    positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
    positions[i3 + 2] = radius * Math.cos(phi)

    // Cool blue-purple palette
    colors[i3] = 0.2 + Math.random() * 0.3
    colors[i3 + 1] = 0.1 + Math.random() * 0.2
    colors[i3 + 2] = 0.6 + Math.random() * 0.4
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({
    size: 0.03,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })

  const points = new THREE.Points(geometry, material)
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

// Debounce tracking → generation
let trackingTimer: ReturnType<typeof setTimeout> | null = null

watch(
  () => motion.tracking.gesture,
  (gesture) => {
    if (gesture === 'pinch' && animations.state.value === 'idle' && particles) {
      // Pinch gesture triggers generation
      if (trackingTimer) clearTimeout(trackingTimer)
      trackingTimer = setTimeout(triggerGeneration, 500)
    }
  },
)

async function triggerGeneration() {
  if (!particles || !artPlane) return

  const palm = motion.tracking.palmCenter
  const spatialData = palm
    ? { coordinates: motion.toWorldCoordinates(palm), gesture: motion.tracking.gesture ?? undefined }
    : undefined

  // Play anticipation animation
  const genTimeline = animations.playGenerating(particles)

  // Fire request to GPU
  const result = await inference.generate(
    'ethereal generative art, museum installation, luminous particles',
    spatialData,
  )

  // Wait for animation to finish if GPU was faster
  await genTimeline.then?.()

  if (result && artPlane) {
    // Load texture from the result
    const img = await inference.resultToTexture(result)
    const texture = new THREE.Texture(img)
    texture.needsUpdate = true
    ;(artPlane.material as THREE.MeshBasicMaterial).map = texture
    ;(artPlane.material as THREE.MeshBasicMaterial).needsUpdate = true

    // Play reveal
    animations.playReveal(artPlane, particles, scene.context.value!.camera)
  }
  else {
    // GPU failed — gracefully return to idle
    animations.playIdle(particles, scene.context.value!.camera)
  }
}

onMounted(async () => {
  if (!canvasRef.value) return

  const ctx = scene.init(canvasRef.value)

  // Build the scene
  particles = createParticleField(ctx.scene)
  artPlane = createArtPlane(ctx.scene)

  // Per-frame: respond to hand tracking
  scene.onFrame((delta, elapsed) => {
    if (motion.tracking.palmCenter && particles && animations.state.value !== 'generating') {
      const world = motion.toWorldCoordinates(motion.tracking.palmCenter)
      animations.playTracking(particles, world)
    }

    // Gentle particle shimmer
    if (particles) {
      const positions = particles.geometry.attributes.position
      for (let i = 0; i < Math.min(positions.count, 500); i++) {
        const idx = i * 3 + 1
        positions.array[idx] += Math.sin(elapsed * 2 + i) * 0.0003
      }
      positions.needsUpdate = true
    }
  })

  // Start
  scene.startLoop()
  animations.playIdle(particles, ctx.camera)

  // Try to initialize motion tracking (fails gracefully if no webcam)
  try {
    await motion.init()
  }
  catch {
    console.warn('[Gallery] Motion tracking unavailable — running in ambient mode')
  }

  window.addEventListener('resize', scene.handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', scene.handleResize)
  if (trackingTimer) clearTimeout(trackingTimer)
  animations.killAll()
  motion.dispose()
  inference.cancel()
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
