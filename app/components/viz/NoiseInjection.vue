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
type NoiseMode = 'gaussian' | 'adversarial' | 'shift'

/* ── State ── */
const gaussianAmplitude = ref(0)
const adversarialStrength = ref(0)
const shiftMean = ref(0)
const shiftVariance = ref(0)
const noiseMode = ref<NoiseMode>('gaussian')
const interactionCount = ref(0)
const exerciseEmitted = ref(false)
const hoveredPoint = ref<number | null>(null)

/* ── Chart dimensions ── */
const chartWidth = 700
const chartHeight = 250
const chartPadding = { top: 30, right: 30, bottom: 40, left: 50 }
const plotWidth = chartWidth - chartPadding.left - chartPadding.right
const plotHeight = chartHeight - chartPadding.top - chartPadding.bottom
const numPoints = 100

/* ── Seeded random ── */
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

/* ── Signal generation ── */
const cleanSignal = computed(() => {
  const points: { x: number; y: number }[] = []
  for (let i = 0; i < numPoints; i++) {
    const t = i / numPoints
    const x = chartPadding.left + t * plotWidth
    // Composite signal: main sine + harmonic
    const y = Math.sin(t * Math.PI * 4) * 0.6 + Math.sin(t * Math.PI * 8) * 0.2
    const yScreen = chartPadding.top + plotHeight / 2 - y * (plotHeight / 2.5)
    points.push({ x, y: yScreen })
  }
  return points
})

const noisySignal = computed(() => {
  return cleanSignal.value.map((pt, i) => {
    const t = i / numPoints
    let noise = 0
    const seed = i

    // Gaussian noise
    if (noiseMode.value === 'gaussian' || noiseMode.value === 'adversarial') {
      const amp = gaussianAmplitude.value / 100
      // Box-Muller approximation using seeded random
      const u1 = seededRandom(seed * 3 + 7)
      const u2 = seededRandom(seed * 5 + 13)
      const gaussNoise = Math.sqrt(-2 * Math.log(Math.max(0.001, u1))) * Math.cos(2 * Math.PI * u2)
      noise += gaussNoise * amp * (plotHeight / 5)
    }

    // Adversarial targeted noise
    if (noiseMode.value === 'adversarial') {
      const adv = adversarialStrength.value / 100
      // Targeted to push signal in specific direction at certain frequencies
      const targetPush = Math.sin(t * Math.PI * 12 + 1) * adv * (plotHeight / 4)
      noise += targetPush
    }

    // Distribution shift
    if (noiseMode.value === 'shift') {
      const meanShift = (shiftMean.value / 100) * (plotHeight / 3)
      const varScale = 1 + shiftVariance.value / 50
      // Shift the signal vertically and scale its variance
      const centerY = chartPadding.top + plotHeight / 2
      const deviation = pt.y - centerY
      return {
        x: pt.x,
        y: centerY + deviation * varScale - meanShift,
      }
    }

    return { x: pt.x, y: pt.y + noise }
  })
})

/* ── Model confidence ── */
const modelConfidence = computed(() => {
  let totalDeviation = 0
  for (let i = 0; i < numPoints; i++) {
    const diff = Math.abs(noisySignal.value[i].y - cleanSignal.value[i].y)
    totalDeviation += diff
  }
  const avgDev = totalDeviation / numPoints
  const confidence = Math.max(0, Math.min(100, 100 - avgDev * 1.5))
  return Math.round(confidence)
})

const signalToNoiseRatio = computed(() => {
  let signalPower = 0
  let noisePower = 0
  for (let i = 0; i < numPoints; i++) {
    const centerY = chartPadding.top + plotHeight / 2
    signalPower += Math.pow(cleanSignal.value[i].y - centerY, 2)
    noisePower += Math.pow(noisySignal.value[i].y - cleanSignal.value[i].y, 2)
  }
  if (noisePower < 0.001) return 99.9
  const snr = 10 * Math.log10(signalPower / noisePower)
  return Math.round(Math.max(-10, Math.min(99.9, snr)) * 10) / 10
})

