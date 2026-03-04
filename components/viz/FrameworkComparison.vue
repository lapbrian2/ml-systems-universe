<script setup lang="ts">
import { ref, computed, watch } from 'vue'

/* ── Props & Emits ── */
const props = defineProps<{
  activeSection: number
}>()

const emit = defineEmits<{
  exerciseComplete: []
}>()

/* ── Types ── */
interface Framework {
  id: string
  name: string
  color: string
  tagline: string
  description: string
  scores: {
    easeOfUse: number
    performance: number
    community: number
    deployment: number
    research: number
  }
}

/* ── Framework Data ── */
const frameworks: Framework[] = [
  {
    id: 'pytorch',
    name: 'PyTorch',
    color: '#ee4c2c',
    tagline: 'Research-first dynamic graphs',
    description: 'Dynamic computation graphs with Pythonic API. Dominant in research, growing in production with TorchServe.',
    scores: { easeOfUse: 9, performance: 8, community: 9, deployment: 7, research: 10 },
  },
  {
    id: 'tensorflow',
    name: 'TensorFlow',
    color: '#ff6f00',
    tagline: 'Production-grade ecosystem',
    description: 'Comprehensive ML platform with Keras, TFLite, TF Serving. Strong enterprise and mobile deployment story.',
    scores: { easeOfUse: 7, performance: 8, community: 8, deployment: 10, research: 7 },
  },
  {
    id: 'jax',
    name: 'JAX',
    color: '#5c6bc0',
    tagline: 'Composable transformations',
    description: 'NumPy-compatible with auto-diff, JIT compilation, and hardware-agnostic XLA. Rising in cutting-edge research.',
    scores: { easeOfUse: 5, performance: 10, community: 5, deployment: 4, research: 9 },
  },
  {
    id: 'onnx',
    name: 'ONNX',
    color: '#00b4d8',
    tagline: 'Universal model interchange',
    description: 'Open format for model interoperability. Export from any framework, deploy anywhere with ONNX Runtime.',
    scores: { easeOfUse: 6, performance: 9, community: 6, deployment: 9, research: 3 },
  },
]

const radarAxes = ['Ease of Use', 'Performance', 'Community', 'Deployment', 'Research'] as const
type AxisKey = 'easeOfUse' | 'performance' | 'community' | 'deployment' | 'research'
const axisKeys: AxisKey[] = ['easeOfUse', 'performance', 'community', 'deployment', 'research']

/* ── Highlight per section ── */
const highlightedId = computed<string | null>(() => {
  switch (props.activeSection) {
    case 0: return 'pytorch'
    case 1: return 'tensorflow'
    case 2: return 'jax'
    case 3: return 'onnx'
    default: return null
  }
})

/* ── Interaction State ── */
const clickedFrameworks = ref<Set<string>>(new Set())
const selectedFramework = ref<string | null>(null)
const exerciseEmitted = ref(false)

function handleFrameworkClick(fwId: string) {
  selectedFramework.value = selectedFramework.value === fwId ? null : fwId
  clickedFrameworks.value = new Set([...clickedFrameworks.value, fwId])

  if (clickedFrameworks.value.size >= 3 && !exerciseEmitted.value) {
    exerciseEmitted.value = true
    emit('exerciseComplete')
  }
}

/* ── State Helpers ── */
function isHighlighted(id: string): boolean {
  return highlightedId.value === id
}

function isSelected(id: string): boolean {
  return selectedFramework.value === id
}

function fwOpacity(id: string): number {
  if (isSelected(id)) return 1
  if (highlightedId.value === null && selectedFramework.value === null) return 0.8
  if (isHighlighted(id)) return 1
  return 0.3
}

/* ── Progress ── */
const explorationProgress = computed(() => Math.min(clickedFrameworks.value.size, 3))

/* ── Radar chart geometry ── */
const radarCx = 460
const radarCy = 200
const radarR = 140
const angleStep = (2 * Math.PI) / 5

