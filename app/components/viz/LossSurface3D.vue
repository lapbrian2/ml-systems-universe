<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, shallowRef } from 'vue'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { lossSurface3DTour } from '~/data/tours'
import type { TourStep } from '~/components/viz/GuidedTour.vue'

/* ── Props & Emits (preserved interface) ── */
const props = defineProps<{
  activeSection: number
}>()

const emit = defineEmits<{
  exerciseComplete: []
}>()

/* ── Constants ── */
const SURFACE_SIZE = 6
const SURFACE_SEGMENTS = 80
const SURFACE_HALF = SURFACE_SIZE / 2
const PATH_STEPS = 60

/* ── Interaction state ── */
const interactionCount = ref(0)
const exerciseEmitted = ref(false)
const isUserInteracting = ref(false)
let autoRotateTimer: ReturnType<typeof setTimeout> | null = null
let pathTimeline: gsap.core.Tween | null = null
let pathAnimTimeout: ReturnType<typeof setTimeout> | null = null
const activeTweens: gsap.core.Tween[] = []

/* ── Three.js objects (shallowRef prevents deep reactivity overhead) ── */
const surfaceMesh = shallowRef<THREE.Mesh | null>(null)
const sgdLineObj = shallowRef<THREE.Line | null>(null)
const adamLineObj = shallowRef<THREE.Line | null>(null)
const sgdBallObj = shallowRef<THREE.Mesh | null>(null)
const adamBallObj = shallowRef<THREE.Mesh | null>(null)
const globalMinMarker = shallowRef<THREE.Mesh | null>(null)
const localMinMarker = shallowRef<THREE.Mesh | null>(null)
const gridHelperObj = shallowRef<THREE.GridHelper | null>(null)

/* ── Loss function (same two-basin landscape as original) ── */
function lossFunction(x: number, z: number): number {
  const basin1 = 3 * Math.exp(-((x - 1) ** 2 + (z - 1) ** 2) / 0.8)
  const basin2 = 2.5 * Math.exp(-((x + 0.8) ** 2 + (z + 0.5) ** 2) / 1.2)
  const ridge = 0.3 * Math.sin(x * 2) * Math.cos(z * 2)
  return 4 - basin1 - basin2 + ridge + 0.1 * (x * x + z * z)
}

/* ── Gradient (numerical, central differences) ── */
function gradient(x: number, z: number): { dx: number; dz: number } {
  const h = 0.01
  return {
    dx: (lossFunction(x + h, z) - lossFunction(x - h, z)) / (2 * h),
    dz: (lossFunction(x, z + h) - lossFunction(x, z - h)) / (2 * h),
  }
}

/* ── Loss-to-color mapping (deep blue -> teal -> yellow -> red) ── */
// Hoisted palette colors to avoid ~19K allocations per build
const _c0 = new THREE.Color('#0a1628')
const _c1 = new THREE.Color('#14b8a6')
const _c2 = new THREE.Color('#eab308')
const _c3 = new THREE.Color('#ef4444')
const _c4 = new THREE.Color('#7f1d1d')
const _cResult = new THREE.Color()

function lossToColor(t: number): THREE.Color {
  if (t < 0.25) return _cResult.lerpColors(_c0, _c1, t / 0.25)
  if (t < 0.5) return _cResult.lerpColors(_c1, _c2, (t - 0.25) / 0.25)
  if (t < 0.75) return _cResult.lerpColors(_c2, _c3, (t - 0.5) / 0.25)
  return _cResult.lerpColors(_c3, _c4, (t - 0.75) / 0.25)
}

/* ── Seeded PRNG for deterministic SGD noise ── */
function createSeededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

/* ── SGD simulation (wobblier, slower convergence) ── */
function simulateSGD(): THREE.Vector3[] {
  const path: THREE.Vector3[] = []
  let x = 2.2, z = 2.0
  const lr = 0.15
  const rand = createSeededRandom(42)

  for (let i = 0; i < PATH_STEPS; i++) {
    const y = lossFunction(x, z) * 0.5 + 0.03
    path.push(new THREE.Vector3(x, y, z))
    const g = gradient(x, z)
    x -= lr * g.dx + (rand() - 0.5) * 0.14
    z -= lr * g.dz + (rand() - 0.5) * 0.14
    x = Math.max(-SURFACE_HALF, Math.min(SURFACE_HALF, x))
    z = Math.max(-SURFACE_HALF, Math.min(SURFACE_HALF, z))
  }
  return path
}

