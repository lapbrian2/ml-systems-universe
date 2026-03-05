<script setup lang="ts">
import { ref, computed, watch } from 'vue'

/* ── Props & Emits ── */
const props = withDefaults(defineProps<{
  activeSection: number
  scrollProgress?: number
  sectionProgress?: number
}>(), {
  scrollProgress: 0,
  sectionProgress: 0,
})

const emit = defineEmits<{
  exerciseComplete: []
}>()

/* ── Types ── */
interface ModelPoint {
  id: string
  name: string
  accuracy: number    // 0-100
  efficiency: number  // 0-100 (higher = more efficient, lower latency/params)
  params: string
  latency: string
  category: 'vision' | 'nlp'
  isPareto: boolean
  description: string
  color: string
}

interface TooltipState {
  visible: boolean
  x: number
  y: number
  model: ModelPoint | null
}

/* ── Constants ── */
const SVG_W = 800
const SVG_H = 500
const PLOT_X = 80
const PLOT_Y = 30
const PLOT_W = 680
const PLOT_H = 400

/* ── Models data ── */
const models: ModelPoint[] = [
  {
    id: 'mobilenet-v3',
    name: 'MobileNet V3',
    accuracy: 62,
    efficiency: 92,
    params: '5.4M',
    latency: '3ms',
    category: 'vision',
    isPareto: true,
    description: 'Lightweight architecture optimized for mobile devices using depthwise separable convolutions and squeeze-excitation blocks.',
    color: '#22c55e',
  },
  {
    id: 'efficientnet-b0',
    name: 'EfficientNet B0',
    accuracy: 71,
    efficiency: 82,
    params: '5.3M',
    latency: '8ms',
    category: 'vision',
    isPareto: true,
    description: 'Compound scaling method that uniformly scales depth, width, and resolution. Optimal baseline for efficiency.',
    color: '#14b8a6',
  },
  {
    id: 'efficientnet-b4',
    name: 'EfficientNet B4',
    accuracy: 83,
    efficiency: 55,
    params: '19M',
    latency: '32ms',
    category: 'vision',
    isPareto: true,
    description: 'Scaled-up version with higher accuracy. Demonstrates the compound scaling strategy at larger compute budgets.',
    color: '#14b8a6',
  },
  {
    id: 'resnet-50',
    name: 'ResNet-50',
    accuracy: 76,
    efficiency: 58,
    params: '25.6M',
    latency: '18ms',
    category: 'vision',
    isPareto: false,
    description: 'Classic deep residual network. Skip connections enable training very deep networks. Strong baseline, but not Pareto-optimal.',
    color: '#f0a500',
  },
  {
    id: 'resnet-152',
    name: 'ResNet-152',
    accuracy: 80,
    efficiency: 35,
    params: '60.2M',
    latency: '45ms',
    category: 'vision',
    isPareto: false,
    description: 'Deeper variant with diminishing returns on accuracy vs compute. Illustrates the cost of brute-force scaling.',
    color: '#f0a500',
  },
  {
    id: 'vit-large',
    name: 'ViT-Large',
    accuracy: 88,
    efficiency: 22,
    params: '307M',
    latency: '85ms',
    category: 'vision',
    isPareto: true,
    description: 'Vision Transformer with global attention. Highest accuracy but requires substantial compute and data.',
    color: '#ec4899',
  },
  {
    id: 'distilbert',
    name: 'DistilBERT',
    accuracy: 67,
    efficiency: 88,
    params: '66M',
    latency: '6ms',
    category: 'nlp',
    isPareto: true,
    description: 'Knowledge-distilled BERT retaining 97% performance with 40% fewer parameters and 60% faster inference.',
    color: '#22c55e',
  },
  {
    id: 'tinybert',
    name: 'TinyBERT',
    accuracy: 60,
    efficiency: 94,
    params: '14.5M',
    latency: '2ms',
    category: 'nlp',
    isPareto: true,
    description: 'Aggressive distillation achieving 7.5x smaller and 9.4x faster than BERT with task-specific distillation.',
    color: '#22c55e',
  },
  {
    id: 'bert-base',
    name: 'BERT Base',
    accuracy: 73,
    efficiency: 50,
    params: '110M',
    latency: '22ms',
    category: 'nlp',
    isPareto: false,
    description: 'Bidirectional encoder baseline. Strong NLU performance but heavy for production deployment.',
    color: '#f0a500',
  },
  {
    id: 'bert-large',
    name: 'BERT Large',
    accuracy: 78,
    efficiency: 30,
    params: '340M',
    latency: '55ms',
    category: 'nlp',
    isPareto: false,
    description: 'Larger BERT with marginal accuracy gains. Below the Pareto frontier — dominated by more efficient alternatives.',
    color: '#f0a500',
  },
]

