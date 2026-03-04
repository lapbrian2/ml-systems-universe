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
interface ConfusionMatrix {
  tp: number
  fp: number
  fn: number
  tn: number
}

interface FairnessMetric {
  name: string
  shortName: string
  description: string
  valueA: number
  valueB: number
  difference: number
  threshold: number
  pass: boolean
}

/* ── State ── */
const groupA = ref<ConfusionMatrix>({ tp: 80, fp: 10, fn: 15, tn: 95 })
const groupB = ref<ConfusionMatrix>({ tp: 60, fp: 25, fn: 30, tn: 85 })
const interactionCount = ref(0)
const exerciseEmitted = ref(false)
const selectedMetric = ref<string | null>(null)

/* ── Confusion matrix cell info ── */
const matrixCells = [
  { key: 'tp' as const, label: 'True Positive', row: 0, col: 0, color: '#00c896' },
  { key: 'fp' as const, label: 'False Positive', row: 0, col: 1, color: '#ff6b6b' },
  { key: 'fn' as const, label: 'False Negative', row: 1, col: 0, color: '#f0a500' },
  { key: 'tn' as const, label: 'True Negative', row: 1, col: 1, color: '#4a6aff' },
]

/* ── Derived metrics per group ── */
function computeMetrics(cm: ConfusionMatrix) {
  const total = cm.tp + cm.fp + cm.fn + cm.tn
  const positiveRate = (cm.tp + cm.fp) / total
  const tpr = cm.tp / Math.max(1, cm.tp + cm.fn) // sensitivity / recall
  const fpr = cm.fp / Math.max(1, cm.fp + cm.tn)
  const ppv = cm.tp / Math.max(1, cm.tp + cm.fp) // precision
  const accuracy = (cm.tp + cm.tn) / total
  return { positiveRate, tpr, fpr, ppv, accuracy, total }
}

/* ── Fairness metrics ── */
const fairnessMetrics = computed<FairnessMetric[]>(() => {
  const metricsA = computeMetrics(groupA.value)
  const metricsB = computeMetrics(groupB.value)

  return [
    {
      name: 'Demographic Parity',
      shortName: 'DP',
      description: 'Equal positive prediction rates across groups',
      valueA: metricsA.positiveRate,
      valueB: metricsB.positiveRate,
      difference: Math.abs(metricsA.positiveRate - metricsB.positiveRate),
      threshold: 0.1,
      pass: Math.abs(metricsA.positiveRate - metricsB.positiveRate) < 0.1,
    },
    {
      name: 'Equal Opportunity',
      shortName: 'EO',
      description: 'Equal true positive rates (sensitivity) across groups',
      valueA: metricsA.tpr,
      valueB: metricsB.tpr,
      difference: Math.abs(metricsA.tpr - metricsB.tpr),
      threshold: 0.1,
      pass: Math.abs(metricsA.tpr - metricsB.tpr) < 0.1,
    },
    {
      name: 'Equalized Odds',
      shortName: 'EOd',
      description: 'Equal TPR and FPR across groups',
      valueA: metricsA.tpr,
      valueB: metricsB.tpr,
      difference: Math.max(
        Math.abs(metricsA.tpr - metricsB.tpr),
        Math.abs(metricsA.fpr - metricsB.fpr)
      ),
      threshold: 0.1,
      pass: Math.max(
        Math.abs(metricsA.tpr - metricsB.tpr),
        Math.abs(metricsA.fpr - metricsB.fpr)
      ) < 0.1,
    },
    {
      name: 'Calibration',
      shortName: 'Cal',
      description: 'Equal precision (PPV) across groups',
      valueA: metricsA.ppv,
      valueB: metricsB.ppv,
      difference: Math.abs(metricsA.ppv - metricsB.ppv),
      threshold: 0.1,
      pass: Math.abs(metricsA.ppv - metricsB.ppv) < 0.1,
    },
  ]
})

const overallFairnessScore = computed(() => {
  const passed = fairnessMetrics.value.filter(m => m.pass).length
  return passed
})

/* ── Interaction tracking ── */
function trackInteraction() {
  interactionCount.value++
  if (interactionCount.value >= 3 && !exerciseEmitted.value) {
    exerciseEmitted.value = true
    emit('exerciseComplete')
  }
}