/* ── Adam simulation (smoother, faster convergence) ── */
function simulateAdam(): THREE.Vector3[] {
  const path: THREE.Vector3[] = []
  let x = 2.2, z = 2.0
  const lr = 0.2
  let mx = 0, mz = 0, vx = 0, vz = 0
  const beta1 = 0.9, beta2 = 0.999, eps = 1e-8

  for (let i = 0; i < PATH_STEPS; i++) {
    const y = lossFunction(x, z) * 0.5 + 0.03
    path.push(new THREE.Vector3(x, y, z))
    const g = gradient(x, z)
    mx = beta1 * mx + (1 - beta1) * g.dx
    mz = beta1 * mz + (1 - beta1) * g.dz
    vx = beta2 * vx + (1 - beta2) * g.dx * g.dx
    vz = beta2 * vz + (1 - beta2) * g.dz * g.dz
    const t = i + 1
    x -= lr * (mx / (1 - beta1 ** t)) / (Math.sqrt(vx / (1 - beta2 ** t)) + eps)
    z -= lr * (mz / (1 - beta1 ** t)) / (Math.sqrt(vz / (1 - beta2 ** t)) + eps)
    x = Math.max(-SURFACE_HALF, Math.min(SURFACE_HALF, x))
    z = Math.max(-SURFACE_HALF, Math.min(SURFACE_HALF, z))
  }
  return path
}

/* ── Pre-compute paths ── */
const sgdPath = simulateSGD()
const adamPath = simulateAdam()

/* ── Build surface mesh ── */
function buildSurface(): THREE.Mesh {
  const geom = new THREE.PlaneGeometry(SURFACE_SIZE, SURFACE_SIZE, SURFACE_SEGMENTS, SURFACE_SEGMENTS)
  geom.rotateX(-Math.PI / 2)

  const pos = geom.attributes.position as THREE.BufferAttribute
  const count = pos.count
  const colors = new Float32Array(count * 3)
  const losses = new Float32Array(count)
  let minL = Infinity, maxL = -Infinity

  for (let i = 0; i < count; i++) {
    const l = lossFunction(pos.getX(i), pos.getZ(i))
    losses[i] = l
    if (l < minL) minL = l
    if (l > maxL) maxL = l
  }

  const range = maxL - minL || 1
  for (let i = 0; i < count; i++) {
    pos.setY(i, losses[i] * 0.5)
    const t = (losses[i] - minL) / range
    const c = lossToColor(t)
    colors[i * 3] = c.r
    colors[i * 3 + 1] = c.g
    colors[i * 3 + 2] = c.b
  }

  geom.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geom.computeVertexNormals()
  pos.needsUpdate = true

  const mat = new THREE.MeshPhongMaterial({
    vertexColors: true,
    side: THREE.DoubleSide,
    shininess: 40,
    specular: new THREE.Color('#1a2a40'),
    transparent: true,
    opacity: 0.92,
  })

  return new THREE.Mesh(geom, mat)
}

/* ── Build line from path ── */
function buildLine(path: THREE.Vector3[], color: string): THREE.Line {
  const geom = new THREE.BufferGeometry().setFromPoints(path)
  geom.setDrawRange(0, 0) // Start hidden, animate in
  const mat = new THREE.LineBasicMaterial({
    color: new THREE.Color(color),
    transparent: true,
    opacity: 1,
  })
  return new THREE.Line(geom, mat)
}

/* ── Build ball (current optimizer position) ── */
function buildBall(color: string): THREE.Mesh {
  const geom = new THREE.SphereGeometry(0.06, 12, 12)
  const mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    emissive: new THREE.Color(color),
    emissiveIntensity: 0.8,
    transparent: true,
    opacity: 0,
  })
  const mesh = new THREE.Mesh(geom, mat)
  mesh.visible = false
  return mesh
}