/* ── Scroll-driven animation state ── */
// Number of models visible based on scroll progress
const scrollVisibleCount = computed(() => {
  if (!props.scrollProgress) return models.length // show all by default
  return Math.ceil(props.scrollProgress * models.length)
})

// Pareto frontier draw progress (0 to 1) — used as SVG stroke-dashoffset
const scrollParetoProgress = computed(() => {
  if (!props.scrollProgress) return 1
  // Pareto line should be fully drawn by 80% scroll
  return Math.min(props.scrollProgress / 0.8, 1)
})

// Which models are visible based on scroll
function isScrollVisible(index: number): boolean {
  return index < scrollVisibleCount.value
}

// Label fade-in opacity based on scroll proximity
function scrollLabelOpacity(index: number): number {
  if (!props.scrollProgress) return 0.7
  const visible = scrollVisibleCount.value
  if (index >= visible) return 0
  // Recently appeared models have lower opacity
  const diff = visible - index
  return Math.min(diff / 2, 1) * 0.7 + 0.3
}

/* ── Interaction state ── */
const clickedModels = ref<Set<string>>(new Set())
const selectedModel = ref<string | null>(null)
const exerciseEmitted = ref(false)
const tooltip = ref<TooltipState>({ visible: false, x: 0, y: 0, model: null })

/* ── Coordinate helpers ── */
function toSvgX(efficiency: number): number {
  return PLOT_X + (efficiency / 100) * PLOT_W
}

function toSvgY(accuracy: number): number {
  return PLOT_Y + PLOT_H - (accuracy / 100) * PLOT_H
}

/* ── Pareto frontier line ── */
const paretoLine = computed(() => {
  const pareto = models
    .filter(m => m.isPareto)
    .sort((a, b) => a.efficiency - b.efficiency)
  if (pareto.length < 2) return ''
  return pareto.map((m, i) =>
    `${i === 0 ? 'M' : 'L'} ${toSvgX(m.efficiency)} ${toSvgY(m.accuracy)}`
  ).join(' ')
})

/* ── Section-based highlighting ── */
const highlightCategory = computed<string | null>(() => {
  switch (props.activeSection) {
    case 0: return null         // Show all
    case 1: return 'vision'     // Vision models
    case 2: return 'nlp'        // NLP models
    case 3: return null         // Pareto focus
    default: return null
  }
})

const showParetoHighlight = computed(() => props.activeSection === 3)

function modelOpacity(model: ModelPoint, index: number): number {
  if (selectedModel.value === model.id) return 1
  // Scroll-driven: models appear one by one
  if (props.scrollProgress > 0) {
    if (!isScrollVisible(index)) return 0
    return scrollLabelOpacity(index)
  }
  if (highlightCategory.value === null) return 0.85
  return model.category === highlightCategory.value ? 1 : 0.2
}

/* ── Click handlers ── */
function handleModelClick(model: ModelPoint, event: MouseEvent) {
  selectedModel.value = model.id
  clickedModels.value = new Set([...clickedModels.value, model.id])

  const svg = (event.currentTarget as SVGElement).closest('svg')
  if (svg) {
    const rect = svg.getBoundingClientRect()
    tooltip.value = {
      visible: true,
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      model,
    }
  }

  if (clickedModels.value.size >= 3 && !exerciseEmitted.value) {
    exerciseEmitted.value = true
    emit('exerciseComplete')
  }
}

