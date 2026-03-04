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
interface Classification {
  label: string
  confidence: number
  color: string
}

/* ── State ── */
const epsilon = ref(0)
const noiseType = ref<'fgsm' | 'pgd' | 'random'>('fgsm')
const interactionCount = ref(0)
const exerciseEmitted = ref(false)
const selectedPixel = ref<{ x: number; y: number } | null>(null)

/* ── Noise type options ── */
const noiseTypes = [
  { value: 'fgsm' as const, label: 'FGSM', desc: 'Fast Gradient Sign Method' },
  { value: 'pgd' as const, label: 'PGD', desc: 'Projected Gradient Descent' },
  { value: 'random' as const, label: 'Random', desc: 'Uniform Random Noise' },
]

/* ── Seeded pseudo-random for deterministic pixel grid ── */
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

/* ── Original image pixels (8x8 simplified representation) ── */
const gridSize = 8
const originalPixels = computed(() => {
  const pixels: number[][] = []
  for (let y = 0; y < gridSize; y++) {
    const row: number[] = []
    for (let x = 0; x < gridSize; x++) {
      // Create a recognizable pattern (cat-like silhouette)
      const cx = x - 3.5
      const cy = y - 3.5
      const dist = Math.sqrt(cx * cx + cy * cy)
      // Ears
      const isEar = (x === 1 && y === 1) || (x === 6 && y === 1)
      // Body
      const isBody = dist < 3.2
      // Eyes
      const isEye = (x === 2 && y === 3) || (x === 5 && y === 3)
      if (isEye) row.push(220)
      else if (isEar) row.push(160)
      else if (isBody) row.push(100 + Math.floor(seededRandom(y * gridSize + x) * 40))
      else row.push(20 + Math.floor(seededRandom(y * gridSize + x + 100) * 20))
    }
    pixels.push(row)
  }
  return pixels
})

/* ── Perturbation generation ── */
const perturbedPixels = computed(() => {
  const eps = epsilon.value / 100
  return originalPixels.value.map((row, y) =>
    row.map((pixel, x) => {
      if (eps === 0) return pixel
      let noise = 0
      const seed = y * gridSize + x
      switch (noiseType.value) {
        case 'fgsm':
          // Gradient-like directional noise
          noise = (seededRandom(seed * 3 + 7) > 0.5 ? 1 : -1) * eps * 255
          break
        case 'pgd':
          // Iterative stronger noise
          noise = (seededRandom(seed * 5 + 13) * 2 - 1) * eps * 255 * 1.3
          break
        case 'random':
          // Uniform random
          noise = (seededRandom(seed * 7 + 19) * 2 - 1) * eps * 255 * 0.8
          break
      }
      return Math.max(0, Math.min(255, Math.round(pixel + noise)))
    })
  )
})

/* ── Classification results ── */
const originalClassifications = computed<Classification[]>(() => [
  { label: 'Cat', confidence: 0.94, color: '#14b8a6' },
  { label: 'Dog', confidence: 0.03, color: '#a855f7' },
  { label: 'Bird', confidence: 0.02, color: '#22c55e' },
  { label: 'Fish', confidence: 0.01, color: '#f0a500' },
])

const perturbedClassifications = computed<Classification[]>(() => {
  const eps = epsilon.value / 100
  const typeMultiplier = noiseType.value === 'pgd' ? 1.4 : noiseType.value === 'fgsm' ? 1.0 : 0.6

  const catConf = Math.max(0.02, 0.94 - eps * 3.5 * typeMultiplier)
  const dogConf = Math.min(0.7, 0.03 + eps * 2.8 * typeMultiplier)
  const birdConf = Math.min(0.3, 0.02 + eps * 0.5 * typeMultiplier)
  const fishConf = Math.max(0.01, 1 - catConf - dogConf - birdConf)

  const total = catConf + dogConf + birdConf + fishConf
  return [
    { label: 'Cat', confidence: catConf / total, color: '#14b8a6' },
    { label: 'Dog', confidence: dogConf / total, color: '#a855f7' },
    { label: 'Bird', confidence: birdConf / total, color: '#22c55e' },
    { label: 'Fish', confidence: fishConf / total, color: '#f0a500' },
  ].sort((a, b) => b.confidence - a.confidence)
})

