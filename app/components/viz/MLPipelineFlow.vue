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
interface PipelineStage {
  id: string
  label: string
  shortLabel: string
  description: string
  icon: string // SVG path key
  color: string
}

interface TooltipState {
  visible: boolean
  x: number
  y: number
  stage: PipelineStage | null
}

/* ── Pipeline Stages ── */
const stages: PipelineStage[] = [
  {
    id: 'data-collection',
    label: 'Data Collection',
    shortLabel: 'Collect',
    description: 'Gather raw data from sensors, APIs, databases, and user interactions. Quality starts here.',
    icon: 'database',
    color: '#14b8a6',
  },
  {
    id: 'preprocessing',
    label: 'Preprocessing',
    shortLabel: 'Clean',
    description: 'Clean, normalize, and transform raw data. Handle missing values, outliers, and format inconsistencies.',
    icon: 'filter',
    color: '#a855f7',
  },
  {
    id: 'feature-engineering',
    label: 'Feature Engineering',
    shortLabel: 'Features',
    description: 'Extract and select meaningful features. Domain expertise meets statistical methods.',
    icon: 'layers',
    color: '#a855f7',
  },
  {
    id: 'model-training',
    label: 'Model Training',
    shortLabel: 'Train',
    description: 'Train models on prepared data. Tune hyperparameters and validate with cross-validation.',
    icon: 'brain',
    color: '#ec4899',
  },
  {
    id: 'evaluation',
    label: 'Evaluation',
    shortLabel: 'Evaluate',
    description: 'Assess model performance with metrics, fairness audits, and stress tests.',
    icon: 'chart',
    color: '#f0a500',
  },
  {
    id: 'deployment',
    label: 'Deployment',
    shortLabel: 'Deploy',
    description: 'Package and serve the model. Optimize for latency, throughput, and target hardware.',
    icon: 'rocket',
    color: '#22c55e',
  },
  {
    id: 'monitoring',
    label: 'Monitoring',
    shortLabel: 'Monitor',
    description: 'Track drift, performance, and reliability in production. Close the feedback loop.',
    icon: 'pulse',
    color: '#5b78ff',
  },
]

/* ── Highlight Logic per Section ── */
const highlightedStageIds = computed<Set<string>>(() => {
  const allIds = new Set(stages.map((s) => s.id))
  switch (props.activeSection) {
    case 0:
      return new Set(['data-collection', 'preprocessing'])
    case 1:
      return allIds
    case 2:
      return new Set(['deployment'])
    case 3:
      return allIds
    default:
      return new Set<string>()
  }
})

const showFeedbackArrows = computed(() => props.activeSection === 3)

/* ── Scroll-driven animation state ── */
// How many stages should be "lit up" based on continuous scroll (0 to stages.length)
const scrollLitCount = computed(() => {
  if (!props.scrollProgress) return 0
  return props.scrollProgress * stages.length
})

// Dash offset for arrow animation tied to scroll
const scrollDashOffset = computed(() => {
  return -(props.scrollProgress * 200)
})

/* ── Interaction State ── */
const clickedStages = ref<Set<string>>(new Set())
const selectedStage = ref<string | null>(null)
const exerciseEmitted = ref(false)

const tooltip = ref<TooltipState>({
  visible: false,
  x: 0,
  y: 0,
  stage: null,
})

function handleStageClick(stage: PipelineStage, event: MouseEvent) {
  selectedStage.value = stage.id
  clickedStages.value = new Set([...clickedStages.value, stage.id])

  const svgEl = (event.currentTarget as SVGElement).closest('svg')
  if (svgEl) {
    const rect = svgEl.getBoundingClientRect()
    tooltip.value = {
      visible: true,
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      stage,
    }
  }

  if (clickedStages.value.size >= 3 && !exerciseEmitted.value) {
    exerciseEmitted.value = true
    emit('exerciseComplete')
  }
}

function closeTooltip() {
  tooltip.value.visible = false
  selectedStage.value = null
}