function closeTooltip() {
  tooltip.value.visible = false
  selectedModel.value = null
}

/* ── Progress ── */
const explorationProgress = computed(() => Math.min(clickedModels.value.size, 3))

/* ── Section info ── */
const sectionInfo = computed(() => {
  switch (props.activeSection) {
    case 0: return 'Accuracy vs Efficiency trade-off across model families'
    case 1: return 'Vision models: from MobileNet to ViT'
    case 2: return 'NLP models: BERT compression and distillation'
    case 3: return 'Pareto frontier: no model above this line is dominated'
    default: return 'Explore model architectures on the efficiency frontier'
  }
})

watch(() => props.activeSection, () => {
  tooltip.value.visible = false
  selectedModel.value = null
})
</script>

<template>
  <div class="eff-frontier" @click.self="closeTooltip">
    <!-- Header -->
    <div class="eff-frontier__header">
      <span class="eff-frontier__badge">Interactive</span>
      <h3 class="eff-frontier__title">Efficiency Frontier</h3>
      <p class="eff-frontier__subtitle">
        Click models to compare
        <span
          class="eff-frontier__progress"
          :class="{ 'eff-frontier__progress--complete': explorationProgress >= 3 }"
        >
          {{ explorationProgress }}/3
        </span>
      </p>
    </div>

    <!-- SVG -->
    <div class="eff-frontier__canvas">
      <svg
        :viewBox="`0 0 ${SVG_W} ${SVG_H}`"
        class="eff-frontier__svg"
        preserveAspectRatio="xMidYMid meet"
        @click.self="closeTooltip"
      >
        <defs>
          <filter id="ef-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="ef-glow-strong" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id="ef-pareto-grad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#22c55e" stop-opacity="0.8" />
            <stop offset="50%" stop-color="#14b8a6" stop-opacity="0.8" />
            <stop offset="100%" stop-color="#ec4899" stop-opacity="0.8" />
          </linearGradient>
          <linearGradient id="ef-fill-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#14b8a6" stop-opacity="0.06" />
            <stop offset="100%" stop-color="#14b8a6" stop-opacity="0" />
          </linearGradient>
        </defs>

        <!-- Background -->
        <rect :x="PLOT_X" :y="PLOT_Y" :width="PLOT_W" :height="PLOT_H" fill="#080c18" rx="8" />

        <!-- Grid -->
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

        <!-- Axis tick labels -->
        <g>
          <text
            v-for="i in 5"
            :key="`xtick-${i}`"
            :x="PLOT_X + (PLOT_W / 4) * (i - 1)"
            :y="PLOT_Y + PLOT_H + 20"
            text-anchor="middle"
            class="eff-frontier__tick"
          >
            {{ (i - 1) * 25 }}%
          </text>
          <text
            v-for="i in 5"
            :key="`ytick-${i}`"
            :x="PLOT_X - 10"
            :y="PLOT_Y + PLOT_H - (PLOT_H / 4) * (i - 1) + 4"
            text-anchor="end"
            class="eff-frontier__tick"
          >
            {{ (i - 1) * 25 }}%
          </text>
        </g>

        <!-- Pareto fill area -->
        <path
          v-if="paretoLine"
          :d="`${paretoLine} L ${toSvgX(94)} ${PLOT_Y + PLOT_H} L ${PLOT_X + PLOT_W} ${PLOT_Y + PLOT_H} L ${PLOT_X} ${PLOT_Y + PLOT_H} Z`"
          fill="url(#ef-fill-grad)"
          :opacity="showParetoHighlight ? 0.3 : 0.1"
          class="eff-frontier__pareto-fill"
        />

        <!-- Pareto frontier line (scroll-driven draw animation) -->
        <path
          v-if="paretoLine"
          :d="paretoLine"
          fill="none"
          stroke="url(#ef-pareto-grad)"
          :stroke-width="showParetoHighlight ? 3 : 2"
          stroke-linecap="round"
          stroke-linejoin="round"
          pathLength="1"
          :stroke-dasharray="scrollProgress > 0 ? '1' : (showParetoHighlight ? 'none' : '8 4')"
          :stroke-dashoffset="scrollProgress > 0 ? (1 - scrollParetoProgress) : 0"
          class="eff-frontier__pareto-line"
        />

        <!-- Dominated region label -->
        <text
          v-if="showParetoHighlight"
          :x="PLOT_X + PLOT_W * 0.35"
          :y="PLOT_Y + PLOT_H * 0.75"
          text-anchor="middle"
          class="eff-frontier__region-label"
        >
          Dominated Region
        </text>
        <text
          v-if="showParetoHighlight"
          :x="PLOT_X + PLOT_W * 0.7"
          :y="PLOT_Y + PLOT_H * 0.2"
          text-anchor="middle"
          class="eff-frontier__region-label eff-frontier__region-label--optimal"
        >
          Pareto Optimal
        </text>

        <!-- Model dots -->
        <g
          v-for="(model, mi) in models"
          :key="model.id"
          class="eff-frontier__model"
          :class="{
            'eff-frontier__model--selected': selectedModel === model.id,
            'eff-frontier__model--pareto': model.isPareto && showParetoHighlight,
            'eff-frontier__model--scroll-hidden': scrollProgress > 0 && !isScrollVisible(mi),
          }"
          :style="{ opacity: modelOpacity(model, mi) }"
          role="button"
          :tabindex="0"
          :aria-label="`${model.name}: ${model.accuracy}% accuracy, ${model.efficiency}% efficiency. ${model.params} parameters, ${model.latency} latency.`"
          @click.stop="handleModelClick(model, $event)"
          @keydown.enter.stop="handleModelClick(model, $event as unknown as MouseEvent)"
          @keydown.space.prevent.stop="handleModelClick(model, $event as unknown as MouseEvent)"
        >
          <!-- Glow ring -->
          <circle
            :cx="toSvgX(model.efficiency)"
            :cy="toSvgY(model.accuracy)"
            :r="selectedModel === model.id ? 20 : 14"
            :fill="model.color"
            :opacity="selectedModel === model.id ? 0.15 : 0.05"
            :filter="selectedModel === model.id ? 'url(#ef-glow-strong)' : 'url(#ef-glow)'"
            class="eff-frontier__model-glow"
          />
          <!-- Dot -->
          <circle
            :cx="toSvgX(model.efficiency)"
            :cy="toSvgY(model.accuracy)"
            :r="selectedModel === model.id ? 8 : model.isPareto ? 6 : 5"
            :fill="model.color"
            :stroke="clickedModels.has(model.id) ? '#ffffff' : 'none'"
            :stroke-width="1"
            class="eff-frontier__model-dot"
          />
          <!-- Label -->
          <text
            :x="toSvgX(model.efficiency)"
            :y="toSvgY(model.accuracy) - 12"
            text-anchor="middle"
            class="eff-frontier__model-label"
            :fill="model.color"
          >
            {{ model.name }}
          </text>
        </g>

        <!-- Axis labels -->
        <text :x="PLOT_X + PLOT_W / 2" :y="SVG_H - 2" text-anchor="middle" class="eff-frontier__axis-label">
          Efficiency (lower latency, fewer params) &rarr;
        </text>
        <text :x="16" :y="PLOT_Y + PLOT_H / 2" text-anchor="middle" class="eff-frontier__axis-label" transform="rotate(-90, 16, 230)">
          Accuracy &rarr;
        </text>

        <!-- Legend -->
        <g :transform="`translate(${PLOT_X + PLOT_W - 220}, ${PLOT_Y + 10})`">
          <rect x="0" y="0" width="210" height="62" rx="8" fill="#0a0e1a" opacity="0.9" stroke="rgba(255,255,255,0.06)" stroke-width="1" />
          <circle cx="16" cy="16" r="5" fill="#22c55e" />
          <text x="28" y="20" class="eff-frontier__legend-text">Pareto Optimal</text>
          <circle cx="16" cy="36" r="5" fill="#f0a500" />
          <text x="28" y="40" class="eff-frontier__legend-text">Dominated</text>
          <circle cx="120" cy="16" r="4" fill="#14b8a6" />
          <text x="130" y="20" class="eff-frontier__legend-text">Vision</text>
          <circle cx="120" cy="36" r="4" fill="#ec4899" />
          <text x="130" y="40" class="eff-frontier__legend-text">NLP</text>
          <line x1="10" y1="54" x2="200" y2="54" stroke="rgba(255,255,255,0.06)" stroke-width="0.5" />
        </g>

        <!-- Tooltip -->
        <foreignObject
          v-if="tooltip.visible && tooltip.model"
          :x="Math.min(Math.max(tooltip.x - 145, 10), SVG_W - 310)"
          :y="tooltip.y < 250 ? tooltip.y + 15 : tooltip.y - 160"
          width="290"
          height="155"
          class="eff-frontier__tooltip-foreign"
        >
          <div class="eff-frontier__tooltip" @click.stop>
            <div class="eff-frontier__tooltip-header">
              <span class="eff-frontier__tooltip-dot" :style="{ background: tooltip.model.color }" />
              <span class="eff-frontier__tooltip-title">{{ tooltip.model.name }}</span>
              <span v-if="tooltip.model.isPareto" class="eff-frontier__tooltip-pareto">Pareto</span>
              <button class="eff-frontier__tooltip-close" aria-label="Close tooltip" @click.stop="closeTooltip">&times;</button>
            </div>
            <div class="eff-frontier__tooltip-stats">
              <div class="eff-frontier__tooltip-stat">
                <span class="eff-frontier__tooltip-stat-label">Accuracy</span>
                <span class="eff-frontier__tooltip-stat-value">{{ tooltip.model.accuracy }}%</span>
              </div>
              <div class="eff-frontier__tooltip-stat">
                <span class="eff-frontier__tooltip-stat-label">Params</span>
                <span class="eff-frontier__tooltip-stat-value">{{ tooltip.model.params }}</span>
              </div>
              <div class="eff-frontier__tooltip-stat">
                <span class="eff-frontier__tooltip-stat-label">Latency</span>
                <span class="eff-frontier__tooltip-stat-value">{{ tooltip.model.latency }}</span>
              </div>
            </div>
            <p class="eff-frontier__tooltip-desc">{{ tooltip.model.description }}</p>
          </div>
        </foreignObject>
      </svg>
    </div>

    <!-- Context -->
    <div class="eff-frontier__context">
      <span class="eff-frontier__context-text">{{ sectionInfo }}</span>
    </div>
  </div>
