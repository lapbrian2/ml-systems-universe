<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

/* ── Props & Emits ── */
const props = defineProps<{
  activeSection: number
}>()

const emit = defineEmits<{
  exerciseComplete: []
}>()

/* ── Types ── */
interface Point {
  x: number
  y: number
}

interface OptimizerStep {
  x: number
  y: number
  loss: number
}

interface TooltipState {
  visible: boolean
  x: number
  y: number
  title: string
  description: string
}

/* ── Constants ── */
const GRID_SIZE = 20
const CONTOUR_LEVELS = 10
const SVG_W = 800
const SVG_H = 500
const PLOT_X = 60
const PLOT_Y = 40
const PLOT_W = 680
const PLOT_H = 400

/* ── Interaction state ── */
const clickCount = ref(0)
const exerciseEmitted = ref(false)
const startingPoints = ref<Point[]>([])
const sgdPaths = ref<OptimizerStep[][]>([])
const adamPaths = ref<OptimizerStep[][]>([])
const animationFrame = ref(0)
const animTimer = ref<ReturnType<typeof setInterval> | null>(null)
const tooltip = ref<TooltipState>({ visible: false, x: 0, y: 0, title: '', description: '' })

/* ── Loss function: two minima landscape ── */
function lossFunction(x: number, y: number): number {
  // Normalize to [-3, 3]
  const nx = (x / PLOT_W) * 6 - 3
  const ny = (y / PLOT_H) * 6 - 3
  // Two-basin surface
  const basin1 = 3 * Math.exp(-((nx - 1) ** 2 + (ny - 1) ** 2) / 0.8)
  const basin2 = 2.5 * Math.exp(-((nx + 0.8) ** 2 + (ny + 0.5) ** 2) / 1.2)
  const ridge = 0.3 * Math.sin(nx * 2) * Math.cos(ny * 2)
  return 4 - basin1 - basin2 + ridge + 0.1 * (nx * nx + ny * ny)
}

/* ── Gradient computation ── */
function gradient(x: number, y: number): { dx: number; dy: number } {
  const h = 0.5
  const dx = (lossFunction(x + h, y) - lossFunction(x - h, y)) / (2 * h)
  const dy = (lossFunction(x, y + h) - lossFunction(x, y - h)) / (2 * h)
  return { dx, dy }
}

/* ── Contour paths ── */
const contourData = computed(() => {
  const points: { x: number; y: number; loss: number }[] = []
  const step = PLOT_W / GRID_SIZE
  for (let i = 0; i <= GRID_SIZE; i++) {
    for (let j = 0; j <= GRID_SIZE; j++) {
      const px = i * step
      const py = j * step
      points.push({ x: px, y: py, loss: lossFunction(px, py) })
    }
  }
  return points
})

const contourLevels = computed(() => {
  const losses = contourData.value.map(p => p.loss)
  const min = Math.min(...losses)
  const max = Math.max(...losses)
  const levels: number[] = []
  for (let i = 0; i < CONTOUR_LEVELS; i++) {
    levels.push(min + (max - min) * (i / (CONTOUR_LEVELS - 1)))
  }
  return levels
})

/* ── Build contour circles approximation ── */
const contourCircles = computed(() => {
  const circles: { cx: number; cy: number; r: number; level: number; opacity: number }[] = []
  const minima = [
    { x: (1 + 3) / 6 * PLOT_W, y: (1 + 3) / 6 * PLOT_H },
    { x: (-0.8 + 3) / 6 * PLOT_W, y: (-0.5 + 3) / 6 * PLOT_H },
  ]

  for (const m of minima) {
    for (let i = 1; i <= 8; i++) {
      circles.push({
        cx: m.x,
        cy: m.y,
        r: i * 22 + (m === minima[0] ? 0 : 5),
        level: i,
        opacity: 0.08 + (8 - i) * 0.03,
      })
    }
  }
  return circles
})

/* ── SGD simulation ── */
function simulateSGD(startX: number, startY: number): OptimizerStep[] {
  const path: OptimizerStep[] = []
  let x = startX
  let y = startY
  const lr = 8
  for (let i = 0; i < 40; i++) {
    const loss = lossFunction(x, y)
    path.push({ x, y, loss })
    const g = gradient(x, y)
    // Add noise for SGD
    const noise = 4
    x -= lr * g.dx + (Math.random() - 0.5) * noise
    y -= lr * g.dy + (Math.random() - 0.5) * noise
    x = Math.max(0, Math.min(PLOT_W, x))
    y = Math.max(0, Math.min(PLOT_H, y))
  }
  return path
}

