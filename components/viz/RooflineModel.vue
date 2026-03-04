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
interface Operation {
  id: string
  name: string
  flops: number            // GFLOPS
  arithmeticIntensity: number  // FLOP/Byte
  description: string
  category: 'compute' | 'memory' | 'balanced'
  color: string
}

interface TooltipState {
  visible: boolean
  x: number
  y: number
  operation: Operation | null
}

/* ── Constants ── */
const SVG_W = 800
const SVG_H = 500
const PLOT_X = 90
const PLOT_Y = 30
const PLOT_W = 670
const PLOT_H = 400

// Hardware specs (log scale)
const PEAK_COMPUTE = 312     // TFLOPS (A100)
const PEAK_BANDWIDTH = 2039  // GB/s (A100 HBM2e)
const RIDGE_POINT = PEAK_COMPUTE * 1000 / PEAK_BANDWIDTH // ~153 FLOP/Byte

// Log scale bounds
const MIN_AI = 0.5   // min arithmetic intensity
const MAX_AI = 512    // max arithmetic intensity
const MIN_PERF = 0.1  // TFLOPS
const MAX_PERF = 500   // TFLOPS

function logScale(value: number, min: number, max: number): number {
  return (Math.log10(value) - Math.log10(min)) / (Math.log10(max) - Math.log10(min))
}

function toSvgX(ai: number): number {
  return PLOT_X + logScale(ai, MIN_AI, MAX_AI) * PLOT_W
}

function toSvgY(perf: number): number {
  return PLOT_Y + PLOT_H - logScale(perf, MIN_PERF, MAX_PERF) * PLOT_H
}

/* ── Operations ── */
const operations: Operation[] = [
  {
    id: 'embedding',
    name: 'Embedding Lookup',
    flops: 0.5,
    arithmeticIntensity: 0.8,
    description: 'Pure memory access with minimal computation. Bottlenecked by memory bandwidth, not compute.',
    category: 'memory',
    color: '#f0a500',
  },
  {
    id: 'attention',
    name: 'Self-Attention',
    flops: 8,
    arithmeticIntensity: 4,
    description: 'O(n^2) attention scores. Memory-bound for long sequences; FlashAttention helps by tiling.',
    category: 'memory',
    color: '#ec4899',
  },
  {
    id: 'layernorm',
    name: 'LayerNorm',
    flops: 1.2,
    arithmeticIntensity: 2,
    description: 'Element-wise normalization. Low arithmetic intensity makes it memory-bandwidth bound.',
    category: 'memory',
    color: '#f0a500',
  },
  {
    id: 'depthwise-conv',
    name: 'Depthwise Conv',
    flops: 15,
    arithmeticIntensity: 12,
    description: 'Separable convolution with low intensity. Efficient on mobile but underutilizes GPU compute.',
    category: 'balanced',
    color: '#a855f7',
  },
  {
    id: 'matmul-small',
    name: 'MatMul (small)',
    flops: 40,
    arithmeticIntensity: 25,
    description: 'Small matrix multiply near the roofline ridge. Transitioning from memory to compute bound.',
    category: 'balanced',
    color: '#4a6aff',
  },
  {
    id: 'conv2d',
    name: 'Conv2D (3x3)',
    flops: 120,
    arithmeticIntensity: 80,
    description: 'Standard convolution with high reuse. Compute-bound and well-suited for GPU acceleration.',
    category: 'compute',
    color: '#00c896',
  },
  {
    id: 'matmul-large',
    name: 'MatMul (large)',
    flops: 250,
    arithmeticIntensity: 200,
    description: 'Large GEMM operation — the bread and butter of GPU computing. Deep in the compute-bound regime.',
    category: 'compute',
    color: '#00c896',
  },
  {
    id: 'winograd-conv',
    name: 'Winograd Conv',
    flops: 180,
    arithmeticIntensity: 350,
    description: 'Transform-based convolution trading more FLOP/Byte for fewer total FLOPs. Highly compute-bound.',
    category: 'compute',
    color: '#00c896',
  },
]

/* ── Roofline path ── */
const rooflinePath = computed(() => {
  const points: string[] = []
  for (let ai = MIN_AI; ai <= MAX_AI; ai *= 1.2) {
    const perf = Math.min(PEAK_COMPUTE, ai * PEAK_BANDWIDTH / 1000)
    points.push(`${points.length === 0 ? 'M' : 'L'} ${toSvgX(ai)} ${toSvgY(perf)}`)
  }
  return points.join(' ')
})

