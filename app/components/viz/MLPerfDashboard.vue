<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useMouseTracker } from '~/composables/useMouseTracker'

/* ── Props & Emits ── */
const props = defineProps<{
  activeSection: number
}>()

const emit = defineEmits<{
  exerciseComplete: []
}>()

/* ── Types ── */
interface Hardware {
  id: string
  name: string
  shortName: string
  color: string
  metrics: {
    trainingThroughput: number  // samples/sec (normalized 0-100)
    inferenceLatency: number    // lower is better (normalized 0-100, inverted for display)
    powerEfficiency: number     // perf/watt (normalized 0-100)
    cost: number                // perf/dollar (normalized 0-100)
  }
  specs: {
    memory: string
    tdp: string
    price: string
    process: string
  }
  description: string
}

interface TooltipState {
  visible: boolean
  x: number
  y: number
  hardware: Hardware | null
}

/* ── Constants ── */
const SVG_W = 800
const SVG_H = 460
const CHART_X = 120
const CHART_Y = 50
const CHART_W = 640
const CHART_H = 340

const metricKeys = ['trainingThroughput', 'inferenceLatency', 'powerEfficiency', 'cost'] as const
type MetricKey = typeof metricKeys[number]

const metricLabels: Record<MetricKey, string> = {
  trainingThroughput: 'Training Throughput',
  inferenceLatency: 'Inference Speed',
  powerEfficiency: 'Power Efficiency',
  cost: 'Cost Efficiency',
}

const metricUnits: Record<MetricKey, string> = {
  trainingThroughput: 'samples/sec',
  inferenceLatency: 'queries/sec',
  powerEfficiency: 'perf/watt',
  cost: 'perf/$',
}

/* ── Hardware data ── */
const hardwareList: Hardware[] = [
  {
    id: 'a100',
    name: 'NVIDIA A100 80GB',
    shortName: 'A100',
    color: '#22c55e',
    metrics: { trainingThroughput: 72, inferenceLatency: 68, powerEfficiency: 55, cost: 45 },
    specs: { memory: '80GB HBM2e', tdp: '300W', price: '$10,000', process: '7nm' },
    description: 'Previous generation datacenter GPU. Strong all-around performance with Tensor Cores and MIG support.',
  },
  {
    id: 'h100',
    name: 'NVIDIA H100 SXM',
    shortName: 'H100',
    color: '#14b8a6',
    metrics: { trainingThroughput: 95, inferenceLatency: 92, powerEfficiency: 68, cost: 38 },
    specs: { memory: '80GB HBM3', tdp: '700W', price: '$25,000', process: '4nm' },
    description: 'Flagship datacenter GPU with Transformer Engine. 3x training speedup over A100 for LLMs.',
  },
  {
    id: 'tpu-v4',
    name: 'Google TPU v4',
    shortName: 'TPU v4',
    color: '#f0a500',
    metrics: { trainingThroughput: 88, inferenceLatency: 75, powerEfficiency: 82, cost: 62 },
    specs: { memory: '32GB HBM2e', tdp: '170W', price: 'Cloud only', process: '7nm' },
    description: 'Custom ASIC optimized for ML workloads. Excels at large-batch training with pod-level scaling.',
  },
  {
    id: 'm2-ultra',
    name: 'Apple M2 Ultra',
    shortName: 'M2 Ultra',
    color: '#ec4899',
    metrics: { trainingThroughput: 35, inferenceLatency: 52, powerEfficiency: 90, cost: 55 },
    specs: { memory: '192GB Unified', tdp: '60W', price: '$5,000', process: '5nm' },
    description: 'Unified memory architecture eliminates PCIe bottleneck. Best power efficiency for on-device inference.',
  },
  {
    id: 'gaudi2',
    name: 'Intel Gaudi2',
    shortName: 'Gaudi2',
    color: '#a855f7',
    metrics: { trainingThroughput: 65, inferenceLatency: 60, powerEfficiency: 58, cost: 72 },
    specs: { memory: '96GB HBM2e', tdp: '600W', price: '$8,000', process: '7nm' },
    description: 'Cost-effective alternative to NVIDIA GPUs. Strong price-performance ratio for training workloads.',
  },
]