function handleCellChange(group: 'A' | 'B', key: keyof ConfusionMatrix, event: Event) {
  const target = event.target as HTMLInputElement
  const value = Math.max(0, Math.min(200, parseInt(target.value) || 0))
  if (group === 'A') {
    groupA.value = { ...groupA.value, [key]: value }
  } else {
    groupB.value = { ...groupB.value, [key]: value }
  }
  trackInteraction()
}

function handleMetricClick(name: string) {
  selectedMetric.value = selectedMetric.value === name ? null : name
  trackInteraction()
}

/* ── Progress ── */
const explorationProgress = computed(() => Math.min(interactionCount.value, 3))

/* ── Section highlight ── */
const highlightedMetricIndex = computed(() => {
  switch (props.activeSection) {
    case 0: return 0 // Demographic Parity
    case 1: return 1 // Equal Opportunity
    case 2: return 2 // Equalized Odds
    case 3: return 3 // Calibration
    default: return -1
  }
})

/* ── Reset on section change ── */
watch(
  () => props.activeSection,
  () => { selectedMetric.value = null }
)
</script>

<template>
  <div class="bias" role="region" aria-label="Fairness Metrics Calculator">
    <!-- Header -->
    <div class="bias__header">
      <span class="bias__badge">Interactive</span>
      <h3 class="bias__title">Bias Calculator</h3>
      <p class="bias__subtitle">
        Adjust confusion matrices to explore fairness metrics
        <span
          class="bias__progress"
          :class="{ 'bias__progress--complete': explorationProgress >= 3 }"
        >
          {{ explorationProgress }}/3
        </span>
      </p>
    </div>

    <!-- Main Visualization -->
    <div class="bias__canvas">
      <svg
        viewBox="0 0 800 440"
        class="bias__svg"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Fairness metrics visualization with confusion matrices and metric bars"
      >
        <defs>
          <filter id="bias-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <!-- Group A Confusion Matrix -->
        <g transform="translate(30, 30)">
          <text x="85" y="0" text-anchor="middle" class="bias__group-label">Group A</text>
          <text x="85" y="16" text-anchor="middle" class="bias__group-sub">
            (n={{ groupA.tp + groupA.fp + groupA.fn + groupA.tn }})
          </text>

          <!-- Matrix header labels -->
          <text x="60" y="42" text-anchor="middle" class="bias__matrix-header">Pred +</text>
          <text x="130" y="42" text-anchor="middle" class="bias__matrix-header">Pred -</text>
          <text x="5" y="80" text-anchor="middle" class="bias__matrix-side">Act +</text>
          <text x="5" y="140" text-anchor="middle" class="bias__matrix-side">Act -</text>

          <!-- Matrix cells -->
          <g v-for="cell in matrixCells" :key="`a-${cell.key}`">
            <rect
              :x="25 + cell.col * 70"
              :y="50 + cell.row * 60"
              width="65"
              height="55"
              rx="8"
              :fill="`${cell.color}10`"
              :stroke="`${cell.color}30`"
              stroke-width="1"
              class="bias__matrix-cell"
            />
            <text
              :x="57 + cell.col * 70"
              :y="72 + cell.row * 60"
              text-anchor="middle"
              class="bias__cell-label"
              :fill="cell.color"
            >
              {{ cell.label }}
            </text>

            <!-- Editable value via foreignObject -->
            <foreignObject
              :x="30 + cell.col * 70"
              :y="78 + cell.row * 60"
              width="55"
              height="24"
            >
              <input
                type="number"
                min="0"
                max="200"
                :value="groupA[cell.key]"
                class="bias__cell-input"
                :aria-label="`Group A ${cell.label} count`"
                @input="handleCellChange('A', cell.key, $event)"
              />
            </foreignObject>
          </g>
        </g>

        <!-- Group B Confusion Matrix -->
        <g transform="translate(220, 30)">
          <text x="85" y="0" text-anchor="middle" class="bias__group-label">Group B</text>
          <text x="85" y="16" text-anchor="middle" class="bias__group-sub">
            (n={{ groupB.tp + groupB.fp + groupB.fn + groupB.tn }})
          </text>

          <text x="60" y="42" text-anchor="middle" class="bias__matrix-header">Pred +</text>
          <text x="130" y="42" text-anchor="middle" class="bias__matrix-header">Pred -</text>
          <text x="5" y="80" text-anchor="middle" class="bias__matrix-side">Act +</text>
          <text x="5" y="140" text-anchor="middle" class="bias__matrix-side">Act -</text>

          <g v-for="cell in matrixCells" :key="`b-${cell.key}`">
            <rect
              :x="25 + cell.col * 70"
              :y="50 + cell.row * 60"
              width="65"
              height="55"
              rx="8"
              :fill="`${cell.color}10`"
              :stroke="`${cell.color}30`"
              stroke-width="1"
              class="bias__matrix-cell"
            />
            <text
              :x="57 + cell.col * 70"
              :y="72 + cell.row * 60"
              text-anchor="middle"
              class="bias__cell-label"
              :fill="cell.color"
            >
              {{ cell.label }}
            </text>

            <foreignObject
              :x="30 + cell.col * 70"
              :y="78 + cell.row * 60"
              width="55"
              height="24"
            >
              <input
                type="number"
                min="0"
                max="200"
                :value="groupB[cell.key]"
                class="bias__cell-input"
                :aria-label="`Group B ${cell.label} count`"
                @input="handleCellChange('B', cell.key, $event)"
              />
            </foreignObject>
          </g>
        </g>

        <!-- Fairness Metrics Panel -->
        <g transform="translate(430, 30)">
          <text x="170" y="0" text-anchor="middle" class="bias__metrics-title">Fairness Metrics</text>

          <!-- Overall score -->
          <rect x="90" y="10" width="160" height="36" rx="18" class="bias__score-bg" />
          <text x="170" y="34" text-anchor="middle" class="bias__score-text">
            {{ overallFairnessScore }}/{{ fairnessMetrics.length }} Passing
          </text>

          <!-- Individual metrics -->
          <g
            v-for="(metric, i) in fairnessMetrics"
            :key="metric.name"
            :transform="`translate(0, ${60 + i * 85})`"
            class="bias__metric"
            :class="{
              'bias__metric--highlighted': highlightedMetricIndex === i,
              'bias__metric--selected': selectedMetric === metric.name,
            }"
            role="button"
            :tabindex="0"
            :aria-label="`${metric.name}: ${metric.pass ? 'passing' : 'failing'}. Difference: ${(metric.difference * 100).toFixed(1)}%`"
            @click="handleMetricClick(metric.name)"
            @keydown.enter="handleMetricClick(metric.name)"
            @keydown.space.prevent="handleMetricClick(metric.name)"
          >
            <!-- Background -->
            <rect
              x="0"
              y="0"
              width="340"
              height="78"
              rx="10"
              class="bias__metric-bg"
              :class="{ 'bias__metric-bg--pass': metric.pass, 'bias__metric-bg--fail': !metric.pass }"
            />

            <!-- Name and status -->
            <text x="14" y="20" class="bias__metric-name">{{ metric.name }}</text>
            <rect
              x="270"
              y="6"
              width="56"
              height="22"
              rx="11"
              :fill="metric.pass ? 'rgba(0, 200, 150, 0.15)' : 'rgba(255, 107, 107, 0.15)'"
              :stroke="metric.pass ? 'rgba(0, 200, 150, 0.3)' : 'rgba(255, 107, 107, 0.3)'"
              stroke-width="1"
            />
            <text
              x="298"
              y="22"
              text-anchor="middle"
              class="bias__metric-status"
              :fill="metric.pass ? '#00c896' : '#ff6b6b'"
            >
              {{ metric.pass ? 'PASS' : 'FAIL' }}
            </text>

            <!-- Comparison bars -->
            <g transform="translate(14, 32)">
              <text x="0" y="10" class="bias__bar-label">A:</text>
              <rect x="22" y="2" width="200" height="10" rx="5" fill="rgba(255,255,255,0.04)" />
              <rect
                x="22"
                y="2"
                :width="200 * Math.min(1, metric.valueA)"
                height="10"
                rx="5"
                fill="#4a6aff"
                class="bias__metric-bar"
              />
              <text :x="22 + 200 * Math.min(1, metric.valueA) + 6" y="11" class="bias__bar-value">
                {{ (metric.valueA * 100).toFixed(1) }}%
              </text>
            </g>

            <g transform="translate(14, 50)">
              <text x="0" y="10" class="bias__bar-label">B:</text>
              <rect x="22" y="2" width="200" height="10" rx="5" fill="rgba(255,255,255,0.04)" />
              <rect
                x="22"
                y="2"
                :width="200 * Math.min(1, metric.valueB)"
                height="10"
                rx="5"
                fill="#a855f7"
                class="bias__metric-bar"
              />
              <text :x="22 + 200 * Math.min(1, metric.valueB) + 6" y="11" class="bias__bar-value">
                {{ (metric.valueB * 100).toFixed(1) }}%
              </text>
            </g>

            <!-- Threshold line -->
            <line
              x1="14"
              y1="68"
              :x2="14 + 312 * Math.min(1, metric.difference / 0.3)"
              y2="68"
              :stroke="metric.pass ? '#00c896' : '#ff6b6b'"
              stroke-width="2"
              stroke-linecap="round"
              class="bias__threshold-line"
            />
            <text x="14" y="76" class="bias__diff-label">
              Gap: {{ (metric.difference * 100).toFixed(1) }}% (threshold: {{ (metric.threshold * 100).toFixed(0) }}%)
            </text>
          </g>
        </g>

        <!-- Description panel for selected metric -->
        <g v-if="selectedMetric" transform="translate(30, 210)">
          <rect x="0" y="0" width="370" height="50" rx="8" class="bias__info-bg" />
          <text x="14" y="20" class="bias__info-title">
            {{ fairnessMetrics.find(m => m.name === selectedMetric)?.name }}
          </text>
          <text x="14" y="38" class="bias__info-desc">
            {{ fairnessMetrics.find(m => m.name === selectedMetric)?.description }}
          </text>
        </g>

        <!-- Accuracy comparison -->
        <g transform="translate(30, 280)">
          <rect x="0" y="0" width="370" height="60" rx="8" class="bias__info-bg" />
          <text x="14" y="20" class="bias__info-title">Overall Accuracy</text>
          <g transform="translate(14, 30)">
            <text x="0" y="10" class="bias__bar-label" fill="#4a6aff">A:</text>
            <rect x="22" y="2" width="150" height="8" rx="4" fill="rgba(255,255,255,0.04)" />
            <rect
              x="22"
              y="2"
              :width="150 * computeMetrics(groupA).accuracy"
              height="8"
              rx="4"
              fill="#4a6aff"
              class="bias__metric-bar"
            />
            <text :x="180" y="10" class="bias__bar-value">
              {{ (computeMetrics(groupA).accuracy * 100).toFixed(1) }}%
            </text>

            <text x="210" y="10" class="bias__bar-label" fill="#a855f7">B:</text>
            <rect x="228" y="2" width="120" height="8" rx="4" fill="rgba(255,255,255,0.04)" />
            <rect
              x="228"
              y="2"
              :width="120 * computeMetrics(groupB).accuracy"
              height="8"
              rx="4"
              fill="#a855f7"
              class="bias__metric-bar"
            />
            <text :x="355" y="10" class="bias__bar-value">
              {{ (computeMetrics(groupB).accuracy * 100).toFixed(1) }}%
            </text>
          </g>
        </g>
      </svg>
    </div>

    <!-- Context -->
    <div class="bias__context">
      <span v-if="activeSection === 0" class="bias__context-text">
        Demographic parity: equal positive prediction rates regardless of group membership
      </span>
      <span v-else-if="activeSection === 1" class="bias__context-text">
        Equal opportunity: the model should be equally good at detecting true positives
      </span>
      <span v-else-if="activeSection === 2" class="bias__context-text">
        Equalized odds: both TPR and FPR should be equal across groups
      </span>
      <span v-else class="bias__context-text">
        No single fairness metric can satisfy all criteria simultaneously
      </span>
    </div>
  </div>
