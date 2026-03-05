<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useAnimatedValue } from '~/composables/useAnimatedValue'
import { quantizationPruningTour } from '~/data/tours'
import type { TourStep } from '~/components/viz/GuidedTour.vue'

/* ── Props & Emits ── */
const props = defineProps<{
  activeSection: number
}>()

const emit = defineEmits<{
  exerciseComplete: []
}>()

/* ── Types ── */
interface NeuronNode {
  x: number
  y: number
  layer: number
  index: number
}

interface ConnectionLine {
  x1: number
  y1: number
  x2: number
  y2: number
  weight: number
}

/* ── Constants ── */
const SVG_W = 800
const SVG_H = 500
const LAYER_SIZES = [4, 6, 8, 6, 4, 2]
const LAYER_X_START = 100
const LAYER_X_SPACING = 120

/* ── Interaction state ── */
const interactionCount = ref(0)
const exerciseEmitted = ref(false)
const quantSteps = [4, 8, 16, 32] as const
const quantBitsRaw = ref(3) // index into quantSteps; 3 = FP32 default
const quantizationLevel = computed(() => quantSteps[quantBitsRaw.value])
const pruningPercent = ref(0)
const distillationOn = ref(false)
const challengeComplete = ref(false)

function trackInteraction() {
  interactionCount.value++
  if (interactionCount.value >= 3 && !exerciseEmitted.value) {
    exerciseEmitted.value = true
    emit('exerciseComplete')
  }
}

/* ── Neurons ── */
const neurons = computed<NeuronNode[]>(() => {
  const nodes: NeuronNode[] = []
  LAYER_SIZES.forEach((size, layerIdx) => {
    const x = LAYER_X_START + layerIdx * LAYER_X_SPACING
    const totalH = (size - 1) * 42
    const startY = (SVG_H - 60) / 2 - totalH / 2 + 30
    for (let i = 0; i < size; i++) {
      nodes.push({ x, y: startY + i * 42, layer: layerIdx, index: i })
    }
  })
  return nodes
})

/* ── Deterministic pseudo-random weights ── */
function seededWeight(l1: number, i1: number, l2: number, i2: number): number {
  const seed = l1 * 1000 + i1 * 100 + l2 * 10 + i2
  return (Math.sin(seed * 9.8) + 1) / 2 // 0..1
}

/* ── Connections ── */
const connections = computed<(ConnectionLine & { pruned: boolean })[]>(() => {
  const conns: (ConnectionLine & { pruned: boolean })[] = []
  for (let l = 0; l < LAYER_SIZES.length - 1; l++) {
    const layer1 = neurons.value.filter(n => n.layer === l)
    const layer2 = neurons.value.filter(n => n.layer === l + 1)
    for (const n1 of layer1) {
      for (const n2 of layer2) {
        const w = seededWeight(n1.layer, n1.index, n2.layer, n2.index)
        const pruned = w * 100 < pruningPercent.value
        conns.push({
          x1: n1.x, y1: n1.y,
          x2: n2.x, y2: n2.y,
          weight: w,
          pruned,
        })
      }
    }
  }
  return conns
})

/* ── Metrics ── */
const baseModelSize = 256 // MB
const baseLatency = 45 // ms
const baseAccuracy = 94.2

const quantBits = computed(() => quantizationLevel.value)

const modelSizeMB = computed(() => {
  let size = baseModelSize * (quantBits.value / 32)
  size *= (1 - pruningPercent.value / 100 * 0.6)
  if (distillationOn.value) size *= 0.35
  return Math.max(1, Math.round(size * 10) / 10)
})

const latencyMs = computed(() => {
  let lat = baseLatency * (quantBits.value / 32) ** 0.6
  lat *= (1 - pruningPercent.value / 100 * 0.4)
  if (distillationOn.value) lat *= 0.5
  return Math.max(1, Math.round(lat * 10) / 10)
})

const accuracy = computed(() => {
  let acc = baseAccuracy
  if (quantBits.value <= 8) acc -= 0.5
  if (quantBits.value <= 4) acc -= 1.8
  acc -= pruningPercent.value * 0.015
  if (distillationOn.value) acc -= 1.5
  return Math.max(50, Math.round(acc * 10) / 10)
})