const isAdversarialSuccess = computed(() => {
  return perturbedClassifications.value[0].label !== 'Cat'
})

/* ── Pixel color helper ── */
function pixelColor(value: number): string {
  const v = Math.round(value)
  return `rgb(${v}, ${v + 10}, ${v + 30})`
}

/* ── Difference overlay ── */
function diffColor(orig: number, pert: number): string {
  const diff = Math.abs(pert - orig)
  const intensity = Math.min(255, diff * 5)
  return diff > 2 ? `rgba(255, ${100 - intensity / 3}, ${50}, ${intensity / 255})` : 'transparent'
}

/* ── Interaction tracking ── */
function trackInteraction() {
  interactionCount.value++
  if (interactionCount.value >= 3 && !exerciseEmitted.value) {
    exerciseEmitted.value = true
    emit('exerciseComplete')
  }
}

function handleEpsilonChange(event: Event) {
  const target = event.target as HTMLInputElement
  epsilon.value = parseFloat(target.value)
  trackInteraction()
}

function handleNoiseTypeChange(type: 'fgsm' | 'pgd' | 'random') {
  noiseType.value = type
  trackInteraction()
}

function handlePixelClick(x: number, y: number) {
  selectedPixel.value = selectedPixel.value?.x === x && selectedPixel.value?.y === y
    ? null
    : { x, y }
  trackInteraction()
}

/* ── Progress ── */
const explorationProgress = computed(() => Math.min(interactionCount.value, 3))

/* ── Section-based highlighting ── */
const showAttackSuccess = computed(() => props.activeSection >= 2)

/* ── Reset on section change ── */
watch(
  () => props.activeSection,
  () => {
    selectedPixel.value = null
  }
)
</script>