</template>

<style scoped>
.bias {
  --viz-bg: #05070f;
  --viz-surface: #0a0e1a;
  --viz-card: #0f1325;
  --viz-border: rgba(255, 255, 255, 0.06);
  --viz-primary: #4a6aff;
  --viz-text: #e2e8f0;
  --viz-text-muted: rgba(255, 255, 255, 0.45);
  --viz-accent-green: #00c896;
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

.bias__header { display: flex; flex-direction: column; gap: 4px; padding: 0 4px; }

.bias__badge {
  display: inline-flex; align-self: flex-start; padding: 3px 10px; border-radius: 9999px;
  font-size: 10px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
  color: #a855f7; background: rgba(168, 85, 247, 0.1); border: 1px solid rgba(168, 85, 247, 0.2);
}

.bias__title {
  margin: 0; font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700;
  color: var(--viz-text); letter-spacing: -0.01em;
}

.bias__subtitle {
  margin: 0; font-size: 12px; color: var(--viz-text-muted);
  display: flex; align-items: center; gap: 8px;
}

.bias__progress {
  display: inline-flex; padding: 1px 8px; border-radius: 9999px; font-size: 11px; font-weight: 600;
  color: var(--viz-text-muted); background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06); transition: all 0.4s ease;
}

.bias__progress--complete {
  color: var(--viz-accent-green); background: rgba(0, 200, 150, 0.1);
  border-color: rgba(0, 200, 150, 0.3);
}

