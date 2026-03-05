<script setup lang="ts">
/**
 * RobustnessFailureModes — Interactive textbook infographic (Ch 16)
 * A matrix/grid showing ML failure modes:
 *   Rows: Data Drift, Concept Drift, Adversarial Input, Edge Cases, System Failures
 *   Columns: Detection Method, Impact Level, Mitigation Strategy
 * Each cell is a rounded rectangle with icon and short text.
 * Impact shown as color gradient (green=low, amber=medium, red=high).
 * Hover a row to highlight the full failure mode with expanded description.
 */
import { ref } from 'vue'

const hoveredRow = ref<string | null>(null)

interface FailureMode {
  id: string
  name: string
  description: string
  detection: string
  detectionIcon: string
  impact: 'low' | 'medium' | 'high'
  mitigation: string
  mitigationDetail: string
}

const impactColors: Record<string, string> = {
  low: '#22c55e',
  medium: '#f0a500',
  high: '#ef4444',
}

const impactLabels: Record<string, string> = {
  low: 'LOW',
  medium: 'MEDIUM',
  high: 'HIGH',
}

const failureModes: FailureMode[] = [
  {
    id: 'data-drift',
    name: 'Data Drift',
    description: 'Input distribution shifts from training data over time, causing silent accuracy degradation',
    detection: 'Statistical tests (KS, PSI)',
    detectionIcon: 'chart',
    impact: 'high',
    mitigation: 'Continuous monitoring',
    mitigationDetail: 'Automated retraining triggers, feature drift dashboards, sliding window validation',
  },
  {
    id: 'concept-drift',
    name: 'Concept Drift',
    description: 'The relationship between features and target changes, invalidating learned patterns',
    detection: 'Performance decay tracking',
    detectionIcon: 'trend',
    impact: 'high',
    mitigation: 'Periodic retraining',
    mitigationDetail: 'Online learning, adaptive windowing, concept drift detectors (ADWIN, DDM)',
  },
  {
    id: 'adversarial',
    name: 'Adversarial Input',
    description: 'Deliberately crafted inputs designed to fool the model into incorrect predictions',
    detection: 'Input perturbation analysis',
    detectionIcon: 'shield',
    impact: 'high',
    mitigation: 'Adversarial training',
    mitigationDetail: 'Certified defenses, input sanitization, ensemble voting, gradient masking',
  },
  {
    id: 'edge-cases',
    name: 'Edge Cases',
    description: 'Rare or unusual inputs not well-represented in training data, causing unpredictable behavior',
    detection: 'Coverage analysis',
    detectionIcon: 'search',
    impact: 'medium',
    mitigation: 'Data augmentation',
    mitigationDetail: 'Synthetic data generation, boundary testing, metamorphic testing, fuzzing',
  },
  {
    id: 'system-fail',
    name: 'System Failures',
    description: 'Infrastructure failures: OOM, timeout, dependency outage, corrupted model artifacts',
    detection: 'Health checks & alerts',
    detectionIcon: 'pulse',
    impact: 'medium',
    mitigation: 'Redundancy & fallbacks',
    mitigationDetail: 'Circuit breakers, graceful degradation, model caching, rollback automation',
  },
]

const columns = ['Detection Method', 'Impact Level', 'Mitigation Strategy']
const colX = [310, 490, 630]
const colW = [150, 110, 160]
const rowY0 = 90
const rowH = 72
</script>