function radarPoint(axisIdx: number, value: number): { x: number; y: number } {
  const angle = -Math.PI / 2 + axisIdx * angleStep
  const r = (value / 10) * radarR
  return {
    x: radarCx + r * Math.cos(angle),
    y: radarCy + r * Math.sin(angle),
  }
}

function radarPolygonPoints(fw: Framework): string {
  return axisKeys
    .map((key, i) => {
      const p = radarPoint(i, fw.scores[key])
      return `${p.x},${p.y}`
    })
    .join(' ')
}

function radarGridPoints(level: number): string {
  return Array.from({ length: 5 }, (_, i) => {
    const p = radarPoint(i, level)
    return `${p.x},${p.y}`
  }).join(' ')
}

/* ── Active frameworks for radar overlay ── */
const visibleFrameworks = computed(() => {
  if (selectedFramework.value) {
    return frameworks.filter(fw => fw.id === selectedFramework.value)
  }
  if (highlightedId.value) {
    return frameworks.filter(fw => fw.id === highlightedId.value)
  }
  return frameworks
})

/* ── Reset ── */
watch(
  () => props.activeSection,
  () => { selectedFramework.value = null }
)
</script>

<template>
  <div class="fw-cmp">
    <!-- Header -->
    <div class="fw-cmp__header">
      <span class="fw-cmp__badge">Interactive</span>
      <h3 class="fw-cmp__title">Framework Comparison</h3>
      <p class="fw-cmp__subtitle">
        Click frameworks to compare on radar chart
        <span
          class="fw-cmp__progress"
          :class="{ 'fw-cmp__progress--complete': explorationProgress >= 3 }"
        >
          {{ explorationProgress }}/3
        </span>
      </p>
    </div>

    <!-- SVG — Desktop -->
    <div class="fw-cmp__canvas">
      <svg
        viewBox="0 0 960 420"
        class="fw-cmp__svg fw-cmp__svg--horizontal"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="fw-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="fw-glow-strong" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="14" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <!-- Framework cards (left side) -->
        <g
          v-for="(fw, fi) in frameworks"
          :key="fw.id"
          class="fw-cmp__card"
          :class="{
            'fw-cmp__card--highlighted': isHighlighted(fw.id),
            'fw-cmp__card--selected': isSelected(fw.id),
          }"
          :style="{
            '--fw-color': fw.color,
            opacity: fwOpacity(fw.id),
          }"
          :transform="`translate(20, ${20 + fi * 96})`"
          role="button"
          :tabindex="0"
          :aria-label="`Framework: ${fw.name}. ${fw.tagline}. ${fw.description}`"
          @click.stop="handleFrameworkClick(fw.id)"
          @keydown.enter.stop="handleFrameworkClick(fw.id)"
          @keydown.space.prevent.stop="handleFrameworkClick(fw.id)"
        >
          <!-- Glow -->
          <rect
            x="-8"
            y="-8"
            width="236"
            height="96"
            rx="18"
            class="fw-cmp__card-glow"
            :filter="isSelected(fw.id) ? 'url(#fw-glow-strong)' : 'url(#fw-glow)'"
          />
          <!-- Background -->
          <rect x="0" y="0" width="220" height="80" rx="14" class="fw-cmp__card-bg" />
          <rect x="0" y="0" width="220" height="80" rx="14" class="fw-cmp__card-border" />

          <!-- Color accent bar -->
          <rect x="0" y="0" width="4" height="80" rx="2" :fill="fw.color" opacity="0.6" />

          <!-- Name -->
          <text x="18" y="28" class="fw-cmp__card-name">{{ fw.name }}</text>

          <!-- Tagline -->
          <text x="18" y="46" class="fw-cmp__card-tagline">{{ fw.tagline }}</text>

          <!-- Score summary -->
          <g transform="translate(18, 58)">
            <rect
              v-for="(key, ki) in axisKeys"
              :key="ki"
              :x="ki * 38"
              y="0"
              :width="(fw.scores[key] / 10) * 32"
              height="6"
              rx="3"
              :fill="fw.color"
              :opacity="0.3 + (fw.scores[key] / 10) * 0.5"
            />
          </g>
        </g>

        <!-- Radar Chart (right side) -->
        <g class="fw-cmp__radar">
          <!-- Grid rings -->
          <polygon
            v-for="level in [2, 4, 6, 8, 10]"
            :key="`grid-${level}`"
            :points="radarGridPoints(level)"
            class="fw-cmp__radar-grid"
          />

          <!-- Axis lines -->
          <line
            v-for="(_, ai) in radarAxes"
            :key="`axis-${ai}`"
            :x1="radarCx"
            :y1="radarCy"
            :x2="radarPoint(ai, 10).x"
            :y2="radarPoint(ai, 10).y"
            class="fw-cmp__radar-axis"
          />

          <!-- Axis labels -->
          <text
            v-for="(label, ai) in radarAxes"
            :key="`label-${ai}`"
            :x="radarPoint(ai, 12).x"
            :y="radarPoint(ai, 12).y + 4"
            text-anchor="middle"
            class="fw-cmp__radar-label"
          >
            {{ label }}
          </text>

          <!-- Framework polygons -->
          <polygon
            v-for="fw in visibleFrameworks"
            :key="`poly-${fw.id}`"
            :points="radarPolygonPoints(fw)"
            class="fw-cmp__radar-polygon"
            :style="{
              '--fw-color': fw.color,
              stroke: fw.color,
              fill: fw.color,
            }"
          />

          <!-- Data points -->
          <g v-for="fw in visibleFrameworks" :key="`dots-${fw.id}`">
            <circle
              v-for="(key, ki) in axisKeys"
              :key="ki"
              :cx="radarPoint(ki, fw.scores[key]).x"
              :cy="radarPoint(ki, fw.scores[key]).y"
              r="4"
              :fill="fw.color"
              class="fw-cmp__radar-dot"
            />
          </g>
        </g>

        <!-- Legend -->
        <g transform="translate(660, 20)">
          <g
            v-for="(fw, fi) in frameworks"
            :key="`leg-${fw.id}`"
            :transform="`translate(0, ${fi * 24})`"
            :style="{ opacity: fwOpacity(fw.id) }"
          >
            <rect x="0" y="-6" width="12" height="12" rx="3" :fill="fw.color" />
            <text x="18" y="4" class="fw-cmp__legend-text">{{ fw.name }}</text>
          </g>
        </g>
      </svg>

      <!-- Vertical (mobile) -->
      <svg
        viewBox="0 0 280 900"
        class="fw-cmp__svg fw-cmp__svg--vertical"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="fw-glow-v" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <!-- Cards stacked -->
        <g
          v-for="(fw, fi) in frameworks"
          :key="`v-${fw.id}`"
          class="fw-cmp__card"
          :class="{
            'fw-cmp__card--highlighted': isHighlighted(fw.id),
            'fw-cmp__card--selected': isSelected(fw.id),
          }"
          :style="{
            '--fw-color': fw.color,
            opacity: fwOpacity(fw.id),
          }"
          :transform="`translate(10, ${10 + fi * 100})`"
          role="button"
          :tabindex="0"
          :aria-label="`Framework: ${fw.name}. ${fw.tagline}`"
          @click.stop="handleFrameworkClick(fw.id)"
          @keydown.enter.stop="handleFrameworkClick(fw.id)"
          @keydown.space.prevent.stop="handleFrameworkClick(fw.id)"
        >
          <rect x="-5" y="-5" width="270" height="90" rx="18" class="fw-cmp__card-glow" filter="url(#fw-glow-v)" />
          <rect x="0" y="0" width="260" height="80" rx="14" class="fw-cmp__card-bg" />
          <rect x="0" y="0" width="260" height="80" rx="14" class="fw-cmp__card-border" />
          <rect x="0" y="0" width="4" height="80" rx="2" :fill="fw.color" opacity="0.6" />
          <text x="18" y="30" class="fw-cmp__card-name fw-cmp__card-name--vertical">{{ fw.name }}</text>
          <text x="18" y="50" class="fw-cmp__card-tagline">{{ fw.tagline }}</text>
        </g>

        <!-- Small radar chart below on mobile -->
        <g transform="translate(140, 550)">
          <polygon
            v-for="level in [2, 4, 6, 8, 10]"
            :key="`vgrid-${level}`"
            :points="Array.from({ length: 5 }, (_, i) => {
              const angle = -Math.PI / 2 + i * angleStep
              const r = (level / 10) * 100
              return `${r * Math.cos(angle)},${r * Math.sin(angle)}`
            }).join(' ')"
            class="fw-cmp__radar-grid"
          />
          <polygon
            v-for="fw in visibleFrameworks"
            :key="`vpoly-${fw.id}`"
            :points="axisKeys.map((key, i) => {
              const angle = -Math.PI / 2 + i * angleStep
              const r = (fw.scores[key] / 10) * 100
              return `${r * Math.cos(angle)},${r * Math.sin(angle)}`
            }).join(' ')"
            :style="{ stroke: fw.color, fill: fw.color }"
            class="fw-cmp__radar-polygon"
          />
        </g>
      </svg>
    </div>

    <!-- Detail panel -->
    <div v-if="selectedFramework" class="fw-cmp__detail">
      <div class="fw-cmp__detail-inner">
        <span
          class="fw-cmp__detail-dot"
          :style="{ background: frameworks.find(f => f.id === selectedFramework)?.color }"
        />
        <span class="fw-cmp__detail-name">
          {{ frameworks.find(f => f.id === selectedFramework)?.name }}
        </span>
      </div>
      <p class="fw-cmp__detail-desc">
        {{ frameworks.find(f => f.id === selectedFramework)?.description }}
      </p>
    </div>

    <!-- Context -->
    <div class="fw-cmp__context">
      <span v-if="activeSection === 0" class="fw-cmp__context-text">
        PyTorch: dynamic graphs, intuitive debugging, research favorite
      </span>
      <span v-else-if="activeSection === 1" class="fw-cmp__context-text">
        TensorFlow: production ecosystem with Keras, TFLite, and Serving
      </span>
      <span v-else-if="activeSection === 2" class="fw-cmp__context-text">
        JAX: functional transforms with XLA compilation for raw speed
      </span>
      <span v-else-if="activeSection === 3" class="fw-cmp__context-text">
        ONNX: bridge between frameworks for portable deployment
      </span>
    </div>
  </div>