/* ── Path generators ── */
function pointsToPath(points: { x: number; y: number }[]): string {
  return points.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`).join(' ')
}

function pointsToAreaPath(points: { x: number; y: number }[]): string {
  const baseline = chartPadding.top + plotHeight
  const linePath = points.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`).join(' ')
  return `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${baseline} L ${points[0].x.toFixed(1)} ${baseline} Z`
}

/* ── Grid lines ── */
const yGridLines = computed(() => {
  const lines = []
  for (let i = 0; i <= 4; i++) {
    const y = chartPadding.top + (plotHeight / 4) * i
    const value = (1 - i / 2).toFixed(1)
    lines.push({ y, label: value })
  }
  return lines
})

const xGridLines = computed(() => {
  const lines = []
  for (let i = 0; i <= 5; i++) {
    const x = chartPadding.left + (plotWidth / 5) * i
    const value = (i * 20).toString()
    lines.push({ x, label: value })
  }
  return lines
})

/* ── Noise modes ── */
const noiseModes: { value: NoiseMode; label: string; color: string }[] = [
  { value: 'gaussian', label: 'Gaussian', color: '#14b8a6' },
  { value: 'adversarial', label: 'Adversarial', color: '#ff6b6b' },
  { value: 'shift', label: 'Distribution Shift', color: '#f0a500' },
]

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

function handleModeChange(mode: NoiseMode) {
  noiseMode.value = mode
  trackInteraction()
}

/* ── Hover info ── */
function handlePointHover(index: number | null) {
  hoveredPoint.value = index
}

/* ── Progress ── */
const explorationProgress = computed(() => Math.min(interactionCount.value, 3))

/* ── Confidence bar color ── */
function confidenceColor(conf: number): string {
  if (conf >= 80) return '#22c55e'
  if (conf >= 50) return '#f0a500'
  return '#ff6b6b'
}

/* ── Reset on section change ── */
watch(
  () => props.activeSection,
  () => {
    hoveredPoint.value = null
  }
)
</script>