.bias__canvas { flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; }
.bias__svg { width: 100%; height: auto; overflow: visible; }

/* ── Groups ── */
.bias__group-label { fill: var(--viz-text); font-size: 14px; font-family: 'Syne', sans-serif; font-weight: 600; }
.bias__group-sub { fill: var(--viz-text-muted); font-size: 10px; font-family: 'Inter', sans-serif; }

/* ── Matrix ── */
.bias__matrix-header { fill: var(--viz-text-muted); font-size: 9px; font-family: 'Inter', sans-serif; font-weight: 500; }
.bias__matrix-side { fill: var(--viz-text-muted); font-size: 9px; font-family: 'Inter', sans-serif; font-weight: 500; }
.bias__matrix-cell { transition: fill 0.3s ease; }
.bias__cell-label { font-size: 7px; font-family: 'Inter', sans-serif; font-weight: 500; }

.bias__cell-input {
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  color: #e2e8f0;
  font-size: 13px;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  text-align: center;
  outline: none;
  padding: 0;
  -moz-appearance: textfield;
}

.bias__cell-input::-webkit-outer-spin-button,
.bias__cell-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.bias__cell-input:focus {
  border-color: var(--viz-primary);
  background: rgba(74, 106, 255, 0.08);
}

/* ── Metrics ── */
.bias__metrics-title { fill: var(--viz-text); font-size: 14px; font-family: 'Syne', sans-serif; font-weight: 700; }