/* ── Build glowing minimum marker ── */
function buildMinMarker(position: THREE.Vector3, color: string): THREE.Mesh {
  const geom = new THREE.SphereGeometry(0.06, 10, 10)
  const mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    emissive: new THREE.Color(color),
    emissiveIntensity: 2,
  })
  const mesh = new THREE.Mesh(geom, mat)
  mesh.position.copy(position)
  return mesh
}

/* ── Build subtle grid ── */
function buildGrid(): THREE.GridHelper {
  const grid = new THREE.GridHelper(SURFACE_SIZE, 20, 0x14b8a6, 0x14b8a6)
  // Dispose constructor's default material, replace with transparent one
  const oldMat = grid.material
  if (Array.isArray(oldMat)) oldMat.forEach((m) => m.dispose())
  else oldMat.dispose()
  grid.material = new THREE.LineBasicMaterial({
    color: 0x14b8a6,
    transparent: true,
    opacity: 0.06,
  })
  grid.position.y = -0.05
  return grid
}

/* ── Animate paths with GSAP (progressive draw range reveal) ── */
function animatePaths() {
  if (pathTimeline) pathTimeline.kill()

  const progress = { value: 0 }
  pathTimeline = gsap.to(progress, {
    value: PATH_STEPS,
    duration: 4,
    ease: 'power2.out',
    onUpdate() {
      const count = Math.floor(progress.value)

      // Extend line draw ranges
      if (sgdLineObj.value) sgdLineObj.value.geometry.setDrawRange(0, count)
      if (adamLineObj.value) adamLineObj.value.geometry.setDrawRange(0, count)

      // Move SGD ball to current head of path
      if (sgdBallObj.value && count > 0 && count <= sgdPath.length) {
        const p = sgdPath[count - 1]
        sgdBallObj.value.position.set(p.x, p.y + 0.02, p.z)
        sgdBallObj.value.visible = true
        ;(sgdBallObj.value.material as THREE.MeshStandardMaterial).opacity = 1
      }

      // Move Adam ball to current head of path
      if (adamBallObj.value && count > 0 && count <= adamPath.length) {
        const p = adamPath[count - 1]
        adamBallObj.value.position.set(p.x, p.y + 0.02, p.z)
        adamBallObj.value.visible = true
        ;(adamBallObj.value.material as THREE.MeshStandardMaterial).opacity = 1
      }
    },
  })
}

/* ── Section-based highlights ── */
const sectionInfo = computed(() => {
  switch (props.activeSection) {
    case 0: return { label: 'Rotate and zoom the 3D loss landscape to explore', highlight: 'surface' }
    case 1: return { label: 'SGD: noisy gradient updates with momentum', highlight: 'sgd' }
    case 2: return { label: 'Adam: adaptive learning rates per parameter', highlight: 'adam' }
    case 3: return { label: 'Compare how optimizers navigate different landscapes', highlight: 'both' }
    default: return { label: 'Explore the loss landscape', highlight: 'surface' }
  }
})

/* ── Watch activeSection for path opacity highlighting ── */
watch(() => props.activeSection, (section) => {
  const hl = sectionInfo.value.highlight

  // Kill any in-flight opacity tweens before creating new ones
  activeTweens.forEach(t => t.kill())
  activeTweens.length = 0

  // Animate SGD opacity
  const sgdTarget = hl === 'adam' ? 0.15 : 1
  if (sgdLineObj.value) {
    activeTweens.push(gsap.to(sgdLineObj.value.material as THREE.LineBasicMaterial, {
      opacity: sgdTarget, duration: 0.6, ease: 'power2.out',
    }))
  }
  if (sgdBallObj.value && sgdBallObj.value.visible) {
    activeTweens.push(gsap.to(sgdBallObj.value.material as THREE.MeshStandardMaterial, {
      opacity: sgdTarget, duration: 0.6, ease: 'power2.out',
    }))
  }

  // Animate Adam opacity
  const adamTarget = hl === 'sgd' ? 0.15 : 1
  if (adamLineObj.value) {
    activeTweens.push(gsap.to(adamLineObj.value.material as THREE.LineBasicMaterial, {
      opacity: adamTarget, duration: 0.6, ease: 'power2.out',
    }))
  }
  if (adamBallObj.value && adamBallObj.value.visible) {
    activeTweens.push(gsap.to(adamBallObj.value.material as THREE.MeshStandardMaterial, {
      opacity: adamTarget, duration: 0.6, ease: 'power2.out',
    }))
  }

  // Re-animate paths on section 1-3
  if (section >= 1 && section <= 3) {
    animatePaths()
  }
}, { immediate: false })