const compressionRatio = computed(() => {
  return Math.round((baseModelSize / modelSizeMB.value) * 10) / 10
})

/* ── Challenge completion: <1MB size + >90% accuracy ── */
watch(
  [modelSizeMB, accuracy],
  ([size, acc]) => {
    if (size < 1 && acc > 90) {
      challengeComplete.value = true
    }
  }
)

/* ── Quantization color per neuron ── */
function neuronColor(node: NeuronNode): string {
  const pruned = seededWeight(node.layer, node.index, 0, 0) * 100 < pruningPercent.value * 0.3
  if (pruned) return 'rgba(255,255,255,0.05)'
  switch (quantBits.value) {
    case 32: return '#14b8a6'
    case 16: return '#a855f7'
    case 8: return '#f0a500'
    case 4: return '#ec4899'
    default: return '#14b8a6'
  }
}

function neuronRadius(node: NeuronNode): number {
  if (distillationOn.value && (node.layer === 2 || node.layer === 3)) {
    return node.index % 2 === 0 ? 8 : 4
  }
  return 8
}

/* ── Section info ── */
const sectionInfo = computed(() => {
  switch (props.activeSection) {
    case 0: return 'Quantization: reduce numerical precision (FP32 to INT4)'
    case 1: return 'Pruning: remove low-magnitude weights for sparsity'
    case 2: return 'Knowledge distillation: train a smaller student network'
    case 3: return 'Combine techniques for maximum compression'
    default: return 'Adjust controls to optimize the model'
  }
})

const highlightTechnique = computed(() => {
  switch (props.activeSection) {
    case 0: return 'quantization'
    case 1: return 'pruning'
    case 2: return 'distillation'
    default: return 'all'
  }
})

/* ── Slider format labels ── */
const quantLabel = computed(() => {
  switch (quantizationLevel.value) {
    case 32: return 'FP32'
    case 16: return 'FP16'
    case 8: return 'INT8'
    case 4: return 'INT4'
    default: return 'FP32'
  }
})

/* ── Progress ── */
const explorationProgress = computed(() => Math.min(interactionCount.value, 3))

/* ── Animated display values ── */
const { displayValue: animatedSize, targetValue: sizeTarget } = useAnimatedValue(baseModelSize, 0.5)
const { displayValue: animatedLatency, targetValue: latencyTarget } = useAnimatedValue(baseLatency, 0.5)
const { displayValue: animatedAccuracy, targetValue: accuracyTarget } = useAnimatedValue(baseAccuracy, 0.5)
const { displayValue: animatedCompression, targetValue: compressionTarget } = useAnimatedValue(1, 0.5)

watch(modelSizeMB, (v) => { sizeTarget.value = v }, { immediate: true })
watch(latencyMs, (v) => { latencyTarget.value = v }, { immediate: true })
watch(accuracy, (v) => { accuracyTarget.value = v }, { immediate: true })
watch(compressionRatio, (v) => { compressionTarget.value = v }, { immediate: true })

watch(() => props.activeSection, () => {
  // Auto-set controls based on section
  if (props.activeSection === 0) {
    quantBitsRaw.value = 1 // index 1 = INT8
  } else if (props.activeSection === 1) {
    pruningPercent.value = 50
  } else if (props.activeSection === 2) {
    distillationOn.value = true
  }
})

/* ── Guided Tour steps with reactive checks ── */
const tourSteps = computed<TourStep[]>(() =>
  quantizationPruningTour.map((step, i) => ({
    ...step,
    check: i === 0 ? undefined
      : i === 1 ? () => quantizationLevel.value <= 8
      : i === 2 ? () => pruningPercent.value >= 45
      : i === 3 ? () => distillationOn.value
      : i === 4 ? () => modelSizeMB.value < 1 && accuracy.value > 90
      : undefined,
  }))
)
</script>

