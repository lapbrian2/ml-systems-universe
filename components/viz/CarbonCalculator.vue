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
interface GpuOption {
  id: string
  name: string
  tdp: number // watts
  perf: number // relative training speed multiplier
}

interface LocationOption {
  id: string
  name: string
  carbonIntensity: number // gCO2/kWh
  icon: string
}

interface Comparison {
  label: string
  icon: string
  perUnit: number // kg CO2 per unit
  unit: string
}

/* ── Configuration data ── */
const gpuOptions: GpuOption[] = [
  { id: 'v100', name: 'NVIDIA V100', tdp: 300, perf: 1.0 },
  { id: 'a100', name: 'NVIDIA A100', tdp: 400, perf: 2.5 },
  { id: 'h100', name: 'NVIDIA H100', tdp: 700, perf: 5.0 },
  { id: 'tpu-v4', name: 'Google TPU v4', tdp: 200, perf: 3.0 },
  { id: 'a6000', name: 'NVIDIA A6000', tdp: 300, perf: 1.8 },
]

const locationOptions: LocationOption[] = [
  { id: 'us-west', name: 'US West (Oregon)', carbonIntensity: 80, icon: 'tree' },
  { id: 'us-east', name: 'US East (Virginia)', carbonIntensity: 350, icon: 'factory' },
  { id: 'eu-nordic', name: 'EU Nordic (Sweden)', carbonIntensity: 20, icon: 'wind' },
  { id: 'eu-central', name: 'EU Central (Germany)', carbonIntensity: 340, icon: 'factory' },
  { id: 'asia-china', name: 'Asia (China)', carbonIntensity: 550, icon: 'coal' },
  { id: 'asia-india', name: 'Asia (India)', carbonIntensity: 630, icon: 'coal' },
]

const comparisons: Comparison[] = [
  { label: 'Transatlantic flights', icon: 'plane', perUnit: 900, unit: 'flights' },
  { label: 'Car miles driven', icon: 'car', perUnit: 0.21, unit: 'miles' },
  { label: 'Smartphone charges', icon: 'phone', perUnit: 0.008, unit: 'charges' },
  { label: 'Streaming hours', icon: 'stream', perUnit: 0.036, unit: 'hours' },
  { label: 'Tree-years to offset', icon: 'tree', perUnit: 21, unit: 'tree-years' },
]

const modelSizes = [
  { label: 'Small (1B)', params: 1, color: '#22c55e' },
  { label: 'Medium (7B)', params: 7, color: '#14b8a6' },
  { label: 'Large (70B)', params: 70, color: '#f0a500' },
  { label: 'Huge (175B)', params: 175, color: '#ff6b6b' },
]

/* ── State ── */
const selectedGpu = ref('a100')
const trainingHours = ref(100)
const selectedLocation = ref('us-west')
const selectedModelSize = ref(1)
const numGpus = ref(8)
const interactionCount = ref(0)
const exerciseEmitted = ref(false)
const challengeComplete = ref(false)

/* ── Calculations ── */
const currentGpu = computed(() => gpuOptions.find(g => g.id === selectedGpu.value) ?? gpuOptions[1])
const currentLocation = computed(() => locationOptions.find(l => l.id === selectedLocation.value) ?? locationOptions[0])

const energyConsumedKwh = computed(() => {
  const watts = currentGpu.value.tdp * numGpus.value
  const pue = 1.1 // Power Usage Effectiveness
  const hours = trainingHours.value * (selectedModelSize.value / currentGpu.value.perf)
  return (watts * hours * pue) / 1000
})

const co2Kg = computed(() => {
  return (energyConsumedKwh.value * currentLocation.value.carbonIntensity) / 1000
})

const comparisonValues = computed(() => {
  return comparisons.map(c => ({
    ...c,
    value: co2Kg.value / c.perUnit,
  }))
})

/* ── Chart data for location comparison ── */
const locationComparison = computed(() => {
  return locationOptions.map(loc => {
    const co2 = (energyConsumedKwh.value * loc.carbonIntensity) / 1000
    return { ...loc, co2 }
  })
})

const maxLocationCo2 = computed(() => Math.max(...locationComparison.value.map(l => l.co2), 1))

/* ── Challenge completion: CO2 under 50kg ── */
watch(
  co2Kg,
  (kg) => {
    if (kg < 50) {
      challengeComplete.value = true
    }
  }
)