<template>
  <div class="robustness-matrix">
    <p class="robustness-matrix__caption">
      Figure: ML Failure Modes &amp; Mitigation Matrix
    </p>

    <svg
      class="robustness-matrix__svg"
      viewBox="0 0 840 520"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Matrix showing five ML failure modes (Data Drift, Concept Drift, Adversarial Input, Edge Cases, System Failures) with their detection methods, impact levels, and mitigation strategies."
    >
      <defs>
        <linearGradient id="rm-header-fill" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#5b78ff" stop-opacity="0.12" />
          <stop offset="100%" stop-color="#5b78ff" stop-opacity="0.04" />
        </linearGradient>
      </defs>

      <!-- Header row -->
      <rect x="20" y="40" width="250" height="36" rx="8" fill="url(#rm-header-fill)" />
      <rect x="20" y="40" width="250" height="36" rx="8" fill="none" stroke="#5b78ff" stroke-width="0.8" stroke-opacity="0.2" />
      <text x="145" y="63" text-anchor="middle" fill="#5b78ff" font-family="Inter, sans-serif" font-size="10" font-weight="700" letter-spacing="0.05em">FAILURE MODE</text>

      <g v-for="(col, ci) in columns" :key="col">
        <rect :x="colX[ci]" y="40" :width="colW[ci]" height="36" rx="8" fill="url(#rm-header-fill)" />
        <rect :x="colX[ci]" y="40" :width="colW[ci]" height="36" rx="8" fill="none" stroke="#5b78ff" stroke-width="0.8" stroke-opacity="0.2" />
        <text :x="colX[ci] + colW[ci] / 2" y="63" text-anchor="middle" fill="#5b78ff" font-family="Inter, sans-serif" font-size="10" font-weight="700" letter-spacing="0.05em">
          {{ col.toUpperCase() }}
        </text>
      </g>

      <!-- Data rows -->
      <g
        v-for="(fm, ri) in failureModes"
        :key="fm.id"
        class="rm-row"
        @mouseenter="hoveredRow = fm.id"
        @mouseleave="hoveredRow = null"
      >
        <!-- Row highlight on hover -->
        <rect
          v-if="hoveredRow === fm.id"
          x="16" :y="rowY0 + ri * rowH - 2"
          width="808" :height="rowH - 4" rx="10"
          fill="rgba(255,255,255,0.02)"
        />

        <!-- Failure mode name cell -->
        <rect
          x="20" :y="rowY0 + ri * rowH" width="250" :height="rowH - 8" rx="8"
          :fill="hoveredRow === fm.id ? `${impactColors[fm.impact]}10` : 'rgba(255,255,255,0.02)'"
          class="rm-cell"
        />
        <rect
          x="20" :y="rowY0 + ri * rowH" width="250" :height="rowH - 8" rx="8"
          fill="none"
          :stroke="hoveredRow === fm.id ? impactColors[fm.impact] : 'rgba(255,255,255,0.06)'"
          :stroke-width="hoveredRow === fm.id ? 1.2 : 0.6"
          class="rm-cell"
        />

        <!-- Row number -->
        <circle :cx="40" :cy="rowY0 + ri * rowH + (rowH - 8) / 2" r="10" :fill="`${impactColors[fm.impact]}15`" :stroke="impactColors[fm.impact]" stroke-width="0.6" stroke-opacity="0.3" />
        <text :x="40" :y="rowY0 + ri * rowH + (rowH - 8) / 2 + 4" text-anchor="middle" :fill="impactColors[fm.impact]" font-family="Inter, sans-serif" font-size="9" font-weight="700">{{ ri + 1 }}</text>

        <!-- Name -->
        <text :x="60" :y="rowY0 + ri * rowH + 24" fill="white" font-family="Inter, sans-serif" font-size="11" font-weight="700">{{ fm.name }}</text>

        <!-- Short desc (visible) -->
        <text
          v-if="hoveredRow !== fm.id"
          :x="60" :y="rowY0 + ri * rowH + 42"
          fill="rgba(255,255,255,0.35)" font-family="Inter, sans-serif" font-size="8"
        >{{ fm.description.substring(0, 40) }}...</text>

        <!-- Full desc on hover -->
        <text
          v-if="hoveredRow === fm.id"
          :x="60" :y="rowY0 + ri * rowH + 40"
          fill="rgba(255,255,255,0.5)" font-family="Inter, sans-serif" font-size="8"
        >{{ fm.description.substring(0, 48) }}</text>
        <text
          v-if="hoveredRow === fm.id"
          :x="60" :y="rowY0 + ri * rowH + 52"
          fill="rgba(255,255,255,0.4)" font-family="Inter, sans-serif" font-size="8"
        >{{ fm.description.substring(48) }}</text>

        <!-- Detection cell -->
        <rect
          :x="colX[0]" :y="rowY0 + ri * rowH" :width="colW[0]" :height="rowH - 8" rx="8"
          :fill="hoveredRow === fm.id ? 'rgba(20,184,166,0.06)' : 'rgba(255,255,255,0.02)'"
          class="rm-cell"
        />
        <rect
          :x="colX[0]" :y="rowY0 + ri * rowH" :width="colW[0]" :height="rowH - 8" rx="8"
          fill="none"
          :stroke="hoveredRow === fm.id ? '#14b8a6' : 'rgba(255,255,255,0.06)'"
          :stroke-width="hoveredRow === fm.id ? 0.8 : 0.6"
          class="rm-cell"
        />
        <!-- Detection icon: chart -->
        <g v-if="fm.detectionIcon === 'chart'" :transform="`translate(${colX[0] + 10}, ${rowY0 + ri * rowH + 12})`" opacity="0.6">
          <polyline points="0,16 5,10 10,14 15,4 20,8" fill="none" stroke="#14b8a6" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
        </g>
        <g v-if="fm.detectionIcon === 'trend'" :transform="`translate(${colX[0] + 10}, ${rowY0 + ri * rowH + 12})`" opacity="0.6">
          <polyline points="0,14 8,6 14,10 20,2" fill="none" stroke="#14b8a6" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
          <polyline points="14,2 20,2 20,8" fill="none" stroke="#14b8a6" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" />
        </g>
        <g v-if="fm.detectionIcon === 'shield'" :transform="`translate(${colX[0] + 10}, ${rowY0 + ri * rowH + 10})`" opacity="0.6">
          <path d="M 10 1 L 1 5 v 6 c 0 5.5 3.8 10.5 9 12 c 5.2 -1.5 9 -6.5 9 -12 V 5 Z" fill="none" stroke="#14b8a6" stroke-width="1.2" />
        </g>
        <g v-if="fm.detectionIcon === 'search'" :transform="`translate(${colX[0] + 10}, ${rowY0 + ri * rowH + 12})`" opacity="0.6">
          <circle cx="8" cy="8" r="6" fill="none" stroke="#14b8a6" stroke-width="1.2" />
          <line x1="12.5" y1="12.5" x2="18" y2="18" stroke="#14b8a6" stroke-width="1.2" stroke-linecap="round" />
        </g>
        <g v-if="fm.detectionIcon === 'pulse'" :transform="`translate(${colX[0] + 10}, ${rowY0 + ri * rowH + 12})`" opacity="0.6">
          <polyline points="0,10 5,10 8,2 11,18 14,10 20,10" fill="none" stroke="#14b8a6" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
        </g>
        <text :x="colX[0] + 38" :y="rowY0 + ri * rowH + 26" fill="rgba(255,255,255,0.6)" font-family="Inter, sans-serif" font-size="9" font-weight="600">{{ fm.detection.split('(')[0].trim() }}</text>
        <text
          v-if="fm.detection.includes('(')"
          :x="colX[0] + 38" :y="rowY0 + ri * rowH + 40"
          fill="rgba(255,255,255,0.3)" font-family="Inter, sans-serif" font-size="8"
        >({{ fm.detection.split('(')[1] }}</text>
        <text
          v-else
          :x="colX[0] + 38" :y="rowY0 + ri * rowH + 40"
          fill="rgba(255,255,255,0.3)" font-family="Inter, sans-serif" font-size="8"
        >{{ fm.detection.length > 24 ? '' : '' }}</text>

        <!-- Impact cell -->
        <rect
          :x="colX[1]" :y="rowY0 + ri * rowH" :width="colW[1]" :height="rowH - 8" rx="8"
          :fill="hoveredRow === fm.id ? `${impactColors[fm.impact]}10` : 'rgba(255,255,255,0.02)'"
          class="rm-cell"
        />
        <rect
          :x="colX[1]" :y="rowY0 + ri * rowH" :width="colW[1]" :height="rowH - 8" rx="8"
          fill="none"
          :stroke="hoveredRow === fm.id ? impactColors[fm.impact] : 'rgba(255,255,255,0.06)'"
          :stroke-width="hoveredRow === fm.id ? 0.8 : 0.6"
          class="rm-cell"
        />
        <!-- Impact badge -->
        <rect
          :x="colX[1] + colW[1] / 2 - 30" :y="rowY0 + ri * rowH + 14"
          width="60" height="20" rx="10"
          :fill="`${impactColors[fm.impact]}20`"
          :stroke="impactColors[fm.impact]" stroke-width="0.8" stroke-opacity="0.5"
        />
        <text
          :x="colX[1] + colW[1] / 2" :y="rowY0 + ri * rowH + 28"
          text-anchor="middle" :fill="impactColors[fm.impact]" font-family="Inter, sans-serif" font-size="8" font-weight="700"
        >{{ impactLabels[fm.impact] }}</text>
        <!-- Impact bar -->
        <rect :x="colX[1] + 15" :y="rowY0 + ri * rowH + 42" :width="colW[1] - 30" height="6" rx="3" fill="rgba(255,255,255,0.05)" />
        <rect
          :x="colX[1] + 15" :y="rowY0 + ri * rowH + 42"
          :width="(colW[1] - 30) * (fm.impact === 'high' ? 1.0 : fm.impact === 'medium' ? 0.6 : 0.3)"
          height="6" rx="3" :fill="impactColors[fm.impact]" fill-opacity="0.4"
        />

        <!-- Mitigation cell -->
        <rect
          :x="colX[2]" :y="rowY0 + ri * rowH" :width="colW[2]" :height="rowH - 8" rx="8"
          :fill="hoveredRow === fm.id ? 'rgba(168,85,247,0.06)' : 'rgba(255,255,255,0.02)'"
          class="rm-cell"
        />
        <rect
          :x="colX[2]" :y="rowY0 + ri * rowH" :width="colW[2]" :height="rowH - 8" rx="8"
          fill="none"
          :stroke="hoveredRow === fm.id ? '#a855f7' : 'rgba(255,255,255,0.06)'"
          :stroke-width="hoveredRow === fm.id ? 0.8 : 0.6"
          class="rm-cell"
        />
        <text :x="colX[2] + 14" :y="rowY0 + ri * rowH + 26" fill="rgba(255,255,255,0.6)" font-family="Inter, sans-serif" font-size="9" font-weight="600">{{ fm.mitigation }}</text>
        <text
          v-if="hoveredRow !== fm.id"
          :x="colX[2] + 14" :y="rowY0 + ri * rowH + 42"
          fill="rgba(255,255,255,0.3)" font-family="Inter, sans-serif" font-size="7"
        >Hover for details</text>
        <text
          v-if="hoveredRow === fm.id"
          :x="colX[2] + 14" :y="rowY0 + ri * rowH + 42"
          fill="#a855f7" font-family="Inter, sans-serif" font-size="7" opacity="0.7"
        >{{ fm.mitigationDetail.substring(0, 38) }}</text>
        <text
          v-if="hoveredRow === fm.id"
          :x="colX[2] + 14" :y="rowY0 + ri * rowH + 54"
          fill="#a855f7" font-family="Inter, sans-serif" font-size="7" opacity="0.5"
        >{{ fm.mitigationDetail.substring(38) }}</text>
      </g>

      <!-- Legend -->
      <g transform="translate(20, 465)">
        <text x="0" y="10" fill="rgba(255,255,255,0.25)" font-family="Inter, sans-serif" font-size="9" font-weight="600" letter-spacing="0.05em">IMPACT LEVELS:</text>
        <rect x="110" y="1" width="10" height="10" rx="3" fill="#22c55e" opacity="0.6" />
        <text x="126" y="10" fill="rgba(255,255,255,0.45)" font-family="Inter, sans-serif" font-size="9">Low</text>
        <rect x="160" y="1" width="10" height="10" rx="3" fill="#f0a500" opacity="0.6" />
        <text x="176" y="10" fill="rgba(255,255,255,0.45)" font-family="Inter, sans-serif" font-size="9">Medium</text>
        <rect x="228" y="1" width="10" height="10" rx="3" fill="#ef4444" opacity="0.6" />
        <text x="244" y="10" fill="rgba(255,255,255,0.45)" font-family="Inter, sans-serif" font-size="9">High</text>
      </g>

      <g transform="translate(20, 490)">
        <text x="0" y="10" fill="rgba(255,255,255,0.15)" font-family="Inter, sans-serif" font-size="8" font-style="italic">Hover any row to see expanded descriptions and detailed mitigation strategies</text>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.robustness-matrix {
  width: 100%;
  max-width: 840px;
  margin: 0 auto;
  font-family: 'Inter', sans-serif;
}

.rm-row {
  cursor: pointer;
}

.rm-cell {
  transition: fill 0.2s ease, stroke 0.2s ease, stroke-width 0.2s ease;
}

.robustness-matrix__caption {
  margin: 0 0 12px 0;
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.35);
  text-align: center;
}

.robustness-matrix__svg {
  width: 100%;
  height: auto;
  display: block;
}
</style>