<template>
  <div class="noise" role="region" aria-label="Noise Injection Robustness Testing">
    <!-- Header -->
    <div class="noise__header">
      <span class="noise__badge">Interactive</span>
      <h3 class="noise__title">Noise Injection Lab</h3>
      <p class="noise__subtitle">
        Test signal robustness under different noise conditions
        <span
          class="noise__progress"
          :class="{ 'noise__progress--complete': explorationProgress >= 3 }"
        >
          {{ explorationProgress }}/3
        </span>
      </p>
    </div>

    <!-- Main Chart -->
    <div class="noise__canvas">
      <svg
        :viewBox="`0 0 ${chartWidth} ${chartHeight + 80}`"
        class="noise__svg"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Signal chart showing clean and noisy waveforms"
      >
        <defs>
          <filter id="noise-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id="noise-clean-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#14b8a6" stop-opacity="0.15" />
            <stop offset="100%" stop-color="#14b8a6" stop-opacity="0" />
          </linearGradient>
          <linearGradient id="noise-noisy-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" :stop-color="noiseModes.find(m => m.value === noiseMode)?.color ?? '#ff6b6b'" stop-opacity="0.1" />
            <stop offset="100%" :stop-color="noiseModes.find(m => m.value === noiseMode)?.color ?? '#ff6b6b'" stop-opacity="0" />
          </linearGradient>
          <clipPath id="noise-chart-clip">
            <rect
              :x="chartPadding.left"
              :y="chartPadding.top"
              :width="plotWidth"
              :height="plotHeight"
            />
          </clipPath>
        </defs>

        <!-- Grid -->
        <g class="noise__grid">
          <!-- Y grid lines -->
          <g v-for="line in yGridLines" :key="`y-${line.y}`">
            <line
              :x1="chartPadding.left"
              :y1="line.y"
              :x2="chartPadding.left + plotWidth"
              :y2="line.y"
              class="noise__grid-line"
            />
            <text
              :x="chartPadding.left - 8"
              :y="line.y + 4"
              text-anchor="end"
              class="noise__axis-label"
            >
              {{ line.label }}
            </text>
          </g>
          <!-- X grid lines -->
          <g v-for="line in xGridLines" :key="`x-${line.x}`">
            <line
              :x1="line.x"
              :y1="chartPadding.top"
              :x2="line.x"
              :y2="chartPadding.top + plotHeight"
              class="noise__grid-line"
            />
            <text
              :x="line.x"
              :y="chartPadding.top + plotHeight + 18"
              text-anchor="middle"
              class="noise__axis-label"
            >
              {{ line.label }}
            </text>
          </g>
        </g>

        <!-- Axis labels -->
        <text
          :x="chartPadding.left + plotWidth / 2"
          :y="chartPadding.top + plotHeight + 35"
          text-anchor="middle"
          class="noise__axis-title"
        >
          Time (samples)
        </text>
        <text
          :x="12"
          :y="chartPadding.top + plotHeight / 2"
          text-anchor="middle"
          class="noise__axis-title"
          transform="rotate(-90, 12, 155)"
        >
          Amplitude
        </text>

        <!-- Clipped chart area -->
        <g clip-path="url(#noise-chart-clip)">
          <!-- Area fills -->
          <path :d="pointsToAreaPath(cleanSignal)" fill="url(#noise-clean-gradient)" />
          <path :d="pointsToAreaPath(noisySignal)" fill="url(#noise-noisy-gradient)" />

          <!-- Noisy signal line (behind) -->
          <path
            :d="pointsToPath(noisySignal)"
            fill="none"
            :stroke="noiseModes.find(m => m.value === noiseMode)?.color ?? '#ff6b6b'"
            stroke-width="1.5"
            stroke-opacity="0.6"
            class="noise__signal-line noise__signal-line--noisy"
          />

          <!-- Clean signal line (front) -->
          <path
            :d="pointsToPath(cleanSignal)"
            fill="none"
            stroke="#14b8a6"
            stroke-width="2"
            filter="url(#noise-glow)"
            class="noise__signal-line noise__signal-line--clean"
          />

          <!-- Hover points -->
          <g v-if="hoveredPoint !== null">
            <circle
              :cx="cleanSignal[hoveredPoint].x"
              :cy="cleanSignal[hoveredPoint].y"
              r="4"
              fill="#14b8a6"
              stroke="#05070f"
              stroke-width="2"
            />
            <circle
              :cx="noisySignal[hoveredPoint].x"
              :cy="noisySignal[hoveredPoint].y"
              r="4"
              :fill="noiseModes.find(m => m.value === noiseMode)?.color ?? '#ff6b6b'"
              stroke="#05070f"
              stroke-width="2"
            />
            <!-- Diff line -->
            <line
              :x1="cleanSignal[hoveredPoint].x"
              :y1="cleanSignal[hoveredPoint].y"
              :x2="noisySignal[hoveredPoint].x"
              :y2="noisySignal[hoveredPoint].y"
              stroke="rgba(255,255,255,0.3)"
              stroke-width="1"
              stroke-dasharray="3 2"
            />
          </g>

          <!-- Invisible hover rects for interaction -->
          <rect
            v-for="(pt, i) in cleanSignal"
            :key="`hover-${i}`"
            :x="pt.x - plotWidth / numPoints / 2"
            :y="chartPadding.top"
            :width="plotWidth / numPoints"
            :height="plotHeight"
            fill="transparent"
            @mouseenter="handlePointHover(i)"
            @mouseleave="handlePointHover(null)"
          />
        </g>

        <!-- Legend -->
        <g :transform="`translate(${chartPadding.left + 10}, ${chartPadding.top + 10})`">
          <rect x="-6" y="-10" width="170" height="38" rx="6" fill="rgba(5,7,15,0.8)" stroke="rgba(255,255,255,0.06)" stroke-width="1" />
          <line x1="0" y1="0" x2="20" y2="0" stroke="#14b8a6" stroke-width="2" />
          <text x="26" y="4" class="noise__legend-text">Clean Signal</text>
          <line x1="0" y1="18" x2="20" y2="18" :stroke="noiseModes.find(m => m.value === noiseMode)?.color ?? '#ff6b6b'" stroke-width="1.5" stroke-opacity="0.6" />
          <text x="26" y="22" class="noise__legend-text">Noisy Signal</text>
        </g>

        <!-- Metrics panel -->
        <g :transform="`translate(${chartPadding.left}, ${chartHeight + 5})`">
          <!-- Confidence meter -->
          <rect x="0" y="0" width="200" height="50" rx="8" class="noise__metric-bg" />
          <text x="12" y="18" class="noise__metric-label">Model Confidence</text>
          <rect x="12" y="26" width="140" height="8" rx="4" fill="rgba(255,255,255,0.06)" />
          <rect
            x="12"
            y="26"
            :width="140 * (modelConfidence / 100)"
            height="8"
            rx="4"
            :fill="confidenceColor(modelConfidence)"
            class="noise__metric-bar"
          />
          <text x="160" y="34" class="noise__metric-value" :fill="confidenceColor(modelConfidence)">
            {{ modelConfidence }}%
          </text>

          <!-- SNR -->
          <rect x="220" y="0" width="160" height="50" rx="8" class="noise__metric-bg" />
          <text x="232" y="18" class="noise__metric-label">Signal-to-Noise Ratio</text>
          <text x="232" y="40" class="noise__metric-snr">{{ signalToNoiseRatio }} dB</text>

          <!-- Status -->
          <rect
            x="400"
            y="0"
            width="140"
            height="50"
            rx="8"
            :fill="modelConfidence >= 50 ? 'rgba(0,200,150,0.06)' : 'rgba(255,107,107,0.06)'"
            :stroke="modelConfidence >= 50 ? 'rgba(0,200,150,0.2)' : 'rgba(255,107,107,0.2)'"
            stroke-width="1"
          />
          <text x="470" y="22" text-anchor="middle" class="noise__status-text">
            {{ modelConfidence >= 80 ? 'ROBUST' : modelConfidence >= 50 ? 'DEGRADED' : 'FAILING' }}
          </text>
          <text x="470" y="40" text-anchor="middle" class="noise__status-sub">
            {{ modelConfidence >= 80 ? 'Signal intact' : modelConfidence >= 50 ? 'Quality reduced' : 'Signal lost' }}
          </text>
        </g>
      </svg>
    </div>

    <!-- Controls -->
    <div class="noise__controls">
      <!-- Mode selector -->
      <div class="noise__control-group noise__control-group--modes">
        <span class="noise__control-label">Noise Type:</span>
        <div class="noise__mode-buttons" role="radiogroup" aria-label="Noise mode selection">
          <button
            v-for="mode in noiseModes"
            :key="mode.value"
            class="noise__mode-btn"
            :class="{ 'noise__mode-btn--active': noiseMode === mode.value }"
            :style="noiseMode === mode.value ? `--active-color: ${mode.color}` : ''"
            role="radio"
            :aria-checked="noiseMode === mode.value"
            :aria-label="`Noise type: ${mode.label}`"
            @click="handleModeChange(mode.value)"
          >
            {{ mode.label }}
          </button>
        </div>
      </div>

      <!-- Gaussian controls -->
      <div v-if="noiseMode === 'gaussian' || noiseMode === 'adversarial'" class="noise__control-group">
        <label class="noise__control-label" for="noise-gauss-amp">
          Gaussian Amplitude: {{ gaussianAmplitude }}%
        </label>
        <input
          id="noise-gauss-amp"
          type="range"
          min="0"
          max="100"
          step="1"
          :value="gaussianAmplitude"
          class="noise__slider"
          @input="handleSlider(v => gaussianAmplitude = v)($event)"
        />
      </div>

      <!-- Adversarial controls -->
      <div v-if="noiseMode === 'adversarial'" class="noise__control-group">
        <label class="noise__control-label" for="noise-adv-str">
          Adversarial Strength: {{ adversarialStrength }}%
        </label>
        <input
          id="noise-adv-str"
          type="range"
          min="0"
          max="100"
          step="1"
          :value="adversarialStrength"
          class="noise__slider noise__slider--red"
          @input="handleSlider(v => adversarialStrength = v)($event)"
        />
      </div>

      <!-- Shift controls -->
      <template v-if="noiseMode === 'shift'">
        <div class="noise__control-group">
          <label class="noise__control-label" for="noise-shift-mean">
            Mean Shift: {{ shiftMean }}%
          </label>
          <input
            id="noise-shift-mean"
            type="range"
            min="-100"
            max="100"
            step="1"
            :value="shiftMean"
            class="noise__slider noise__slider--amber"
            @input="handleSlider(v => shiftMean = v)($event)"
          />
        </div>
        <div class="noise__control-group">
          <label class="noise__control-label" for="noise-shift-var">
            Variance Scale: {{ shiftVariance }}%
          </label>
          <input
            id="noise-shift-var"
            type="range"
            min="0"
            max="100"
            step="1"
            :value="shiftVariance"
            class="noise__slider noise__slider--amber"
            @input="handleSlider(v => shiftVariance = v)($event)"
          />
        </div>
      </template>
    </div>

    <!-- Context -->
    <div class="noise__context">
      <span v-if="activeSection === 0" class="noise__context-text">
        Noise injection tests model resilience to input perturbations
      </span>
      <span v-else-if="activeSection === 1" class="noise__context-text">
        Gaussian noise simulates sensor noise and data corruption
      </span>
      <span v-else-if="activeSection === 2" class="noise__context-text">
        Adversarial noise targets specific model vulnerabilities
      </span>
      <span v-else class="noise__context-text">
        Distribution shift occurs when deployment data differs from training data
      </span>
    </div>
  </div>
