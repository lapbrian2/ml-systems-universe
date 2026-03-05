<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

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
  icon: string
  color: string
  duration: string
  description: string
  tools: string[]
  phase: 'build' | 'validate' | 'deploy'
}

interface TooltipState {
  visible: boolean
  x: number
  y: number
  stage: PipelineStage | null
}

/* ── Pipeline stages ── */
const stages: PipelineStage[] = [
  {
    id: 'commit',
    label: 'Code Commit',
    shortLabel: 'Commit',
    icon: 'git',
    color: '#14b8a6',
    duration: '~1s',
    description: 'Developer pushes code changes. Git hooks run linting and formatting checks before commit.',
    tools: ['Git', 'Pre-commit', 'Husky'],
    phase: 'build',
  },
  {
    id: 'build',
    label: 'Build & Package',
    shortLabel: 'Build',
    icon: 'box',
    color: '#a855f7',
    duration: '~5m',
    description: 'Build Docker containers, package model artifacts, and resolve dependencies.',
    tools: ['Docker', 'Poetry', 'Bazel'],
    phase: 'build',
  },
  {
    id: 'unit-tests',
    label: 'Unit Tests',
    shortLabel: 'Tests',
    icon: 'check',
    color: '#a855f7',
    duration: '~3m',
    description: 'Run data validation tests, model unit tests, and pipeline integration tests.',
    tools: ['pytest', 'Great Expectations', 'TFX'],
    phase: 'validate',
  },
  {
    id: 'training',
    label: 'Training',
    shortLabel: 'Train',
    icon: 'brain',
    color: '#ec4899',
    duration: '~2h',
    description: 'Train or fine-tune the model on latest data. Track metrics and hyperparameters.',
    tools: ['MLflow', 'W&B', 'Ray Train'],
    phase: 'validate',
  },
  {
    id: 'validation',
    label: 'Validation',
    shortLabel: 'Validate',
    icon: 'shield',
    color: '#f0a500',
    duration: '~15m',
    description: 'Evaluate model quality, fairness metrics, and regression tests against baseline.',
    tools: ['ML Test Score', 'Fairlearn', 'Deepchecks'],
    phase: 'validate',
  },
  {
    id: 'registry',
    label: 'Model Registry',
    shortLabel: 'Registry',
    icon: 'archive',
    color: '#22c55e',
    duration: '~1m',
    description: 'Version and register the model with metadata. Promote to staging if validation passes.',
    tools: ['MLflow Registry', 'Vertex AI', 'DVC'],
    phase: 'validate',
  },
  {
    id: 'staging',
    label: 'Staging',
    shortLabel: 'Stage',
    icon: 'server',
    color: '#5b78ff',
    duration: '~10m',
    description: 'Deploy to staging environment. Run integration tests and load testing.',
    tools: ['Kubernetes', 'Seldon', 'BentoML'],
    phase: 'deploy',
  },
  {
    id: 'ab-test',
    label: 'A/B Testing',
    shortLabel: 'A/B Test',
    icon: 'split',
    color: '#10b981',
    duration: '~24h',
    description: 'Route traffic between old and new model. Measure business metrics and model quality.',
    tools: ['Istio', 'LaunchDarkly', 'Optimizely'],
    phase: 'deploy',
  },
  {
    id: 'production',
    label: 'Production',
    shortLabel: 'Prod',
    icon: 'rocket',
    color: '#22c55e',
    duration: 'Continuous',
    description: 'Full traffic cutover to new model. Monitor for drift, latency, and error rates.',
    tools: ['Prometheus', 'Grafana', 'PagerDuty'],
    phase: 'deploy',
  },
]

/* ── Constants ── */
const SVG_W = 900
const SVG_H = 380
const PIPE_Y = 160
const NODE_R = 28
const START_X = 60
const SPACING = (SVG_W - 120) / (stages.length - 1)

/* ── Scroll-driven animation state ── */
// How many stages are "complete" based on scroll progress
const scrollCompletedCount = computed(() => {
  if (!props.scrollProgress) return -1
  return props.scrollProgress * stages.length
})

// Is a given stage index "lit up" by scroll?
function isScrollLit(index: number): boolean {
  return scrollCompletedCount.value >= 0 && index < scrollCompletedCount.value
}

