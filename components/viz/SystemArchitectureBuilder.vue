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
interface SubComponent {
  label: string
  description: string
}

interface ArchLayer {
  id: string
  label: string
  description: string
  color: string
  icon: string
  subComponents: SubComponent[]
}

interface TooltipState {
  visible: boolean
  x: number
  y: number
  layer: ArchLayer | null
}

/* ── Architecture Layers ── */
const layers: ArchLayer[] = [
  {
    id: 'data',
    label: 'Data Layer',
    description: 'Ingestion, storage, and versioning of training and serving data.',
    color: '#14b8a6',
    icon: 'database',
    subComponents: [
      { label: 'Data Lake', description: 'Raw data storage for structured and unstructured data' },
      { label: 'Feature Store', description: 'Centralized repository of curated ML features' },
      { label: 'Data Versioning', description: 'Track lineage and reproducibility of datasets' },
    ],
  },
  {
    id: 'processing',
    label: 'Processing Layer',
    description: 'ETL pipelines, feature engineering, and data validation.',
    color: '#6c5ce7',
    icon: 'gear',
    subComponents: [
      { label: 'ETL Pipelines', description: 'Extract, transform, and load data workflows' },
      { label: 'Data Validation', description: 'Schema checks, drift detection, quality gates' },
      { label: 'Feature Engineering', description: 'Transform raw data into model-ready features' },
    ],
  },
  {
    id: 'model',
    label: 'Model Layer',
    description: 'Training, tuning, experiment tracking, and model registry.',
    color: '#a855f7',
    icon: 'brain',
    subComponents: [
      { label: 'Training Engine', description: 'Distributed training with GPU/TPU orchestration' },
      { label: 'Experiment Tracker', description: 'Log hyperparameters, metrics, and artifacts' },
      { label: 'Model Registry', description: 'Version and promote models through stages' },
    ],
  },
  {
    id: 'serving',
    label: 'Serving Layer',
    description: 'Model deployment, inference APIs, and scaling.',
    color: '#ec4899',
    icon: 'rocket',
    subComponents: [
      { label: 'Inference API', description: 'REST/gRPC endpoints for real-time predictions' },
      { label: 'Batch Scoring', description: 'Offline prediction jobs on large datasets' },
      { label: 'Auto-scaling', description: 'Dynamic resource allocation based on demand' },
    ],
  },
  {
    id: 'monitoring',
    label: 'Monitoring Layer',
    description: 'Performance tracking, drift detection, and alerting.',
    color: '#22c55e',
    icon: 'pulse',
    subComponents: [
      { label: 'Metrics Dashboard', description: 'Real-time model performance visualization' },
      { label: 'Drift Detection', description: 'Detect data and concept drift in production' },
      { label: 'Alerting', description: 'Automated alerts on degradation thresholds' },
    ],
  },
]

/* ── Highlight Logic per Section ── */
const highlightedLayerIds = computed<Set<string>>(() => {
  switch (props.activeSection) {
    case 0:
      return new Set(['data', 'processing'])
    case 1:
      return new Set(['model'])
    case 2:
      return new Set(['serving'])
    case 3:
      return new Set(['monitoring'])
    default:
      return new Set<string>()
  }
})

/* ── Interaction State ── */
const clickedLayers = ref<Set<string>>(new Set())
const expandedLayer = ref<string | null>(null)
const exerciseEmitted = ref(false)

const tooltip = ref<TooltipState>({
  visible: false,
  x: 0,
  y: 0,
  layer: null,
})

function handleLayerClick(layer: ArchLayer, event: MouseEvent) {
  expandedLayer.value = expandedLayer.value === layer.id ? null : layer.id
  clickedLayers.value = new Set([...clickedLayers.value, layer.id])

  const svgEl = (event.currentTarget as SVGElement).closest('svg')
  if (svgEl) {
    const rect = svgEl.getBoundingClientRect()
    tooltip.value = {
      visible: true,
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      layer,
    }
  }

  if (clickedLayers.value.size >= 3 && !exerciseEmitted.value) {
    exerciseEmitted.value = true
    emit('exerciseComplete')
  }
}