/* ── Section to active metric ── */
const activeMetric = computed<MetricKey>(() => {
  switch (props.activeSection) {
    case 0: return 'trainingThroughput'
    case 1: return 'inferenceLatency'
    case 2: return 'powerEfficiency'
    case 3: return 'cost'
    default: return 'trainingThroughput'
  }
})

/* ── Interaction state ── */
const clickedHardware = ref<Set<string>>(new Set())
const selectedHardware = ref<string | null>(null)
const exerciseEmitted = ref(false)
const tooltip = ref<TooltipState>({ visible: false, x: 0, y: 0, hardware: null })
const canvasRef = ref<HTMLElement | null>(null)
const { mouseX, mouseY, isInside } = useMouseTracker(canvasRef)
const hoveredHardware = ref<Hardware | null>(null)

function handleHardwareClick(hw: Hardware, event: MouseEvent) {
  selectedHardware.value = hw.id
  clickedHardware.value = new Set([...clickedHardware.value, hw.id])

  const svg = (event.currentTarget as SVGElement).closest('svg')
  if (svg) {
    const rect = svg.getBoundingClientRect()
    tooltip.value = {
      visible: true,
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      hardware: hw,
    }
  }

  if (clickedHardware.value.size >= 3 && !exerciseEmitted.value) {
    exerciseEmitted.value = true
    emit('exerciseComplete')
  }
}

function handleHardwareKeyboard(hw: Hardware, event: KeyboardEvent) {
  selectedHardware.value = hw.id
  clickedHardware.value = new Set([...clickedHardware.value, hw.id])

  const el = event.currentTarget as SVGElement
  const svg = el.closest('svg')
  if (svg) {
    const elRect = el.getBoundingClientRect()
    const svgRect = svg.getBoundingClientRect()
    const scaleX = SVG_W / svgRect.width
    const scaleY = SVG_H / svgRect.height
    tooltip.value = {
      visible: true,
      x: (elRect.left + elRect.width / 2 - svgRect.left) * scaleX,
      y: (elRect.top - svgRect.top) * scaleY,
      hardware: hw,
    }
  }

  if (clickedHardware.value.size >= 3 && !exerciseEmitted.value) {
    exerciseEmitted.value = true
    emit('exerciseComplete')
  }
}

function closeTooltip() {
  tooltip.value.visible = false
  selectedHardware.value = null
}

/* ── Bar chart layout ── */
const barGroupWidth = computed(() => CHART_W / hardwareList.length)
const barWidth = computed(() => Math.min(barGroupWidth.value * 0.6, 80))

function barHeight(hw: Hardware): number {
  const val = hw.metrics[activeMetric.value]
  return (val / 100) * CHART_H
}

function barX(index: number): number {
  return CHART_X + index * barGroupWidth.value + (barGroupWidth.value - barWidth.value) / 2
}

function barY(hw: Hardware): number {
  return CHART_Y + CHART_H - barHeight(hw)
}

/* ── All metrics mini bars ── */
function miniBarHeight(hw: Hardware, key: MetricKey): number {
  return (hw.metrics[key] / 100) * 30
}

/* ── Progress ── */
const explorationProgress = computed(() => Math.min(clickedHardware.value.size, 3))

const sectionInfo = computed(() => {
  const label = metricLabels[activeMetric.value]
  return `Comparing ${label} across hardware platforms`
})

/* ── Hover handlers for SmartTooltip ── */
function handleHardwareHover(hw: Hardware) {
  hoveredHardware.value = hw
}
function handleHardwareLeave() {
  hoveredHardware.value = null
}
const smartTooltipContent = computed(() => {
  const hw = hoveredHardware.value
  if (!hw) return ''
  return `**${hw.specs.memory}** | ${hw.specs.tdp} | ${hw.specs.price}\n${hw.description}`
})

watch(() => props.activeSection, () => {
  tooltip.value.visible = false
  selectedHardware.value = null
  hoveredHardware.value = null
})
</script>