/* ── Stage state helpers ── */
function isHighlighted(id: string): boolean {
  return highlightedStageIds.value.has(id)
}

function isSelected(id: string): boolean {
  return selectedStage.value === id
}

function isClicked(id: string): boolean {
  return clickedStages.value.has(id)
}

function stageOpacity(id: string, index: number): number {
  if (isSelected(id)) return 1
  // Scroll-driven: stages progressively light up
  if (props.scrollProgress > 0) {
    const lit = scrollLitCount.value
    if (index <= lit) return 0.4 + Math.min((lit - index), 1) * 0.6
    return 0.2
  }
  if (highlightedStageIds.value.size === 0) return 0.7
  return isHighlighted(id) ? 1 : 0.25
}

/* ── Progress indicator ── */
const explorationProgress = computed(() => {
  return Math.min(clickedStages.value.size, 3)
})

/* ── Reset tooltip on section change ── */
watch(
  () => props.activeSection,
  () => {
    tooltip.value.visible = false
    selectedStage.value = null
  }
)
</script>

<template>
  <div class="pipeline-flow" @click.self="closeTooltip">
    <!-- Header -->
    <div class="pipeline-flow__header">
      <span class="pipeline-flow__badge">Interactive</span>
      <h3 class="pipeline-flow__title">ML Pipeline Flow</h3>
      <p class="pipeline-flow__subtitle">
        Click stages to explore
        <span
          class="pipeline-flow__progress"
          :class="{ 'pipeline-flow__progress--complete': explorationProgress >= 3 }"
        >
          {{ explorationProgress }}/3
        </span>
      </p>
    </div>

    <!-- SVG Visualization -->
    <div class="pipeline-flow__canvas" @click.self="closeTooltip">
      <svg
        viewBox="0 0 1000 200"
        class="pipeline-flow__svg pipeline-flow__svg--horizontal"
        preserveAspectRatio="xMidYMid meet"
        @click.self="closeTooltip"
      >
        <defs>
          <!-- Glow filter -->
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <!-- Stronger glow for selected -->
          <filter id="glow-strong" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <!-- Arrow marker -->
          <marker
            id="arrowhead"
            markerWidth="8"
            markerHeight="6"
            refX="8"
            refY="3"
            orient="auto"
          >
            <polygon
              points="0 0, 8 3, 0 6"
              fill="var(--color-primary)"
              opacity="0.5"
            />
          </marker>

          <!-- Feedback arrow marker -->
          <marker
            id="arrowhead-feedback"
            markerWidth="8"
            markerHeight="6"
            refX="8"
            refY="3"
            orient="auto"
          >
            <polygon
              points="0 0, 8 3, 0 6"
              fill="var(--viz-accent-green)"
              opacity="0.6"
            />
          </marker>
        </defs>

        <!-- Connection lines (horizontal) -->
        <g class="pipeline-flow__connections">
          <line
            v-for="(_, i) in stages.slice(0, -1)"
            :key="`conn-h-${i}`"
            :x1="68 + i * 133 + 50"
            y1="100"
            :x2="68 + (i + 1) * 133 - 10"
            y2="100"
            class="pipeline-flow__connection-line"
            :class="{
              'pipeline-flow__connection-line--active':
                isHighlighted(stages[i].id) && isHighlighted(stages[i + 1].id),
              'pipeline-flow__connection-line--scroll-lit':
                scrollProgress > 0 && i < scrollLitCount - 1,
            }"
            :style="scrollProgress > 0 ? { strokeDashoffset: scrollDashOffset + 'px' } : {}"
            marker-end="url(#arrowhead)"
          />
        </g>

        <!-- Feedback arrows (section 3) -->
        <g
          class="pipeline-flow__feedback"
          :class="{ 'pipeline-flow__feedback--visible': showFeedbackArrows }"
        >
          <!-- Monitoring → Data Collection (long feedback) -->
          <path
            d="M 865 130 Q 865 175 500 180 Q 135 175 135 130"
            fill="none"
            class="pipeline-flow__feedback-path"
            marker-end="url(#arrowhead-feedback)"
          />
          <!-- Evaluation → Model Training (short feedback) -->
          <path
            d="M 575 70 Q 575 35 467 35 Q 442 35 442 70"
            fill="none"
            class="pipeline-flow__feedback-path pipeline-flow__feedback-path--short"
            marker-end="url(#arrowhead-feedback)"
          />
        </g>

        <!-- Scroll-driven data flow particle (horizontal) -->
        <circle
          v-if="scrollProgress > 0.01"
          :cx="68 + 45 + (scrollProgress * (stages.length - 1) * 133)"
          cy="100"
          r="5"
          class="pipeline-flow__scroll-particle"
          :style="{ '--particle-color': stages[Math.min(Math.floor(scrollProgress * stages.length), stages.length - 1)].color }"
        />

        <!-- Stages (horizontal) -->
        <g
          v-for="(stage, i) in stages"
          :key="stage.id"
          class="pipeline-flow__stage"
          :class="{
            'pipeline-flow__stage--highlighted': isHighlighted(stage.id),
            'pipeline-flow__stage--selected': isSelected(stage.id),
            'pipeline-flow__stage--clicked': isClicked(stage.id),
          }"
          :style="{
            '--stage-color': stage.color,
            opacity: stageOpacity(stage.id, i),
          }"
          :transform="`translate(${68 + i * 133}, 55)`"
          role="button"
          :tabindex="0"
          :aria-label="`Pipeline stage: ${stage.label}. ${stage.description}`"
          @click.stop="handleStageClick(stage, $event)"
          @keydown.enter.stop="handleStageClick(stage, $event as unknown as MouseEvent)"
          @keydown.space.prevent.stop="handleStageClick(stage, $event as unknown as MouseEvent)"
        >
          <!-- Background glow -->
          <rect
            x="-8"
            y="-8"
            width="106"
            height="106"
            rx="20"
            class="pipeline-flow__stage-glow"
            :filter="isSelected(stage.id) ? 'url(#glow-strong)' : 'url(#glow)'"
          />

          <!-- Card background -->
          <rect
            x="0"
            y="0"
            width="90"
            height="90"
            rx="14"
            class="pipeline-flow__stage-bg"
          />

          <!-- Border -->
          <rect
            x="0"
            y="0"
            width="90"
            height="90"
            rx="14"
            class="pipeline-flow__stage-border"
          />

          <!-- Icon -->
          <g :transform="`translate(27, 18)`" class="pipeline-flow__stage-icon">
            <!-- Database icon -->
            <g v-if="stage.icon === 'database'">
              <ellipse cx="18" cy="8" rx="14" ry="5" fill="none" stroke="currentColor" stroke-width="1.5" />
              <path d="M 4 8 v 10 c 0 2.8 6.3 5 14 5 s 14 -2.2 14 -5 V 8" fill="none" stroke="currentColor" stroke-width="1.5" />
              <path d="M 4 14 c 0 2.8 6.3 5 14 5 s 14 -2.2 14 -5" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.5" />
            </g>
            <!-- Filter icon -->
            <g v-else-if="stage.icon === 'filter'">
              <path d="M 3 4 h 30 l -10 12 v 8 l -10 4 v -12 Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
            </g>
            <!-- Layers icon -->
            <g v-else-if="stage.icon === 'layers'">
              <path d="M 18 4 L 2 13 L 18 22 L 34 13 Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
              <path d="M 2 18 L 18 27 L 34 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" opacity="0.6" />
              <path d="M 2 23 L 18 32 L 34 23" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" opacity="0.35" />
            </g>
            <!-- Brain icon -->
            <g v-else-if="stage.icon === 'brain'">
              <circle cx="18" cy="16" r="12" fill="none" stroke="currentColor" stroke-width="1.5" />
              <path d="M 18 4 v 24" fill="none" stroke="currentColor" stroke-width="1" opacity="0.4" />
              <path d="M 10 8 Q 14 16 10 24" fill="none" stroke="currentColor" stroke-width="1" opacity="0.5" />
              <path d="M 26 8 Q 22 16 26 24" fill="none" stroke="currentColor" stroke-width="1" opacity="0.5" />
              <circle cx="13" cy="12" r="1.5" fill="currentColor" opacity="0.6" />
              <circle cx="23" cy="12" r="1.5" fill="currentColor" opacity="0.6" />
              <circle cx="13" cy="20" r="1.5" fill="currentColor" opacity="0.6" />
              <circle cx="23" cy="20" r="1.5" fill="currentColor" opacity="0.6" />
            </g>
            <!-- Chart icon -->
            <g v-else-if="stage.icon === 'chart'">
              <rect x="4" y="18" width="6" height="10" rx="1" fill="currentColor" opacity="0.4" />
              <rect x="14" y="10" width="6" height="18" rx="1" fill="currentColor" opacity="0.6" />
              <rect x="24" y="4" width="6" height="24" rx="1" fill="currentColor" opacity="0.8" />
              <line x1="2" y1="30" x2="34" y2="30" stroke="currentColor" stroke-width="1.5" opacity="0.3" />
            </g>
            <!-- Rocket icon -->
            <g v-else-if="stage.icon === 'rocket'">
              <path d="M 18 4 C 12 10 10 18 10 26 L 18 22 L 26 26 C 26 18 24 10 18 4 Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
              <circle cx="18" cy="15" r="2.5" fill="none" stroke="currentColor" stroke-width="1.5" />
              <path d="M 10 26 L 6 30" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.5" />
              <path d="M 26 26 L 30 30" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.5" />
            </g>
            <!-- Pulse icon -->
            <g v-else-if="stage.icon === 'pulse'">
              <polyline points="2,18 10,18 14,6 18,28 22,12 26,18 34,18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </g>
          </g>

          <!-- Label -->
          <text
            x="45"
            y="80"
            text-anchor="middle"
            class="pipeline-flow__stage-label"
          >
            {{ stage.shortLabel }}
          </text>
        </g>

        <!-- Tooltip (rendered inside SVG as foreignObject) -->
        <foreignObject
          v-if="tooltip.visible && tooltip.stage"
          :x="Math.min(Math.max(tooltip.x - 140, 10), 720)"
          :y="tooltip.y < 120 ? tooltip.y + 20 : tooltip.y - 140"
          width="280"
          height="130"
          class="pipeline-flow__tooltip-foreign"
        >
          <div class="pipeline-flow__tooltip" @click.stop>
            <div class="pipeline-flow__tooltip-header">
              <span
                class="pipeline-flow__tooltip-dot"
                :style="{ background: tooltip.stage.color }"
              />
              <span class="pipeline-flow__tooltip-title">
                {{ tooltip.stage.label }}
              </span>
              <button
                class="pipeline-flow__tooltip-close"
                aria-label="Close tooltip"
                @click.stop="closeTooltip"
              >
                &times;
              </button>
            </div>
            <p class="pipeline-flow__tooltip-desc">
              {{ tooltip.stage.description }}
            </p>
          </div>
        </foreignObject>
      </svg>

      <!-- Vertical SVG for small screens -->
      <svg
        viewBox="0 0 240 960"
        class="pipeline-flow__svg pipeline-flow__svg--vertical"
        preserveAspectRatio="xMidYMid meet"
        @click.self="closeTooltip"
      >
        <defs>
          <filter id="glow-v" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="glow-strong-v" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <marker
            id="arrowhead-v"
            markerWidth="8"
            markerHeight="6"
            refX="8"
            refY="3"
            orient="auto"
          >
            <polygon
              points="0 0, 8 3, 0 6"
              fill="var(--color-primary)"
              opacity="0.5"
            />
          </marker>
          <marker
            id="arrowhead-feedback-v"
            markerWidth="8"
            markerHeight="6"
            refX="8"
            refY="3"
            orient="auto"
          >
            <polygon
              points="0 0, 8 3, 0 6"
              fill="var(--viz-accent-green)"
              opacity="0.6"
            />
          </marker>
        </defs>

        <!-- Vertical connection lines -->
        <g class="pipeline-flow__connections">
          <line
            v-for="(_, i) in stages.slice(0, -1)"
            :key="`conn-v-${i}`"
            x1="120"
            :y1="40 + i * 130 + 90"
            x2="120"
            :y2="40 + (i + 1) * 130"
            class="pipeline-flow__connection-line"
            :class="{
              'pipeline-flow__connection-line--active':
                isHighlighted(stages[i].id) && isHighlighted(stages[i + 1].id),
            }"
            marker-end="url(#arrowhead-v)"
          />
        </g>

        <!-- Vertical feedback arrows -->
        <g
          class="pipeline-flow__feedback"
          :class="{ 'pipeline-flow__feedback--visible': showFeedbackArrows }"
        >
          <!-- Monitoring → Data Collection -->
          <path
            d="M 180 855 Q 220 855 220 460 Q 220 50 180 50"
            fill="none"
            class="pipeline-flow__feedback-path"
            marker-end="url(#arrowhead-feedback-v)"
          />
          <!-- Evaluation → Model Training -->
          <path
            d="M 60 540 Q 20 540 20 460 Q 20 425 60 425"
            fill="none"
            class="pipeline-flow__feedback-path pipeline-flow__feedback-path--short"
            marker-end="url(#arrowhead-feedback-v)"
          />
        </g>

        <!-- Vertical stages -->
        <g
          v-for="(stage, i) in stages"
          :key="`v-${stage.id}`"
          class="pipeline-flow__stage"
          :class="{
            'pipeline-flow__stage--highlighted': isHighlighted(stage.id),
            'pipeline-flow__stage--selected': isSelected(stage.id),
            'pipeline-flow__stage--clicked': isClicked(stage.id),
          }"
          :style="{
            '--stage-color': stage.color,
            opacity: stageOpacity(stage.id, i),
          }"
          :transform="`translate(30, ${40 + i * 130})`"
          role="button"
          :tabindex="0"
          :aria-label="`Pipeline stage: ${stage.label}. ${stage.description}`"
          @click.stop="handleStageClick(stage, $event)"
          @keydown.enter.stop="handleStageClick(stage, $event as unknown as MouseEvent)"
          @keydown.space.prevent.stop="handleStageClick(stage, $event as unknown as MouseEvent)"
        >
          <!-- Glow -->
          <rect
            x="-5"
            y="-5"
            width="190"
            height="80"
            rx="18"
            class="pipeline-flow__stage-glow"
            :filter="isSelected(stage.id) ? 'url(#glow-strong-v)' : 'url(#glow-v)'"
          />
          <!-- Card -->
          <rect
            x="0"
            y="0"
            width="180"
            height="70"
            rx="14"
            class="pipeline-flow__stage-bg"
          />
          <!-- Border -->
          <rect
            x="0"
            y="0"
            width="180"
            height="70"
            rx="14"
            class="pipeline-flow__stage-border"
          />
          <!-- Icon (smaller in vertical) -->
          <g :transform="`translate(12, 12)`" class="pipeline-flow__stage-icon">
            <g v-if="stage.icon === 'database'" transform="scale(0.65)">
              <ellipse cx="18" cy="8" rx="14" ry="5" fill="none" stroke="currentColor" stroke-width="2" />
              <path d="M 4 8 v 10 c 0 2.8 6.3 5 14 5 s 14 -2.2 14 -5 V 8" fill="none" stroke="currentColor" stroke-width="2" />
              <path d="M 4 14 c 0 2.8 6.3 5 14 5 s 14 -2.2 14 -5" fill="none" stroke="currentColor" stroke-width="2" opacity="0.5" />
            </g>
            <g v-else-if="stage.icon === 'filter'" transform="scale(0.65)">
              <path d="M 3 4 h 30 l -10 12 v 8 l -10 4 v -12 Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
            </g>
            <g v-else-if="stage.icon === 'layers'" transform="scale(0.65)">
              <path d="M 18 4 L 2 13 L 18 22 L 34 13 Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
              <path d="M 2 18 L 18 27 L 34 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" opacity="0.6" />
              <path d="M 2 23 L 18 32 L 34 23" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" opacity="0.35" />
            </g>
            <g v-else-if="stage.icon === 'brain'" transform="scale(0.65)">
              <circle cx="18" cy="16" r="12" fill="none" stroke="currentColor" stroke-width="2" />
              <path d="M 18 4 v 24" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.4" />
              <path d="M 10 8 Q 14 16 10 24" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.5" />
              <path d="M 26 8 Q 22 16 26 24" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.5" />
              <circle cx="13" cy="12" r="1.5" fill="currentColor" opacity="0.6" />
              <circle cx="23" cy="12" r="1.5" fill="currentColor" opacity="0.6" />
              <circle cx="13" cy="20" r="1.5" fill="currentColor" opacity="0.6" />
              <circle cx="23" cy="20" r="1.5" fill="currentColor" opacity="0.6" />
            </g>
            <g v-else-if="stage.icon === 'chart'" transform="scale(0.65)">
              <rect x="4" y="18" width="6" height="10" rx="1" fill="currentColor" opacity="0.4" />
              <rect x="14" y="10" width="6" height="18" rx="1" fill="currentColor" opacity="0.6" />
              <rect x="24" y="4" width="6" height="24" rx="1" fill="currentColor" opacity="0.8" />
              <line x1="2" y1="30" x2="34" y2="30" stroke="currentColor" stroke-width="2" opacity="0.3" />
            </g>
            <g v-else-if="stage.icon === 'rocket'" transform="scale(0.65)">
              <path d="M 18 4 C 12 10 10 18 10 26 L 18 22 L 26 26 C 26 18 24 10 18 4 Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
              <circle cx="18" cy="15" r="2.5" fill="none" stroke="currentColor" stroke-width="2" />
              <path d="M 10 26 L 6 30" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.5" />
              <path d="M 26 26 L 30 30" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.5" />
            </g>
            <g v-else-if="stage.icon === 'pulse'" transform="scale(0.65)">
              <polyline points="2,18 10,18 14,6 18,28 22,12 26,18 34,18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
            </g>
          </g>

          <!-- Label (positioned to the right of icon in vertical mode) -->
          <text
            x="58"
            y="42"
            class="pipeline-flow__stage-label pipeline-flow__stage-label--vertical"
          >
            {{ stage.label }}
          </text>
        </g>

        <!-- Vertical Tooltip -->
        <foreignObject
          v-if="tooltip.visible && tooltip.stage"
          :x="10"
          :y="Math.min(tooltip.y + 15, 820)"
          width="220"
          height="120"
          class="pipeline-flow__tooltip-foreign"
        >
          <div class="pipeline-flow__tooltip" @click.stop>
            <div class="pipeline-flow__tooltip-header">
              <span
                class="pipeline-flow__tooltip-dot"
                :style="{ background: tooltip.stage.color }"
              />
              <span class="pipeline-flow__tooltip-title">
                {{ tooltip.stage.label }}
              </span>
              <button
                class="pipeline-flow__tooltip-close"
                aria-label="Close tooltip"
                @click.stop="closeTooltip"
              >
                &times;
              </button>
            </div>
            <p class="pipeline-flow__tooltip-desc">
              {{ tooltip.stage.description }}
            </p>
          </div>
        </foreignObject>
      </svg>
    </div>

    <!-- Section context label -->
    <div class="pipeline-flow__context">
      <span v-if="activeSection === 0" class="pipeline-flow__context-text">
        Data stages: where ML systems begin
      </span>
      <span v-else-if="activeSection === 1" class="pipeline-flow__context-text">
        The full ML lifecycle &mdash; every stage matters
      </span>
      <span v-else-if="activeSection === 2" class="pipeline-flow__context-text">
        Deployment: bringing models to the edge
      </span>
      <span v-else-if="activeSection === 3" class="pipeline-flow__context-text">
        Systems thinking: feedback loops close the circle
      </span>
    </div>
  </div>
