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
interface WorkflowStage {
  id: string
  label: string
  shortLabel: string
  description: string
  details: string[]
  color: string
  icon: string
}

interface TooltipState {
  visible: boolean
  x: number
  y: number
  stage: WorkflowStage | null
}

/* ── Workflow Stages ── */
const stages: WorkflowStage[] = [
  {
    id: 'problem',
    label: 'Problem Definition',
    shortLabel: 'Problem',
    description: 'Define the business problem and success metrics.',
    details: ['Stakeholder interviews', 'KPI definition', 'Feasibility analysis', 'Success criteria'],
    color: '#14b8a6',
    icon: 'target',
  },
  {
    id: 'collection',
    label: 'Data Collection',
    shortLabel: 'Collect',
    description: 'Gather, label, and catalog training data.',
    details: ['Data sourcing', 'Labeling pipelines', 'Data catalogs', 'Privacy compliance'],
    color: '#a855f7',
    icon: 'database',
  },
  {
    id: 'preprocessing',
    label: 'Preprocessing',
    shortLabel: 'Preprocess',
    description: 'Clean, validate, and transform raw data.',
    details: ['Missing value handling', 'Outlier detection', 'Normalization', 'Feature encoding'],
    color: '#a855f7',
    icon: 'filter',
  },
  {
    id: 'training',
    label: 'Training',
    shortLabel: 'Train',
    description: 'Train and tune models on prepared data.',
    details: ['Architecture selection', 'Hyperparameter tuning', 'Cross-validation', 'Distributed training'],
    color: '#ec4899',
    icon: 'brain',
  },
  {
    id: 'validation',
    label: 'Validation',
    shortLabel: 'Validate',
    description: 'Evaluate model performance and fairness.',
    details: ['Test set evaluation', 'A/B testing', 'Fairness audits', 'Robustness checks'],
    color: '#f0a500',
    icon: 'chart',
  },
  {
    id: 'deployment',
    label: 'Deployment',
    shortLabel: 'Deploy',
    description: 'Package and serve the model in production.',
    details: ['Containerization', 'CI/CD pipelines', 'Canary releases', 'Edge deployment'],
    color: '#22c55e',
    icon: 'rocket',
  },
  {
    id: 'monitoring',
    label: 'Monitoring',
    shortLabel: 'Monitor',
    description: 'Track performance and detect drift.',
    details: ['Latency tracking', 'Drift detection', 'Error logging', 'SLA monitoring'],
    color: '#5b78ff',
    icon: 'pulse',
  },
  {
    id: 'feedback',
    label: 'Feedback Loop',
    shortLabel: 'Feedback',
    description: 'Collect feedback and retrain iteratively.',
    details: ['User feedback', 'Active learning', 'Retraining triggers', 'Model versioning'],
    color: '#f472b6',
    icon: 'loop',
  },
]