// Scroll-driven success indicator: stage is "passing" when fully scrolled past
function scrollStageStatus(index: number): 'idle' | 'running' | 'passed' {
  const completed = scrollCompletedCount.value
  if (completed < 0) return 'idle'
  if (index < completed - 0.5) return 'passed'
  if (index < completed) return 'running'
  return 'idle'
}

// Scroll-driven particle position (overrides timer-based when scrolling)
const scrollParticleX = computed(() => {
  if (!props.scrollProgress) return null
  const idx = props.scrollProgress * (stages.length - 1)
  const base = Math.floor(idx)
  const frac = idx - base
  if (base >= stages.length - 1) return stageX(stages.length - 1)
  return stageX(base) + frac * SPACING
})

/* ── Animation state ── */
const flowProgress = ref(0)
const flowTimer = ref<ReturnType<typeof setInterval> | null>(null)

function startFlow() {
  if (flowTimer.value) clearInterval(flowTimer.value)
  flowProgress.value = 0
  flowTimer.value = setInterval(() => {
    if (flowProgress.value < stages.length - 1) {
      flowProgress.value += 0.05
    } else {
      flowProgress.value = 0
    }
  }, 60)
}

onMounted(() => startFlow())

onUnmounted(() => {
  if (flowTimer.value) clearInterval(flowTimer.value)
})

/* ── Interaction state ── */
const clickedStages = ref<Set<string>>(new Set())
const selectedStage = ref<string | null>(null)
const exerciseEmitted = ref(false)
const tooltip = ref<TooltipState>({ visible: false, x: 0, y: 0, stage: null })