<template>
  <div class="mlperf" @click.self="closeTooltip">
    <!-- Header -->
    <div class="mlperf__header">
      <span class="mlperf__badge">Interactive</span>
      <h3 class="mlperf__title">Benchmarking Dashboard</h3>
      <p class="mlperf__subtitle">
        Click hardware to compare
        <span
          class="mlperf__progress"
          :class="{ 'mlperf__progress--complete': explorationProgress >= 3 }"
        >
          {{ explorationProgress }}/3
        </span>
      </p>
    </div>

    <!-- Metric selector tabs -->
    <div class="mlperf__tabs" aria-label="Current benchmark metric">
      <span
        v-for="(label, key) in metricLabels"
        :key="key"
        class="mlperf__tab"
        :class="{ 'mlperf__tab--active': activeMetric === key }"
        :aria-current="activeMetric === key ? 'true' : undefined"
      >
        {{ label }}
      </span>
    </div>

    <!-- SVG Chart -->
    <div ref="canvasRef" class="mlperf__canvas" style="position: relative;">
      <VizSmartTooltip
        :visible="hoveredHardware !== null && isInside"
        :x="mouseX"
        :y="mouseY"
        :title="hoveredHardware?.name"
        :content="smartTooltipContent"
        :color="hoveredHardware?.color"
        :container-width="canvasRef?.clientWidth || 800"
        :container-height="canvasRef?.clientHeight || 460"
      />
      <svg
        :viewBox="`0 0 ${SVG_W} ${SVG_H}`"
        class="mlperf__svg"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        :aria-label="`Bar chart comparing ${metricLabels[activeMetric]} across 5 hardware platforms`"
        @click.self="closeTooltip"
      >
        <defs>
          <filter id="mp-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient
            v-for="hw in hardwareList"
            :id="`mp-bar-${hw.id}`"
            :key="`grad-${hw.id}`"
            x1="0%" y1="0%" x2="0%" y2="100%"
          >
            <stop offset="0%" :stop-color="hw.color" stop-opacity="0.9" />
            <stop offset="100%" :stop-color="hw.color" stop-opacity="0.4" />
          </linearGradient>
        </defs>

        <!-- Background -->
        <rect :x="CHART_X" :y="CHART_Y" :width="CHART_W" :height="CHART_H" fill="#080c18" rx="8" />

        <!-- Horizontal grid lines -->
        <g opacity="0.06">
          <line
            v-for="i in 4"
            :key="`gy-${i}`"
            :x1="CHART_X"
            :y1="CHART_Y + (CHART_H / 5) * i"
            :x2="CHART_X + CHART_W"
            :y2="CHART_Y + (CHART_H / 5) * i"
            stroke="#14b8a6"
            stroke-width="0.5"
          />
        </g>

        <!-- Y-axis labels -->
        <g>
          <text
            v-for="i in 5"
            :key="`ytick-${i}`"
            :x="CHART_X - 10"
            :y="CHART_Y + CHART_H - (CHART_H / 4) * (i - 1) + 4"
            text-anchor="end"
            class="mlperf__tick"
          >
            {{ (i - 1) * 25 }}
          </text>
        </g>

        <!-- Metric label -->
        <text :x="CHART_X + CHART_W / 2" :y="CHART_Y - 12" text-anchor="middle" class="mlperf__metric-title">
          {{ metricLabels[activeMetric] }} ({{ metricUnits[activeMetric] }})
        </text>

        <!-- Bars -->
        <g
          v-for="(hw, i) in hardwareList"
          :key="hw.id"
          class="mlperf__bar-group"
          :class="{ 'mlperf__bar-group--selected': selectedHardware === hw.id }"
          role="button"
          :tabindex="0"
          :aria-label="`${hw.name}: ${hw.metrics[activeMetric]} ${metricUnits[activeMetric]}`"
          @click.stop="handleHardwareClick(hw, $event)"
          @keydown.enter.stop="handleHardwareKeyboard(hw, $event)"
          @keydown.space.prevent.stop="handleHardwareKeyboard(hw, $event)"
          @mouseenter="handleHardwareHover(hw)"
          @mouseleave="handleHardwareLeave"
        >
          <!-- Bar glow -->
          <rect
            :x="barX(i) - 4"
            :y="barY(hw) - 4"
            :width="barWidth + 8"
            :height="barHeight(hw) + 8"
            :rx="8"
            :fill="hw.color"
            :opacity="selectedHardware === hw.id ? 0.1 : 0.03"
            filter="url(#mp-glow)"
          />
          <!-- Main bar -->
          <rect
            :x="barX(i)"
            :y="barY(hw)"
            :width="barWidth"
            :height="barHeight(hw)"
            :rx="6"
            :fill="`url(#mp-bar-${hw.id})`"
            class="mlperf__bar"
          />
          <!-- Value label on bar -->
          <text
            :x="barX(i) + barWidth / 2"
            :y="barY(hw) - 6"
            text-anchor="middle"
            class="mlperf__bar-value"
            :fill="hw.color"
          >
            {{ hw.metrics[activeMetric] }}
          </text>
          <!-- Hardware name below -->
          <text
            :x="barX(i) + barWidth / 2"
            :y="CHART_Y + CHART_H + 18"
            text-anchor="middle"
            class="mlperf__bar-label"
          >
            {{ hw.shortName }}
          </text>
          <!-- Mini spark bars (all metrics) -->
          <g :transform="`translate(${barX(i) + 2}, ${CHART_Y + CHART_H + 26})`">
            <rect
              v-for="(mk, mi) in metricKeys"
              :key="mk"
              :x="mi * (barWidth / 4 - 1)"
              :y="30 - miniBarHeight(hw, mk)"
              :width="barWidth / 4 - 3"
              :height="miniBarHeight(hw, mk)"
              :rx="1"
              :fill="mk === activeMetric ? hw.color : 'rgba(255,255,255,0.1)'"
              :opacity="mk === activeMetric ? 0.8 : 0.4"
            />
          </g>
          <!-- Clicked indicator -->
          <circle
            v-if="clickedHardware.has(hw.id)"
            :cx="barX(i) + barWidth / 2"
            :cy="CHART_Y + CHART_H + 68"
            r="3"
            :fill="hw.color"
            opacity="0.6"
          />
        </g>

        <!-- Tooltip -->
        <foreignObject
          v-if="tooltip.visible && tooltip.hardware"
          :x="Math.min(Math.max(tooltip.x - 150, 10), SVG_W - 320)"
          :y="tooltip.y < 250 ? tooltip.y + 15 : tooltip.y - 195"
          width="300"
          height="190"
          class="mlperf__tooltip-foreign"
        >
          <div class="mlperf__tooltip" @click.stop>
            <div class="mlperf__tooltip-header">
              <span class="mlperf__tooltip-dot" :style="{ background: tooltip.hardware.color }" />
              <span class="mlperf__tooltip-title">{{ tooltip.hardware.name }}</span>
              <button class="mlperf__tooltip-close" aria-label="Close tooltip" @click.stop="closeTooltip">&times;</button>
            </div>
            <div class="mlperf__tooltip-specs">
              <span>{{ tooltip.hardware.specs.memory }}</span>
              <span>{{ tooltip.hardware.specs.tdp }}</span>
              <span>{{ tooltip.hardware.specs.price }}</span>
              <span>{{ tooltip.hardware.specs.process }}</span>
            </div>
            <div class="mlperf__tooltip-metrics">
              <div
                v-for="(label, key) in metricLabels"
                :key="key"
                class="mlperf__tooltip-metric"
              >
                <span class="mlperf__tooltip-metric-label">{{ label }}</span>
                <div class="mlperf__tooltip-metric-bar">
                  <div
                    class="mlperf__tooltip-metric-fill"
                    :style="{
                      width: `${tooltip.hardware!.metrics[key as MetricKey]}%`,
                      background: tooltip.hardware!.color,
                    }"
                  />
                </div>
                <span class="mlperf__tooltip-metric-val">{{ tooltip.hardware!.metrics[key as MetricKey] }}</span>
              </div>
            </div>
            <p class="mlperf__tooltip-desc">{{ tooltip.hardware.description }}</p>
          </div>
        </foreignObject>
      </svg>
    </div>

    <!-- Context -->
    <div class="mlperf__context">
      <span class="mlperf__context-text">{{ sectionInfo }}</span>
    </div>
  </div>