</template>

<style scoped>
.noise {
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

/* ── Header ── */
.noise__header { display: flex; flex-direction: column; gap: 4px; padding: 0 4px; }

.noise__badge {
  display: inline-flex; align-self: flex-start; padding: 3px 10px; border-radius: 9999px;
  font-size: 10px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--viz-primary); background: rgba(20, 184, 166, 0.1); border: 1px solid rgba(20, 184, 166, 0.2);
}

.noise__title {
  margin: 0; font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700;
  color: var(--viz-text); letter-spacing: -0.01em;
}

.noise__subtitle {
  margin: 0; font-size: 12px; color: var(--viz-text-muted);
  display: flex; align-items: center; gap: 8px;
}

.noise__progress {
  display: inline-flex; padding: 1px 8px; border-radius: 9999px; font-size: 11px; font-weight: 600;
  color: var(--viz-text-muted); background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06); transition: all 0.4s ease;
}

.noise__progress--complete {
  color: var(--viz-accent-green); background: rgba(34, 197, 94, 0.1);
  border-color: rgba(34, 197, 94, 0.3);
}

/* ── Canvas ── */
.noise__canvas { flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; }

.noise__svg { width: 100%; height: auto; overflow: visible; }

/* ── Grid ── */
.noise__grid-line { stroke: rgba(255, 255, 255, 0.04); stroke-width: 1; }
.noise__axis-label { fill: var(--viz-text-muted); font-size: 9px; font-family: 'Inter', sans-serif; }
.noise__axis-title { fill: var(--viz-text-muted); font-size: 10px; font-family: 'Inter', sans-serif; }