function handleStageClick(stage: PipelineStage, event: MouseEvent) {
  selectedStage.value = stage.id
  clickedStages.value = new Set([...clickedStages.value, stage.id])

  const svg = (event.currentTarget as SVGElement).closest('svg')
  if (svg) {
    const rect = svg.getBoundingClientRect()
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

/* ── Stage x position ── */
function stageX(index: number): number {
  return START_X + index * SPACING
}

/* ── Section highlights ── */
const highlightedPhase = computed<string | null>(() => {
  switch (props.activeSection) {
    case 0: return 'build'
    case 1: return 'validate'
    case 2: return 'deploy'
    case 3: return null
    default: return null
  }
})

function stageOpacity(stage: PipelineStage, index?: number): number {
  if (selectedStage.value === stage.id) return 1
  // Scroll-driven sequential lighting
  if (props.scrollProgress > 0 && index !== undefined) {
    const completed = scrollCompletedCount.value
    if (index < completed) return 1
    if (index < completed + 1) return 0.4 + (completed - index + 1) * 0.6
    return 0.15
  }
  if (highlightedPhase.value === null) return 0.85
  return stage.phase === highlightedPhase.value ? 1 : 0.2
}

/* ── Flow particle position ── */
const particleX = computed(() => {
  const idx = Math.floor(flowProgress.value)
  const frac = flowProgress.value - idx
  if (idx >= stages.length - 1) return stageX(stages.length - 1)
  return stageX(idx) + frac * SPACING
})

const particleActive = computed(() => {
  const idx = Math.floor(flowProgress.value)
  if (idx >= stages.length) return stages[stages.length - 1]
  return stages[idx]
})

/* ── Section info ── */
const sectionInfo = computed(() => {
  switch (props.activeSection) {
    case 0: return 'Build phase: code, containers, and artifact packaging'
    case 1: return 'Validation phase: testing, training, and model quality gates'
    case 2: return 'Deploy phase: staging, canary testing, and production rollout'
    case 3: return 'End-to-end ML CI/CD pipeline with automated quality gates'
    default: return 'Click pipeline stages to explore each step'
  }
})

const explorationProgress = computed(() => Math.min(clickedStages.value.size, 3))

watch(() => props.activeSection, () => {
  tooltip.value.visible = false
  selectedStage.value = null
})
</script>

<template>
  <div class="cicd" @click.self="closeTooltip">
    <!-- Header -->
    <div class="cicd__header">
      <span class="cicd__badge">Interactive</span>
      <h3 class="cicd__title">ML CI/CD Pipeline</h3>
      <p class="cicd__subtitle">
        Click stages to explore
        <span
          class="cicd__progress"
          :class="{ 'cicd__progress--complete': explorationProgress >= 3 }"
        >
          {{ explorationProgress }}/3
        </span>
      </p>
    </div>

    <!-- Phase labels -->
    <div class="cicd__phases">
      <span
        class="cicd__phase"
        :class="{ 'cicd__phase--active': highlightedPhase === 'build' || highlightedPhase === null }"
      >
        Build
      </span>
      <span
        class="cicd__phase"
        :class="{ 'cicd__phase--active': highlightedPhase === 'validate' || highlightedPhase === null }"
      >
        Validate
      </span>
      <span
        class="cicd__phase"
        :class="{ 'cicd__phase--active': highlightedPhase === 'deploy' || highlightedPhase === null }"
      >
        Deploy
      </span>
    </div>

    <!-- SVG -->
    <div class="cicd__canvas">
      <svg
        :viewBox="`0 0 ${SVG_W} ${SVG_H}`"
        class="cicd__svg"
        preserveAspectRatio="xMidYMid meet"
        @click.self="closeTooltip"
      >
        <defs>
          <filter id="ci-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="ci-glow-strong" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <marker
            id="ci-arrow"
            markerWidth="8"
            markerHeight="6"
            refX="8"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 8 3, 0 6" fill="rgba(20,184,166,0.4)" />
          </marker>
        </defs>

        <!-- Phase background regions -->
        <rect
          :x="START_X - 35"
          :y="PIPE_Y - 70"
          :width="SPACING * 2 + 20"
          height="140"
          rx="12"
          fill="rgba(20,184,166,0.03)"
          :stroke="highlightedPhase === 'build' ? 'rgba(20,184,166,0.15)' : 'rgba(255,255,255,0.02)'"
          stroke-width="1"
          class="cicd__phase-bg"
        />
        <rect
          :x="START_X + SPACING * 2 - 15"
          :y="PIPE_Y - 70"
          :width="SPACING * 4 + 20"
          height="140"
          rx="12"
          fill="rgba(168,85,247,0.02)"
          :stroke="highlightedPhase === 'validate' ? 'rgba(168,85,247,0.15)' : 'rgba(255,255,255,0.02)'"
          stroke-width="1"
          class="cicd__phase-bg"
        />
        <rect
          :x="START_X + SPACING * 6 - 15"
          :y="PIPE_Y - 70"
          :width="SPACING * 2 + 50"
          height="140"
          rx="12"
          fill="rgba(0,200,150,0.02)"
          :stroke="highlightedPhase === 'deploy' ? 'rgba(0,200,150,0.15)' : 'rgba(255,255,255,0.02)'"
          stroke-width="1"
          class="cicd__phase-bg"
        />

        <!-- Connection lines -->
        <line
          v-for="(_, i) in stages.slice(0, -1)"
          :key="`conn-${i}`"
          :x1="stageX(i) + NODE_R + 2"
          :y1="PIPE_Y"
          :x2="stageX(i + 1) - NODE_R - 2"
          :y2="PIPE_Y"
          stroke="rgba(255,255,255,0.08)"
          stroke-width="2"
          stroke-dasharray="6 4"
          marker-end="url(#ci-arrow)"
          class="cicd__connection"
          :class="{
            'cicd__connection--active': stageOpacity(stages[i], i) > 0.5 && stageOpacity(stages[i + 1], i + 1) > 0.5,
            'cicd__connection--scroll-lit': isScrollLit(i) && isScrollLit(i + 1),
          }"
        />

        <!-- Flow particle (scroll-driven when scrolling, timer-based otherwise) -->
        <circle
          :cx="scrollParticleX ?? particleX"
          :cy="PIPE_Y"
          r="4"
          :fill="particleActive.color"
          filter="url(#ci-glow)"
          class="cicd__particle"
        />
        <circle
          :cx="scrollParticleX ?? particleX"
          :cy="PIPE_Y"
          r="8"
          :fill="particleActive.color"
          opacity="0.15"
        />

        <!-- Stage nodes -->
        <g
          v-for="(stage, i) in stages"
          :key="stage.id"
          class="cicd__stage"
          :class="{
            'cicd__stage--selected': selectedStage === stage.id,
            'cicd__stage--clicked': clickedStages.has(stage.id),
          }"
          :style="{ opacity: stageOpacity(stage, i) }"
          role="button"
          :tabindex="0"
          :aria-label="`${stage.label}: ${stage.description}`"
          @click.stop="handleStageClick(stage, $event)"
          @keydown.enter.stop="handleStageClick(stage, $event as unknown as MouseEvent)"
          @keydown.space.prevent.stop="handleStageClick(stage, $event as unknown as MouseEvent)"
        >
          <!-- Glow ring -->
          <circle
            :cx="stageX(i)"
            :cy="PIPE_Y"
            :r="selectedStage === stage.id ? NODE_R + 10 : NODE_R + 4"
            :fill="stage.color"
            :opacity="selectedStage === stage.id ? 0.12 : 0.04"
            :filter="selectedStage === stage.id ? 'url(#ci-glow-strong)' : 'url(#ci-glow)'"
          />
          <!-- Node circle -->
          <circle
            :cx="stageX(i)"
            :cy="PIPE_Y"
            :r="NODE_R"
            fill="#0f1325"
            :stroke="stage.color"
            :stroke-width="selectedStage === stage.id ? 2.5 : 1.5"
            :stroke-opacity="selectedStage === stage.id ? 0.9 : 0.5"
            class="cicd__stage-circle"
          />

          <!-- Icons -->
          <g :transform="`translate(${stageX(i) - 10}, ${PIPE_Y - 10})`" :fill="stage.color" opacity="0.8">
            <g v-if="stage.icon === 'git'">
              <circle cx="10" cy="5" r="2.5" />
              <circle cx="10" cy="15" r="2.5" />
              <line x1="10" y1="7.5" x2="10" y2="12.5" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.6" />
            </g>
            <g v-else-if="stage.icon === 'box'">
              <rect x="2" y="4" width="16" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.5" />
              <line x1="2" y1="9" x2="18" y2="9" stroke="currentColor" stroke-width="1" stroke-opacity="0.4" />
            </g>
            <g v-else-if="stage.icon === 'check'">
              <polyline points="4,10 8,15 16,5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </g>
            <g v-else-if="stage.icon === 'brain'">
              <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" stroke-width="1.5" />
              <path d="M 6 6 Q 10 10 6 14" fill="none" stroke="currentColor" stroke-width="1" stroke-opacity="0.5" />
              <path d="M 14 6 Q 10 10 14 14" fill="none" stroke="currentColor" stroke-width="1" stroke-opacity="0.5" />
            </g>
            <g v-else-if="stage.icon === 'shield'">
              <path d="M 10 2 L 2 6 L 2 12 C 2 16 10 19 10 19 C 10 19 18 16 18 12 L 18 6 Z" fill="none" stroke="currentColor" stroke-width="1.5" />
              <polyline points="7,10 9,13 13,7" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            </g>
            <g v-else-if="stage.icon === 'archive'">
              <rect x="2" y="3" width="16" height="5" rx="1" fill="none" stroke="currentColor" stroke-width="1.5" />
              <rect x="4" y="8" width="12" height="9" rx="1" fill="none" stroke="currentColor" stroke-width="1.5" />
              <line x1="8" y1="12" x2="12" y2="12" stroke="currentColor" stroke-width="1.5" />
            </g>
            <g v-else-if="stage.icon === 'server'">
              <rect x="2" y="2" width="16" height="6" rx="2" fill="none" stroke="currentColor" stroke-width="1.5" />
              <rect x="2" y="12" width="16" height="6" rx="2" fill="none" stroke="currentColor" stroke-width="1.5" />
              <circle cx="14" cy="5" r="1" fill="currentColor" />
              <circle cx="14" cy="15" r="1" fill="currentColor" />
            </g>
            <g v-else-if="stage.icon === 'split'">
              <line x1="3" y1="10" x2="8" y2="10" stroke="currentColor" stroke-width="1.5" />
              <line x1="8" y1="10" x2="17" y2="4" stroke="currentColor" stroke-width="1.5" />
              <line x1="8" y1="10" x2="17" y2="16" stroke="currentColor" stroke-width="1.5" />
              <circle cx="17" cy="4" r="2" fill="none" stroke="currentColor" stroke-width="1.5" />
              <circle cx="17" cy="16" r="2" fill="none" stroke="currentColor" stroke-width="1.5" />
            </g>
            <g v-else-if="stage.icon === 'rocket'">
              <path d="M 10 2 C 6 6 5 12 5 16 L 10 13 L 15 16 C 15 12 14 6 10 2 Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
              <circle cx="10" cy="9" r="1.5" fill="currentColor" />
            </g>
          </g>

          <!-- Label -->
          <text
            :x="stageX(i)"
            :y="PIPE_Y + NODE_R + 18"
            text-anchor="middle"
            class="cicd__stage-label"
            :fill="selectedStage === stage.id ? stage.color : undefined"
          >
            {{ stage.shortLabel }}
          </text>

          <!-- Duration label -->
          <text
            :x="stageX(i)"
            :y="PIPE_Y + NODE_R + 32"
            text-anchor="middle"
            class="cicd__stage-duration"
          >
            {{ stage.duration }}
          </text>

          <!-- Scroll-driven status indicator -->
          <g v-if="scrollStageStatus(i) === 'passed'">
            <circle
              :cx="stageX(i) + NODE_R - 4"
              :cy="PIPE_Y - NODE_R + 4"
              r="7"
              fill="#22c55e"
              class="cicd__scroll-check-bg"
            />
            <text
              :x="stageX(i) + NODE_R - 4"
              :y="PIPE_Y - NODE_R + 8"
              text-anchor="middle"
              fill="#fff"
              font-size="9"
              font-weight="700"
            >&#x2713;</text>
          </g>
          <circle
            v-else-if="scrollStageStatus(i) === 'running'"
            :cx="stageX(i) + NODE_R - 4"
            :cy="PIPE_Y - NODE_R + 4"
            r="5"
            fill="none"
            :stroke="stage.color"
            stroke-width="2"
            class="cicd__scroll-spinner"
          />
        </g>

        <!-- Tooltip -->
        <foreignObject
          v-if="tooltip.visible && tooltip.stage"
          :x="Math.min(Math.max(tooltip.x - 145, 10), SVG_W - 310)"
          :y="tooltip.y < 200 ? tooltip.y + 15 : tooltip.y - 170"
          width="290"
          height="165"
          class="cicd__tooltip-foreign"
        >
          <div class="cicd__tooltip" @click.stop>
            <div class="cicd__tooltip-header">
              <span class="cicd__tooltip-dot" :style="{ background: tooltip.stage.color }" />
              <span class="cicd__tooltip-title">{{ tooltip.stage.label }}</span>
              <span class="cicd__tooltip-phase">{{ tooltip.stage.phase }}</span>
              <button class="cicd__tooltip-close" aria-label="Close tooltip" @click.stop="closeTooltip">&times;</button>
            </div>
            <p class="cicd__tooltip-desc">{{ tooltip.stage.description }}</p>
            <div class="cicd__tooltip-tools">
              <span class="cicd__tooltip-tools-label">Tools:</span>
              <span
                v-for="tool in tooltip.stage.tools"
                :key="tool"
                class="cicd__tooltip-tool"
              >
                {{ tool }}
              </span>
            </div>
            <div class="cicd__tooltip-duration">
              Duration: {{ tooltip.stage.duration }}
            </div>
          </div>
        </foreignObject>
      </svg>
    </div>

    <!-- Context -->
    <div class="cicd__context">
      <span class="cicd__context-text">{{ sectionInfo }}</span>
    </div>
  </div>