/* ── Bandwidth ceiling line ── */
const bandwidthPath = computed(() => {
  const p1 = { ai: MIN_AI, perf: MIN_AI * PEAK_BANDWIDTH / 1000 }
  const p2 = { ai: RIDGE_POINT, perf: PEAK_COMPUTE }
  return `M ${toSvgX(p1.ai)} ${toSvgY(p1.perf)} L ${toSvgX(p2.ai)} ${toSvgY(p2.perf)}`
})

/* ── Compute ceiling line ── */
const computePath = computed(() => {
  return `M ${toSvgX(RIDGE_POINT)} ${toSvgY(PEAK_COMPUTE)} L ${toSvgX(MAX_AI)} ${toSvgY(PEAK_COMPUTE)}`
})

/* ── Interaction state ── */
const clickedOps = ref<Set<string>>(new Set())
const selectedOp = ref<string | null>(null)
const exerciseEmitted = ref(false)
const tooltip = ref<TooltipState>({ visible: false, x: 0, y: 0, operation: null })

function handleOpClick(op: Operation, event: MouseEvent) {
  selectedOp.value = op.id
  clickedOps.value = new Set([...clickedOps.value, op.id])

  const svg = (event.currentTarget as SVGElement).closest('svg')
  if (svg) {
    const rect = svg.getBoundingClientRect()
    tooltip.value = {
      visible: true,
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      operation: op,
    }
  }

  if (clickedOps.value.size >= 3 && !exerciseEmitted.value) {
    exerciseEmitted.value = true
    emit('exerciseComplete')
  }
}

function closeTooltip() {
  tooltip.value.visible = false
  selectedOp.value = null
}

/* ── Section highlight ── */
const highlightCategory = computed<string | null>(() => {
  switch (props.activeSection) {
    case 0: return null
    case 1: return 'memory'
    case 2: return 'compute'
    case 3: return null // ridge focus
    default: return null
  }
})

function opOpacity(op: Operation): number {
  if (selectedOp.value === op.id) return 1
  if (highlightCategory.value === null) return 0.85
  return op.category === highlightCategory.value ? 1 : 0.2
}

const sectionInfo = computed(() => {
  switch (props.activeSection) {
    case 0: return 'The roofline model shows hardware performance bounds'
    case 1: return 'Memory-bound ops: limited by data transfer rate'
    case 2: return 'Compute-bound ops: utilizing peak hardware FLOPS'
    case 3: return 'The ridge point: where memory and compute ceilings meet'
    default: return 'Click operations to explore their performance characteristics'
  }
})

const explorationProgress = computed(() => Math.min(clickedOps.value.size, 3))

watch(() => props.activeSection, () => {
  tooltip.value.visible = false
  selectedOp.value = null
})
</script>