/* ── Signal lines ── */
.noise__signal-line { transition: stroke-opacity 0.3s ease; }
.noise__signal-line--clean { animation: noiseCleanPulse 3s ease-in-out infinite; }

@keyframes noiseCleanPulse {
  0%, 100% { stroke-opacity: 1; }
  50% { stroke-opacity: 0.8; }
}

/* ── Legend ── */
.noise__legend-text { fill: var(--viz-text-muted); font-size: 10px; font-family: 'Inter', sans-serif; }

/* ── Metrics ── */
.noise__metric-bg { fill: var(--viz-card); stroke: var(--viz-border); stroke-width: 1; }
.noise__metric-label { fill: var(--viz-text-muted); font-size: 10px; font-family: 'Inter', sans-serif; }
.noise__metric-value { font-size: 11px; font-weight: 600; font-family: 'Inter', sans-serif; }
.noise__metric-bar { transition: width 0.5s cubic-bezier(0.22, 1, 0.36, 1), fill 0.5s ease; }
.noise__metric-snr { fill: var(--viz-text); font-size: 16px; font-weight: 700; font-family: 'Syne', sans-serif; }
.noise__status-text {
  fill: var(--viz-text); font-size: 11px; font-weight: 700; font-family: 'Syne', sans-serif;
  letter-spacing: 0.05em;
}
.noise__status-sub { fill: var(--viz-text-muted); font-size: 10px; font-family: 'Inter', sans-serif; }