/* ── Interaction tracking for exerciseComplete ── */
function onControlsEnd() {
  interactionCount.value++
  if (interactionCount.value >= 3 && !exerciseEmitted.value) {
    exerciseEmitted.value = true
    emit('exerciseComplete')
  }
  // Resume auto-rotate after 3s of inactivity
  if (autoRotateTimer) clearTimeout(autoRotateTimer)
  autoRotateTimer = setTimeout(() => {
    isUserInteracting.value = false
  }, 3000)
}

function onControlsStart() {
  isUserInteracting.value = true
  if (autoRotateTimer) {
    clearTimeout(autoRotateTimer)
    autoRotateTimer = null
  }
}


/* ── Progress display ── */
const explorationProgress = computed(() => Math.min(interactionCount.value, 3))

/* ── Lifecycle ── */
onMounted(() => {
  surfaceMesh.value = buildSurface()
  sgdLineObj.value = buildLine(sgdPath, '#f0a500')
  adamLineObj.value = buildLine(adamPath, '#22c55e')
  sgdBallObj.value = buildBall('#f0a500')
  adamBallObj.value = buildBall('#22c55e')
  globalMinMarker.value = buildMinMarker(
    new THREE.Vector3(1, lossFunction(1, 1) * 0.5 + 0.06, 1),
    '#14b8a6',
  )
  localMinMarker.value = buildMinMarker(
    new THREE.Vector3(-0.8, lossFunction(-0.8, -0.5) * 0.5 + 0.06, -0.5),
    '#a855f7',
  )
  gridHelperObj.value = buildGrid()

  // Delay path animation slightly so the scene renders first
  pathAnimTimeout = setTimeout(animatePaths, 800)
})

onUnmounted(() => {
  if (pathAnimTimeout) clearTimeout(pathAnimTimeout)
  if (pathTimeline) pathTimeline.kill()
  if (autoRotateTimer) clearTimeout(autoRotateTimer)
  activeTweens.forEach(t => t.kill())
  activeTweens.length = 0

  // Dispose all Three.js resources
  const dispose = (obj: THREE.Mesh | THREE.Line | THREE.GridHelper | null) => {
    if (!obj) return
    obj.geometry.dispose()
    const mat = obj.material
    if (Array.isArray(mat)) mat.forEach((m) => m.dispose())
    else mat.dispose()
  }

  dispose(surfaceMesh.value)
  dispose(sgdLineObj.value)
  dispose(adamLineObj.value)
  dispose(sgdBallObj.value)
  dispose(adamBallObj.value)
  dispose(globalMinMarker.value)
  dispose(localMinMarker.value)
  dispose(gridHelperObj.value)
})

/* ── Guided Tour steps with reactive checks ── */
const tourSteps = computed<TourStep[]>(() =>
  lossSurface3DTour.map((step, i) => ({
    ...step,
    check: i === 4 ? () => interactionCount.value >= 1
      : undefined,
  }))
)
</script>