<template>
  <div class="roofline" @click.self="closeTooltip">
    <!-- Header -->
    <div class="roofline__header">
      <span class="roofline__badge">Interactive</span>
      <h3 class="roofline__title">Roofline Model</h3>
      <p class="roofline__subtitle">
        Click operations to explore
        <span
          class="roofline__progress"
          :class="{ 'roofline__progress--complete': explorationProgress >= 3 }"
        >
          {{ explorationProgress }}/3
        </span>
      </p>
    </div>

    <!-- SVG -->
    <div class="roofline__canvas">
      <svg
        :viewBox="`0 0 ${SVG_W} ${SVG_H}`"
        class="roofline__svg"
        preserveAspectRatio="xMidYMid meet"
        @click.self="closeTooltip"
      >
        <defs>
          <filter id="rf-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="rf-glow-strong" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id="rf-bw-grad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#f0a500" />
            <stop offset="100%" stop-color="#4a6aff" />
          </linearGradient>
          <linearGradient id="rf-fill-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#4a6aff" stop-opacity="0.08" />
            <stop offset="100%" stop-color="#4a6aff" stop-opacity="0" />
          </linearGradient>
        </defs>

        <!-- Background -->
        <rect :x="PLOT_X" :y="PLOT_Y" :width="PLOT_W" :height="PLOT_H" fill="#080c18" rx="8" />

        <!-- Grid -->
        <g opacity="0.05">
          <line
            v-for="i in 9"
            :key="`gx-${i}`"
            :x1="PLOT_X + (PLOT_W / 10) * i"
            :y1="PLOT_Y"
            :x2="PLOT_X + (PLOT_W / 10) * i"
            :y2="PLOT_Y + PLOT_H"
            stroke="#4a6aff"
            stroke-width="0.5"
          />
          <line
            v-for="i in 9"
            :key="`gy-${i}`"
            :x1="PLOT_X"
            :y1="PLOT_Y + (PLOT_H / 10) * i"
            :x2="PLOT_X + PLOT_W"
            :y2="PLOT_Y + (PLOT_H / 10) * i"
            stroke="#4a6aff"
            stroke-width="0.5"
          />
        </g>

        <!-- Log-scale tick labels -->
        <g>
          <text
            v-for="val in [1, 10, 100]"
            :key="`xtick-${val}`"
            :x="toSvgX(val)"
            :y="PLOT_Y + PLOT_H + 20"
            text-anchor="middle"
            class="roofline__tick"
          >
            {{ val }}
          </text>
          <text
            v-for="val in [0.1, 1, 10, 100]"
            :key="`ytick-${val}`"
            :x="PLOT_X - 10"
            :y="toSvgY(val) + 4"
            text-anchor="end"
            class="roofline__tick"
          >
            {{ val }}
          </text>
        </g>

        <!-- Fill area under roofline -->
        <path
          :d="`${rooflinePath} L ${toSvgX(MAX_AI)} ${PLOT_Y + PLOT_H} L ${toSvgX(MIN_AI)} ${PLOT_Y + PLOT_H} Z`"
          fill="url(#rf-fill-grad)"
        />

        <!-- Bandwidth ceiling (diagonal) -->
        <path
          :d="bandwidthPath"
          fill="none"
          stroke="url(#rf-bw-grad)"
          stroke-width="2.5"
          stroke-linecap="round"
          class="roofline__ceiling"
        />

        <!-- Compute ceiling (horizontal) -->
        <path
          :d="computePath"
          fill="none"
          stroke="#00c896"
          stroke-width="2.5"
          stroke-linecap="round"
          class="roofline__ceiling"
        />

        <!-- Ridge point indicator -->
        <g :class="{ 'roofline__ridge--highlight': props.activeSection === 3 }">
          <line
            :x1="toSvgX(RIDGE_POINT)"
            :y1="toSvgY(PEAK_COMPUTE)"
            :x2="toSvgX(RIDGE_POINT)"
            :y2="PLOT_Y + PLOT_H"
            stroke="#4a6aff"
            stroke-width="1"
            stroke-dasharray="4 4"
            opacity="0.3"
          />
          <circle
            :cx="toSvgX(RIDGE_POINT)"
            :cy="toSvgY(PEAK_COMPUTE)"
            r="5"
            fill="#4a6aff"
            opacity="0.8"
            filter="url(#rf-glow)"
          />
          <text
            :x="toSvgX(RIDGE_POINT)"
            :y="toSvgY(PEAK_COMPUTE) - 12"
            text-anchor="middle"
            class="roofline__ridge-label"
          >
            Ridge Point
          </text>
        </g>

        <!-- Ceiling labels -->
        <text
          :x="toSvgX(3)"
          :y="toSvgY(3 * PEAK_BANDWIDTH / 1000) - 10"
          class="roofline__ceiling-label"
          fill="#f0a500"
        >
          Memory BW: {{ PEAK_BANDWIDTH }} GB/s
        </text>
        <text
          :x="toSvgX(MAX_AI) - 10"
          :y="toSvgY(PEAK_COMPUTE) - 10"
          text-anchor="end"
          class="roofline__ceiling-label"
          fill="#00c896"
        >
          Peak Compute: {{ PEAK_COMPUTE }} TFLOPS
        </text>

        <!-- Region labels -->
        <text
          :x="toSvgX(2)"
          :y="PLOT_Y + PLOT_H - 20"
          class="roofline__region-label"
          fill="#f0a500"
        >
          Memory Bound
        </text>
        <text
          :x="toSvgX(300)"
          :y="PLOT_Y + PLOT_H - 20"
          text-anchor="end"
          class="roofline__region-label"
          fill="#00c896"
        >
          Compute Bound
        </text>

        <!-- Operation dots -->
        <g
          v-for="op in operations"
          :key="op.id"
          class="roofline__op"
          :style="{ opacity: opOpacity(op) }"
          role="button"
          :tabindex="0"
          :aria-label="`${op.name}: ${op.flops} TFLOPS at ${op.arithmeticIntensity} FLOP/Byte. ${op.category}-bound.`"
          @click.stop="handleOpClick(op, $event)"
          @keydown.enter.stop="handleOpClick(op, $event as unknown as MouseEvent)"
          @keydown.space.prevent.stop="handleOpClick(op, $event as unknown as MouseEvent)"
        >
          <!-- Performance target line (dashed to ceiling) -->
          <line
            :x1="toSvgX(op.arithmeticIntensity)"
            :y1="toSvgY(op.flops)"
            :x2="toSvgX(op.arithmeticIntensity)"
            :y2="toSvgY(Math.min(PEAK_COMPUTE, op.arithmeticIntensity * PEAK_BANDWIDTH / 1000))"
            :stroke="op.color"
            stroke-width="0.8"
            stroke-dasharray="3 3"
            :opacity="selectedOp === op.id ? 0.5 : 0.15"
            class="roofline__op-target"
          />
          <!-- Glow -->
          <circle
            :cx="toSvgX(op.arithmeticIntensity)"
            :cy="toSvgY(op.flops)"
            :r="selectedOp === op.id ? 18 : 12"
            :fill="op.color"
            :opacity="selectedOp === op.id ? 0.15 : 0.06"
            :filter="selectedOp === op.id ? 'url(#rf-glow-strong)' : 'url(#rf-glow)'"
          />
          <!-- Dot -->
          <circle
            :cx="toSvgX(op.arithmeticIntensity)"
            :cy="toSvgY(op.flops)"
            :r="selectedOp === op.id ? 7 : 5"
            :fill="op.color"
            :stroke="clickedOps.has(op.id) ? '#ffffff' : 'none'"
            stroke-width="1"
            class="roofline__op-dot"
          />
          <!-- Label -->
          <text
            :x="toSvgX(op.arithmeticIntensity)"
            :y="toSvgY(op.flops) - 12"
            text-anchor="middle"
            class="roofline__op-label"
            :fill="op.color"
          >
            {{ op.name }}
          </text>
        </g>

        <!-- Axis labels -->
        <text :x="PLOT_X + PLOT_W / 2" :y="SVG_H - 2" text-anchor="middle" class="roofline__axis-label">
          Arithmetic Intensity (FLOP/Byte) &rarr;
        </text>
        <text :x="16" :y="PLOT_Y + PLOT_H / 2" text-anchor="middle" class="roofline__axis-label" transform="rotate(-90, 16, 230)">
          Performance (TFLOPS) &rarr;
        </text>

        <!-- Hardware label -->
        <g :transform="`translate(${PLOT_X + 10}, ${PLOT_Y + 10})`">
          <rect x="0" y="0" width="120" height="24" rx="6" fill="#0a0e1a" opacity="0.9" stroke="rgba(255,255,255,0.06)" stroke-width="1" />
          <text x="12" y="16" class="roofline__hw-label">NVIDIA A100 80GB</text>
        </g>

        <!-- Tooltip -->
        <foreignObject
          v-if="tooltip.visible && tooltip.operation"
          :x="Math.min(Math.max(tooltip.x - 140, 10), SVG_W - 300)"
          :y="tooltip.y < 250 ? tooltip.y + 15 : tooltip.y - 140"
          width="280"
          height="130"
          class="roofline__tooltip-foreign"
        >
          <div class="roofline__tooltip" @click.stop>
            <div class="roofline__tooltip-header">
              <span class="roofline__tooltip-dot" :style="{ background: tooltip.operation.color }" />
              <span class="roofline__tooltip-title">{{ tooltip.operation.name }}</span>
              <span
                class="roofline__tooltip-cat"
                :class="`roofline__tooltip-cat--${tooltip.operation.category}`"
              >
                {{ tooltip.operation.category }}
              </span>
              <button class="roofline__tooltip-close" aria-label="Close tooltip" @click.stop="closeTooltip">&times;</button>
            </div>
            <div class="roofline__tooltip-stats">
              <span>{{ tooltip.operation.flops }} TFLOPS</span>
              <span>{{ tooltip.operation.arithmeticIntensity }} FLOP/B</span>
            </div>
            <p class="roofline__tooltip-desc">{{ tooltip.operation.description }}</p>
          </div>
        </foreignObject>
      </svg>
    </div>

    <!-- Context -->
    <div class="roofline__context">
      <span class="roofline__context-text">{{ sectionInfo }}</span>
    </div>
  </div>