<template>
  <div class="quant-prune">
    <!-- Guided Tour -->
    <GuidedTour
      :steps="tourSteps"
      chapter-id="ch10"
      tour-id="quantization-pruning"
      color="#14b8a6"
    />

    <!-- Header -->
    <div class="quant-prune__header">
      <span class="quant-prune__badge">Interactive</span>
      <h3 class="quant-prune__title">Model Compression</h3>
      <p class="quant-prune__subtitle">
        Adjust sliders to optimize
        <span
          class="quant-prune__progress"
          :class="{ 'quant-prune__progress--complete': explorationProgress >= 3 }"
        >
          {{ explorationProgress }}/3
        </span>
      </p>
    </div>

    <!-- Challenge -->
    <VizChallenge
      title="Compression Challenge"
      description="Achieve <1MB model size while keeping accuracy above 90%"
      color="#f0a500"
      :is-complete="challengeComplete"
      :time-limit="90"
      @reset="challengeComplete = false"
    />

    <!-- Controls -->
    <div class="quant-prune__controls">
      <!-- Quantization -->
      <div
        class="quant-prune__control"
        :class="{ 'quant-prune__control--highlight': highlightTechnique === 'quantization' }"
      >
        <label class="quant-prune__control-label" for="quant-slider">
          Quantization
          <span class="quant-prune__control-value">{{ quantLabel }}</span>
        </label>
        <input
          id="quant-slider"
          v-model.number="quantBitsRaw"
          type="range"
          min="0"
          max="3"
          step="1"
          class="quant-prune__slider"
          aria-label="Quantization bit width"
          @input="trackInteraction"
        >
        <div class="quant-prune__slider-labels">
          <span>INT4</span><span>INT8</span><span>FP16</span><span>FP32</span>
        </div>
      </div>

      <!-- Pruning -->
      <div
        class="quant-prune__control"
        :class="{ 'quant-prune__control--highlight': highlightTechnique === 'pruning' }"
      >
        <label class="quant-prune__control-label" for="prune-slider">
          Pruning
          <span class="quant-prune__control-value">{{ pruningPercent }}%</span>
        </label>
        <input
          id="prune-slider"
          v-model.number="pruningPercent"
          type="range"
          min="0"
          max="90"
          step="5"
          class="quant-prune__slider"
          aria-label="Pruning sparsity percentage"
          @input="trackInteraction"
        >
        <div class="quant-prune__slider-labels">
          <span>0%</span><span>45%</span><span>90%</span>
        </div>
      </div>

      <!-- Distillation -->
      <div
        class="quant-prune__control"
        :class="{ 'quant-prune__control--highlight': highlightTechnique === 'distillation' }"
      >
        <label class="quant-prune__control-label">
          Knowledge Distillation
          <span class="quant-prune__control-value">{{ distillationOn ? 'ON' : 'OFF' }}</span>
        </label>
        <button
          class="quant-prune__toggle"
          :class="{ 'quant-prune__toggle--active': distillationOn }"
          role="switch"
          :aria-checked="distillationOn"
          aria-label="Toggle knowledge distillation"
          @click="distillationOn = !distillationOn; trackInteraction()"
        >
          <span class="quant-prune__toggle-thumb" />
        </button>
      </div>
    </div>

    <!-- SVG Network -->
    <div class="quant-prune__canvas">
      <svg
        :viewBox="`0 0 ${SVG_W} ${SVG_H}`"
        class="quant-prune__svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="qp-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <!-- Connections -->
        <line
          v-for="(conn, i) in connections"
          :key="`conn-${i}`"
          :x1="conn.x1"
          :y1="conn.y1"
          :x2="conn.x2"
          :y2="conn.y2"
          :stroke="conn.pruned ? 'rgba(255,255,255,0.02)' : 'rgba(20,184,166,0.15)'"
          :stroke-width="conn.pruned ? 0.3 : conn.weight * 1.5 + 0.3"
          :stroke-dasharray="conn.pruned ? '2 4' : 'none'"
          class="quant-prune__connection"
        />

        <!-- Neurons -->
        <g
          v-for="(node, i) in neurons"
          :key="`neuron-${i}`"
        >
          <circle
            :cx="node.x"
            :cy="node.y"
            :r="neuronRadius(node) + 4"
            :fill="neuronColor(node)"
            :opacity="neuronColor(node).includes('0.05') ? 0 : 0.1"
            filter="url(#qp-glow)"
          />
          <circle
            :cx="node.x"
            :cy="node.y"
            :r="neuronRadius(node)"
            :fill="neuronColor(node)"
            :stroke="neuronColor(node).includes('0.05') ? 'rgba(255,255,255,0.08)' : neuronColor(node)"
            stroke-width="1"
            :opacity="neuronColor(node).includes('0.05') ? 0.3 : 0.8"
            class="quant-prune__neuron"
          />
        </g>

        <!-- Layer labels -->
        <text
          v-for="(size, i) in LAYER_SIZES"
          :key="`layer-${i}`"
          :x="LAYER_X_START + i * LAYER_X_SPACING"
          :y="SVG_H - 15"
          text-anchor="middle"
          class="quant-prune__layer-label"
        >
          {{ i === 0 ? 'Input' : i === LAYER_SIZES.length - 1 ? 'Output' : `Hidden ${i}` }}
        </text>

        <!-- Distillation arrow -->
        <g v-if="distillationOn" class="quant-prune__distill-label">
          <text :x="SVG_W / 2" :y="28" text-anchor="middle" class="quant-prune__distill-text">
            Student Network (distilled)
          </text>
          <line :x1="SVG_W / 2 - 80" y1="35" :x2="SVG_W / 2 + 80" y2="35" stroke="#22c55e" stroke-width="1" opacity="0.4" />
        </g>
      </svg>
    </div>

    <!-- Metrics bar -->
    <div class="quant-prune__metrics">
      <div class="quant-prune__metric">
        <span class="quant-prune__metric-label">Model Size</span>
        <span class="quant-prune__metric-value">{{ (Math.round(animatedSize * 10) / 10) }} MB</span>
        <div class="quant-prune__metric-bar">
          <div
            class="quant-prune__metric-fill quant-prune__metric-fill--size"
            :style="{ width: `${(animatedSize / baseModelSize) * 100}%` }"
          />
        </div>
      </div>
      <div class="quant-prune__metric">
        <span class="quant-prune__metric-label">Latency</span>
        <span class="quant-prune__metric-value">{{ (Math.round(animatedLatency * 10) / 10) }} ms</span>
        <div class="quant-prune__metric-bar">
          <div
            class="quant-prune__metric-fill quant-prune__metric-fill--latency"
            :style="{ width: `${(animatedLatency / baseLatency) * 100}%` }"
          />
        </div>
      </div>
      <div class="quant-prune__metric">
        <span class="quant-prune__metric-label">Accuracy</span>
        <span class="quant-prune__metric-value">{{ (Math.round(animatedAccuracy * 10) / 10) }}%</span>
        <div class="quant-prune__metric-bar">
          <div
            class="quant-prune__metric-fill quant-prune__metric-fill--accuracy"
            :style="{ width: `${animatedAccuracy}%` }"
          />
        </div>
      </div>
      <div class="quant-prune__metric">
        <span class="quant-prune__metric-label">Compression</span>
        <span class="quant-prune__metric-value quant-prune__metric-value--accent">{{ (Math.round(animatedCompression * 10) / 10) }}x</span>
      </div>
    </div>

    <!-- Context -->
    <div class="quant-prune__context">
      <span class="quant-prune__context-text">{{ sectionInfo }}</span>
    </div>
  </div>