</template>

<style scoped>
.eff-frontier {
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

.eff-frontier__header {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 4px;
}

.eff-frontier__badge {
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

.eff-frontier__title {
  margin: 0;
  font-family: 'Syne', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: var(--viz-text);
}

.eff-frontier__subtitle {
  margin: 0;
  font-size: 12px;
  color: var(--viz-text-muted);
  display: flex;
  align-items: center;
  gap: 8px;
}

.eff-frontier__progress {
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

.eff-frontier__progress--complete {
  color: var(--viz-accent-green);
  background: rgba(34, 197, 94, 0.1);
  border-color: rgba(34, 197, 94, 0.3);
}

.eff-frontier__canvas {
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.eff-frontier__svg {
  width: 100%;
  height: auto;
  overflow: visible;
}

.eff-frontier__tick {
  fill: var(--viz-text-muted);
  font-size: 9px;
  font-family: 'Inter', sans-serif;
}

.eff-frontier__pareto-line {
  transition: stroke-width 0.5s ease, stroke-dasharray 0.5s ease;
}

.eff-frontier__pareto-fill {
  transition: opacity 0.5s ease;
}

.eff-frontier__region-label {
  fill: rgba(255, 255, 255, 0.15);
  font-size: 14px;
  font-family: 'Syne', sans-serif;
  font-weight: 600;
  animation: regionFadeIn 0.6s ease;
}

.eff-frontier__region-label--optimal {
  fill: rgba(20, 184, 166, 0.3);
}

@keyframes regionFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.eff-frontier__model {
  cursor: pointer;
  transition: opacity 0.5s ease;
  outline: none;
}

.eff-frontier__model:focus-visible .eff-frontier__model-dot {
  stroke: var(--viz-primary);
  stroke-width: 2;
}

.eff-frontier__model-glow {
  transition: r 0.3s ease, opacity 0.3s ease;
}

.eff-frontier__model-dot {
  transition: r 0.3s ease, stroke 0.3s ease;
}

.eff-frontier__model:hover .eff-frontier__model-dot {
  r: 8;
}

.eff-frontier__model-label {
  font-size: 9px;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  opacity: 0.7;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.eff-frontier__model:hover .eff-frontier__model-label {
  opacity: 1;
}

.eff-frontier__model--selected .eff-frontier__model-label {
  opacity: 1;
  font-weight: 600;
}

.eff-frontier__model--pareto .eff-frontier__model-dot {
  animation: paretoGlow 2s ease-in-out infinite;
}

@keyframes paretoGlow {
  0%, 100% { filter: none; }
  50% { filter: url(#ef-glow); }
}

.eff-frontier__axis-label {
  fill: var(--viz-text-muted);
  font-size: 11px;
  font-family: 'Inter', sans-serif;
}

.eff-frontier__legend-text {
  fill: var(--viz-text-muted);
  font-size: 10px;
  font-family: 'Inter', sans-serif;
}

.eff-frontier__tooltip-foreign {
  pointer-events: none;
  overflow: visible;
}

.eff-frontier__tooltip {
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

.eff-frontier__tooltip-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}

.eff-frontier__tooltip-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.eff-frontier__tooltip-title {
  font-size: 12px;
  font-weight: 600;
  color: #ffffff;
  flex: 1;
  font-family: 'Syne', sans-serif;
}

.eff-frontier__tooltip-pareto {
  font-size: 9px;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: 4px;
  background: rgba(34, 197, 94, 0.15);
  color: #22c55e;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.eff-frontier__tooltip-close {
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

.eff-frontier__tooltip-close:hover {
  background: rgba(255, 255, 255, 0.12);
}

.eff-frontier__tooltip-stats {
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.eff-frontier__tooltip-stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.eff-frontier__tooltip-stat-label {
  font-size: 9px;
  color: var(--viz-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.eff-frontier__tooltip-stat-value {
  font-size: 12px;
  font-weight: 600;
  color: var(--viz-text);
}

.eff-frontier__tooltip-desc {
  margin: 0;
  font-size: 11px;
  line-height: 1.5;
  color: var(--viz-text-muted);
}

.eff-frontier__context {
  padding: 0 4px;
  min-height: 20px;
}

.eff-frontier__context-text {
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

/* ── Scroll-driven elements ── */
.eff-frontier__model--scroll-hidden {
  pointer-events: none;
}

.eff-frontier__pareto-line {
  transition: stroke-dashoffset 0.15s linear;
}

/* ── Reduced motion ── */
@media (prefers-reduced-motion: reduce) {
  .eff-frontier__pareto-line {
    stroke-dashoffset: 0 !important;
    stroke-dasharray: none !important;
    transition: none;
  }
  .eff-frontier__model--scroll-hidden {
    opacity: 0.85 !important;
    pointer-events: auto;
  }
}

@media (max-width: 768px) {
  .eff-frontier__title { font-size: 14px; }
}
</style>