<template>
  <div class="adversarial" role="region" aria-label="Adversarial Attack Playground">
    <!-- Header -->
    <div class="adversarial__header">
      <span class="adversarial__badge">Interactive</span>
      <h3 class="adversarial__title">Adversarial Playground</h3>
      <p class="adversarial__subtitle">
        Adjust perturbations to fool the classifier
        <span
          class="adversarial__progress"
          :class="{ 'adversarial__progress--complete': explorationProgress >= 3 }"
        >
          {{ explorationProgress }}/3
        </span>
      </p>
    </div>

    <!-- Main Visualization -->
    <div class="adversarial__canvas">
      <svg
        viewBox="0 0 800 420"
        class="adversarial__svg"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Adversarial attack visualization showing original and perturbed image classifications"
      >
        <defs>
          <filter id="adv-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="adv-glow-strong" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id="adv-danger-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#ff6b6b" stop-opacity="0.2" />
            <stop offset="100%" stop-color="#ff6b6b" stop-opacity="0" />
          </linearGradient>
        </defs>

        <!-- Original Image Section -->
        <g transform="translate(30, 30)">
          <text x="80" y="0" text-anchor="middle" class="adversarial__section-label">
            Original Image
          </text>

          <!-- Pixel grid - original -->
          <g transform="translate(0, 15)">
            <template v-for="(row, y) in originalPixels" :key="`orig-row-${y}`">
              <rect
                v-for="(pixel, x) in row"
                :key="`orig-${y}-${x}`"
                :x="x * 20"
                :y="y * 20"
                width="19"
                height="19"
                rx="2"
                :fill="pixelColor(pixel)"
                class="adversarial__pixel"
                :class="{ 'adversarial__pixel--selected': selectedPixel?.x === x && selectedPixel?.y === y }"
                :aria-label="`Original pixel at ${x},${y}: intensity ${pixel}`"
                role="button"
                :tabindex="0"
                @click="handlePixelClick(x, y)"
                @keydown.enter="handlePixelClick(x, y)"
                @keydown.space.prevent="handlePixelClick(x, y)"
              />
            </template>
          </g>

          <!-- Classification bars - original -->
          <g transform="translate(0, 195)">
            <g
              v-for="(cls, i) in originalClassifications"
              :key="`orig-cls-${i}`"
              :transform="`translate(0, ${i * 32})`"
            >
              <text x="0" y="12" class="adversarial__bar-label">{{ cls.label }}</text>
              <rect x="42" y="2" width="110" height="14" rx="3" class="adversarial__bar-bg" />
              <rect
                x="42"
                y="2"
                :width="110 * cls.confidence"
                height="14"
                rx="3"
                :fill="cls.color"
                class="adversarial__bar-fill"
              />
              <text :x="42 + 110 * cls.confidence + 6" y="13" class="adversarial__bar-value">
                {{ (cls.confidence * 100).toFixed(1) }}%
              </text>
            </g>
          </g>
        </g>

        <!-- Perturbation Arrow -->
        <g transform="translate(220, 100)">
          <text x="90" y="0" text-anchor="middle" class="adversarial__arrow-label">
            + Perturbation
          </text>
          <line x1="10" y1="30" x2="160" y2="30" class="adversarial__arrow-line" />
          <polygon points="160,24 175,30 160,36" :fill="epsilon > 0 ? '#ff6b6b' : 'rgba(255,255,255,0.15)'" class="adversarial__arrow-head" />

          <!-- Epsilon indicator -->
          <text x="90" y="55" text-anchor="middle" class="adversarial__epsilon-label">
            &epsilon; = {{ (epsilon / 100).toFixed(2) }}
          </text>

          <!-- Noise visualization dots -->
          <g transform="translate(30, 65)" v-if="epsilon > 0">
            <circle
              v-for="i in 20"
              :key="`noise-${i}`"
              :cx="seededRandom(i * 31) * 120"
              :cy="seededRandom(i * 47 + 3) * 30"
              :r="1 + epsilon / 50"
              fill="#ff6b6b"
              :opacity="0.3 + seededRandom(i * 13) * 0.5"
              class="adversarial__noise-dot"
            />
          </g>
        </g>

        <!-- Perturbed Image Section -->
        <g transform="translate(430, 30)">
          <text x="80" y="0" text-anchor="middle" class="adversarial__section-label">
            Perturbed Image
          </text>

          <!-- Pixel grid - perturbed -->
          <g transform="translate(0, 15)">
            <template v-for="(row, y) in perturbedPixels" :key="`pert-row-${y}`">
              <rect
                v-for="(pixel, x) in row"
                :key="`pert-${y}-${x}`"
                :x="x * 20"
                :y="y * 20"
                width="19"
                height="19"
                rx="2"
                :fill="pixelColor(pixel)"
                class="adversarial__pixel"
                :aria-label="`Perturbed pixel at ${x},${y}: intensity ${pixel}`"
                role="button"
                :tabindex="0"
                @click="handlePixelClick(x, y)"
                @keydown.enter="handlePixelClick(x, y)"
                @keydown.space.prevent="handlePixelClick(x, y)"
              />
            </template>
          </g>

          <!-- Difference overlay -->
          <g transform="translate(0, 15)" v-if="epsilon > 0">
            <template v-for="(row, y) in originalPixels" :key="`diff-row-${y}`">
              <rect
                v-for="(pixel, x) in row"
                :key="`diff-${y}-${x}`"
                :x="x * 20"
                :y="y * 20"
                width="19"
                height="19"
                rx="2"
                :fill="diffColor(pixel, perturbedPixels[y][x])"
                pointer-events="none"
              />
            </template>
          </g>

          <!-- Classification bars - perturbed -->
          <g transform="translate(0, 195)">
            <g
              v-for="(cls, i) in perturbedClassifications"
              :key="`pert-cls-${i}`"
              :transform="`translate(0, ${i * 32})`"
            >
              <text x="0" y="12" class="adversarial__bar-label">{{ cls.label }}</text>
              <rect x="42" y="2" width="110" height="14" rx="3" class="adversarial__bar-bg" />
              <rect
                x="42"
                y="2"
                :width="110 * cls.confidence"
                height="14"
                rx="3"
                :fill="cls.color"
                class="adversarial__bar-fill"
              />
              <text :x="42 + 110 * cls.confidence + 6" y="13" class="adversarial__bar-value">
                {{ (cls.confidence * 100).toFixed(1) }}%
              </text>
            </g>
          </g>
        </g>

        <!-- Status indicator -->
        <g transform="translate(620, 30)">
          <rect
            x="0"
            y="0"
            width="150"
            height="50"
            rx="10"
            :fill="isAdversarialSuccess ? 'rgba(255, 107, 107, 0.1)' : 'rgba(34, 197, 94, 0.1)'"
            :stroke="isAdversarialSuccess ? 'rgba(255, 107, 107, 0.3)' : 'rgba(34, 197, 94, 0.3)'"
            stroke-width="1"
            class="adversarial__status-bg"
          />
          <text x="75" y="22" text-anchor="middle" class="adversarial__status-label">
            {{ isAdversarialSuccess ? 'ATTACK SUCCESS' : 'CORRECTLY CLASSIFIED' }}
          </text>
          <text x="75" y="40" text-anchor="middle" class="adversarial__status-sub">
            {{ isAdversarialSuccess ? 'Model fooled!' : 'Model robust' }}
          </text>
        </g>

        <!-- Pixel detail panel -->
        <g v-if="selectedPixel" transform="translate(620, 100)">
          <rect x="0" y="0" width="150" height="110" rx="10" class="adversarial__detail-bg" />
          <text x="75" y="22" text-anchor="middle" class="adversarial__detail-title">
            Pixel ({{ selectedPixel.x }}, {{ selectedPixel.y }})
          </text>
          <text x="12" y="45" class="adversarial__detail-text">
            Original: {{ originalPixels[selectedPixel.y][selectedPixel.x] }}
          </text>
          <text x="12" y="65" class="adversarial__detail-text">
            Perturbed: {{ perturbedPixels[selectedPixel.y][selectedPixel.x] }}
          </text>
          <text x="12" y="85" class="adversarial__detail-text" :fill="Math.abs(perturbedPixels[selectedPixel.y][selectedPixel.x] - originalPixels[selectedPixel.y][selectedPixel.x]) > 10 ? '#ff6b6b' : '#22c55e'">
            Delta: {{ perturbedPixels[selectedPixel.y][selectedPixel.x] - originalPixels[selectedPixel.y][selectedPixel.x] }}
          </text>
        </g>

        <!-- Attack method info -->
        <g transform="translate(620, 230)">
          <rect x="0" y="0" width="150" height="90" rx="10" class="adversarial__detail-bg" />
          <text x="75" y="22" text-anchor="middle" class="adversarial__detail-title">
            {{ noiseTypes.find(n => n.value === noiseType)?.label }}
          </text>
          <text x="12" y="45" class="adversarial__detail-desc">
            {{ noiseTypes.find(n => n.value === noiseType)?.desc }}
          </text>
          <text x="12" y="70" class="adversarial__detail-desc">
            Strength: {{ noiseType === 'pgd' ? 'High' : noiseType === 'fgsm' ? 'Medium' : 'Low' }}
          </text>
        </g>
      </svg>
    </div>

    <!-- Controls -->
    <div class="adversarial__controls">
      <!-- Epsilon Slider -->
      <div class="adversarial__control-group">
        <label class="adversarial__control-label" for="adv-epsilon">
          Perturbation Strength (&epsilon;): {{ (epsilon / 100).toFixed(2) }}
        </label>
        <input
          id="adv-epsilon"
          type="range"
          min="0"
          max="100"
          step="1"
          :value="epsilon"
          class="adversarial__slider"
          aria-label="FGSM epsilon perturbation strength"
          @input="handleEpsilonChange"
        />
      </div>

      <!-- Noise Type Selector -->
      <div class="adversarial__control-group">
        <span class="adversarial__control-label">Attack Method:</span>
        <div class="adversarial__noise-buttons" role="radiogroup" aria-label="Noise type selection">
          <button
            v-for="nt in noiseTypes"
            :key="nt.value"
            class="adversarial__noise-btn"
            :class="{ 'adversarial__noise-btn--active': noiseType === nt.value }"
            role="radio"
            :aria-checked="noiseType === nt.value"
            :aria-label="`Attack method: ${nt.label} - ${nt.desc}`"
            @click="handleNoiseTypeChange(nt.value)"
          >
            {{ nt.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Context -->
    <div class="adversarial__context">
      <span v-if="activeSection === 0" class="adversarial__context-text">
        Adversarial examples: small perturbations, big consequences
      </span>
      <span v-else-if="activeSection === 1" class="adversarial__context-text">
        FGSM computes the gradient of the loss with respect to input pixels
      </span>
      <span v-else-if="activeSection === 2" class="adversarial__context-text">
        Even tiny, imperceptible changes can completely flip predictions
      </span>
      <span v-else class="adversarial__context-text">
        Robustness requires defending against adversarial manipulation
      </span>
    </div>
  </div>
</template>

<style scoped>
.adversarial {
  --viz-bg: #05070f;
  --viz-surface: #0a0e1a;
  --viz-card: #0f1325;
  --viz-border: rgba(255, 255, 255, 0.06);
  --viz-primary: #14b8a6;
  --viz-text: #e2e8f0;
  --viz-text-muted: rgba(255, 255, 255, 0.45);
  --viz-accent-green: #22c55e;
  --viz-accent-red: #ff6b6b;

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
.adversarial__header {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 4px;
}

.adversarial__badge {
  display: inline-flex;
  align-self: flex-start;
  padding: 3px 10px;
  border-radius: 9999px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--viz-accent-red);
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid rgba(255, 107, 107, 0.2);
}

.adversarial__title {
  margin: 0;
  font-family: 'Syne', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: var(--viz-text);
  letter-spacing: -0.01em;
}

.adversarial__subtitle {
  margin: 0;
  font-size: 12px;
  color: var(--viz-text-muted);
  display: flex;
  align-items: center;
  gap: 8px;
}

.adversarial__progress {
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

.adversarial__progress--complete {
  color: var(--viz-accent-green);
  background: rgba(34, 197, 94, 0.1);
  border-color: rgba(34, 197, 94, 0.3);
}

/* ── Canvas ── */
.adversarial__canvas {
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.adversarial__svg {
  width: 100%;
  height: auto;
  overflow: visible;
}

/* ── Section labels ── */
.adversarial__section-label {
  fill: var(--viz-text);
  font-size: 13px;
  font-family: 'Syne', sans-serif;
  font-weight: 600;
}

/* ── Pixel grid ── */
.adversarial__pixel {
  cursor: pointer;
  transition: opacity 0.2s ease, stroke 0.2s ease;
  stroke: transparent;
  stroke-width: 1;
}

.adversarial__pixel:hover {
  opacity: 0.85;
  stroke: var(--viz-primary);
}

.adversarial__pixel--selected {
  stroke: #ffffff;
  stroke-width: 2;
}

/* ── Classification bars ── */
.adversarial__bar-label {
  fill: var(--viz-text-muted);
  font-size: 10px;
  font-family: 'Inter', sans-serif;
}

.adversarial__bar-bg {
  fill: rgba(255, 255, 255, 0.04);
}

.adversarial__bar-fill {
  transition: width 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

.adversarial__bar-value {
  fill: var(--viz-text-muted);
  font-size: 9px;
  font-family: 'Inter', sans-serif;
}

/* ── Arrow ── */
.adversarial__arrow-label {
  fill: var(--viz-text-muted);
  font-size: 11px;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
}

.adversarial__arrow-line {
  stroke: rgba(255, 255, 255, 0.15);
  stroke-width: 2;
  stroke-dasharray: 6 4;
  animation: advDashFlow 1.2s linear infinite;
}

.adversarial__arrow-head {
  transition: fill 0.4s ease;
}

.adversarial__epsilon-label {
  fill: var(--viz-accent-red);
  font-size: 12px;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
}

.adversarial__noise-dot {
  animation: advNoisePulse 2s ease-in-out infinite alternate;
}

.adversarial__noise-dot:nth-child(odd) {
  animation-delay: -0.5s;
}

@keyframes advDashFlow {
  to { stroke-dashoffset: -20; }
}

@keyframes advNoisePulse {
  0% { opacity: 0.2; }
  100% { opacity: 0.7; }
}

/* ── Status ── */
.adversarial__status-bg {
  transition: fill 0.4s ease, stroke 0.4s ease;
}

.adversarial__status-label {
  fill: var(--viz-text);
  font-size: 10px;
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.adversarial__status-sub {
  fill: var(--viz-text-muted);
  font-size: 10px;
  font-family: 'Inter', sans-serif;
}

/* ── Detail panels ── */
.adversarial__detail-bg {
  fill: var(--viz-card);
  stroke: var(--viz-border);
  stroke-width: 1;
}

.adversarial__detail-title {
  fill: var(--viz-text);
  font-size: 11px;
  font-family: 'Syne', sans-serif;
  font-weight: 600;
}

.adversarial__detail-text {
  fill: var(--viz-text-muted);
  font-size: 10px;
  font-family: 'Inter', sans-serif;
}

.adversarial__detail-desc {
  fill: var(--viz-text-muted);
  font-size: 10px;
  font-family: 'Inter', sans-serif;
}

/* ── Controls ── */
.adversarial__controls {
  display: flex;
  gap: 24px;
  padding: 0 4px;
  flex-wrap: wrap;
}

.adversarial__control-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  min-width: 160px;
}

.adversarial__control-label {
  font-size: 11px;
  font-weight: 500;
  color: var(--viz-text-muted);
}

.adversarial__slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.08);
  outline: none;
  cursor: pointer;
}

.adversarial__slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--viz-accent-red);
  border: 2px solid var(--viz-bg);
  cursor: pointer;
  transition: transform 0.2s ease;
}

.adversarial__slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.adversarial__slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--viz-accent-red);
  border: 2px solid var(--viz-bg);
  cursor: pointer;
}

.adversarial__noise-buttons {
  display: flex;
  gap: 6px;
}

.adversarial__noise-btn {
  appearance: none;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  color: var(--viz-text-muted);
  padding: 5px 14px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 500;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;
}

.adversarial__noise-btn:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.15);
}

.adversarial__noise-btn--active {
  color: var(--viz-accent-red);
  background: rgba(255, 107, 107, 0.1);
  border-color: rgba(255, 107, 107, 0.3);
}

.adversarial__noise-btn:focus-visible {
  outline: 2px solid var(--viz-primary);
  outline-offset: 2px;
}

/* ── Context ── */
.adversarial__context {
  padding: 0 4px;
  min-height: 20px;
}

.adversarial__context-text {
  font-size: 11px;
  color: var(--viz-text-muted);
  font-style: italic;
  opacity: 0.7;
  animation: advContextFadeIn 0.5s ease;
}

@keyframes advContextFadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 0.7; transform: translateY(0); }
}

@media (max-width: 768px) {
  .adversarial__controls {
    flex-direction: column;
    gap: 12px;
  }
  .adversarial__title { font-size: 14px; }
}
</style>
