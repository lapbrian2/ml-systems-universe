<script setup lang="ts">
/**
 * ModelLifecycle -- Interactive textbook infographic (Ch. 5)
 * Circular/cyclical diagram showing the ML lifecycle stages:
 *   Problem Definition -> Data Collection -> Data Preparation ->
 *   Model Training -> Evaluation -> Deployment -> Monitoring -> (repeat)
 * Hover a stage to expand it showing 3-4 substeps.
 * Active stage pulses with a glow effect.
 * Center shows "ML Lifecycle" with total stages count.
 */
import { ref } from 'vue'

const hoveredStage = ref<number | null>(null)

interface LifecycleStage {
  id: number
  name: string
  shortName: string
  color: string
  substeps: string[]
}

const stages: LifecycleStage[] = [
  { id: 0, name: 'Problem Definition', shortName: 'Problem', color: '#ec4899', substeps: ['Define objectives', 'Identify metrics', 'Scope constraints', 'Stakeholder alignment'] },
  { id: 1, name: 'Data Collection', shortName: 'Collect', color: '#f0a500', substeps: ['Source identification', 'Data ingestion', 'Schema validation', 'Labeling strategy'] },
  { id: 2, name: 'Data Preparation', shortName: 'Prepare', color: '#14b8a6', substeps: ['Cleaning & dedup', 'Feature engineering', 'Train/test split', 'Augmentation'] },
  { id: 3, name: 'Model Training', shortName: 'Train', color: '#3b82f6', substeps: ['Architecture selection', 'Hyperparameter tuning', 'Distributed training', 'Experiment tracking'] },
  { id: 4, name: 'Evaluation', shortName: 'Evaluate', color: '#a855f7', substeps: ['Metrics computation', 'Error analysis', 'Fairness audit', 'A/B testing plan'] },
  { id: 5, name: 'Deployment', shortName: 'Deploy', color: '#22c55e', substeps: ['Containerization', 'Canary rollout', 'Load testing', 'Rollback strategy'] },
  { id: 6, name: 'Monitoring', shortName: 'Monitor', color: '#ef4444', substeps: ['Data drift detection', 'Performance tracking', 'Alert thresholds', 'Retraining triggers'] },
]

const totalStages = stages.length
const cx = 400
const cy = 240
const radius = 170

function stageX(index: number): number {
  const angle = (2 * Math.PI * index) / totalStages - Math.PI / 2
  return cx + radius * Math.cos(angle)
}

function stageY(index: number): number {
  const angle = (2 * Math.PI * index) / totalStages - Math.PI / 2
  return cy + radius * Math.sin(angle)
}

function arrowPath(fromIdx: number, toIdx: number): string {
  const fromAngle = (2 * Math.PI * fromIdx) / totalStages - Math.PI / 2
  const toAngle = (2 * Math.PI * toIdx) / totalStages - Math.PI / 2
  const midAngle = (fromAngle + toAngle) / 2
  const arcRadius = radius + 20

  const x1 = cx + (radius + 30) * Math.cos(fromAngle + 0.08)
  const y1 = cy + (radius + 30) * Math.sin(fromAngle + 0.08)
  const mx = cx + arcRadius * Math.cos(midAngle)
  const my = cy + arcRadius * Math.sin(midAngle)
  const x2 = cx + (radius + 30) * Math.cos(toAngle - 0.08)
  const y2 = cy + (radius + 30) * Math.sin(toAngle - 0.08)

  return `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`
}

function substepX(stageIdx: number, subIdx: number): number {
  const angle = (2 * Math.PI * stageIdx) / totalStages - Math.PI / 2
  const dir = angle
  const base = cx + (radius + 70) * Math.cos(dir)
  return base
}

function substepY(stageIdx: number, subIdx: number): number {
  const angle = (2 * Math.PI * stageIdx) / totalStages - Math.PI / 2
  const base = cy + (radius + 70) * Math.sin(angle)
  return base + subIdx * 16 - 24
}
</script>