.bias__score-bg { fill: var(--viz-card); stroke: var(--viz-border); stroke-width: 1; }
.bias__score-text { fill: var(--viz-text); font-size: 13px; font-family: 'Syne', sans-serif; font-weight: 600; }

.bias__metric { cursor: pointer; outline: none; }
.bias__metric:focus-visible .bias__metric-bg { stroke: var(--viz-primary); stroke-width: 2; }

.bias__metric-bg {
  fill: var(--viz-card); stroke: var(--viz-border); stroke-width: 1;
  transition: fill 0.3s ease, stroke 0.3s ease;
}
.bias__metric-bg--pass { stroke: rgba(0, 200, 150, 0.15); }
.bias__metric-bg--fail { stroke: rgba(255, 107, 107, 0.15); }
.bias__metric:hover .bias__metric-bg { fill: #141933; }
.bias__metric--highlighted .bias__metric-bg { stroke: var(--viz-primary); stroke-opacity: 0.4; }
.bias__metric--selected .bias__metric-bg { fill: #181e3a; stroke: var(--viz-primary); stroke-opacity: 0.6; }

.bias__metric-name { fill: var(--viz-text); font-size: 12px; font-family: 'Syne', sans-serif; font-weight: 600; }
.bias__metric-status { font-size: 9px; font-weight: 700; font-family: 'Inter', sans-serif; letter-spacing: 0.05em; }

.bias__bar-label { fill: var(--viz-text-muted); font-size: 9px; font-family: 'Inter', sans-serif; font-weight: 500; }
.bias__bar-value { fill: var(--viz-text-muted); font-size: 9px; font-family: 'Inter', sans-serif; }
.bias__metric-bar { transition: width 0.5s cubic-bezier(0.22, 1, 0.36, 1); }

.bias__threshold-line { transition: all 0.5s ease; }
.bias__diff-label { fill: var(--viz-text-muted); font-size: 8px; font-family: 'Inter', sans-serif; }

/* ── Info panel ── */
.bias__info-bg { fill: var(--viz-card); stroke: var(--viz-border); stroke-width: 1; }
.bias__info-title { fill: var(--viz-text); font-size: 11px; font-family: 'Syne', sans-serif; font-weight: 600; }
.bias__info-desc { fill: var(--viz-text-muted); font-size: 10px; font-family: 'Inter', sans-serif; }

/* ── Context ── */
.bias__context { padding: 0 4px; min-height: 20px; }
.bias__context-text {
  font-size: 11px; color: var(--viz-text-muted); font-style: italic; opacity: 0.7;
  animation: biasContextFadeIn 0.5s ease;
}

@keyframes biasContextFadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 0.7; transform: translateY(0); }
}

@media (max-width: 768px) {
  .bias__title { font-size: 14px; }
}
</style>
