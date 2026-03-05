<script setup lang="ts">
/**
 * FairnessMetricsComparison — Interactive textbook infographic (Ch 17)
 * Visual comparison of three fairness metrics:
 * Demographic Parity, Equalized Odds, and Calibration.
 * Each column shows a visual metaphor, definition, and math notation.
 */
import { ref } from 'vue'

const hoveredMetric = ref<string | null>(null)
</script>

<template>
  <div class="fairness-metrics">
    <p class="fairness-metrics__caption">
      Figure: Comparing Fairness Metrics
    </p>

    <svg
      class="fairness-metrics__svg"
      viewBox="0 0 900 420"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Comparison of three fairness metrics: Demographic Parity, Equalized Odds, and Calibration, each with visual metaphors and mathematical definitions."
    >
      <defs>
        <linearGradient id="fm-teal-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#14b8a6" stop-opacity="0.18" />
          <stop offset="100%" stop-color="#14b8a6" stop-opacity="0.06" />
        </linearGradient>
        <linearGradient id="fm-purple-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#a855f7" stop-opacity="0.18" />
          <stop offset="100%" stop-color="#a855f7" stop-opacity="0.06" />
        </linearGradient>
        <linearGradient id="fm-blue-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#5b78ff" stop-opacity="0.18" />
          <stop offset="100%" stop-color="#5b78ff" stop-opacity="0.06" />
        </linearGradient>
      </defs>

      <!-- Title -->
      <text x="450" y="30" text-anchor="middle" fill="white" font-family="Inter, sans-serif" font-size="16" font-weight="700" opacity="0.9">
        Fairness Metrics Comparison
      </text>

      <!-- Legend -->
      <g transform="translate(310, 45)">
        <rect x="0" y="0" width="10" height="10" rx="2" fill="#14b8a6" opacity="0.8" />
        <text x="16" y="9" fill="rgba(255,255,255,0.6)" font-family="Inter, sans-serif" font-size="10">Group A</text>
        <rect x="90" y="0" width="10" height="10" rx="2" fill="#a855f7" opacity="0.8" />
        <text x="106" y="9" fill="rgba(255,255,255,0.6)" font-family="Inter, sans-serif" font-size="10">Group B</text>
      </g>

      <!-- ══════════════════════════════════════ -->
      <!-- Column 1: Demographic Parity           -->
      <!-- ══════════════════════════════════════ -->
      <g
        transform="translate(20, 70)"
        class="fm-column"
        @mouseenter="hoveredMetric = 'dp'"
        @mouseleave="hoveredMetric = null"
      >
        <rect
          v-if="hoveredMetric === 'dp'"
          x="-5" y="-5" width="280" height="350" rx="16"
          fill="rgba(91, 120, 255, 0.04)"
          class="fm-glow"
        />
        <rect
          x="0" y="0" width="270" height="340" rx="14"
          :fill="hoveredMetric === 'dp' ? 'rgba(91, 120, 255, 0.08)' : 'url(#fm-blue-fill)'"
          class="fm-rect"
        />
        <rect
          x="0" y="0" width="270" height="340" rx="14"
          fill="none" stroke="#5b78ff"
          :stroke-width="hoveredMetric === 'dp' ? 1.5 : 1"
          :stroke-opacity="hoveredMetric === 'dp' ? 0.5 : 0.2"
          class="fm-rect"
        />

        <!-- Header -->
        <text x="135" y="32" text-anchor="middle" fill="#5b78ff" font-family="Inter, sans-serif" font-size="13" font-weight="700" opacity="0.9">
          Demographic Parity
        </text>
        <line x1="40" y1="42" x2="230" y2="42" stroke="#5b78ff" stroke-width="0.5" stroke-opacity="0.3" />

        <!-- Visual: Equal positive rate bars -->
        <text x="135" y="68" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-family="Inter, sans-serif" font-size="9" font-weight="500" letter-spacing="0.05em">
          POSITIVE PREDICTION RATE
        </text>

        <!-- Group A bar -->
        <text x="40" y="100" fill="#14b8a6" font-family="Inter, sans-serif" font-size="10" font-weight="600" opacity="0.8">Group A</text>
        <rect x="40" y="108" width="190" height="20" rx="4" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.06)" stroke-width="0.5" />
        <rect x="40" y="108" width="133" height="20" rx="4" fill="#14b8a6" fill-opacity="0.3" stroke="#14b8a6" stroke-width="0.8" stroke-opacity="0.5" />
        <text x="166" y="122" fill="#14b8a6" font-family="Inter, sans-serif" font-size="9" font-weight="600" opacity="0.9">70%</text>

        <!-- Group B bar -->
        <text x="40" y="152" fill="#a855f7" font-family="Inter, sans-serif" font-size="10" font-weight="600" opacity="0.8">Group B</text>
        <rect x="40" y="160" width="190" height="20" rx="4" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.06)" stroke-width="0.5" />
        <rect x="40" y="160" width="133" height="20" rx="4" fill="#a855f7" fill-opacity="0.3" stroke="#a855f7" stroke-width="0.8" stroke-opacity="0.5" />
        <text x="166" y="174" fill="#a855f7" font-family="Inter, sans-serif" font-size="9" font-weight="600" opacity="0.9">70%</text>

        <!-- Equal indicator -->
        <text x="135" y="205" text-anchor="middle" fill="#22c55e" font-family="Inter, sans-serif" font-size="11" font-weight="700" opacity="0.7">
          = Equal rates
        </text>

        <!-- Divider -->
        <line x1="20" y1="220" x2="250" y2="220" stroke="rgba(255,255,255,0.06)" stroke-width="0.5" />

        <!-- Definition -->
        <text x="135" y="244" text-anchor="middle" fill="rgba(255,255,255,0.6)" font-family="Inter, sans-serif" font-size="10" font-weight="400">
          Equal probability of positive
        </text>
        <text x="135" y="260" text-anchor="middle" fill="rgba(255,255,255,0.6)" font-family="Inter, sans-serif" font-size="10" font-weight="400">
          prediction across groups
        </text>

        <!-- Math notation -->
        <rect x="25" y="275" width="220" height="45" rx="8" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" stroke-width="0.5" />
        <text x="135" y="297" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-family="'Courier New', monospace" font-size="11">
          P(Y&#x0302;=1|A=a) = P(Y&#x0302;=1|A=b)
        </text>
        <text x="135" y="313" text-anchor="middle" fill="rgba(255,255,255,0.3)" font-family="Inter, sans-serif" font-size="8" font-style="italic">
          for all groups a, b
        </text>
      </g>

      <!-- ══════════════════════════════════════ -->
      <!-- Column 2: Equalized Odds               -->
      <!-- ══════════════════════════════════════ -->
      <g
        transform="translate(315, 70)"
        class="fm-column"
        @mouseenter="hoveredMetric = 'eo'"
        @mouseleave="hoveredMetric = null"
      >
        <rect
          v-if="hoveredMetric === 'eo'"
          x="-5" y="-5" width="280" height="350" rx="16"
          fill="rgba(91, 120, 255, 0.04)"
          class="fm-glow"
        />
        <rect
          x="0" y="0" width="270" height="340" rx="14"
          :fill="hoveredMetric === 'eo' ? 'rgba(91, 120, 255, 0.08)' : 'url(#fm-blue-fill)'"
          class="fm-rect"
        />
        <rect
          x="0" y="0" width="270" height="340" rx="14"
          fill="none" stroke="#5b78ff"
          :stroke-width="hoveredMetric === 'eo' ? 1.5 : 1"
          :stroke-opacity="hoveredMetric === 'eo' ? 0.5 : 0.2"
          class="fm-rect"
        />

        <!-- Header -->
        <text x="135" y="32" text-anchor="middle" fill="#5b78ff" font-family="Inter, sans-serif" font-size="13" font-weight="700" opacity="0.9">
          Equalized Odds
        </text>
        <line x1="40" y1="42" x2="230" y2="42" stroke="#5b78ff" stroke-width="0.5" stroke-opacity="0.3" />

        <!-- Visual: Equal TPR and FPR bars -->
        <text x="135" y="68" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-family="Inter, sans-serif" font-size="9" font-weight="500" letter-spacing="0.05em">
          TRUE POSITIVE RATE (TPR)
        </text>

        <!-- TPR Group A -->
        <text x="40" y="92" fill="#14b8a6" font-family="Inter, sans-serif" font-size="9" font-weight="600" opacity="0.7">A</text>
        <rect x="52" y="82" width="170" height="14" rx="3" fill="rgba(255,255,255,0.04)" />
        <rect x="52" y="82" width="136" height="14" rx="3" fill="#14b8a6" fill-opacity="0.3" stroke="#14b8a6" stroke-width="0.6" stroke-opacity="0.5" />
        <text x="182" y="93" fill="#14b8a6" font-family="Inter, sans-serif" font-size="8" font-weight="600" opacity="0.8">80%</text>

        <!-- TPR Group B -->
        <text x="40" y="115" fill="#a855f7" font-family="Inter, sans-serif" font-size="9" font-weight="600" opacity="0.7">B</text>
        <rect x="52" y="105" width="170" height="14" rx="3" fill="rgba(255,255,255,0.04)" />
        <rect x="52" y="105" width="136" height="14" rx="3" fill="#a855f7" fill-opacity="0.3" stroke="#a855f7" stroke-width="0.6" stroke-opacity="0.5" />
        <text x="182" y="116" fill="#a855f7" font-family="Inter, sans-serif" font-size="8" font-weight="600" opacity="0.8">80%</text>

        <!-- FPR section -->
        <text x="135" y="143" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-family="Inter, sans-serif" font-size="9" font-weight="500" letter-spacing="0.05em">
          FALSE POSITIVE RATE (FPR)
        </text>

        <!-- FPR Group A -->
        <text x="40" y="165" fill="#14b8a6" font-family="Inter, sans-serif" font-size="9" font-weight="600" opacity="0.7">A</text>
        <rect x="52" y="155" width="170" height="14" rx="3" fill="rgba(255,255,255,0.04)" />
        <rect x="52" y="155" width="34" height="14" rx="3" fill="#14b8a6" fill-opacity="0.3" stroke="#14b8a6" stroke-width="0.6" stroke-opacity="0.5" />
        <text x="80" y="166" fill="#14b8a6" font-family="Inter, sans-serif" font-size="8" font-weight="600" opacity="0.8">20%</text>

        <!-- FPR Group B -->
        <text x="40" y="188" fill="#a855f7" font-family="Inter, sans-serif" font-size="9" font-weight="600" opacity="0.7">B</text>
        <rect x="52" y="178" width="170" height="14" rx="3" fill="rgba(255,255,255,0.04)" />
        <rect x="52" y="178" width="34" height="14" rx="3" fill="#a855f7" fill-opacity="0.3" stroke="#a855f7" stroke-width="0.6" stroke-opacity="0.5" />
        <text x="80" y="189" fill="#a855f7" font-family="Inter, sans-serif" font-size="8" font-weight="600" opacity="0.8">20%</text>

        <!-- Equal indicator -->
        <text x="135" y="212" text-anchor="middle" fill="#22c55e" font-family="Inter, sans-serif" font-size="11" font-weight="700" opacity="0.7">
          = Equal TPR &amp; FPR
        </text>

        <!-- Divider -->
        <line x1="20" y1="224" x2="250" y2="224" stroke="rgba(255,255,255,0.06)" stroke-width="0.5" />

        <!-- Definition -->
        <text x="135" y="248" text-anchor="middle" fill="rgba(255,255,255,0.6)" font-family="Inter, sans-serif" font-size="10" font-weight="400">
          Equal TPR and FPR across
        </text>
        <text x="135" y="264" text-anchor="middle" fill="rgba(255,255,255,0.6)" font-family="Inter, sans-serif" font-size="10" font-weight="400">
          groups, conditioned on true label
        </text>

        <!-- Math notation -->
        <rect x="15" y="275" width="240" height="45" rx="8" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" stroke-width="0.5" />
        <text x="135" y="297" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-family="'Courier New', monospace" font-size="10">
          P(Y&#x0302;=1|Y=y,A=a) = P(Y&#x0302;=1|Y=y,A=b)
        </text>
        <text x="135" y="313" text-anchor="middle" fill="rgba(255,255,255,0.3)" font-family="Inter, sans-serif" font-size="8" font-style="italic">
          for y in {0, 1}
        </text>
      </g>

      <!-- ══════════════════════════════════════ -->
      <!-- Column 3: Calibration                   -->
      <!-- ══════════════════════════════════════ -->
      <g
        transform="translate(610, 70)"
        class="fm-column"
        @mouseenter="hoveredMetric = 'cal'"
        @mouseleave="hoveredMetric = null"
      >
        <rect
          v-if="hoveredMetric === 'cal'"
          x="-5" y="-5" width="280" height="350" rx="16"
          fill="rgba(91, 120, 255, 0.04)"
          class="fm-glow"
        />
        <rect
          x="0" y="0" width="270" height="340" rx="14"
          :fill="hoveredMetric === 'cal' ? 'rgba(91, 120, 255, 0.08)' : 'url(#fm-blue-fill)'"
          class="fm-rect"
        />
        <rect
          x="0" y="0" width="270" height="340" rx="14"
          fill="none" stroke="#5b78ff"
          :stroke-width="hoveredMetric === 'cal' ? 1.5 : 1"
          :stroke-opacity="hoveredMetric === 'cal' ? 0.5 : 0.2"
          class="fm-rect"
        />

        <!-- Header -->
        <text x="135" y="32" text-anchor="middle" fill="#5b78ff" font-family="Inter, sans-serif" font-size="13" font-weight="700" opacity="0.9">
          Calibration
        </text>
        <line x1="40" y1="42" x2="230" y2="42" stroke="#5b78ff" stroke-width="0.5" stroke-opacity="0.3" />

        <!-- Visual: Reliability diagram -->
        <text x="135" y="68" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-family="Inter, sans-serif" font-size="9" font-weight="500" letter-spacing="0.05em">
          RELIABILITY DIAGRAM
        </text>

        <!-- Chart area -->
        <g transform="translate(40, 78)">
          <!-- Grid background -->
          <rect x="0" y="0" width="190" height="120" rx="4" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.06)" stroke-width="0.5" />

          <!-- Grid lines -->
          <line x1="0" y1="30" x2="190" y2="30" stroke="rgba(255,255,255,0.04)" stroke-width="0.5" />
          <line x1="0" y1="60" x2="190" y2="60" stroke="rgba(255,255,255,0.04)" stroke-width="0.5" />
          <line x1="0" y1="90" x2="190" y2="90" stroke="rgba(255,255,255,0.04)" stroke-width="0.5" />
          <line x1="47.5" y1="0" x2="47.5" y2="120" stroke="rgba(255,255,255,0.04)" stroke-width="0.5" />
          <line x1="95" y1="0" x2="95" y2="120" stroke="rgba(255,255,255,0.04)" stroke-width="0.5" />
          <line x1="142.5" y1="0" x2="142.5" y2="120" stroke="rgba(255,255,255,0.04)" stroke-width="0.5" />

          <!-- Perfect calibration line (diagonal) -->
          <line x1="0" y1="120" x2="190" y2="0" stroke="rgba(255,255,255,0.15)" stroke-width="1" stroke-dasharray="4 3" />
          <text x="160" y="14" fill="rgba(255,255,255,0.25)" font-family="Inter, sans-serif" font-size="7" font-style="italic">ideal</text>

          <!-- Group A calibration curve (teal, close to diagonal) -->
          <polyline
            points="0,118 38,92 76,62 114,38 152,14 190,2"
            fill="none"
            stroke="#14b8a6"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-opacity="0.8"
          />
          <!-- Group A dots -->
          <circle cx="38" cy="92" r="3" fill="#14b8a6" opacity="0.7" />
          <circle cx="76" cy="62" r="3" fill="#14b8a6" opacity="0.7" />
          <circle cx="114" cy="38" r="3" fill="#14b8a6" opacity="0.7" />
          <circle cx="152" cy="14" r="3" fill="#14b8a6" opacity="0.7" />

          <!-- Group B calibration curve (purple, close to diagonal) -->
          <polyline
            points="0,116 38,88 76,58 114,34 152,12 190,4"
            fill="none"
            stroke="#a855f7"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-opacity="0.8"
          />
          <!-- Group B dots -->
          <circle cx="38" cy="88" r="3" fill="#a855f7" opacity="0.7" />
          <circle cx="76" cy="58" r="3" fill="#a855f7" opacity="0.7" />
          <circle cx="114" cy="34" r="3" fill="#a855f7" opacity="0.7" />
          <circle cx="152" cy="12" r="3" fill="#a855f7" opacity="0.7" />

          <!-- Axis labels -->
          <text x="95" y="136" text-anchor="middle" fill="rgba(255,255,255,0.35)" font-family="Inter, sans-serif" font-size="8">Predicted Probability</text>
          <text x="-8" y="65" text-anchor="middle" fill="rgba(255,255,255,0.35)" font-family="Inter, sans-serif" font-size="8" transform="rotate(-90, -8, 65)">Actual Frequency</text>
        </g>

        <!-- Both curves follow diagonal indicator -->
        <text x="135" y="228" text-anchor="middle" fill="#22c55e" font-family="Inter, sans-serif" font-size="11" font-weight="700" opacity="0.7">
          = Well-calibrated
        </text>

        <!-- Divider -->
        <line x1="20" y1="240" x2="250" y2="240" stroke="rgba(255,255,255,0.06)" stroke-width="0.5" />

        <!-- Definition -->
        <text x="135" y="264" text-anchor="middle" fill="rgba(255,255,255,0.6)" font-family="Inter, sans-serif" font-size="10" font-weight="400">
          Predicted probability matches
        </text>
        <text x="135" y="280" text-anchor="middle" fill="rgba(255,255,255,0.6)" font-family="Inter, sans-serif" font-size="10" font-weight="400">
          actual outcome frequency
        </text>

        <!-- Math notation -->
        <rect x="20" y="290" width="230" height="35" rx="8" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" stroke-width="0.5" />
        <text x="135" y="312" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-family="'Courier New', monospace" font-size="10">
          P(Y=1|S=s, A=a) = s,  for all s, a
        </text>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.fairness-metrics {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  font-family: 'Inter', sans-serif;
}

.fm-column {
  cursor: pointer;
}

.fm-rect {
  transition: fill 0.2s ease, stroke 0.2s ease, stroke-width 0.2s ease, stroke-opacity 0.2s ease;
}

.fm-glow {
  transition: opacity 0.2s ease;
}

.fairness-metrics__caption {
  margin: 0 0 12px 0;
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.35);
  text-align: center;
}

.fairness-metrics__svg {
  width: 100%;
  height: auto;
  display: block;
}
</style>