/* ── Interaction tracking ── */
function trackInteraction() {
  interactionCount.value++
  if (interactionCount.value >= 3 && !exerciseEmitted.value) {
    exerciseEmitted.value = true
    emit('exerciseComplete')
  }
}

function handleSlider(setter: (v: number) => void) {
  return (event: Event) => {
    const target = event.target as HTMLInputElement
    setter(parseFloat(target.value))
    trackInteraction()
  }
}

function handleSelect(setter: (v: string) => void) {
  return (event: Event) => {
    const target = event.target as HTMLSelectElement
    setter(target.value)
    trackInteraction()
  }
}

function handleModelSize(params: number) {
  selectedModelSize.value = params
  trackInteraction()
}

/* ── Progress ── */
const explorationProgress = computed(() => Math.min(interactionCount.value, 3))

/* ── Number formatting ── */
function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  if (n >= 100) return Math.round(n).toLocaleString()
  if (n >= 1) return n.toFixed(1)
  return n.toFixed(3)
}

/* activeSection drives context text reactively — no watcher needed */
</script>

<template>
  <div class="carbon" role="region" aria-label="ML Training Carbon Footprint Calculator">
    <!-- Header -->
    <div class="carbon__header">
      <span class="carbon__badge">Interactive</span>
      <h3 class="carbon__title">Carbon Calculator</h3>
      <p class="carbon__subtitle">
        Estimate the environmental cost of ML training
        <span
          class="carbon__progress"
          :class="{ 'carbon__progress--complete': explorationProgress >= 3 }"
        >
          {{ explorationProgress }}/3
        </span>
      </p>
    </div>

    <!-- Challenge -->
    <VizChallenge
      title="Sustainability Challenge"
      description="Find a training configuration under 50kg CO₂"
      color="#22c55e"
      :is-complete="challengeComplete"
      :time-limit="60"
      @reset="challengeComplete = false"
    />

    <!-- Main Visualization -->
    <div class="carbon__canvas">
      <svg
        viewBox="0 0 800 460"
        class="carbon__svg"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Carbon footprint calculation results with energy, emissions, and comparisons"
      >
        <defs>
          <filter id="carbon-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id="carbon-green-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#22c55e" stop-opacity="0.2" />
            <stop offset="100%" stop-color="#22c55e" stop-opacity="0" />
          </linearGradient>
        </defs>

        <!-- Output Cards -->
        <g transform="translate(30, 20)">
          <!-- Energy Card -->
          <rect x="0" y="0" width="230" height="80" rx="12" class="carbon__output-bg" />
          <g transform="translate(16, 20)">
            <!-- Lightning bolt icon -->
            <path d="M 10 0 L 4 12 L 9 12 L 6 22 L 16 8 L 11 8 L 14 0 Z" fill="#f0a500" opacity="0.8" />
          </g>
          <text x="44" y="32" class="carbon__output-label">Energy Consumed</text>
          <text x="44" y="58" class="carbon__output-value" fill="#f0a500">
            {{ formatNumber(energyConsumedKwh) }} kWh
          </text>

          <!-- CO2 Card -->
          <rect x="250" y="0" width="230" height="80" rx="12" class="carbon__output-bg" />
          <g transform="translate(266, 20)">
            <!-- Cloud icon -->
            <ellipse cx="12" cy="12" rx="10" ry="8" fill="none" stroke="#ff6b6b" stroke-width="1.5" opacity="0.8" />
            <text x="12" y="15" text-anchor="middle" fill="#ff6b6b" font-size="8" font-weight="700" font-family="Inter, sans-serif">CO2</text>
          </g>
          <text x="294" y="32" class="carbon__output-label">Carbon Emissions</text>
          <text x="294" y="58" class="carbon__output-value" fill="#ff6b6b">
            {{ formatNumber(co2Kg) }} kg CO2
          </text>

          <!-- Efficiency Card -->
          <rect x="500" y="0" width="230" height="80" rx="12" class="carbon__output-bg" />
          <g transform="translate(516, 20)">
            <!-- Leaf icon -->
            <path d="M 12 2 C 6 8 4 16 10 20 C 16 16 18 8 12 2 Z" fill="none" stroke="#22c55e" stroke-width="1.5" opacity="0.8" />
            <line x1="10" y1="20" x2="14" y2="10" stroke="#22c55e" stroke-width="1" opacity="0.5" />
          </g>
          <text x="544" y="32" class="carbon__output-label">Carbon Intensity</text>
          <text x="544" y="58" class="carbon__output-value" fill="#22c55e">
            {{ currentLocation.carbonIntensity }} gCO2/kWh
          </text>
        </g>

        <!-- Location Comparison Bars -->
        <g transform="translate(30, 120)">
          <text x="0" y="0" class="carbon__section-title">Carbon by Location</text>
          <g
            v-for="(loc, i) in locationComparison"
            :key="loc.id"
            :transform="`translate(0, ${16 + i * 28})`"
          >
            <text x="0" y="12" class="carbon__loc-label" :class="{ 'carbon__loc-label--active': loc.id === selectedLocation }">
              {{ loc.name }}
            </text>
            <rect x="155" y="2" width="280" height="14" rx="3" fill="rgba(255,255,255,0.03)" />
            <rect
              x="155"
              y="2"
              :width="280 * Math.min(1, loc.co2 / maxLocationCo2)"
              height="14"
              rx="3"
              :fill="loc.id === selectedLocation ? '#14b8a6' : 'rgba(20, 184, 166, 0.3)'"
              class="carbon__loc-bar"
            />
            <text :x="155 + 280 * Math.min(1, loc.co2 / maxLocationCo2) + 6" y="14" class="carbon__loc-value">
              {{ formatNumber(loc.co2) }} kg
            </text>
          </g>
        </g>

        <!-- Comparisons -->
        <g transform="translate(500, 120)">
          <text x="0" y="0" class="carbon__section-title">Equivalent To</text>
          <g
            v-for="(comp, i) in comparisonValues"
            :key="comp.label"
            :transform="`translate(0, ${20 + i * 36})`"
          >
            <rect x="0" y="-6" width="270" height="32" rx="8" class="carbon__comp-bg" />
            <!-- Icon placeholders -->
            <g transform="translate(10, 2)">
              <text v-if="comp.icon === 'plane'" x="0" y="12" class="carbon__comp-icon">&#9992;</text>
              <text v-else-if="comp.icon === 'car'" x="0" y="12" class="carbon__comp-icon">&#128663;</text>
              <text v-else-if="comp.icon === 'phone'" x="0" y="12" class="carbon__comp-icon">&#128241;</text>
              <text v-else-if="comp.icon === 'stream'" x="0" y="12" class="carbon__comp-icon">&#9654;</text>
              <text v-else x="0" y="12" class="carbon__comp-icon">&#127794;</text>
            </g>
            <text x="32" y="8" class="carbon__comp-label">{{ comp.label }}</text>
            <text x="32" y="22" class="carbon__comp-value">
              {{ formatNumber(comp.value) }} {{ comp.unit }}
            </text>
          </g>
        </g>

        <!-- Model Size Selector -->
        <g transform="translate(30, 320)">
          <text x="0" y="0" class="carbon__section-title">Model Size</text>
          <g
            v-for="(model, i) in modelSizes"
            :key="model.params"
            :transform="`translate(${i * 110}, 15)`"
            class="carbon__model-card"
            :class="{ 'carbon__model-card--active': selectedModelSize === model.params }"
            role="button"
            :tabindex="0"
            :aria-label="`Select model size: ${model.label}`"
            :aria-pressed="selectedModelSize === model.params"
            @click="handleModelSize(model.params)"
            @keydown.enter="handleModelSize(model.params)"
            @keydown.space.prevent="handleModelSize(model.params)"
          >
            <rect
              x="0"
              y="0"
              width="100"
              height="55"
              rx="10"
              class="carbon__model-bg"
              :stroke="selectedModelSize === model.params ? model.color : 'transparent'"
            />
            <text x="50" y="22" text-anchor="middle" class="carbon__model-label" :fill="selectedModelSize === model.params ? model.color : undefined">
              {{ model.label }}
            </text>
            <!-- Size indicator dots -->
            <g :transform="`translate(${50 - model.params / 10}, 34)`">
              <circle
                v-for="j in Math.min(5, Math.ceil(model.params / 35))"
                :key="j"
                :cx="(j - 1) * 12"
                cy="0"
                r="4"
                :fill="selectedModelSize === model.params ? model.color : 'rgba(255,255,255,0.1)'"
                class="carbon__model-dot"
              />
            </g>
          </g>
        </g>

        <!-- GPU Count -->
        <g transform="translate(30, 405)">
          <text x="0" y="0" class="carbon__section-title">GPU Configuration</text>
          <text x="0" y="22" class="carbon__gpu-info">
            {{ numGpus }}x {{ currentGpu.name }} ({{ currentGpu.tdp }}W each, {{ (currentGpu.tdp * numGpus) / 1000 }}kW total)
          </text>
        </g>
      </svg>
    </div>

    <!-- Controls -->
    <div class="carbon__controls">
      <div class="carbon__control-group">
        <label class="carbon__control-label" for="carbon-gpu">GPU Type:</label>
        <select
          id="carbon-gpu"
          class="carbon__select"
          :value="selectedGpu"
          @change="handleSelect(v => selectedGpu = v)($event)"
        >
          <option v-for="gpu in gpuOptions" :key="gpu.id" :value="gpu.id">
            {{ gpu.name }} ({{ gpu.tdp }}W)
          </option>
        </select>
      </div>

      <div class="carbon__control-group">
        <label class="carbon__control-label" for="carbon-location">Data Center:</label>
        <select
          id="carbon-location"
          class="carbon__select"
          :value="selectedLocation"
          @change="handleSelect(v => selectedLocation = v)($event)"
        >
          <option v-for="loc in locationOptions" :key="loc.id" :value="loc.id">
            {{ loc.name }} ({{ loc.carbonIntensity }} gCO2/kWh)
          </option>
        </select>
      </div>

      <div class="carbon__control-group">
        <label class="carbon__control-label" for="carbon-hours">
          Training Hours: {{ trainingHours }}h
        </label>
        <input
          id="carbon-hours"
          type="range"
          min="1"
          max="1000"
          step="1"
          :value="trainingHours"
          class="carbon__slider"
          @input="handleSlider(v => trainingHours = v)($event)"
        />
      </div>

      <div class="carbon__control-group">
        <label class="carbon__control-label" for="carbon-gpus">
          Number of GPUs: {{ numGpus }}
        </label>
        <input
          id="carbon-gpus"
          type="range"
          min="1"
          max="512"
          step="1"
          :value="numGpus"
          class="carbon__slider"
          @input="handleSlider(v => numGpus = Math.round(v))($event)"
        />
      </div>
    </div>

    <!-- Context -->
    <div class="carbon__context">
      <span v-if="activeSection === 0" class="carbon__context-text">
        Training large models can consume as much energy as several homes use in a year
      </span>
      <span v-else-if="activeSection === 1" class="carbon__context-text">
        Data center location dramatically affects carbon footprint due to energy grid mix
      </span>
      <span v-else-if="activeSection === 2" class="carbon__context-text">
        Model efficiency improvements can reduce both costs and environmental impact
      </span>
      <span v-else class="carbon__context-text">
        Consider carbon costs alongside accuracy when choosing model architectures
      </span>
    </div>
  </div>