</template>

<style scoped>
.mlperf {
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

.mlperf__header {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 4px;
}

.mlperf__badge {
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

.mlperf__title {
  margin: 0;
  font-family: 'Syne', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: var(--viz-text);
}

.mlperf__subtitle {
  margin: 0;
  font-size: 12px;
  color: var(--viz-text-muted);
  display: flex;
  align-items: center;
  gap: 8px;
}

.mlperf__progress {
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

.mlperf__progress--complete {
  color: var(--viz-accent-green);
  background: rgba(34, 197, 94, 0.1);
  border-color: rgba(34, 197, 94, 0.3);
}

/* ── Tabs ── */
.mlperf__tabs {
  display: flex;
  gap: 4px;
  padding: 0 4px;
  flex-wrap: wrap;
}

.mlperf__tab {
  appearance: none;
  border: 1px solid var(--viz-border);
  background: rgba(255, 255, 255, 0.02);
  color: var(--viz-text-muted);
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 500;
  cursor: default;
  transition: all 0.3s ease;
  font-family: 'Inter', sans-serif;
}

.mlperf__tab--active {
  background: rgba(20, 184, 166, 0.1);
  border-color: rgba(20, 184, 166, 0.3);
  color: var(--viz-primary);
  font-weight: 600;
}

/* ── Canvas ── */
.mlperf__canvas {
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mlperf__svg {
  width: 100%;
  height: auto;
  overflow: visible;
}

.mlperf__tick {
  fill: var(--viz-text-muted);
  font-size: 9px;
  font-family: 'Inter', sans-serif;
}

.mlperf__metric-title {
  fill: var(--viz-text);
  font-size: 12px;
  font-family: 'Syne', sans-serif;
  font-weight: 600;
}

.mlperf__bar-group {
  cursor: pointer;
  outline: none;
}

.mlperf__bar-group:focus-visible .mlperf__bar {
  stroke: #ffffff;
  stroke-width: 2;
}

.mlperf__bar {
  transition: height 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), y 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.mlperf__bar-group:hover .mlperf__bar {
  filter: brightness(1.2);
}

.mlperf__bar-value {
  font-size: 11px;
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  transition: all 0.4s ease;
}

.mlperf__bar-label {
  fill: var(--viz-text-muted);
  font-size: 10px;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
}

.mlperf__bar-group--selected .mlperf__bar-label {
  fill: var(--viz-text);
  font-weight: 600;
}

/* ── Tooltip ── */
.mlperf__tooltip-foreign {
  pointer-events: none;
  overflow: visible;
}

.mlperf__tooltip {
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

.mlperf__tooltip-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
}

.mlperf__tooltip-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.mlperf__tooltip-title {
  font-size: 12px;
  font-weight: 600;
  color: #ffffff;
  flex: 1;
  font-family: 'Syne', sans-serif;
}

.mlperf__tooltip-close {
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

.mlperf__tooltip-close:hover {
  background: rgba(255, 255, 255, 0.12);
}

.mlperf__tooltip-specs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 8px;
  font-size: 9px;
  color: var(--viz-text-muted);
}

.mlperf__tooltip-specs span {
  padding: 1px 6px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.mlperf__tooltip-metrics {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 8px;
}

.mlperf__tooltip-metric {
  display: flex;
  align-items: center;
  gap: 6px;
}

.mlperf__tooltip-metric-label {
  font-size: 9px;
  color: var(--viz-text-muted);
  width: 100px;
  flex-shrink: 0;
}

.mlperf__tooltip-metric-bar {
  flex: 1;
  height: 3px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 2px;
  overflow: hidden;
}

.mlperf__tooltip-metric-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.4s ease;
}

.mlperf__tooltip-metric-val {
  font-size: 10px;
  font-weight: 600;
  color: var(--viz-text);
  width: 24px;
  text-align: right;
}

.mlperf__tooltip-desc {
  margin: 0;
  font-size: 11px;
  line-height: 1.5;
  color: var(--viz-text-muted);
}

/* ── Context ── */
.mlperf__context {
  padding: 0 4px;
  min-height: 20px;
}

.mlperf__context-text {
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
  .mlperf__title { font-size: 14px; }
  .mlperf__tabs { gap: 2px; }
  .mlperf__tab { font-size: 9px; padding: 3px 8px; }
}
</style>