/* ── Adam simulation ── */
function simulateAdam(startX: number, startY: number): OptimizerStep[] {
  const path: OptimizerStep[] = []
  let x = startX
  let y = startY
  const lr = 12
  let mx = 0, my = 0
  let vx = 0, vy = 0
  const beta1 = 0.9, beta2 = 0.999, eps = 1e-8

  for (let i = 0; i < 40; i++) {
    const loss = lossFunction(x, y)
    path.push({ x, y, loss })
    const g = gradient(x, y)
    mx = beta1 * mx + (1 - beta1) * g.dx
    my = beta1 * my + (1 - beta1) * g.dy
    vx = beta2 * vx + (1 - beta2) * g.dx * g.dx
    vy = beta2 * vy + (1 - beta2) * g.dy * g.dy
    const mxHat = mx / (1 - Math.pow(beta1, i + 1))
    const myHat = my / (1 - Math.pow(beta1, i + 1))
    const vxHat = vx / (1 - Math.pow(beta2, i + 1))
    const vyHat = vy / (1 - Math.pow(beta2, i + 1))
    x -= lr * mxHat / (Math.sqrt(vxHat) + eps)
    y -= lr * myHat / (Math.sqrt(vyHat) + eps)
    x = Math.max(0, Math.min(PLOT_W, x))
    y = Math.max(0, Math.min(PLOT_H, y))
  }
  return path
}

/* ── Click handler ── */
function handleSurfaceClick(event: MouseEvent) {
  const svg = (event.currentTarget as SVGElement)
  const rect = svg.getBoundingClientRect()
  const scaleX = SVG_W / rect.width
  const scaleY = SVG_H / rect.height
  const px = (event.clientX - rect.left) * scaleX - PLOT_X
  const py = (event.clientY - rect.top) * scaleY - PLOT_Y

  if (px < 0 || px > PLOT_W || py < 0 || py > PLOT_H) return

  startingPoints.value = [...startingPoints.value, { x: px, y: py }]
  sgdPaths.value = [...sgdPaths.value, simulateSGD(px, py)]
  adamPaths.value = [...adamPaths.value, simulateAdam(px, py)]
  animationFrame.value = 0

  clickCount.value++
  if (clickCount.value >= 3 && !exerciseEmitted.value) {
    exerciseEmitted.value = true
    emit('exerciseComplete')
  }

  startAnimation()
}

function startAnimation() {
  if (animTimer.value) clearInterval(animTimer.value)
  animationFrame.value = 0
  animTimer.value = setInterval(() => {
    if (animationFrame.value < 39) {
      animationFrame.value++
    } else if (animTimer.value) {
      clearInterval(animTimer.value)
    }
  }, 80)
}

/* ── Build visible path ── */
function visiblePath(steps: OptimizerStep[]): string {
  const visible = steps.slice(0, animationFrame.value + 1)
  if (visible.length < 2) return ''
  return visible.map((s, i) =>
    `${i === 0 ? 'M' : 'L'} ${PLOT_X + s.x} ${PLOT_Y + s.y}`
  ).join(' ')
}

/* ── Section-based highlights ── */
const sectionInfo = computed(() => {
  switch (props.activeSection) {
    case 0: return { label: 'Click on the loss surface to place starting points', highlight: 'surface' }
    case 1: return { label: 'SGD: noisy gradient updates with momentum', highlight: 'sgd' }
    case 2: return { label: 'Adam: adaptive learning rates per parameter', highlight: 'adam' }
    case 3: return { label: 'Compare how optimizers navigate different landscapes', highlight: 'both' }
    default: return { label: 'Explore the loss landscape', highlight: 'surface' }
  }
})

/* ── Show tooltip ── */
function showOptimizerInfo(type: string, event: MouseEvent) {
  const svg = (event.currentTarget as SVGElement).closest('svg')
  if (!svg) return
  const rect = svg.getBoundingClientRect()
  const info = type === 'sgd'
    ? { title: 'SGD (Stochastic Gradient Descent)', description: 'Updates weights using gradients from mini-batches. Noisy but can escape local minima. Learning rate is constant.' }
    : { title: 'Adam Optimizer', description: 'Combines momentum and adaptive learning rates. Maintains per-parameter learning rates. Converges faster and more smoothly.' }
  tooltip.value = {
    visible: true,
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
    ...info,
  }
}

