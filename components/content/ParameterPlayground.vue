<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { SlidersHorizontal, RotateCcw } from 'lucide-vue-next'
import { computeRegistry } from '~/lib/playground-compute'
import type { LineChartData, BarChartData, GaugeData } from '~/lib/playground-compute'

const props = defineProps<{
  title: string
  description: string
  parameters: Array<{
    name: string
    label: string
    min: number
    max: number
    step: number
    default: number
    unit?: string
  }>
  computeFn: string
  chartType: 'line' | 'bar' | 'gauge'
}>()

// Check reduced motion preference
const prefersReducedMotion = ref(false)
onMounted(() => {
  if (typeof window !== 'undefined') {
    prefersReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }
})

// Reactive parameter values
const values = ref<Record<string, number>>({})

onMounted(() => {
  const initial: Record<string, number> = {}
  for (const p of props.parameters) {
    initial[p.name] = p.default
  }
  values.value = initial
})

function resetAll() {
  const defaults: Record<string, number> = {}
  for (const p of props.parameters) {
    defaults[p.name] = p.default
  }
  values.value = defaults
}

function updateParam(name: string, event: Event) {
  const val = parseFloat((event.target as HTMLInputElement).value)
  values.value = { ...values.value, [name]: val }
}

function formatValue(param: { step: number; unit?: string }, val: number): string {
  const decimals = param.step < 1 ? (String(param.step).split('.')[1]?.length ?? 1) : 0
  return val.toFixed(decimals)
}

// Compute chart data
const chartData = computed(() => {
  const fn = computeRegistry[props.computeFn]
  if (!fn) return null
  return fn(values.value)
})

// SVG chart dimensions
const svgW = 440
const svgH = 220
const pad = { top: 20, right: 20, bottom: 35, left: 50 }
const plotW = svgW - pad.left - pad.right
const plotH = svgH - pad.top - pad.bottom

// Line chart SVG path and helpers
const lineChartPath = computed(() => {
  if (props.chartType !== 'line' || !chartData.value) return ''
  const data = chartData.value as LineChartData
  if (!data.x || data.x.length === 0) return ''

  const xMin = Math.min(...data.x)
  const xMax = Math.max(...data.x)
  const yMin = Math.min(...data.y)
  const yMax = Math.max(...data.y)
  const yRange = yMax - yMin || 1
  const xRange = xMax - xMin || 1

  return data.x.map((xv, i) => {
    const px = pad.left + ((xv - xMin) / xRange) * plotW
    const py = pad.top + plotH - ((data.y[i] - yMin) / yRange) * plotH
    return `${i === 0 ? 'M' : 'L'}${px.toFixed(1)},${py.toFixed(1)}`
  }).join(' ')
})

const lineChartAreaPath = computed(() => {
  if (!lineChartPath.value) return ''
  const data = chartData.value as LineChartData
  const xMin = Math.min(...data.x)
  const xMax = Math.max(...data.x)
  const xRange = xMax - xMin || 1
  const startX = pad.left + ((data.x[0] - xMin) / xRange) * plotW
  const endX = pad.left + ((data.x[data.x.length - 1] - xMin) / xRange) * plotW
  const bottom = pad.top + plotH
  return `${lineChartPath.value} L${endX.toFixed(1)},${bottom} L${startX.toFixed(1)},${bottom} Z`
})

const lineAxisLabels = computed(() => {
  if (props.chartType !== 'line' || !chartData.value) return { xTicks: [], yTicks: [], xlabel: '', ylabel: '' }
  const data = chartData.value as LineChartData
  const xMin = Math.min(...data.x)
  const xMax = Math.max(...data.x)
  const yMin = Math.min(...data.y)
  const yMax = Math.max(...data.y)
  const yRange = yMax - yMin || 1
  const xRange = xMax - xMin || 1

  const xTicks = [0, 0.25, 0.5, 0.75, 1].map(f => ({
    px: pad.left + f * plotW,
    label: (xMin + f * xRange).toFixed(xRange > 10 ? 0 : 1),
  }))
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(f => ({
    py: pad.top + plotH - f * plotH,
    label: (yMin + f * yRange).toFixed(yRange > 10 ? 0 : 2),
  }))

  return { xTicks, yTicks, xlabel: data.xlabel, ylabel: data.ylabel }
})

// Bar chart data
const barChartBars = computed(() => {
  if (props.chartType !== 'bar' || !chartData.value) return []
  const data = chartData.value as BarChartData
  if (!data.labels || data.labels.length === 0) return []

  const maxVal = Math.max(...data.values, 1)
  const barW = Math.min(60, (plotW - 20) / data.labels.length - 10)

  return data.labels.map((label, i) => {
    const cx = pad.left + (i + 0.5) * (plotW / data.labels.length)
    const barHeight = (data.values[i] / maxVal) * plotH
    return {
      x: cx - barW / 2,
      y: pad.top + plotH - barHeight,
      width: barW,
      height: barHeight,
      label: label.replace('\n', ' '),
      value: data.values[i],
      cx,
    }
  })
})