<template>
  <div class="loss-surface">
    <!-- Guided Tour -->
    <GuidedTour
      :steps="tourSteps"
      chapter-id="ch08"
      tour-id="loss-surface"
      color="#f0a500"
    />

    <!-- Header -->
    <div class="loss-surface__header">
      <span class="loss-surface__badge">3D Interactive</span>
      <h3 class="loss-surface__title">Loss Surface &amp; Optimization</h3>
      <p class="loss-surface__subtitle">
        Rotate &amp; zoom to explore
        <span
          class="loss-surface__progress"
          :class="{ 'loss-surface__progress--complete': explorationProgress >= 3 }"
        >
          {{ explorationProgress }}/3
        </span>
      </p>
    </div>

    <!-- 3D Canvas -->
    <div class="loss-surface__canvas" role="img" aria-label="3D loss surface visualization">
      <ClientOnly>
        <TresCanvas
          :alpha="true"
          :antialias="true"
          :shadows="false"
        >
          <!-- Camera -->
          <TresPerspectiveCamera
            :position="[5, 4, 5]"
            :fov="45"
            :near="0.1"
            :far="100"
          />

          <!-- OrbitControls (auto-imported from @tresjs/cientos via nuxt module) -->
          <OrbitControls
            :auto-rotate="!isUserInteracting"
            :auto-rotate-speed="0.5"
            :enable-damping="true"
            :damping-factor="0.08"
            :min-distance="3"
            :max-distance="12"
            :max-polar-angle="Math.PI * 0.48"
            :min-polar-angle="Math.PI * 0.05"
            :target="[0, 0.8, 0]"
            @start="onControlsStart"
            @end="onControlsEnd"
          />

          <!-- Lighting -->
          <TresAmbientLight :intensity="0.4" color="#8ec8ff" />
          <TresDirectionalLight :position="[5, 8, 3]" :intensity="0.8" color="#ffffff" />
          <TresDirectionalLight :position="[-3, 2, -4]" :intensity="0.3" color="#14b8a6" />

          <!-- Loss surface -->
          <primitive v-if="surfaceMesh" :object="surfaceMesh" />

          <!-- Subtle ground grid -->
          <primitive v-if="gridHelperObj" :object="gridHelperObj" />

          <!-- SGD path + ball -->
          <primitive v-if="sgdLineObj" :object="sgdLineObj" />
          <primitive v-if="sgdBallObj" :object="sgdBallObj" />

          <!-- Adam path + ball -->
          <primitive v-if="adamLineObj" :object="adamLineObj" />
          <primitive v-if="adamBallObj" :object="adamBallObj" />

          <!-- Global minimum marker (teal glow) -->
          <primitive v-if="globalMinMarker" :object="globalMinMarker" />

          <!-- Local minimum marker (purple glow) -->
          <primitive v-if="localMinMarker" :object="localMinMarker" />
        </TresCanvas>

        <template #fallback>
          <div class="loss-surface__loading">
            <div class="loss-surface__loading-spinner" />
            <span class="loss-surface__loading-text">Loading 3D surface...</span>
          </div>
        </template>
      </ClientOnly>

      <!-- Legend overlay (positioned over the canvas) -->
      <div class="loss-surface__legend">
        <div class="loss-surface__legend-item">
          <span class="loss-surface__legend-swatch loss-surface__legend-swatch--sgd" />
          <span class="loss-surface__legend-label">SGD</span>
        </div>
        <div class="loss-surface__legend-item">
          <span class="loss-surface__legend-swatch loss-surface__legend-swatch--adam" />
          <span class="loss-surface__legend-label">Adam</span>
        </div>
        <div class="loss-surface__legend-item">
          <span class="loss-surface__legend-dot loss-surface__legend-dot--global" />
          <span class="loss-surface__legend-label">Global min</span>
        </div>
        <div class="loss-surface__legend-item">
          <span class="loss-surface__legend-dot loss-surface__legend-dot--local" />
          <span class="loss-surface__legend-label">Local min</span>
        </div>
      </div>

      <!-- Color scale indicator -->
      <div class="loss-surface__colorscale">
        <span class="loss-surface__colorscale-label">Low loss</span>
        <div class="loss-surface__colorscale-bar" />
        <span class="loss-surface__colorscale-label">High loss</span>
      </div>
    </div>

    <!-- Section context -->
    <div class="loss-surface__context">
      <span class="loss-surface__context-text">{{ sectionInfo.label }}</span>
    </div>
  </div>
</template>

<style scoped>
.loss-surface {
  --viz-bg: #05070f;
  --viz-surface: #0a0e1a;
  --viz-card: #0f1325;
  --viz-border: rgba(255, 255, 255, 0.06);
  --viz-primary: #14b8a6;
  --viz-text: #e2e8f0;
  --viz-text-muted: rgba(255, 255, 255, 0.45);
  --viz-accent-green: #22c55e;

  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  height: 100%;
  min-height: 0;
  font-family: 'Inter', sans-serif;
  user-select: none;
}

