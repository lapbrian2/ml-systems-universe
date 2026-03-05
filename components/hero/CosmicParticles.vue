<script setup lang="ts">
/**
 * CosmicParticles — Ambient deep-space particle background
 *
 * A lightweight THREE.js point cloud rendered via TresJS.
 * 250 tiny glowing dots drift upward with gentle sway,
 * wrapping toroidally. The camera orbits slowly and
 * responds to mouse position for subtle parallax.
 *
 * Performance target: <2ms per frame.
 */
import { shallowRef, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

/* ── Configuration ── */
const PARTICLE_COUNT = 250
const SPREAD_X = 16
const SPREAD_Y = 10
const SPREAD_Z = 12
const BASE_OPACITY = 0.4
const DRIFT_SPEED = 0.003
const SWAY_AMPLITUDE = 0.002
const CAMERA_ROTATE_SPEED = 0.001
const MOUSE_PARALLAX_STRENGTH = 0.3
const ORBIT_RADIUS = 8

const PALETTE = [
  new THREE.Color('#14b8a6'), // teal
  new THREE.Color('#a855f7'), // purple
  new THREE.Color('#22c55e'), // green
  new THREE.Color('#f0a500'), // amber
]

/* ── State ── */
const pointsObj = shallowRef<THREE.Points | null>(null)
const cameraObj = shallowRef<THREE.PerspectiveCamera | null>(null)

let mouseNX = 0 // normalized -1..1
let mouseNY = 0
let frameAngle = 0
let animationId = 0

/* ── Seeded PRNG ── */
function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

/* ── Build particle geometry + material ── */
function buildParticles(): THREE.Points {
  const rand = seededRandom(314159)
  const positions = new Float32Array(PARTICLE_COUNT * 3)
  const colors = new Float32Array(PARTICLE_COUNT * 3)
  const baseSizes = new Float32Array(PARTICLE_COUNT)

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3

    positions[i3]     = (rand() - 0.5) * SPREAD_X
    positions[i3 + 1] = (rand() - 0.5) * SPREAD_Y
    positions[i3 + 2] = (rand() - 0.5) * SPREAD_Z

    const color = PALETTE[Math.floor(rand() * PALETTE.length)]
    colors[i3]     = color.r
    colors[i3 + 1] = color.g
    colors[i3 + 2] = color.b

    baseSizes[i] = 1.0 + rand() * 2.0
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  // PointsMaterial with additive blending for glow
  const material = new THREE.PointsMaterial({
    vertexColors: true,
    transparent: true,
    opacity: BASE_OPACITY,
    size: 0.06,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })

  const points = new THREE.Points(geometry, material)

  // Stash base sizes on userData for depth-of-field modulation
  points.userData.baseSizes = baseSizes

  return points
}

/* ── Per-frame update (called from rAF) ── */
function tick() {
  animationId = requestAnimationFrame(tick)

  const points = pointsObj.value
  const camera = cameraObj.value
  if (!points || !camera) return

  const posAttr = points.geometry.attributes.position as THREE.BufferAttribute
  const pos = posAttr.array as Float32Array

  const halfX = SPREAD_X / 2
  const halfY = SPREAD_Y / 2
  const halfZ = SPREAD_Z / 2

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3

    // Gentle upward drift
    pos[i3 + 1] += DRIFT_SPEED

    // Subtle sway unique per particle
    pos[i3]     += Math.sin(frameAngle + i * 0.37) * SWAY_AMPLITUDE
    pos[i3 + 2] += Math.cos(frameAngle + i * 0.53) * SWAY_AMPLITUDE * 0.5

    // Toroidal wrap
    if (pos[i3 + 1] > halfY) pos[i3 + 1] = -halfY
    if (pos[i3] > halfX) pos[i3] = -halfX
    else if (pos[i3] < -halfX) pos[i3] = halfX
    if (pos[i3 + 2] > halfZ) pos[i3 + 2] = -halfZ
    else if (pos[i3 + 2] < -halfZ) pos[i3 + 2] = halfZ
  }

  posAttr.needsUpdate = true

  // Slow camera orbit + mouse parallax
  frameAngle += CAMERA_ROTATE_SPEED
  camera.position.x = Math.sin(frameAngle) * ORBIT_RADIUS + mouseNX * MOUSE_PARALLAX_STRENGTH
  camera.position.z = Math.cos(frameAngle) * ORBIT_RADIUS + mouseNY * MOUSE_PARALLAX_STRENGTH
  camera.position.y = mouseNY * MOUSE_PARALLAX_STRENGTH * 0.3
  camera.lookAt(0, 0, 0)
}

/* ── Mouse handler ── */
function onMouseMove(e: MouseEvent) {
  mouseNX = (e.clientX / window.innerWidth - 0.5) * 2
  mouseNY = (e.clientY / window.innerHeight - 0.5) * 2
}

/* ── Lifecycle ── */
onMounted(() => {
  // Build THREE objects
  pointsObj.value = buildParticles()
  cameraObj.value = new THREE.PerspectiveCamera(60, 1, 0.1, 50)
  cameraObj.value.position.set(0, 0, ORBIT_RADIUS)

  // Start animation
  animationId = requestAnimationFrame(tick)
  window.addEventListener('mousemove', onMouseMove, { passive: true })
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('mousemove', onMouseMove)

  if (pointsObj.value) {
    pointsObj.value.geometry.dispose()
    const mat = pointsObj.value.material
    if (Array.isArray(mat)) mat.forEach((m) => m.dispose())
    else mat.dispose()
  }
})
</script>

<template>
  <div class="cosmic-particles">
    <TresCanvas
      :alpha="true"
      :antialias="false"
      :shadows="false"
      power-preference="low-power"
    >
      <!-- Use our own managed camera -->
      <primitive v-if="cameraObj" :object="cameraObj" />

      <!-- Particle points cloud -->
      <primitive v-if="pointsObj" :object="pointsObj" />
    </TresCanvas>
  </div>
</template>

<style scoped>
.cosmic-particles {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.cosmic-particles :deep(canvas) {
  width: 100% !important;
  height: 100% !important;
}
</style>