</template>

<style scoped>
.quant-prune {
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

.quant-prune__header {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 4px;
}

.quant-prune__badge {
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

.quant-prune__title {
  margin: 0;
  font-family: 'Syne', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: var(--viz-text);
}

.quant-prune__subtitle {
  margin: 0;
  font-size: 12px;
  color: var(--viz-text-muted);
  display: flex;
  align-items: center;
  gap: 8px;
}

.quant-prune__progress {
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

.quant-prune__progress--complete {
  color: var(--viz-accent-green);
  background: rgba(34, 197, 94, 0.1);
  border-color: rgba(34, 197, 94, 0.3);
}

/* ── Controls ── */
.quant-prune__controls {
  display: flex;
  gap: 12px;
  padding: 0 4px;
  flex-wrap: wrap;
}

.quant-prune__control {
  flex: 1;
  min-width: 140px;
  background: var(--viz-card);
  border: 1px solid var(--viz-border);
  border-radius: 10px;
  padding: 10px 12px;
  transition: border-color 0.4s ease, background 0.4s ease;
}

.quant-prune__control--highlight {
  border-color: rgba(20, 184, 166, 0.3);
  background: rgba(20, 184, 166, 0.05);
}

.quant-prune__control-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  font-weight: 600;
  color: var(--viz-text);
  margin-bottom: 8px;
}

.quant-prune__control-value {
  font-size: 11px;
  font-weight: 700;
  color: var(--viz-primary);
  font-family: 'Syne', sans-serif;
}

.quant-prune__slider {
  width: 100%;
  height: 4px;
  appearance: none;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 2px;
  outline: none;
  cursor: pointer;
}

.quant-prune__slider::-webkit-slider-thumb {
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--viz-primary);
  border: 2px solid #1a1f3a;
  cursor: pointer;
  box-shadow: 0 0 8px rgba(20, 184, 166, 0.4);
}

.quant-prune__slider::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--viz-primary);
  border: 2px solid #1a1f3a;
  cursor: pointer;
}