/* ── Controls ── */
.noise__controls { display: flex; gap: 16px; padding: 0 4px; flex-wrap: wrap; }
.noise__control-group { display: flex; flex-direction: column; gap: 6px; flex: 1; min-width: 140px; }
.noise__control-group--modes { flex: 2; min-width: 280px; }
.noise__control-label { font-size: 11px; font-weight: 500; color: var(--viz-text-muted); }

.noise__slider {
  -webkit-appearance: none; appearance: none; width: 100%; height: 4px; border-radius: 2px;
  background: rgba(255, 255, 255, 0.08); outline: none; cursor: pointer;
}
.noise__slider::-webkit-slider-thumb {
  -webkit-appearance: none; appearance: none; width: 16px; height: 16px; border-radius: 50%;
  background: var(--viz-primary); border: 2px solid var(--viz-bg); cursor: pointer;
  transition: transform 0.2s ease;
}
.noise__slider::-webkit-slider-thumb:hover { transform: scale(1.2); }
.noise__slider::-moz-range-thumb {
  width: 16px; height: 16px; border-radius: 50%;
  background: var(--viz-primary); border: 2px solid var(--viz-bg); cursor: pointer;
}
.noise__slider--red::-webkit-slider-thumb { background: var(--viz-accent-red); }
.noise__slider--red::-moz-range-thumb { background: var(--viz-accent-red); }
.noise__slider--amber::-webkit-slider-thumb { background: var(--viz-accent-amber); }
.noise__slider--amber::-moz-range-thumb { background: var(--viz-accent-amber); }

.noise__mode-buttons { display: flex; gap: 6px; flex-wrap: wrap; }

.noise__mode-btn {
  appearance: none; border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03); color: var(--viz-text-muted);
  padding: 5px 14px; border-radius: 8px; font-size: 11px; font-weight: 500;
  font-family: 'Inter', sans-serif; cursor: pointer; transition: all 0.3s ease;
}
.noise__mode-btn:hover { background: rgba(255, 255, 255, 0.06); border-color: rgba(255, 255, 255, 0.15); }
.noise__mode-btn--active {
  color: var(--active-color, var(--viz-primary));
  background: color-mix(in srgb, var(--active-color, var(--viz-primary)) 10%, transparent);
  border-color: color-mix(in srgb, var(--active-color, var(--viz-primary)) 30%, transparent);
}
.noise__mode-btn:focus-visible { outline: 2px solid var(--viz-primary); outline-offset: 2px; }

/* ── Context ── */
.noise__context { padding: 0 4px; min-height: 20px; }
.noise__context-text {
  font-size: 11px; color: var(--viz-text-muted); font-style: italic; opacity: 0.7;
  animation: noiseContextFadeIn 0.5s ease;
}

@keyframes noiseContextFadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 0.7; transform: translateY(0); }
}

@media (max-width: 768px) {
  .noise__controls { flex-direction: column; gap: 12px; }
  .noise__title { font-size: 14px; }
}
</style>