</template>

<style scoped>
.carbon {
  --viz-bg: #05070f;
  --viz-surface: #0a0e1a;
  --viz-card: #0f1325;
  --viz-border: rgba(255, 255, 255, 0.06);
  --viz-primary: #14b8a6;
  --viz-text: #e2e8f0;
  --viz-text-muted: rgba(255, 255, 255, 0.45);
  --viz-accent-green: #22c55e;
  --viz-accent-red: #ff6b6b;
  --viz-accent-amber: #f0a500;

  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  height: 100%;
  min-height: 0;
  font-family: 'Inter', sans-serif;
  user-select: none;
}

.carbon__header { display: flex; flex-direction: column; gap: 4px; padding: 0 4px; }

.carbon__badge {
  display: inline-flex; align-self: flex-start; padding: 3px 10px; border-radius: 9999px;
  font-size: 10px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--viz-accent-green); background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.2);
}

.carbon__title {
  margin: 0; font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700;
  color: var(--viz-text); letter-spacing: -0.01em;
}

.carbon__subtitle {
  margin: 0; font-size: 12px; color: var(--viz-text-muted);
  display: flex; align-items: center; gap: 8px;
}

.carbon__progress {
  display: inline-flex; padding: 1px 8px; border-radius: 9999px; font-size: 11px; font-weight: 600;
  color: var(--viz-text-muted); background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06); transition: all 0.4s ease;
}