</template>

<style scoped>
.roofline {
  --viz-bg: #05070f;
  --viz-surface: #0a0e1a;
  --viz-card: #0f1325;
  --viz-border: rgba(255, 255, 255, 0.06);
  --viz-primary: #4a6aff;
  --viz-text: #e2e8f0;
  --viz-text-muted: rgba(255, 255, 255, 0.45);
  --viz-accent-green: #00c896;

  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  height: 100%;
  min-height: 0;
  font-family: 'Inter', sans-serif;
  user-select: none;
}

.roofline__header {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 4px;
}

.roofline__badge {
  display: inline-flex;
  align-self: flex-start;
  padding: 3px 10px;
  border-radius: 9999px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--viz-primary);
  background: rgba(74, 106, 255, 0.1);
  border: 1px solid rgba(74, 106, 255, 0.2);
}

.roofline__title {
  margin: 0;
  font-family: 'Syne', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: var(--viz-text);
}

.roofline__subtitle {
  margin: 0;
  font-size: 12px;
  color: var(--viz-text-muted);
  display: flex;
  align-items: center;
  gap: 8px;
}

.roofline__progress {
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

.roofline__progress--complete {
  color: var(--viz-accent-green);
  background: rgba(0, 200, 150, 0.1);
  border-color: rgba(0, 200, 150, 0.3);
}

.roofline__canvas {
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.roofline__svg {
  width: 100%;
  height: auto;
  overflow: visible;
}

.roofline__tick {
  fill: var(--viz-text-muted);
  font-size: 9px;
  font-family: 'Inter', sans-serif;
}

.roofline__ceiling {
  transition: stroke-width 0.3s ease;
}

.roofline__ceiling-label {
  font-size: 9px;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
}

.roofline__region-label {
  font-size: 11px;
  font-family: 'Syne', sans-serif;
  font-weight: 600;
  opacity: 0.3;
}

.roofline__ridge-label {
  fill: var(--viz-primary);
  font-size: 10px;
  font-family: 'Syne', sans-serif;
  font-weight: 600;
  opacity: 0.7;
}

.roofline__ridge--highlight .roofline__ridge-label {
  opacity: 1;
  animation: ridgePulse 1.5s ease-in-out infinite;
}

@keyframes ridgePulse {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}

.roofline__op {
  cursor: pointer;
  transition: opacity 0.5s ease;
  outline: none;
}

.roofline__op:focus-visible .roofline__op-dot {
  stroke: #ffffff;
  stroke-width: 2;
}

.roofline__op-dot {
  transition: r 0.3s ease;
}

.roofline__op:hover .roofline__op-dot {
  r: 7;
}

.roofline__op-target {
  transition: opacity 0.3s ease;
}

.roofline__op-label {
  font-size: 9px;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  opacity: 0.7;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.roofline__op:hover .roofline__op-label {
  opacity: 1;
}

.roofline__axis-label {
  fill: var(--viz-text-muted);
  font-size: 11px;
  font-family: 'Inter', sans-serif;
}

.roofline__hw-label {
  fill: var(--viz-text);
  font-size: 10px;
  font-family: 'Syne', sans-serif;
  font-weight: 600;
}

.roofline__tooltip-foreign {
  pointer-events: none;
  overflow: visible;
}

.roofline__tooltip {
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

.roofline__tooltip-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
}

.roofline__tooltip-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.roofline__tooltip-title {
  font-size: 12px;
  font-weight: 600;
  color: #ffffff;
  flex: 1;
  font-family: 'Syne', sans-serif;
}

.roofline__tooltip-cat {
  font-size: 8px;
  font-weight: 600;
  padding: 1px 5px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.roofline__tooltip-cat--memory {
  background: rgba(240, 165, 0, 0.15);
  color: #f0a500;
}

.roofline__tooltip-cat--compute {
  background: rgba(0, 200, 150, 0.15);
  color: #00c896;
}

.roofline__tooltip-cat--balanced {
  background: rgba(74, 106, 255, 0.15);
  color: #4a6aff;
}

.roofline__tooltip-close {
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

.roofline__tooltip-close:hover {
  background: rgba(255, 255, 255, 0.12);
}

.roofline__tooltip-stats {
  display: flex;
  gap: 12px;
  margin-bottom: 6px;
  font-size: 11px;
  color: var(--viz-text);
  font-weight: 500;
}

.roofline__tooltip-desc {
  margin: 0;
  font-size: 11px;
  line-height: 1.5;
  color: var(--viz-text-muted);
}

.roofline__context {
  padding: 0 4px;
  min-height: 20px;
}

.roofline__context-text {
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
  .roofline__title { font-size: 14px; }
}
</style>