function closeTooltip() {
  tooltip.value.visible = false
}

/* ── Progress ── */
const explorationProgress = computed(() => Math.min(clickCount.value, 3))

/* ── Cleanup ── */
onUnmounted(() => {
  if (animTimer.value) clearInterval(animTimer.value)
})

watch(() => props.activeSection, () => {
  tooltip.value.visible = false
})
</script>

<template>
  <div class="loss-surface" @click.self="closeTooltip">
    <!-- Header -->
    <div class="loss-surface__header">
      <span class="loss-surface__badge">Interactive</span>
      <h3 class="loss-surface__title">Loss Surface &amp; Optimization</h3>
      <p class="loss-surface__subtitle">
        Click to place starting points
        <span
          class="loss-surface__progress"
          :class="{ 'loss-surface__progress--complete': explorationProgress >= 3 }"
        >
          {{ explorationProgress }}/3
        </span>
      </p>
    </div>

    <!-- SVG Visualization -->
    <div class="loss-surface__canvas">
      <svg
        :viewBox="`0 0 ${SVG_W} ${SVG_H}`"
        class="loss-surface__svg"
        preserveAspectRatio="xMidYMid meet"
        @click="handleSurfaceClick"
      >
        <defs>
          <filter id="ls-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="ls-glow-strong" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <radialGradient id="ls-basin1" cx="67%" cy="67%">
            <stop offset="0%" stop-color="#14b8a6" stop-opacity="0.3" />
            <stop offset="60%" stop-color="#14b8a6" stop-opacity="0.05" />
            <stop offset="100%" stop-color="#14b8a6" stop-opacity="0" />
          </radialGradient>
          <radialGradient id="ls-basin2" cx="37%" cy="42%">
            <stop offset="0%" stop-color="#a855f7" stop-opacity="0.25" />
            <stop offset="60%" stop-color="#a855f7" stop-opacity="0.04" />
            <stop offset="100%" stop-color="#a855f7" stop-opacity="0" />
          </radialGradient>
          <linearGradient id="ls-sgd-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#f0a500" />
            <stop offset="100%" stop-color="#ec4899" />
          </linearGradient>
          <linearGradient id="ls-adam-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#22c55e" />
            <stop offset="100%" stop-color="#14b8a6" />
          </linearGradient>
        </defs>

        <!-- Background grid -->
        <rect :x="PLOT_X" :y="PLOT_Y" :width="PLOT_W" :height="PLOT_H" fill="#080c18" rx="8" />

        <!-- Grid lines -->
        <g opacity="0.06">
          <line
            v-for="i in 9"
            :key="`gx-${i}`"
            :x1="PLOT_X + (PLOT_W / 10) * i"
            :y1="PLOT_Y"
            :x2="PLOT_X + (PLOT_W / 10) * i"
            :y2="PLOT_Y + PLOT_H"
            stroke="#14b8a6"
            stroke-width="0.5"
          />
          <line
            v-for="i in 9"
            :key="`gy-${i}`"
            :x1="PLOT_X"
            :y1="PLOT_Y + (PLOT_H / 10) * i"
            :x2="PLOT_X + PLOT_W"
            :y2="PLOT_Y + (PLOT_H / 10) * i"
            stroke="#14b8a6"
            stroke-width="0.5"
          />
        </g>

        <!-- Contour rings -->
        <g>
          <ellipse
            v-for="(c, i) in contourCircles"
            :key="`contour-${i}`"
            :cx="PLOT_X + c.cx"
            :cy="PLOT_Y + c.cy"
            :rx="c.r"
            :ry="c.r * 0.75"
            fill="none"
            :stroke="c.level <= 4 ? '#14b8a6' : '#a855f7'"
            stroke-width="0.8"
            :opacity="c.opacity"
            class="loss-surface__contour"
          />
        </g>

        <!-- Basin glow -->
        <ellipse
          :cx="PLOT_X + (1 + 3) / 6 * PLOT_W"
          :cy="PLOT_Y + (1 + 3) / 6 * PLOT_H"
          rx="80"
          ry="60"
          fill="url(#ls-basin1)"
          class="loss-surface__basin-glow"
        />
        <ellipse
          :cx="PLOT_X + (-0.8 + 3) / 6 * PLOT_W"
          :cy="PLOT_Y + (-0.5 + 3) / 6 * PLOT_H"
          rx="70"
          ry="55"
          fill="url(#ls-basin2)"
          class="loss-surface__basin-glow"
        />

        <!-- Minimum markers -->
        <g>
          <circle
            :cx="PLOT_X + (1 + 3) / 6 * PLOT_W"
            :cy="PLOT_Y + (1 + 3) / 6 * PLOT_H"
            r="5"
            fill="#14b8a6"
            opacity="0.8"
            filter="url(#ls-glow)"
          />
          <text
            :x="PLOT_X + (1 + 3) / 6 * PLOT_W + 10"
            :y="PLOT_Y + (1 + 3) / 6 * PLOT_H + 4"
            class="loss-surface__label"
            fill="#14b8a6"
            opacity="0.7"
          >
            Global Min
          </text>
          <circle
            :cx="PLOT_X + (-0.8 + 3) / 6 * PLOT_W"
            :cy="PLOT_Y + (-0.5 + 3) / 6 * PLOT_H"
            r="4"
            fill="#a855f7"
            opacity="0.7"
            filter="url(#ls-glow)"
          />
          <text
            :x="PLOT_X + (-0.8 + 3) / 6 * PLOT_W + 10"
            :y="PLOT_Y + (-0.5 + 3) / 6 * PLOT_H + 4"
            class="loss-surface__label"
            fill="#a855f7"
            opacity="0.6"
          >
            Local Min
          </text>
        </g>

        <!-- SGD paths -->
        <g
          v-for="(path, pi) in sgdPaths"
          :key="`sgd-${pi}`"
          :opacity="sectionInfo.highlight === 'adam' ? 0.2 : 1"
          class="loss-surface__path-group"
        >
          <path
            :d="visiblePath(path)"
            fill="none"
            stroke="url(#ls-sgd-grad)"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            opacity="0.8"
            class="loss-surface__optimizer-path"
          />
          <!-- Current position dot -->
          <circle
            v-if="path[Math.min(animationFrame, path.length - 1)]"
            :cx="PLOT_X + path[Math.min(animationFrame, path.length - 1)].x"
            :cy="PLOT_Y + path[Math.min(animationFrame, path.length - 1)].y"
            r="4"
            fill="#f0a500"
            filter="url(#ls-glow)"
            class="loss-surface__dot-pulse"
          />
        </g>

        <!-- Adam paths -->
        <g
          v-for="(path, pi) in adamPaths"
          :key="`adam-${pi}`"
          :opacity="sectionInfo.highlight === 'sgd' ? 0.2 : 1"
          class="loss-surface__path-group"
        >
          <path
            :d="visiblePath(path)"
            fill="none"
            stroke="url(#ls-adam-grad)"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            opacity="0.8"
            class="loss-surface__optimizer-path"
          />
          <circle
            v-if="path[Math.min(animationFrame, path.length - 1)]"
            :cx="PLOT_X + path[Math.min(animationFrame, path.length - 1)].x"
            :cy="PLOT_Y + path[Math.min(animationFrame, path.length - 1)].y"
            r="4"
            fill="#22c55e"
            filter="url(#ls-glow)"
            class="loss-surface__dot-pulse"
          />
        </g>

        <!-- Starting points -->
        <g v-for="(pt, i) in startingPoints" :key="`start-${i}`">
          <circle
            :cx="PLOT_X + pt.x"
            :cy="PLOT_Y + pt.y"
            r="6"
            fill="none"
            stroke="#ffffff"
            stroke-width="1.5"
            opacity="0.5"
          />
          <circle
            :cx="PLOT_X + pt.x"
            :cy="PLOT_Y + pt.y"
            r="2"
            fill="#ffffff"
            opacity="0.8"
          />
        </g>

        <!-- Legend -->
        <g transform="translate(60, 455)">
          <rect x="0" y="-2" width="200" height="28" rx="6" fill="#0a0e1a" opacity="0.9" />
          <line x1="10" y1="12" x2="30" y2="12" stroke="#f0a500" stroke-width="2" />
          <text x="36" y="16" class="loss-surface__legend-text">SGD</text>
          <line x1="80" y1="12" x2="100" y2="12" stroke="#22c55e" stroke-width="2" />
          <text x="106" y="16" class="loss-surface__legend-text">Adam</text>
        </g>

        <!-- Axis labels -->
        <text :x="PLOT_X + PLOT_W / 2" :y="SVG_H - 5" text-anchor="middle" class="loss-surface__axis-label">
          Parameter &theta;&#x2081;
        </text>
        <text :x="15" :y="PLOT_Y + PLOT_H / 2" text-anchor="middle" class="loss-surface__axis-label" transform="rotate(-90, 15, 240)">
          Parameter &theta;&#x2082;
        </text>

        <!-- Click prompt -->
        <text
          v-if="startingPoints.length === 0"
          :x="PLOT_X + PLOT_W / 2"
          :y="PLOT_Y + PLOT_H / 2"
          text-anchor="middle"
          class="loss-surface__prompt"
        >
          Click anywhere to start gradient descent
        </text>

        <!-- Tooltip -->
        <foreignObject
          v-if="tooltip.visible"
          :x="Math.min(Math.max(tooltip.x - 130, 10), SVG_W - 280)"
          :y="tooltip.y < 250 ? tooltip.y + 15 : tooltip.y - 110"
          width="260"
          height="100"
          class="loss-surface__tooltip-foreign"
        >
          <div class="loss-surface__tooltip" @click.stop>
            <div class="loss-surface__tooltip-header">
              <span class="loss-surface__tooltip-title">{{ tooltip.title }}</span>
              <button class="loss-surface__tooltip-close" aria-label="Close tooltip" @click.stop="closeTooltip">&times;</button>
            </div>
            <p class="loss-surface__tooltip-desc">{{ tooltip.description }}</p>
          </div>
        </foreignObject>
      </svg>
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
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: crosshair;
}