.quant-prune__slider:focus-visible {
  outline: 2px solid var(--viz-primary);
  outline-offset: 2px;
}

.quant-prune__slider-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
  font-size: 8px;
  color: var(--viz-text-muted);
}

/* ── Toggle ── */
.quant-prune__toggle {
  appearance: none;
  border: none;
  width: 44px;
  height: 24px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.08);
  cursor: pointer;
  position: relative;
  transition: background 0.3s ease;
  padding: 0;
}

.quant-prune__toggle--active {
  background: rgba(34, 197, 94, 0.3);
}

.quant-prune__toggle-thumb {
  display: block;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--viz-text-muted);
  position: absolute;
  top: 3px;
  left: 3px;
  transition: transform 0.3s ease, background 0.3s ease;
}

.quant-prune__toggle--active .quant-prune__toggle-thumb {
  transform: translateX(20px);
  background: #22c55e;
}

.quant-prune__toggle:focus-visible {
  outline: 2px solid var(--viz-primary);
  outline-offset: 2px;
}

/* ── Canvas ── */
.quant-prune__canvas {
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quant-prune__svg {
  width: 100%;
  height: auto;
  overflow: visible;
}

.quant-prune__connection {
  transition: stroke 0.4s ease, stroke-width 0.4s ease, stroke-dasharray 0.4s ease;
}

.quant-prune__neuron {
  transition: r 0.4s ease, fill 0.4s ease, opacity 0.4s ease;
}

.quant-prune__layer-label {
  fill: var(--viz-text-muted);
  font-size: 9px;
  font-family: 'Inter', sans-serif;
}

.quant-prune__distill-label {
  animation: distillFadeIn 0.5s ease;
}

.quant-prune__distill-text {
  fill: #22c55e;
  font-size: 11px;
  font-family: 'Syne', sans-serif;
  font-weight: 600;
  opacity: 0.7;
}

@keyframes distillFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* ── Metrics ── */
.quant-prune__metrics {
  display: flex;
  gap: 12px;
  padding: 0 4px;
  flex-wrap: wrap;
}

.quant-prune__metric {
  flex: 1;
  min-width: 100px;
  background: var(--viz-card);
  border: 1px solid var(--viz-border);
  border-radius: 8px;
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.quant-prune__metric-label {
  font-size: 9px;
  font-weight: 500;
  color: var(--viz-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.quant-prune__metric-value {
  font-size: 14px;
  font-weight: 700;
  color: var(--viz-text);
  font-family: 'Syne', sans-serif;
}

.quant-prune__metric-value--accent {
  color: var(--viz-accent-green);
}

.quant-prune__metric-bar {
  height: 3px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 2px;
  overflow: hidden;
}

.quant-prune__metric-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.5s ease;
}

.quant-prune__metric-fill--size {
  background: #f0a500;
}

.quant-prune__metric-fill--latency {
  background: #ec4899;
}

.quant-prune__metric-fill--accuracy {
  background: #22c55e;
}

/* ── Context ── */
.quant-prune__context {
  padding: 0 4px;
  min-height: 20px;
}

.quant-prune__context-text {
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
  .quant-prune__title { font-size: 14px; }
  .quant-prune__controls { flex-direction: column; }
  .quant-prune__metrics { flex-direction: column; }
}
</style>