/* ── Highlight per section ── */
const highlightedIds = computed<Set<string>>(() => {
  switch (props.activeSection) {
    case 0: return new Set(['problem', 'collection'])
    case 1: return new Set(['preprocessing', 'training'])
    case 2: return new Set(['validation', 'deployment'])
    case 3: return new Set(['monitoring', 'feedback'])
    default: return new Set<string>()
  }
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

function handleStageClick(stage: WorkflowStage, event: MouseEvent) {
  selectedStage.value = selectedStage.value === stage.id ? null : stage.id
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

/* ── State Helpers ── */
function isHighlighted(id: string): boolean {
  return highlightedIds.value.has(id)
}

function isSelected(id: string): boolean {
  return selectedStage.value === id
}

function stageOpacity(id: string): number {
  if (isSelected(id)) return 1
  if (highlightedIds.value.size === 0) return 0.7
  return isHighlighted(id) ? 1 : 0.25
}

/* ── Progress ── */
const explorationProgress = computed(() => Math.min(clickedStages.value.size, 3))

/* ── Layout: 2 rows of 4 ── */
function stageX(index: number): number {
  return 40 + (index % 4) * 225
}

function stageY(index: number): number {
  return index < 4 ? 30 : 195
}

/* ── Reset ── */
watch(
  () => props.activeSection,
  () => {
    tooltip.value.visible = false
    selectedStage.value = null
  }
)
</script>

<template>
  <div class="wf-designer" @click.self="closeTooltip">
    <!-- Header -->
    <div class="wf-designer__header">
      <span class="wf-designer__badge">Interactive</span>
      <h3 class="wf-designer__title">Model Lifecycle Workflow</h3>
      <p class="wf-designer__subtitle">
        Click stages to explore details
        <span
          class="wf-designer__progress"
          :class="{ 'wf-designer__progress--complete': explorationProgress >= 3 }"
        >
          {{ explorationProgress }}/3
        </span>
      </p>
    </div>

    <!-- SVG — Horizontal (desktop) -->
    <div class="wf-designer__canvas" @click.self="closeTooltip">
      <svg
        viewBox="0 0 960 400"
        class="wf-designer__svg wf-designer__svg--horizontal"
        preserveAspectRatio="xMidYMid meet"
        @click.self="closeTooltip"
      >
        <defs>
          <filter id="wf-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="wf-glow-strong" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="14" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <marker
            id="wf-arrow"
            markerWidth="8"
            markerHeight="6"
            refX="8"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 8 3, 0 6" fill="var(--color-primary)" opacity="0.5" />
          </marker>
          <marker
            id="wf-arrow-feedback"
            markerWidth="8"
            markerHeight="6"
            refX="8"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 8 3, 0 6" fill="#f472b6" opacity="0.5" />
          </marker>
        </defs>

        <!-- Row 1 connections (stages 0-3) -->
        <g class="wf-designer__connections">
          <line
            v-for="i in 3"
            :key="`r1-${i}`"
            :x1="stageX(i - 1) + 180"
            :y1="stageY(0) + 55"
            :x2="stageX(i) - 5"
            :y2="stageY(0) + 55"
            class="wf-designer__connection-line"
            :class="{
              'wf-designer__connection-line--active':
                isHighlighted(stages[i - 1].id) && isHighlighted(stages[i].id),
            }"
            marker-end="url(#wf-arrow)"
          />
        </g>

        <!-- Row 1 to Row 2 connection -->
        <path
          :d="`M ${stageX(3) + 90} ${stageY(0) + 110} Q ${stageX(3) + 90} ${stageY(1) - 10} ${stageX(3) + 90} ${stageY(1)}`"
          fill="none"
          class="wf-designer__connection-line"
          :class="{
            'wf-designer__connection-line--active':
              isHighlighted(stages[3].id) && isHighlighted(stages[4].id),
          }"
          marker-end="url(#wf-arrow)"
        />

        <!-- Row 2 connections (stages 4-7, reversed direction) -->
        <g class="wf-designer__connections">
          <line
            v-for="i in 3"
            :key="`r2-${i}`"
            :x1="stageX(7 - i + 1) + 5"
            :y1="stageY(1) + 55"
            :x2="stageX(7 - i) + 180"
            :y2="stageY(1) + 55"
            class="wf-designer__connection-line"
            :class="{
              'wf-designer__connection-line--active':
                isHighlighted(stages[7 - i].id) && isHighlighted(stages[7 - i + 1].id),
            }"
            marker-end="url(#wf-arrow)"
          />
        </g>

        <!-- Feedback loop: stage 7 back to stage 0 -->
        <path
          :d="`M ${stageX(0) + 90} ${stageY(1) + 110} Q ${stageX(0) + 90} ${stageY(1) + 150} ${stageX(0) - 20} ${stageY(1) + 150} Q ${stageX(0) - 35} ${stageY(0) + 55} ${stageX(0)} ${stageY(0) + 55}`"
          fill="none"
          class="wf-designer__feedback-path"
          :class="{ 'wf-designer__feedback-path--visible': activeSection === 3 }"
          marker-end="url(#wf-arrow-feedback)"
        />

        <!-- Stage cards -->
        <g
          v-for="(stage, i) in stages"
          :key="stage.id"
          class="wf-designer__stage"
          :class="{
            'wf-designer__stage--highlighted': isHighlighted(stage.id),
            'wf-designer__stage--selected': isSelected(stage.id),
          }"
          :style="{
            '--stage-color': stage.color,
            opacity: stageOpacity(stage.id),
          }"
          :transform="`translate(${stageX(i)}, ${stageY(i)})`"
          role="button"
          :tabindex="0"
          :aria-label="`Lifecycle stage: ${stage.label}. ${stage.description}`"
          @click.stop="handleStageClick(stage, $event)"
          @keydown.enter.stop="handleStageClick(stage, $event as unknown as MouseEvent)"
          @keydown.space.prevent.stop="handleStageClick(stage, $event as unknown as MouseEvent)"
        >
          <!-- Glow -->
          <rect
            x="-8"
            y="-8"
            width="196"
            height="126"
            rx="18"
            class="wf-designer__stage-glow"
            :filter="isSelected(stage.id) ? 'url(#wf-glow-strong)' : 'url(#wf-glow)'"
          />
          <!-- Card -->
          <rect x="0" y="0" width="180" height="110" rx="14" class="wf-designer__stage-bg" />
          <rect x="0" y="0" width="180" height="110" rx="14" class="wf-designer__stage-border" />

          <!-- Stage number -->
          <text x="16" y="26" class="wf-designer__stage-num">
            {{ String(i + 1).padStart(2, '0') }}
          </text>

          <!-- Label -->
          <text x="16" y="50" class="wf-designer__stage-label">
            {{ stage.shortLabel }}
          </text>

          <!-- Description snippet -->
          <text x="16" y="70" class="wf-designer__stage-desc">
            {{ stage.description.length > 35 ? stage.description.slice(0, 35) + '...' : stage.description }}
          </text>

          <!-- Detail bullets (when selected) -->
          <g v-if="isSelected(stage.id)">
            <text
              v-for="(detail, di) in stage.details.slice(0, 2)"
              :key="di"
              x="16"
              :y="86 + di * 13"
              class="wf-designer__stage-detail"
            >
              · {{ detail }}
            </text>
          </g>
        </g>

        <!-- Tooltip -->
        <foreignObject
          v-if="tooltip.visible && tooltip.stage"
          :x="Math.min(Math.max(tooltip.x - 140, 10), 680)"
          :y="tooltip.y < 200 ? tooltip.y + 20 : tooltip.y - 140"
          width="280"
          height="140"
          class="wf-designer__tooltip-foreign"
        >
          <div class="wf-designer__tooltip" @click.stop>
            <div class="wf-designer__tooltip-header">
              <span
                class="wf-designer__tooltip-dot"
                :style="{ background: tooltip.stage.color }"
              />
              <span class="wf-designer__tooltip-title">
                {{ tooltip.stage.label }}
              </span>
              <button
                class="wf-designer__tooltip-close"
                aria-label="Close tooltip"
                @click.stop="closeTooltip"
              >
                &times;
              </button>
            </div>
            <p class="wf-designer__tooltip-desc">
              {{ tooltip.stage.description }}
            </p>
            <div class="wf-designer__tooltip-details">
              <span
                v-for="(d, di) in tooltip.stage.details"
                :key="di"
                class="wf-designer__tooltip-tag"
              >
                {{ d }}
              </span>
            </div>
          </div>
        </foreignObject>
      </svg>

      <!-- Vertical (mobile) -->
      <svg
        viewBox="0 0 260 1100"
        class="wf-designer__svg wf-designer__svg--vertical"
        preserveAspectRatio="xMidYMid meet"
        @click.self="closeTooltip"
      >
        <defs>
          <filter id="wf-glow-v" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <marker
            id="wf-arrow-v"
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
        <g class="wf-designer__connections">
          <line
            v-for="(_, i) in stages.slice(0, -1)"
            :key="`vc-${i}`"
            x1="130"
            :y1="20 + i * 130 + 80"
            x2="130"
            :y2="20 + (i + 1) * 130"
            class="wf-designer__connection-line"
            marker-end="url(#wf-arrow-v)"
          />
        </g>

        <!-- Vertical stage cards -->
        <g
          v-for="(stage, i) in stages"
          :key="`v-${stage.id}`"
          class="wf-designer__stage"
          :class="{
            'wf-designer__stage--highlighted': isHighlighted(stage.id),
            'wf-designer__stage--selected': isSelected(stage.id),
          }"
          :style="{
            '--stage-color': stage.color,
            opacity: stageOpacity(stage.id),
          }"
          :transform="`translate(20, ${20 + i * 130})`"
          role="button"
          :tabindex="0"
          :aria-label="`Lifecycle stage: ${stage.label}. ${stage.description}`"
          @click.stop="handleStageClick(stage, $event)"
          @keydown.enter.stop="handleStageClick(stage, $event as unknown as MouseEvent)"
          @keydown.space.prevent.stop="handleStageClick(stage, $event as unknown as MouseEvent)"
        >
          <rect x="-5" y="-5" width="230" height="80" rx="18" class="wf-designer__stage-glow" filter="url(#wf-glow-v)" />
          <rect x="0" y="0" width="220" height="70" rx="14" class="wf-designer__stage-bg" />
          <rect x="0" y="0" width="220" height="70" rx="14" class="wf-designer__stage-border" />
          <text x="16" y="24" class="wf-designer__stage-num">{{ String(i + 1).padStart(2, '0') }}</text>
          <text x="40" y="44" class="wf-designer__stage-label wf-designer__stage-label--vertical">{{ stage.label }}</text>
        </g>
      </svg>
    </div>

    <!-- Context label -->
    <div class="wf-designer__context">
      <span v-if="activeSection === 0" class="wf-designer__context-text">
        Every ML project starts with problem framing and data
      </span>
      <span v-else-if="activeSection === 1" class="wf-designer__context-text">
        Preprocessing and training form the core model development loop
      </span>
      <span v-else-if="activeSection === 2" class="wf-designer__context-text">
        Validation ensures quality; deployment brings value
      </span>
      <span v-else-if="activeSection === 3" class="wf-designer__context-text">
        Monitoring and feedback close the lifecycle loop
      </span>
    </div>
  </div>