function closeTooltip() {
  tooltip.value.visible = false
}

/* ── State Helpers ── */
function isHighlighted(id: string): boolean {
  return highlightedLayerIds.value.has(id)
}

function isExpanded(id: string): boolean {
  return expandedLayer.value === id
}

function layerOpacity(id: string): number {
  if (isExpanded(id)) return 1
  if (highlightedLayerIds.value.size === 0) return 0.7
  return isHighlighted(id) ? 1 : 0.25
}

/* ── Progress ── */
const explorationProgress = computed(() => Math.min(clickedLayers.value.size, 3))

/* ── Reset on section change ── */
watch(
  () => props.activeSection,
  () => {
    tooltip.value.visible = false
  }
)
</script>

<template>
  <div class="arch-builder" @click.self="closeTooltip">
    <!-- Header -->
    <div class="arch-builder__header">
      <span class="arch-builder__badge">Interactive</span>
      <h3 class="arch-builder__title">System Architecture Builder</h3>
      <p class="arch-builder__subtitle">
        Click layers to expand sub-components
        <span
          class="arch-builder__progress"
          :class="{ 'arch-builder__progress--complete': explorationProgress >= 3 }"
        >
          {{ explorationProgress }}/3
        </span>
      </p>
    </div>

    <!-- SVG Visualization — Horizontal (desktop) -->
    <div class="arch-builder__canvas" @click.self="closeTooltip">
      <svg
        viewBox="0 0 960 420"
        class="arch-builder__svg arch-builder__svg--horizontal"
        preserveAspectRatio="xMidYMid meet"
        @click.self="closeTooltip"
      >
        <defs>
          <filter id="arch-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="arch-glow-strong" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="14" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <marker
            id="arch-arrow"
            markerWidth="8"
            markerHeight="6"
            refX="8"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 8 3, 0 6" fill="var(--color-primary)" opacity="0.5" />
          </marker>
        </defs>

        <!-- Connection arrows between layers -->
        <g class="arch-builder__connections">
          <line
            v-for="(_, i) in layers.slice(0, -1)"
            :key="`conn-${i}`"
            :x1="80 + i * 180 + 140"
            y1="50"
            :x2="80 + (i + 1) * 180 - 8"
            y2="50"
            class="arch-builder__connection-line"
            :class="{
              'arch-builder__connection-line--active':
                isHighlighted(layers[i].id) && isHighlighted(layers[i + 1].id),
            }"
            marker-end="url(#arch-arrow)"
          />
        </g>

        <!-- Layer cards -->
        <g
          v-for="(layer, i) in layers"
          :key="layer.id"
          class="arch-builder__layer"
          :class="{
            'arch-builder__layer--highlighted': isHighlighted(layer.id),
            'arch-builder__layer--expanded': isExpanded(layer.id),
          }"
          :style="{
            '--layer-color': layer.color,
            opacity: layerOpacity(layer.id),
          }"
          :transform="`translate(${80 + i * 180}, 10)`"
          role="button"
          :tabindex="0"
          :aria-label="`Architecture layer: ${layer.label}. ${layer.description}`"
          :aria-expanded="isExpanded(layer.id)"
          @click.stop="handleLayerClick(layer, $event)"
          @keydown.enter.stop="handleLayerClick(layer, $event as unknown as MouseEvent)"
          @keydown.space.prevent.stop="handleLayerClick(layer, $event as unknown as MouseEvent)"
        >
          <!-- Glow -->
          <rect
            x="-8"
            y="-8"
            width="156"
            height="96"
            rx="18"
            class="arch-builder__layer-glow"
            :filter="isExpanded(layer.id) ? 'url(#arch-glow-strong)' : 'url(#arch-glow)'"
          />

          <!-- Card bg -->
          <rect
            x="0"
            y="0"
            width="140"
            height="80"
            rx="14"
            class="arch-builder__layer-bg"
          />

          <!-- Border -->
          <rect
            x="0"
            y="0"
            width="140"
            height="80"
            rx="14"
            class="arch-builder__layer-border"
          />

          <!-- Icon -->
          <g transform="translate(10, 14)" class="arch-builder__layer-icon">
            <!-- Database -->
            <g v-if="layer.icon === 'database'" transform="scale(0.7)">
              <ellipse cx="18" cy="8" rx="14" ry="5" fill="none" stroke="currentColor" stroke-width="1.8" />
              <path d="M 4 8 v 10 c 0 2.8 6.3 5 14 5 s 14 -2.2 14 -5 V 8" fill="none" stroke="currentColor" stroke-width="1.8" />
              <path d="M 4 14 c 0 2.8 6.3 5 14 5 s 14 -2.2 14 -5" fill="none" stroke="currentColor" stroke-width="1.8" opacity="0.5" />
            </g>
            <!-- Gear -->
            <g v-else-if="layer.icon === 'gear'" transform="scale(0.7)">
              <circle cx="18" cy="16" r="6" fill="none" stroke="currentColor" stroke-width="1.8" />
              <path d="M 18 4 v 4 M 18 24 v 4 M 6 10 l 3.5 2 M 26.5 20 l 3.5 2 M 6 22 l 3.5 -2 M 26.5 12 l 3.5 -2 M 30 16 h -4 M 10 16 H 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            </g>
            <!-- Brain -->
            <g v-else-if="layer.icon === 'brain'" transform="scale(0.7)">
              <circle cx="18" cy="16" r="12" fill="none" stroke="currentColor" stroke-width="1.8" />
              <path d="M 18 4 v 24" fill="none" stroke="currentColor" stroke-width="1" opacity="0.4" />
              <path d="M 10 8 Q 14 16 10 24" fill="none" stroke="currentColor" stroke-width="1" opacity="0.5" />
              <path d="M 26 8 Q 22 16 26 24" fill="none" stroke="currentColor" stroke-width="1" opacity="0.5" />
              <circle cx="13" cy="12" r="1.5" fill="currentColor" opacity="0.6" />
              <circle cx="23" cy="12" r="1.5" fill="currentColor" opacity="0.6" />
              <circle cx="13" cy="20" r="1.5" fill="currentColor" opacity="0.6" />
              <circle cx="23" cy="20" r="1.5" fill="currentColor" opacity="0.6" />
            </g>
            <!-- Rocket -->
            <g v-else-if="layer.icon === 'rocket'" transform="scale(0.7)">
              <path d="M 18 4 C 12 10 10 18 10 26 L 18 22 L 26 26 C 26 18 24 10 18 4 Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
              <circle cx="18" cy="15" r="2.5" fill="none" stroke="currentColor" stroke-width="1.8" />
            </g>
            <!-- Pulse -->
            <g v-else-if="layer.icon === 'pulse'" transform="scale(0.7)">
              <polyline points="2,18 10,18 14,6 18,28 22,12 26,18 34,18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </g>
          </g>

          <!-- Label -->
          <text x="44" y="32" class="arch-builder__layer-label">
            {{ layer.label }}
          </text>

          <!-- Expand indicator -->
          <text
            x="126"
            y="30"
            text-anchor="middle"
            class="arch-builder__expand-icon"
          >
            {{ isExpanded(layer.id) ? '−' : '+' }}
          </text>

          <!-- Sub-components (expanded) -->
          <g v-if="isExpanded(layer.id)" class="arch-builder__sub-group">
            <g
              v-for="(sub, si) in layer.subComponents"
              :key="si"
              :transform="`translate(0, ${95 + si * 58})`"
            >
              <rect
                x="4"
                y="0"
                width="132"
                height="48"
                rx="10"
                class="arch-builder__sub-bg"
              />
              <rect
                x="4"
                y="0"
                width="132"
                height="48"
                rx="10"
                class="arch-builder__sub-border"
              />
              <text x="16" y="20" class="arch-builder__sub-label">
                {{ sub.label }}
              </text>
              <text x="16" y="36" class="arch-builder__sub-desc">
                {{ sub.description.length > 30 ? sub.description.slice(0, 30) + '...' : sub.description }}
              </text>
            </g>
          </g>

          <!-- Connector line from card to subs -->
          <line
            v-if="isExpanded(layer.id)"
            x1="70"
            y1="80"
            x2="70"
            y2="95"
            class="arch-builder__sub-connector"
          />
        </g>

        <!-- Tooltip -->
        <foreignObject
          v-if="tooltip.visible && tooltip.layer"
          :x="Math.min(Math.max(tooltip.x - 140, 10), 680)"
          :y="tooltip.y < 200 ? tooltip.y + 20 : tooltip.y - 130"
          width="280"
          height="120"
          class="arch-builder__tooltip-foreign"
        >
          <div class="arch-builder__tooltip" @click.stop>
            <div class="arch-builder__tooltip-header">
              <span
                class="arch-builder__tooltip-dot"
                :style="{ background: tooltip.layer.color }"
              />
              <span class="arch-builder__tooltip-title">
                {{ tooltip.layer.label }}
              </span>
              <button
                class="arch-builder__tooltip-close"
                aria-label="Close tooltip"
                @click.stop="closeTooltip"
              >
                &times;
              </button>
            </div>
            <p class="arch-builder__tooltip-desc">
              {{ tooltip.layer.description }}
            </p>
          </div>
        </foreignObject>
      </svg>

      <!-- SVG Visualization — Vertical (mobile) -->
      <svg
        viewBox="0 0 260 900"
        class="arch-builder__svg arch-builder__svg--vertical"
        preserveAspectRatio="xMidYMid meet"
        @click.self="closeTooltip"
      >
        <defs>
          <filter id="arch-glow-v" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <marker
            id="arch-arrow-v"
            markerWidth="8"
            markerHeight="6"
            refX="8"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 8 3, 0 6" fill="var(--color-primary)" opacity="0.5" />
          </marker>
        </defs>

        <!-- Vertical connections -->
        <g class="arch-builder__connections">
          <line
            v-for="(_, i) in layers.slice(0, -1)"
            :key="`vconn-${i}`"
            x1="130"
            :y1="30 + i * 170 + 80"
            x2="130"
            :y2="30 + (i + 1) * 170"
            class="arch-builder__connection-line"
            marker-end="url(#arch-arrow-v)"
          />
        </g>

        <!-- Layer cards (vertical) -->
        <g
          v-for="(layer, i) in layers"
          :key="`v-${layer.id}`"
          class="arch-builder__layer"
          :class="{
            'arch-builder__layer--highlighted': isHighlighted(layer.id),
            'arch-builder__layer--expanded': isExpanded(layer.id),
          }"
          :style="{
            '--layer-color': layer.color,
            opacity: layerOpacity(layer.id),
          }"
          :transform="`translate(20, ${30 + i * 170})`"
          role="button"
          :tabindex="0"
          :aria-label="`Architecture layer: ${layer.label}. ${layer.description}`"
          :aria-expanded="isExpanded(layer.id)"
          @click.stop="handleLayerClick(layer, $event)"
          @keydown.enter.stop="handleLayerClick(layer, $event as unknown as MouseEvent)"
          @keydown.space.prevent.stop="handleLayerClick(layer, $event as unknown as MouseEvent)"
        >
          <rect
            x="-5"
            y="-5"
            width="230"
            height="80"
            rx="18"
            class="arch-builder__layer-glow"
            filter="url(#arch-glow-v)"
          />
          <rect x="0" y="0" width="220" height="70" rx="14" class="arch-builder__layer-bg" />
          <rect x="0" y="0" width="220" height="70" rx="14" class="arch-builder__layer-border" />

          <text x="20" y="38" class="arch-builder__layer-label arch-builder__layer-label--vertical">
            {{ layer.label }}
          </text>
          <text x="200" y="38" text-anchor="middle" class="arch-builder__expand-icon">
            {{ isExpanded(layer.id) ? '−' : '+' }}
          </text>
        </g>
      </svg>
    </div>

    <!-- Context label -->
    <div class="arch-builder__context">
      <span v-if="activeSection === 0" class="arch-builder__context-text">
        Foundation: data &amp; processing layers fuel the system
      </span>
      <span v-else-if="activeSection === 1" class="arch-builder__context-text">
        The model layer: training, experiments, and registries
      </span>
      <span v-else-if="activeSection === 2" class="arch-builder__context-text">
        Serving layer: bringing predictions to users at scale
      </span>
      <span v-else-if="activeSection === 3" class="arch-builder__context-text">
        Monitoring: keeping the system reliable in production
      </span>
    </div>
  </div>