.loss-surface__svg {
  width: 100%;
  height: auto;
  overflow: visible;
}

.loss-surface__contour {
  transition: opacity 0.5s ease;
}

.loss-surface__basin-glow {
  animation: basinPulse 4s ease-in-out infinite;
}

@keyframes basinPulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

.loss-surface__path-group {
  transition: opacity 0.5s ease;
}

.loss-surface__optimizer-path {
  transition: opacity 0.3s ease;
}

.loss-surface__dot-pulse {
  animation: dotPulse 1.2s ease-in-out infinite;
}

@keyframes dotPulse {
  0%, 100% { r: 4; opacity: 1; }
  50% { r: 6; opacity: 0.7; }
}

.loss-surface__label {
  font-size: 10px;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
}

.loss-surface__legend-text {
  fill: var(--viz-text-muted);
  font-size: 11px;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
}

.loss-surface__axis-label {
  fill: var(--viz-text-muted);
  font-size: 11px;
  font-family: 'Inter', sans-serif;
}

.loss-surface__prompt {
  fill: rgba(255, 255, 255, 0.25);
  font-size: 14px;
  font-family: 'Inter', sans-serif;
  animation: promptPulse 2s ease-in-out infinite;
}

@keyframes promptPulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
}

.loss-surface__tooltip-foreign {
  pointer-events: none;
  overflow: visible;
}

.loss-surface__tooltip {
  pointer-events: auto;
  background: rgba(10, 14, 26, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 12px 14px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  animation: tooltipFadeIn 0.25s ease;
}

@keyframes tooltipFadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

.loss-surface__tooltip-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.loss-surface__tooltip-title {
  font-size: 12px;
  font-weight: 600;
  color: #ffffff;
  flex: 1;
  font-family: 'Syne', sans-serif;
}

.loss-surface__tooltip-close {
  appearance: none;
  border: none;
  background: rgba(255, 255, 255, 0.06);
  color: var(--viz-text-muted);
  width: 20px;
  height: 20px;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
  padding: 0;
}

.loss-surface__tooltip-close:hover {
  background: rgba(255, 255, 255, 0.12);
}

.loss-surface__tooltip-desc {
  margin: 0;
  font-size: 11px;
  line-height: 1.5;
  color: var(--viz-text-muted);
}

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
}
</style>