.carbon__progress--complete {
  color: var(--viz-accent-green); background: rgba(34, 197, 94, 0.1);
  border-color: rgba(34, 197, 94, 0.3);
}

.carbon__canvas { flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; }
.carbon__svg { width: 100%; height: auto; overflow: visible; }

/* ── Output cards ── */
.carbon__output-bg { fill: var(--viz-card); stroke: var(--viz-border); stroke-width: 1; }
.carbon__output-label { fill: var(--viz-text-muted); font-size: 11px; font-family: 'Inter', sans-serif; }
.carbon__output-value { font-size: 18px; font-weight: 700; font-family: 'Syne', sans-serif; }

/* ── Section titles ── */
.carbon__section-title { fill: var(--viz-text); font-size: 12px; font-family: 'Syne', sans-serif; font-weight: 600; }

/* ── Location bars ── */
.carbon__loc-label { fill: var(--viz-text-muted); font-size: 9px; font-family: 'Inter', sans-serif; transition: fill 0.3s ease; }
.carbon__loc-label--active { fill: var(--viz-text); font-weight: 600; }
.carbon__loc-bar { transition: width 0.5s cubic-bezier(0.22, 1, 0.36, 1), fill 0.3s ease; }
.carbon__loc-value { fill: var(--viz-text-muted); font-size: 9px; font-family: 'Inter', sans-serif; }