</template>

<style scoped>
/* ── CSS Variables ── */
.arch-builder {
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

/* ── Header ── */
.arch-builder__header {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 4px;
}

.arch-builder__badge {
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

.arch-builder__title {
  margin: 0;
  font-family: 'Syne', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: var(--viz-text);
  letter-spacing: -0.01em;
}

.arch-builder__subtitle {
  margin: 0;
  font-size: 12px;
  color: var(--viz-text-muted);
  display: flex;
  align-items: center;
  gap: 8px;
}

.arch-builder__progress {
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

.arch-builder__progress--complete {
  color: var(--viz-accent-green);
  background: rgba(34, 197, 94, 0.1);
  border-color: rgba(34, 197, 94, 0.3);
}

/* ── Canvas ── */
.arch-builder__canvas {
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.arch-builder__svg {
  width: 100%;
  height: auto;
  overflow: visible;
}

.arch-builder__svg--vertical {
  display: none;
}

/* ── Connection Lines ── */
.arch-builder__connection-line {
  stroke: rgba(255, 255, 255, 0.08);
  stroke-width: 2;
  stroke-dasharray: 8 6;
  transition: stroke 0.5s ease;
  animation: archDashFlow 1.2s linear infinite;
}

.arch-builder__connection-line--active {
  stroke: var(--viz-primary);
  stroke-opacity: 0.4;
}

@keyframes archDashFlow {
  to { stroke-dashoffset: -28; }
}

/* ── Layer Group ── */
.arch-builder__layer {
  cursor: pointer;
  transition: opacity 0.5s ease;
  outline: none;
}

.arch-builder__layer:focus-visible .arch-builder__layer-border {
  stroke: var(--viz-primary);
  stroke-opacity: 0.8;
  stroke-width: 2;
}

/* ── Layer Glow ── */
.arch-builder__layer-glow {
  fill: var(--layer-color);
  opacity: 0;
  transition: opacity 0.5s ease;
}

.arch-builder__layer--highlighted .arch-builder__layer-glow {
  opacity: 0.08;
}

.arch-builder__layer--expanded .arch-builder__layer-glow {
  opacity: 0.18;
}

/* ── Layer Background ── */
.arch-builder__layer-bg {
  fill: var(--viz-card);
  transition: fill 0.3s ease;
}

.arch-builder__layer:hover .arch-builder__layer-bg {
  fill: #141933;
}

.arch-builder__layer--expanded .arch-builder__layer-bg {
  fill: #181e3a;
}

/* ── Layer Border ── */
.arch-builder__layer-border {
  fill: none;
  stroke: var(--viz-border);
  stroke-width: 1;
  transition: stroke 0.4s ease, stroke-width 0.3s ease;
}

.arch-builder__layer--highlighted .arch-builder__layer-border {
  stroke: var(--layer-color);
  stroke-opacity: 0.35;
}

.arch-builder__layer--expanded .arch-builder__layer-border {
  stroke: var(--layer-color);
  stroke-opacity: 0.7;
  stroke-width: 1.5;
}

/* ── Layer Icon ── */
.arch-builder__layer-icon {
  color: var(--viz-text-muted);
  transition: color 0.4s ease;
}

.arch-builder__layer--highlighted .arch-builder__layer-icon,
.arch-builder__layer--expanded .arch-builder__layer-icon {
  color: var(--layer-color);
}

/* ── Layer Label ── */
.arch-builder__layer-label {
  fill: var(--viz-text-muted);
  font-size: 11px;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  transition: fill 0.4s ease;
}

.arch-builder__layer--highlighted .arch-builder__layer-label {
  fill: var(--viz-text);
}

.arch-builder__layer--expanded .arch-builder__layer-label {
  fill: #ffffff;
}

.arch-builder__layer-label--vertical {
  font-size: 13px;
}

/* ── Expand Icon ── */
.arch-builder__expand-icon {
  fill: var(--viz-text-muted);
  font-size: 16px;
  font-family: 'Inter', sans-serif;
  font-weight: 300;
  transition: fill 0.3s ease;
}

.arch-builder__layer--expanded .arch-builder__expand-icon {
  fill: var(--layer-color);
}

/* ── Sub-components ── */
.arch-builder__sub-group {
  animation: subSlideIn 0.35s ease;
}

@keyframes subSlideIn {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}

.arch-builder__sub-bg {
  fill: rgba(15, 19, 37, 0.8);
}

.arch-builder__sub-border {
  fill: none;
  stroke: var(--layer-color);
  stroke-opacity: 0.15;
  stroke-width: 1;
}

.arch-builder__sub-label {
  fill: var(--viz-text);
  font-size: 10px;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
}

.arch-builder__sub-desc {
  fill: var(--viz-text-muted);
  font-size: 8px;
  font-family: 'Inter', sans-serif;
}

.arch-builder__sub-connector {
  stroke: var(--layer-color);
  stroke-opacity: 0.2;
  stroke-width: 1;
  stroke-dasharray: 3 3;
}

/* ── Tooltip ── */
.arch-builder__tooltip-foreign {
  pointer-events: none;
  overflow: visible;
}

.arch-builder__tooltip {
  pointer-events: auto;
  background: rgba(10, 14, 26, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 14px 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(20, 184, 166, 0.05);
  animation: archTooltipIn 0.25s ease;
}

@keyframes archTooltipIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

.arch-builder__tooltip-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.arch-builder__tooltip-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.arch-builder__tooltip-title {
  font-size: 13px;
  font-weight: 600;
  color: #ffffff;
  flex: 1;
  font-family: 'Syne', sans-serif;
}

.arch-builder__tooltip-close {
  appearance: none;
  border: none;
  background: rgba(255, 255, 255, 0.06);
  color: var(--viz-text-muted);
  width: 22px;
  height: 22px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  transition: background 0.2s ease, color 0.2s ease;
  flex-shrink: 0;
  padding: 0;
}

.arch-builder__tooltip-close:hover {
  background: rgba(255, 255, 255, 0.12);
  color: var(--viz-text);
}

.arch-builder__tooltip-desc {
  margin: 0;
  font-size: 12px;
  line-height: 1.55;
  color: var(--viz-text-muted);
}

/* ── Context Label ── */
.arch-builder__context {
  padding: 0 4px;
  min-height: 20px;
}

.arch-builder__context-text {
  font-size: 11px;
  color: var(--viz-text-muted);
  font-style: italic;
  opacity: 0.7;
  animation: archContextIn 0.5s ease;
}

@keyframes archContextIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 0.7; transform: translateY(0); }
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .arch-builder__svg--horizontal { display: none; }
  .arch-builder__svg--vertical { display: block; max-height: 70vh; }
  .arch-builder__title { font-size: 14px; }
}
</style>