<template>
  <div class="model-lifecycle">
    <p class="model-lifecycle__caption">
      Figure: ML Model Lifecycle
    </p>

    <svg
      class="model-lifecycle__svg"
      viewBox="0 0 800 500"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Circular ML lifecycle diagram with 7 stages: Problem Definition, Data Collection, Data Preparation, Model Training, Evaluation, Deployment, and Monitoring, connected by curved arrows in a continuous cycle."
    >
      <defs>
        <marker id="mlc-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="rgba(255,255,255,0.2)" />
        </marker>

        <!-- Pulse animation filter -->
        <filter id="mlc-pulse">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <!-- Curved arrows between stages -->
      <path
        v-for="(stage, idx) in stages"
        :key="'arc-' + idx"
        :d="arrowPath(idx, (idx + 1) % totalStages)"
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        stroke-width="1.5"
        marker-end="url(#mlc-arrow)"
      />

      <!-- Center label -->
      <circle :cx="cx" :cy="cy" r="60" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.06)" stroke-width="1" />
      <text :x="cx" :y="cy - 10" text-anchor="middle" fill="white" font-family="Inter, sans-serif" font-size="14" font-weight="700">
        ML Lifecycle
      </text>
      <text :x="cx" :y="cy + 10" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-family="Inter, sans-serif" font-size="11">
        {{ totalStages }} stages
      </text>
      <text :x="cx" :y="cy + 28" text-anchor="middle" fill="rgba(255,255,255,0.2)" font-family="Inter, sans-serif" font-size="9">
        Continuous iteration
      </text>

      <!-- Stage nodes -->
      <g
        v-for="(stage, idx) in stages"
        :key="stage.id"
        class="mlc-stage"
        @mouseenter="hoveredStage = idx"
        @mouseleave="hoveredStage = null"
      >
        <!-- Pulsing glow for hovered stage -->
        <circle
          v-if="hoveredStage === idx"
          :cx="stageX(idx)" :cy="stageY(idx)" r="34"
          :fill="`${stage.color}10`"
          :stroke="stage.color"
          stroke-width="0.5"
          stroke-opacity="0.3"
          class="mlc-glow-pulse"
        />

        <!-- Main node circle -->
        <circle
          :cx="stageX(idx)" :cy="stageY(idx)" r="28"
          :fill="hoveredStage === idx ? `${stage.color}20` : `${stage.color}10`"
          :stroke="stage.color"
          :stroke-width="hoveredStage === idx ? 1.8 : 1"
          :stroke-opacity="hoveredStage === idx ? 0.7 : 0.35"
          class="mlc-circle"
        />

        <!-- Stage number -->
        <text
          :x="stageX(idx)" :y="stageY(idx) - 4"
          text-anchor="middle"
          :fill="stage.color" font-family="Inter, sans-serif" font-size="9" font-weight="700"
          opacity="0.6"
        >
          {{ idx + 1 }}
        </text>

        <!-- Stage short name -->
        <text
          :x="stageX(idx)" :y="stageY(idx) + 10"
          text-anchor="middle"
          fill="white" font-family="Inter, sans-serif" font-size="10" font-weight="600"
        >
          {{ stage.shortName }}
        </text>

        <!-- Expanded substeps on hover -->
        <g v-if="hoveredStage === idx">
          <!-- Full name label -->
          <text
            :x="substepX(idx, 0)" :y="substepY(idx, 0) - 14"
            text-anchor="middle"
            :fill="stage.color" font-family="Inter, sans-serif" font-size="10" font-weight="600"
            opacity="0.9"
          >
            {{ stage.name }}
          </text>
          <!-- Substep items -->
          <text
            v-for="(sub, si) in stage.substeps"
            :key="si"
            :x="substepX(idx, si)"
            :y="substepY(idx, si)"
            text-anchor="middle"
            fill="rgba(255,255,255,0.5)" font-family="Inter, sans-serif" font-size="8"
          >
            {{ sub }}
          </text>
        </g>
      </g>

      <!-- Hover instruction -->
      <text x="400" y="490" text-anchor="middle" fill="rgba(255,255,255,0.15)" font-family="Inter, sans-serif" font-size="8" font-style="italic">
        Hover each stage to see substeps
      </text>
    </svg>
  </div>
</template>

<style scoped>
.model-lifecycle {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  font-family: 'Inter', sans-serif;
}

.mlc-stage {
  cursor: pointer;
}

.mlc-circle {
  transition: fill 0.2s ease, stroke 0.2s ease, stroke-width 0.2s ease, stroke-opacity 0.2s ease;
}

.mlc-glow-pulse {
  animation: mlc-pulse-anim 2s ease-in-out infinite;
}

@keyframes mlc-pulse-anim {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

.model-lifecycle__caption {
  margin: 0 0 12px 0;
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.35);
  text-align: center;
}

.model-lifecycle__svg {
  width: 100%;
  height: auto;
  display: block;
}
</style>