</template>

<style scoped>
/* ── CSS Variables ── */
.pipeline-flow {
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
.pipeline-flow__header {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 4px;
}

.pipeline-flow__badge {
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

.pipeline-flow__title {
  margin: 0;
  font-family: 'Syne', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: var(--viz-text);
  letter-spacing: -0.01em;
}

.pipeline-flow__subtitle {
  margin: 0;
  font-size: 12px;
  color: var(--viz-text-muted);
  display: flex;
  align-items: center;
  gap: 8px;
}

.pipeline-flow__progress {
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

.pipeline-flow__progress--complete {
  color: var(--viz-accent-green);
  background: rgba(34, 197, 94, 0.1);
  border-color: rgba(34, 197, 94, 0.3);
}

/* ── Canvas ── */
.pipeline-flow__canvas {
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.pipeline-flow__svg {
  width: 100%;
  height: auto;
  overflow: visible;
}

.pipeline-flow__svg--vertical {
  display: none;
}

/* ── Connection Lines ── */
.pipeline-flow__connection-line {
  stroke: rgba(255, 255, 255, 0.08);
  stroke-width: 2;
  stroke-dasharray: 8 6;
  transition: stroke 0.5s ease, stroke-opacity 0.5s ease;
  animation: dashFlow 1.2s linear infinite;
}

.pipeline-flow__connection-line--active {
  stroke: var(--viz-primary);
  stroke-opacity: 0.4;
}

@keyframes dashFlow {
  to {
    stroke-dashoffset: -28;
  }
}

/* ── Feedback Arrows ── */
.pipeline-flow__feedback {
  opacity: 0;
  transition: opacity 0.8s ease;
  pointer-events: none;
}

.pipeline-flow__feedback--visible {
  opacity: 1;
}

.pipeline-flow__feedback-path {
  stroke: var(--viz-accent-green);
  stroke-width: 1.5;
  stroke-dasharray: 6 4;
  stroke-opacity: 0.5;
  animation: dashFlowReverse 1.5s linear infinite;
}

.pipeline-flow__feedback-path--short {
  stroke-opacity: 0.35;
  animation-duration: 1s;
}

@keyframes dashFlowReverse {
  to {
    stroke-dashoffset: 20;
  }
}

/* ── Stage Group ── */
.pipeline-flow__stage {
  cursor: pointer;
  transition: opacity 0.5s ease;
  outline: none;
}

.pipeline-flow__stage:focus-visible .pipeline-flow__stage-border {
  stroke: var(--viz-primary);
  stroke-opacity: 0.8;
  stroke-width: 2;
}

/* ── Stage Glow ── */
.pipeline-flow__stage-glow {
  fill: var(--stage-color);
  opacity: 0;
  transition: opacity 0.5s ease;
}

.pipeline-flow__stage--highlighted .pipeline-flow__stage-glow {
  opacity: 0.08;
}

.pipeline-flow__stage--selected .pipeline-flow__stage-glow {
  opacity: 0.18;
}

/* ── Stage Background ── */
.pipeline-flow__stage-bg {
  fill: var(--viz-card);
  transition: fill 0.3s ease;
}

.pipeline-flow__stage:hover .pipeline-flow__stage-bg {
  fill: #141933;
}

.pipeline-flow__stage--selected .pipeline-flow__stage-bg {
  fill: #181e3a;
}

/* ── Stage Border ── */
.pipeline-flow__stage-border {
  fill: none;
  stroke: var(--viz-border);
  stroke-width: 1;
  transition: stroke 0.4s ease, stroke-width 0.3s ease;
}

.pipeline-flow__stage--highlighted .pipeline-flow__stage-border {
  stroke: var(--stage-color);
  stroke-opacity: 0.35;
}

.pipeline-flow__stage--selected .pipeline-flow__stage-border {
  stroke: var(--stage-color);
  stroke-opacity: 0.7;
  stroke-width: 1.5;
}

.pipeline-flow__stage--clicked .pipeline-flow__stage-border {
  stroke: var(--stage-color);
  stroke-opacity: 0.25;
}

/* ── Stage Icon ── */
.pipeline-flow__stage-icon {
  color: var(--viz-text-muted);
  transition: color 0.4s ease;
}

.pipeline-flow__stage--highlighted .pipeline-flow__stage-icon {
  color: var(--stage-color);
}

.pipeline-flow__stage--selected .pipeline-flow__stage-icon {
  color: var(--stage-color);
}

/* ── Stage Label ── */
.pipeline-flow__stage-label {
  fill: var(--viz-text-muted);
  font-size: 10px;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  letter-spacing: 0.02em;
  transition: fill 0.4s ease;
}

.pipeline-flow__stage--highlighted .pipeline-flow__stage-label {
  fill: var(--viz-text);
}

.pipeline-flow__stage--selected .pipeline-flow__stage-label {
  fill: #ffffff;
}

.pipeline-flow__stage-label--vertical {
  font-size: 13px;
  font-weight: 600;
}

/* ── Tooltip ── */
.pipeline-flow__tooltip-foreign {
  pointer-events: none;
  overflow: visible;
}

.pipeline-flow__tooltip {
  pointer-events: auto;
  background: rgba(10, 14, 26, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 14px 16px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(20, 184, 166, 0.05);
  animation: tooltipFadeIn 0.25s ease;
}

@keyframes tooltipFadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.pipeline-flow__tooltip-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.pipeline-flow__tooltip-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.pipeline-flow__tooltip-title {
  font-size: 13px;
  font-weight: 600;
  color: #ffffff;
  flex: 1;
  font-family: 'Syne', sans-serif;
}

.pipeline-flow__tooltip-close {
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

.pipeline-flow__tooltip-close:hover {
  background: rgba(255, 255, 255, 0.12);
  color: var(--viz-text);
}

.pipeline-flow__tooltip-desc {
  margin: 0;
  font-size: 12px;
  line-height: 1.55;
  color: var(--viz-text-muted);
}

/* ── Context Label ── */
.pipeline-flow__context {
  padding: 0 4px;
  min-height: 20px;
}

.pipeline-flow__context-text {
  font-size: 11px;
  color: var(--viz-text-muted);
  font-style: italic;
  opacity: 0.7;
  animation: contextFadeIn 0.5s ease;
}

@keyframes contextFadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 0.7;
    transform: translateY(0);
  }
}

/* ── Scroll-driven particle ── */
.pipeline-flow__scroll-particle {
  fill: var(--particle-color, var(--viz-primary));
  filter: url(#glow);
  transition: cx 0.1s linear;
}

/* ── Scroll-lit connection ── */
.pipeline-flow__connection-line--scroll-lit {
  stroke: var(--viz-primary);
  stroke-opacity: 0.5;
}

/* ── Reduced motion: disable scroll animations ── */
@media (prefers-reduced-motion: reduce) {
  .pipeline-flow__scroll-particle {
    display: none;
  }
  .pipeline-flow__connection-line {
    animation: none;
  }
}

/* ── Responsive: vertical layout on small screens ── */
@media (max-width: 768px) {
  .pipeline-flow__svg--horizontal {
    display: none;
  }

  .pipeline-flow__svg--vertical {
    display: block;
    max-height: 70vh;
  }

  .pipeline-flow__title {
    font-size: 14px;
  }
}
</style>