</template>

<style scoped>
.cicd {
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

.cicd__header {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 4px;
}

.cicd__badge {
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

.cicd__title {
  margin: 0;
  font-family: 'Syne', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: var(--viz-text);
}

.cicd__subtitle {
  margin: 0;
  font-size: 12px;
  color: var(--viz-text-muted);
  display: flex;
  align-items: center;
  gap: 8px;
}

.cicd__progress {
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

.cicd__progress--complete {
  color: var(--viz-accent-green);
  background: rgba(34, 197, 94, 0.1);
  border-color: rgba(34, 197, 94, 0.3);
}

.cicd__phases {
  display: flex;
  gap: 8px;
  padding: 0 4px;
}

.cicd__phase {
  padding: 3px 10px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--viz-text-muted);
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--viz-border);
  transition: all 0.4s ease;
}

.cicd__phase--active {
  color: var(--viz-primary);
  background: rgba(20, 184, 166, 0.08);
  border-color: rgba(20, 184, 166, 0.25);
}

.cicd__canvas {
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cicd__svg {
  width: 100%;
  height: auto;
  overflow: visible;
}

.cicd__phase-bg {
  transition: stroke 0.5s ease;
}

.cicd__connection {
  transition: stroke 0.4s ease;
  animation: dashFlow 1.5s linear infinite;
}

.cicd__connection--active {
  stroke: rgba(20, 184, 166, 0.2);
}

@keyframes dashFlow {
  to { stroke-dashoffset: -20; }
}

.cicd__particle {
  transition: fill 0.3s ease;
}

.cicd__stage {
  cursor: pointer;
  transition: opacity 0.5s ease;
  outline: none;
}

.cicd__stage:focus-visible .cicd__stage-circle {
  stroke-width: 3;
  stroke-opacity: 1;
}

.cicd__stage-circle {
  transition: stroke-width 0.3s ease, stroke-opacity 0.3s ease;
}

.cicd__stage:hover .cicd__stage-circle {
  stroke-opacity: 0.8;
  stroke-width: 2;
}

.cicd__stage-label {
  fill: var(--viz-text-muted);
  font-size: 10px;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  transition: fill 0.3s ease;
}

.cicd__stage--selected .cicd__stage-label {
  font-weight: 600;
}

.cicd__stage-duration {
  fill: var(--viz-text-muted);
  font-size: 8px;
  font-family: 'Inter', sans-serif;
  opacity: 0.5;
}

.cicd__tooltip-foreign {
  pointer-events: none;
  overflow: visible;
}

.cicd__tooltip {
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

.cicd__tooltip-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
}

.cicd__tooltip-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.cicd__tooltip-title {
  font-size: 12px;
  font-weight: 600;
  color: #ffffff;
  flex: 1;
  font-family: 'Syne', sans-serif;
}

.cicd__tooltip-phase {
  font-size: 8px;
  font-weight: 600;
  padding: 1px 5px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: rgba(20, 184, 166, 0.15);
  color: var(--viz-primary);
}

.cicd__tooltip-close {
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

.cicd__tooltip-close:hover {
  background: rgba(255, 255, 255, 0.12);
}

.cicd__tooltip-desc {
  margin: 0 0 8px 0;
  font-size: 11px;
  line-height: 1.5;
  color: var(--viz-text-muted);
}

.cicd__tooltip-tools {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
  margin-bottom: 6px;
}

.cicd__tooltip-tools-label {
  font-size: 9px;
  color: var(--viz-text-muted);
  font-weight: 500;
}

.cicd__tooltip-tool {
  font-size: 9px;
  padding: 1px 6px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: var(--viz-text);
}

.cicd__tooltip-duration {
  font-size: 10px;
  color: var(--viz-text-muted);
  font-weight: 500;
}

.cicd__context {
  padding: 0 4px;
  min-height: 20px;
}

.cicd__context-text {
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

/* ── Scroll-driven status indicators ── */
.cicd__scroll-check-bg {
  animation: cicdCheckIn 0.3s ease;
}

@keyframes cicdCheckIn {
  from { r: 0; opacity: 0; }
  to { r: 7; opacity: 1; }
}

.cicd__scroll-spinner {
  stroke-dasharray: 12 8;
  animation: cicdSpin 1s linear infinite;
}

@keyframes cicdSpin {
  to { stroke-dashoffset: -40; }
}

.cicd__connection--scroll-lit {
  stroke: rgba(20, 184, 166, 0.35);
}

/* ── Reduced motion ── */
@media (prefers-reduced-motion: reduce) {
  .cicd__scroll-check-bg,
  .cicd__scroll-spinner {
    animation: none;
  }
  .cicd__connection {
    animation: none;
  }
}

@media (max-width: 768px) {
  .cicd__title { font-size: 14px; }
  .cicd__phases { gap: 4px; }
  .cicd__phase { font-size: 9px; padding: 2px 6px; }
}
</style>