.loss-surface__header {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 4px;
}

.loss-surface__badge {
  display: inline-flex;
  align-self: flex-start;
  padding: 3px 10px;
  border-radius: 9999px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--viz-primary);
  background: rgba(20, 184, 166, 0.1);
  border: 1px solid rgba(20, 184, 166, 0.2);
}

.loss-surface__title {
  margin: 0;
  font-family: 'Syne', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: var(--viz-text);
  letter-spacing: -0.01em;
}

.loss-surface__subtitle {
  margin: 0;
  font-size: 12px;
  color: var(--viz-text-muted);
  display: flex;
  align-items: center;
  gap: 8px;
}

.loss-surface__progress {
  display: inline-flex;
  padding: 1px 8px;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 600;
  color: var(--viz-text-muted);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: all 0.4s ease;
}

.loss-surface__progress--complete {
  color: var(--viz-accent-green);
  background: rgba(34, 197, 94, 0.1);
  border-color: rgba(34, 197, 94, 0.3);
}

.loss-surface__canvas {
  position: relative;
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  border-radius: 12px;
  overflow: hidden;
  background: radial-gradient(ellipse at center, #0a0e1a 0%, #05070f 100%);
}

/* Loading fallback */
.loss-surface__loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: 300px;
  gap: 12px;
}

.loss-surface__loading-spinner {
  width: 28px;
  height: 28px;
  border: 2px solid rgba(20, 184, 166, 0.15);
  border-top-color: var(--viz-primary);
  border-radius: 50%;
  animation: spinLoader 0.8s linear infinite;
}

@keyframes spinLoader {
  to { transform: rotate(360deg); }
}

.loss-surface__loading-text {
  font-size: 12px;
  color: var(--viz-text-muted);
}

/* Legend overlay */
.loss-surface__legend {
  position: absolute;
  bottom: 12px;
  left: 12px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 8px 12px;
  background: rgba(10, 14, 26, 0.88);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  pointer-events: none;
  z-index: 10;
}

.loss-surface__legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.loss-surface__legend-swatch {
  width: 16px;
  height: 3px;
  border-radius: 2px;
}

.loss-surface__legend-swatch--sgd {
  background: linear-gradient(90deg, #f0a500, #ec4899);
}

.loss-surface__legend-swatch--adam {
  background: linear-gradient(90deg, #22c55e, #14b8a6);
}

.loss-surface__legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.loss-surface__legend-dot--global {
  background: #14b8a6;
  box-shadow: 0 0 6px #14b8a6;
}

.loss-surface__legend-dot--local {
  background: #a855f7;
  box-shadow: 0 0 6px #a855f7;
}

.loss-surface__legend-label {
  font-size: 10px;
  font-weight: 500;
  color: var(--viz-text-muted);
  letter-spacing: 0.02em;
}

/* Color scale */
.loss-surface__colorscale {
  position: absolute;
  bottom: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: rgba(10, 14, 26, 0.88);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  pointer-events: none;
  z-index: 10;
}

.loss-surface__colorscale-label {
  font-size: 9px;
  color: var(--viz-text-muted);
  white-space: nowrap;
}

.loss-surface__colorscale-bar {
  width: 60px;
  height: 6px;
  border-radius: 3px;
  background: linear-gradient(90deg, #0a1628, #14b8a6, #eab308, #ef4444, #7f1d1d);
}

/* Context bar */
.loss-surface__context {
  padding: 0 4px;
  min-height: 20px;
}

.loss-surface__context-text {
  font-size: 11px;
  color: var(--viz-text-muted);
  font-style: italic;
  opacity: 0.7;
  animation: contextFade 0.5s ease;
}

@keyframes contextFade {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 0.7; transform: translateY(0); }
}

@media (max-width: 768px) {
  .loss-surface__title { font-size: 14px; }

  .loss-surface__colorscale {
    display: none;
  }
}
</style>