// Gauge chart data
const gaugeData = computed(() => {
  if (props.chartType !== 'gauge' || !chartData.value) return null
  return chartData.value as GaugeData
})

const gaugeAngle = computed(() => {
  if (!gaugeData.value) return 0
  const { value, min, max } = gaugeData.value
  const ratio = Math.max(0, Math.min(1, (value - min) / (max - min || 1)))
  return -135 + ratio * 270 // -135 to +135 degrees
})

// Transition class for SVG
const transitionClass = computed(() =>
  prefersReducedMotion.value ? '' : 'playground-transition'
)
</script>

<template>
  <ClientOnly>
    <div class="my-6 rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
      <!-- Header -->
      <div class="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.04] bg-white/[0.015]">
        <div class="flex items-center gap-2">
          <SlidersHorizontal class="w-3.5 h-3.5 text-teal-400/70" />
          <span class="text-[10px] font-semibold uppercase tracking-wider text-white/40">Parameter Playground</span>
        </div>
        <button
          class="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-colors"
          aria-label="Reset all parameters to defaults"
          @click="resetAll"
        >
          <RotateCcw class="w-3 h-3" />
          Reset
        </button>
      </div>

      <!-- Title and description -->
      <div class="px-4 sm:px-6 pt-4 pb-2">
        <h4 class="text-sm font-semibold text-white/80">{{ title }}</h4>
        <p class="text-[13px] leading-relaxed text-white/40 mt-1">{{ description }}</p>
      </div>

      <!-- Sliders -->
      <div class="px-4 sm:px-6 pb-4 space-y-3">
        <div
          v-for="param in parameters"
          :key="param.name"
          class="flex items-center gap-3"
        >
          <div class="w-28 shrink-0">
            <label
              :for="`playground-${computeFn}-${param.name}`"
              class="text-[11px] font-medium text-white/50 block"
            >
              {{ param.label }}
            </label>
          </div>
          <input
            :id="`playground-${computeFn}-${param.name}`"
            type="range"
            :min="param.min"
            :max="param.max"
            :step="param.step"
            :value="values[param.name] ?? param.default"
            class="playground-slider flex-1 h-1.5 appearance-none rounded-full bg-white/[0.08] cursor-pointer"
            @input="updateParam(param.name, $event)"
          />
          <div class="w-24 shrink-0 text-right">
            <span class="text-xs font-mono font-semibold text-teal-400 tabular-nums">
              {{ formatValue(param, values[param.name] ?? param.default) }}
            </span>
            <span v-if="param.unit" class="text-[9px] text-white/30 ml-1">{{ param.unit }}</span>
          </div>
        </div>
      </div>

      <!-- Chart area -->
      <div class="px-4 sm:px-6 pb-5">
        <div class="rounded-lg border border-white/[0.04] bg-black/20 overflow-hidden">
          <!-- Line chart -->
          <svg
            v-if="chartType === 'line' && lineChartPath"
            :viewBox="`0 0 ${svgW} ${svgH}`"
            class="w-full h-auto"
            role="img"
            :aria-label="`${title} line chart`"
          >
            <!-- Grid lines -->
            <line
              v-for="tick in lineAxisLabels.yTicks"
              :key="'grid-' + tick.label"
              :x1="pad.left"
              :y1="tick.py"
              :x2="pad.left + plotW"
              :y2="tick.py"
              stroke="rgba(255,255,255,0.04)"
              stroke-width="1"
            />

            <!-- Area fill -->
            <path
              :d="lineChartAreaPath"
              fill="url(#playground-area-grad)"
              :class="transitionClass"
            />

            <!-- Line -->
            <path
              :d="lineChartPath"
              fill="none"
              stroke="#14b8a6"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              :class="transitionClass"
            />

            <!-- X axis labels -->
            <text
              v-for="tick in lineAxisLabels.xTicks"
              :key="'xl-' + tick.label"
              :x="tick.px"
              :y="svgH - 5"
              text-anchor="middle"
              class="fill-white/30 text-[9px]"
              style="font-family: ui-monospace, monospace"
            >{{ tick.label }}</text>

            <!-- Y axis labels -->
            <text
              v-for="tick in lineAxisLabels.yTicks"
              :key="'yl-' + tick.label"
              :x="pad.left - 6"
              :y="tick.py + 3"
              text-anchor="end"
              class="fill-white/30 text-[9px]"
              style="font-family: ui-monospace, monospace"
            >{{ tick.label }}</text>

            <!-- Axis labels -->
            <text
              :x="pad.left + plotW / 2"
              :y="svgH - 0"
              text-anchor="middle"
              class="fill-white/20 text-[9px]"
            >{{ lineAxisLabels.xlabel }}</text>
            <text
              :x="12"
              :y="pad.top + plotH / 2"
              text-anchor="middle"
              class="fill-white/20 text-[9px]"
              :transform="`rotate(-90, 12, ${pad.top + plotH / 2})`"
            >{{ lineAxisLabels.ylabel }}</text>

            <!-- Gradient definition -->
            <defs>
              <linearGradient id="playground-area-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#14b8a6" stop-opacity="0.15" />
                <stop offset="100%" stop-color="#14b8a6" stop-opacity="0.01" />
              </linearGradient>
            </defs>
          </svg>

          <!-- Bar chart -->
          <svg
            v-else-if="chartType === 'bar' && barChartBars.length > 0"
            :viewBox="`0 0 ${svgW} ${svgH}`"
            class="w-full h-auto"
            role="img"
            :aria-label="`${title} bar chart`"
          >
            <!-- Bars -->
            <g v-for="(bar, i) in barChartBars" :key="i">
              <rect
                :x="bar.x"
                :y="bar.y"
                :width="bar.width"
                :height="bar.height"
                rx="3"
                fill="url(#playground-bar-grad)"
                :class="transitionClass"
              />
              <!-- Value label -->
              <text
                :x="bar.cx"
                :y="bar.y - 6"
                text-anchor="middle"
                class="fill-teal-400 text-[10px] font-semibold"
                style="font-family: ui-monospace, monospace"
                :class="transitionClass"
              >{{ bar.value }}</text>
              <!-- Bar label -->
              <text
                :x="bar.cx"
                :y="pad.top + plotH + 14"
                text-anchor="middle"
                class="fill-white/35 text-[8px]"
              >{{ bar.label }}</text>
            </g>

            <!-- Gradient definition -->
            <defs>
              <linearGradient id="playground-bar-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#14b8a6" stop-opacity="0.7" />
                <stop offset="100%" stop-color="#14b8a6" stop-opacity="0.25" />
              </linearGradient>
            </defs>
          </svg>

          <!-- Gauge chart -->
          <svg
            v-else-if="chartType === 'gauge' && gaugeData"
            :viewBox="`0 0 ${svgW} ${svgH}`"
            class="w-full h-auto"
            role="img"
            :aria-label="`${title} gauge: ${gaugeData.value} ${gaugeData.unit}`"
          >
            <g :transform="`translate(${svgW / 2}, ${svgH - 30})`">
              <!-- Background arc -->
              <path
                d="M-90,-5 A90,90 0 1,1 90,-5"
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                stroke-width="10"
                stroke-linecap="round"
              />
              <!-- Value arc -->
              <circle
                cx="0"
                cy="0"
                r="90"
                fill="none"
                stroke="#14b8a6"
                stroke-width="10"
                stroke-linecap="round"
                :stroke-dasharray="`${((gaugeAngle + 135) / 270) * 283} 283`"
                :stroke-dashoffset="0"
                :transform="`rotate(-225)`"
                :class="transitionClass"
                style="opacity: 0.7"
              />
              <!-- Needle -->
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="-70"
                stroke="#14b8a6"
                stroke-width="2.5"
                stroke-linecap="round"
                :transform="`rotate(${gaugeAngle})`"
                :class="transitionClass"
              />
              <circle cx="0" cy="0" r="4" fill="#14b8a6" />
              <!-- Value text -->
              <text
                x="0"
                y="-25"
                text-anchor="middle"
                class="fill-white text-lg font-bold"
                style="font-family: ui-monospace, monospace; font-size: 22px"
              >{{ gaugeData.value.toFixed(1) }}</text>
              <text
                x="0"
                y="-8"
                text-anchor="middle"
                class="fill-white/30 text-[10px]"
              >{{ gaugeData.unit }}</text>
              <!-- Min / Max labels -->
              <text x="-95" y="12" text-anchor="middle" class="fill-white/20 text-[9px]"
                style="font-family: ui-monospace, monospace"
              >{{ gaugeData.min }}</text>
              <text x="95" y="12" text-anchor="middle" class="fill-white/20 text-[9px]"
                style="font-family: ui-monospace, monospace"
              >{{ gaugeData.max }}</text>
              <!-- Label -->
              <text x="0" y="18" text-anchor="middle" class="fill-white/25 text-[9px]">{{ gaugeData.label }}</text>
            </g>
          </svg>
        </div>
      </div>
    </div>

    <template #fallback>
      <div class="my-6 rounded-xl border border-white/[0.04] bg-white/[0.015] px-4 py-6 text-center">
        <span class="text-xs text-white/30">Loading playground...</span>
      </div>
    </template>
  </ClientOnly>
</template>

<style>
.playground-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #14b8a6;
  cursor: pointer;
  box-shadow: 0 0 8px rgba(20, 184, 166, 0.3);
  transition: box-shadow 0.2s;
}

.playground-slider::-webkit-slider-thumb:hover {
  box-shadow: 0 0 14px rgba(20, 184, 166, 0.5);
}

.playground-slider::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border: none;
  border-radius: 50%;
  background: #14b8a6;
  cursor: pointer;
  box-shadow: 0 0 8px rgba(20, 184, 166, 0.3);
}

.playground-transition {
  transition: d 0.3s ease, transform 0.3s ease, y 0.3s ease, height 0.3s ease,
    stroke-dasharray 0.3s ease;
}

@media (prefers-reduced-motion: reduce) {
  .playground-transition {
    transition: none;
  }
}
</style>