</template>

<style scoped>
/* ── CSS Variables ── */
.wf-designer {
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

/* ── Header ── */
.wf-designer__header {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 4px;
}

.wf-designer__badge {
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

.wf-designer__title {
  margin: 0;
  font-family: 'Syne', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: var(--viz-text);
  letter-spacing: -0.01em;
}

.wf-designer__subtitle {
  margin: 0;
  font-size: 12px;
  color: var(--viz-text-muted);
  display: flex;
  align-items: center;
  gap: 8px;
}

.wf-designer__progress {
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

.wf-designer__progress--complete {
  color: var(--viz-accent-green);
  background: rgba(34, 197, 94, 0.1);
  border-color: rgba(34, 197, 94, 0.3);
}

/* ── Canvas ── */
.wf-designer__canvas {
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.wf-designer__svg {
  width: 100%;
  height: auto;
  overflow: visible;
}

.wf-designer__svg--vertical {
  display: none;
}

/* ── Connection Lines ── */
.wf-designer__connection-line {
  stroke: rgba(255, 255, 255, 0.08);
  stroke-width: 2;
  stroke-dasharray: 8 6;
  transition: stroke 0.5s ease;
  animation: wfDashFlow 1.2s linear infinite;
}

.wf-designer__connection-line--active {
  stroke: var(--viz-primary);
  stroke-opacity: 0.4;
}

@keyframes wfDashFlow {
  to { stroke-dashoffset: -28; }
}

/* ── Feedback Path ── */
.wf-designer__feedback-path {
  stroke: #f472b6;
  stroke-width: 1.5;
  stroke-dasharray: 6 4;
  stroke-opacity: 0;
  transition: stroke-opacity 0.8s ease;
  animation: wfDashReverse 1.5s linear infinite;
}

.wf-designer__feedback-path--visible {
  stroke-opacity: 0.4;
}

@keyframes wfDashReverse {
  to { stroke-dashoffset: 20; }
}

/* ── Stage Group ── */
.wf-designer__stage {
  cursor: pointer;
  transition: opacity 0.5s ease;
  outline: none;
}

.wf-designer__stage:focus-visible .wf-designer__stage-border {
  stroke: var(--viz-primary);
  stroke-opacity: 0.8;
  stroke-width: 2;
}

/* ── Stage Glow ── */
.wf-designer__stage-glow {
  fill: var(--stage-color);
  opacity: 0;
  transition: opacity 0.5s ease;
}

.wf-designer__stage--highlighted .wf-designer__stage-glow {
  opacity: 0.08;
}

.wf-designer__stage--selected .wf-designer__stage-glow {
  opacity: 0.18;
}

/* ── Stage Background ── */
.wf-designer__stage-bg {
  fill: var(--viz-card);
  transition: fill 0.3s ease;
}

.wf-designer__stage:hover .wf-designer__stage-bg {
  fill: #141933;
}

.wf-designer__stage--selected .wf-designer__stage-bg {
  fill: #181e3a;
}

/* ── Stage Border ── */
.wf-designer__stage-border {
  fill: none;
  stroke: var(--viz-border);
  stroke-width: 1;
  transition: stroke 0.4s ease, stroke-width 0.3s ease;
}

.wf-designer__stage--highlighted .wf-designer__stage-border {
  stroke: var(--stage-color);
  stroke-opacity: 0.35;
}

.wf-designer__stage--selected .wf-designer__stage-border {
  stroke: var(--stage-color);
  stroke-opacity: 0.7;
  stroke-width: 1.5;
}

/* ── Stage Texts ── */
.wf-designer__stage-num {
  fill: var(--stage-color);
  font-size: 10px;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  opacity: 0.5;
}

.wf-designer__stage--highlighted .wf-designer__stage-num {
  opacity: 1;
}

.wf-designer__stage-label {
  fill: var(--viz-text);
  font-size: 12px;
  font-family: 'Syne', sans-serif;
  font-weight: 600;
  transition: fill 0.3s ease;
}

.wf-designer__stage--selected .wf-designer__stage-label {
  fill: #ffffff;
}

.wf-designer__stage-label--vertical {
  font-size: 13px;
}

.wf-designer__stage-desc {
  fill: var(--viz-text-muted);
  font-size: 8px;
  font-family: 'Inter', sans-serif;
}

.wf-designer__stage-detail {
  fill: var(--stage-color);
  font-size: 8px;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  opacity: 0.7;
}

/* ── Tooltip ── */
.wf-designer__tooltip-foreign {
  pointer-events: none;
  overflow: visible;
}

.wf-designer__tooltip {
  pointer-events: auto;
  background: rgba(10, 14, 26, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 14px 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(20, 184, 166, 0.05);
  animation: wfTooltipIn 0.25s ease;
}

@keyframes wfTooltipIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

.wf-designer__tooltip-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.wf-designer__tooltip-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.wf-designer__tooltip-title {
  font-size: 13px;
  font-weight: 600;
  color: #ffffff;
  flex: 1;
  font-family: 'Syne', sans-serif;
}

.wf-designer__tooltip-close {
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

.wf-designer__tooltip-close:hover {
  background: rgba(255, 255, 255, 0.12);
  color: var(--viz-text);
}

.wf-designer__tooltip-desc {
  margin: 0 0 8px 0;
  font-size: 12px;
  line-height: 1.55;
  color: var(--viz-text-muted);
}

.wf-designer__tooltip-details {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.wf-designer__tooltip-tag {
  display: inline-flex;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 500;
  color: var(--viz-text-muted);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

/* ── Context ── */
.wf-designer__context {
  padding: 0 4px;
  min-height: 20px;
}

.wf-designer__context-text {
  font-size: 11px;
  color: var(--viz-text-muted);
  font-style: italic;
  opacity: 0.7;
  animation: wfContextIn 0.5s ease;
}

@keyframes wfContextIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 0.7; transform: translateY(0); }
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .wf-designer__svg--horizontal { display: none; }
  .wf-designer__svg--vertical { display: block; max-height: 70vh; }
  .wf-designer__title { font-size: 14px; }
}
</style>