</template>

<style scoped>
/* ── CSS Variables ── */
.fw-cmp {
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
  gap: 12px;
  width: 100%;
  height: 100%;
  min-height: 0;
  font-family: 'Inter', sans-serif;
  user-select: none;
}

/* ── Header ── */
.fw-cmp__header {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 4px;
}

.fw-cmp__badge {
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

.fw-cmp__title {
  margin: 0;
  font-family: 'Syne', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: var(--viz-text);
  letter-spacing: -0.01em;
}

.fw-cmp__subtitle {
  margin: 0;
  font-size: 12px;
  color: var(--viz-text-muted);
  display: flex;
  align-items: center;
  gap: 8px;
}

.fw-cmp__progress {
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

.fw-cmp__progress--complete {
  color: var(--viz-accent-green);
  background: rgba(34, 197, 94, 0.1);
  border-color: rgba(34, 197, 94, 0.3);
}

/* ── Canvas ── */
.fw-cmp__canvas {
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fw-cmp__svg {
  width: 100%;
  height: auto;
  overflow: visible;
}

.fw-cmp__svg--vertical {
  display: none;
}

/* ── Framework Cards ── */
.fw-cmp__card {
  cursor: pointer;
  transition: opacity 0.5s ease;
  outline: none;
}

.fw-cmp__card:focus-visible .fw-cmp__card-border {
  stroke: var(--viz-primary);
  stroke-opacity: 0.8;
  stroke-width: 2;
}

.fw-cmp__card-glow {
  fill: var(--fw-color);
  opacity: 0;
  transition: opacity 0.5s ease;
}

.fw-cmp__card--highlighted .fw-cmp__card-glow {
  opacity: 0.08;
}

.fw-cmp__card--selected .fw-cmp__card-glow {
  opacity: 0.18;
}

.fw-cmp__card-bg {
  fill: var(--viz-card);
  transition: fill 0.3s ease;
}

.fw-cmp__card:hover .fw-cmp__card-bg {
  fill: #141933;
}

.fw-cmp__card--selected .fw-cmp__card-bg {
  fill: #181e3a;
}

.fw-cmp__card-border {
  fill: none;
  stroke: var(--viz-border);
  stroke-width: 1;
  transition: stroke 0.4s ease, stroke-width 0.3s ease;
}

.fw-cmp__card--highlighted .fw-cmp__card-border {
  stroke: var(--fw-color);
  stroke-opacity: 0.35;
}

.fw-cmp__card--selected .fw-cmp__card-border {
  stroke: var(--fw-color);
  stroke-opacity: 0.7;
  stroke-width: 1.5;
}

.fw-cmp__card-name {
  fill: var(--viz-text);
  font-size: 13px;
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  transition: fill 0.3s ease;
}

.fw-cmp__card--selected .fw-cmp__card-name {
  fill: #ffffff;
}

.fw-cmp__card-name--vertical {
  font-size: 14px;
}

.fw-cmp__card-tagline {
  fill: var(--viz-text-muted);
  font-size: 10px;
  font-family: 'Inter', sans-serif;
  font-style: italic;
}

/* ── Radar Chart ── */
.fw-cmp__radar-grid {
  fill: none;
  stroke: rgba(255, 255, 255, 0.04);
  stroke-width: 1;
}

.fw-cmp__radar-axis {
  stroke: rgba(255, 255, 255, 0.06);
  stroke-width: 1;
}

.fw-cmp__radar-label {
  fill: var(--viz-text-muted);
  font-size: 9px;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
}

.fw-cmp__radar-polygon {
  fill-opacity: 0.08;
  stroke-width: 2;
  stroke-opacity: 0.7;
  transition: fill-opacity 0.4s ease, stroke-opacity 0.4s ease;
}

.fw-cmp__radar-dot {
  stroke: var(--viz-bg);
  stroke-width: 2;
  transition: r 0.3s ease;
}

/* ── Legend ── */
.fw-cmp__legend-text {
  fill: var(--viz-text-muted);
  font-size: 10px;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  transition: fill 0.3s ease;
}

/* ── Detail Panel ── */
.fw-cmp__detail {
  padding: 8px 12px;
  background: rgba(15, 19, 37, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  animation: fwDetailIn 0.3s ease;
}

@keyframes fwDetailIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

.fw-cmp__detail-inner {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.fw-cmp__detail-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.fw-cmp__detail-name {
  font-size: 12px;
  font-weight: 600;
  color: #ffffff;
  font-family: 'Syne', sans-serif;
}

.fw-cmp__detail-desc {
  margin: 0;
  font-size: 11px;
  color: var(--viz-text-muted);
  line-height: 1.5;
}

/* ── Context ── */
.fw-cmp__context {
  padding: 0 4px;
  min-height: 20px;
}

.fw-cmp__context-text {
  font-size: 11px;
  color: var(--viz-text-muted);
  font-style: italic;
  opacity: 0.7;
  animation: fwContextIn 0.5s ease;
}

@keyframes fwContextIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 0.7; transform: translateY(0); }
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .fw-cmp__svg--horizontal { display: none; }
  .fw-cmp__svg--vertical { display: block; max-height: 70vh; }
  .fw-cmp__title { font-size: 14px; }
}
</style>