/* ── Comparisons ── */
.carbon__comp-bg { fill: var(--viz-card); stroke: var(--viz-border); stroke-width: 1; }
.carbon__comp-icon { font-size: 14px; }
.carbon__comp-label { fill: var(--viz-text-muted); font-size: 10px; font-family: 'Inter', sans-serif; }
.carbon__comp-value { fill: var(--viz-text); font-size: 11px; font-weight: 600; font-family: 'Inter', sans-serif; }

/* ── Model cards ── */
.carbon__model-card { cursor: pointer; outline: none; }
.carbon__model-card:focus-visible .carbon__model-bg { stroke: var(--viz-primary); stroke-width: 2; }

.carbon__model-bg {
  fill: var(--viz-card); stroke-width: 1.5; transition: fill 0.3s ease, stroke 0.3s ease;
}
.carbon__model-card:hover .carbon__model-bg { fill: #141933; }
.carbon__model-card--active .carbon__model-bg { fill: #181e3a; }

.carbon__model-label { fill: var(--viz-text-muted); font-size: 10px; font-family: 'Inter', sans-serif; font-weight: 500; transition: fill 0.3s ease; }
.carbon__model-dot { transition: fill 0.3s ease; }

.carbon__gpu-info { fill: var(--viz-text-muted); font-size: 11px; font-family: 'Inter', sans-serif; }

/* ── Controls ── */
.carbon__controls { display: flex; gap: 16px; padding: 0 4px; flex-wrap: wrap; }
.carbon__control-group { display: flex; flex-direction: column; gap: 6px; flex: 1; min-width: 140px; }
.carbon__control-label { font-size: 11px; font-weight: 500; color: var(--viz-text-muted); }

.carbon__select {
  appearance: none; background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px;
  color: var(--viz-text); font-size: 11px; font-family: 'Inter', sans-serif;
  padding: 6px 10px; cursor: pointer; outline: none;
}
.carbon__select:focus { border-color: var(--viz-primary); }
.carbon__select option { background: #0f1325; color: var(--viz-text); }

.carbon__slider {
  -webkit-appearance: none; appearance: none; width: 100%; height: 4px; border-radius: 2px;
  background: rgba(255, 255, 255, 0.08); outline: none; cursor: pointer;
}
.carbon__slider::-webkit-slider-thumb {
  -webkit-appearance: none; appearance: none; width: 16px; height: 16px; border-radius: 50%;
  background: var(--viz-accent-green); border: 2px solid var(--viz-bg); cursor: pointer;
  transition: transform 0.2s ease;
}
.carbon__slider::-webkit-slider-thumb:hover { transform: scale(1.2); }
.carbon__slider::-moz-range-thumb {
  width: 16px; height: 16px; border-radius: 50%;
  background: var(--viz-accent-green); border: 2px solid var(--viz-bg); cursor: pointer;
}

/* ── Context ── */
.carbon__context { padding: 0 4px; min-height: 20px; }
.carbon__context-text {
  font-size: 11px; color: var(--viz-text-muted); font-style: italic; opacity: 0.7;
  animation: carbonContextFadeIn 0.5s ease;
}

@keyframes carbonContextFadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 0.7; transform: translateY(0); }
}

@media (max-width: 768px) {
  .carbon__controls { flex-direction: column; gap: 12px; }
  .carbon__title { font-size: 14px; }
}
</style>
