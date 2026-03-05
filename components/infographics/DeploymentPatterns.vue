<script setup lang="ts">
/**
 * DeploymentPatterns — Interactive textbook infographic
 * Shows a deployment strategy flowchart:
 *   Blue Deployment → Canary → Shadow → A/B Test → Full Rollout
 * Each node is a card with traffic percentage annotations.
 * Arrows show progression with risk/confidence labels.
 * Color gradient from cautious (blue) to confident (green).
 */
import { ref } from 'vue'

const hoveredStage = ref<string | null>(null)

interface DeployStage {
  id: string
  name: string
  traffic: string
  desc: string
  risk: string
  color: string
}

const stages: DeployStage[] = [
  { id: 'blue', name: 'Blue/Green', traffic: '0% → 100%', desc: 'Two identical environments; instant switch', risk: 'Lowest Risk', color: '#3b82f6' },
  { id: 'canary', name: 'Canary', traffic: '1-5%', desc: 'Small subset gets new version first', risk: 'Low Risk', color: '#14b8a6' },
  { id: 'shadow', name: 'Shadow', traffic: '0% (mirror)', desc: 'New version processes traffic silently', risk: 'Zero User Impact', color: '#a855f7' },
  { id: 'ab', name: 'A/B Test', traffic: '50/50 split', desc: 'Statistical comparison of versions', risk: 'Measured Risk', color: '#eab308' },
  { id: 'full', name: 'Full Rollout', traffic: '100%', desc: 'New version serves all traffic', risk: 'Validated', color: '#22c55e' },
]

const edgeLabels = [
  'validated metrics',
  'no anomalies',
  'collect results',
  'significance reached',
]
</script>

<template>
  <div class="deploy-patterns">
    <p class="deploy-patterns__caption">
      Figure: ML Model Deployment Strategies
    </p>

    <!-- Desktop / wide layout -->
    <svg
      class="deploy-patterns__svg deploy-patterns__svg--horizontal"
      viewBox="0 0 1060 340"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Deployment strategy flowchart showing progression from Blue/Green deployment through Canary, Shadow, A/B Testing to Full Rollout, with risk levels and traffic percentages for each stage."
    >
      <defs>
        <linearGradient id="dp-blue-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.18" />
          <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.06" />
        </linearGradient>
        <linearGradient id="dp-canary-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#14b8a6" stop-opacity="0.18" />
          <stop offset="100%" stop-color="#14b8a6" stop-opacity="0.06" />
        </linearGradient>
        <linearGradient id="dp-shadow-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#a855f7" stop-opacity="0.18" />
          <stop offset="100%" stop-color="#a855f7" stop-opacity="0.06" />
        </linearGradient>
        <linearGradient id="dp-ab-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#eab308" stop-opacity="0.18" />
          <stop offset="100%" stop-color="#eab308" stop-opacity="0.06" />
        </linearGradient>
        <linearGradient id="dp-full-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#22c55e" stop-opacity="0.18" />
          <stop offset="100%" stop-color="#22c55e" stop-opacity="0.06" />
        </linearGradient>

        <!-- Confidence gradient bar -->
        <linearGradient id="dp-confidence-bar" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.5" />
          <stop offset="25%" stop-color="#14b8a6" stop-opacity="0.5" />
          <stop offset="50%" stop-color="#a855f7" stop-opacity="0.5" />
          <stop offset="75%" stop-color="#eab308" stop-opacity="0.5" />
          <stop offset="100%" stop-color="#22c55e" stop-opacity="0.5" />
        </linearGradient>

        <marker id="dp-arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="rgba(255,255,255,0.25)" />
        </marker>
      </defs>

      <!-- Confidence gradient bar at top -->
      <rect x="30" y="18" width="1000" height="4" rx="2" fill="url(#dp-confidence-bar)" />
      <text x="30" y="14" fill="rgba(255,255,255,0.25)" font-family="Inter, sans-serif" font-size="8" font-weight="500">CAUTIOUS</text>
      <text x="1030" y="14" text-anchor="end" fill="rgba(255,255,255,0.25)" font-family="Inter, sans-serif" font-size="8" font-weight="500">CONFIDENT</text>

      <!-- ── Stage 0: Blue/Green ── -->
      <g
        class="dp-stage"
        @mouseenter="hoveredStage = 'blue'"
        @mouseleave="hoveredStage = null"
      >
        <rect
          v-if="hoveredStage === 'blue'"
          x="17" y="37" width="186" height="186" rx="14"
          fill="#3b82f608" class="dp-glow"
        />
        <rect
          x="20" y="40" width="180" height="180" rx="12"
          :fill="hoveredStage === 'blue' ? '#3b82f618' : 'url(#dp-blue-fill)'"
          class="dp-rect"
        />
        <rect
          x="20" y="40" width="180" height="180" rx="12"
          fill="none" stroke="#3b82f6"
          :stroke-width="hoveredStage === 'blue' ? 1.5 : 1"
          :stroke-opacity="hoveredStage === 'blue' ? 0.6 : 0.3"
          class="dp-rect"
        />

        <!-- Step number badge -->
        <circle cx="42" cy="60" r="10" fill="#3b82f620" stroke="#3b82f6" stroke-width="0.8" stroke-opacity="0.4" />
        <text x="42" y="64" text-anchor="middle" fill="#3b82f6" font-family="Inter, sans-serif" font-size="10" font-weight="700">1</text>

        <text x="58" y="64" fill="white" font-family="Inter, sans-serif" font-size="13" font-weight="700">Blue/Green</text>

        <!-- Traffic badge -->
        <rect x="40" y="78" width="80" height="20" rx="6" fill="#3b82f615" stroke="#3b82f6" stroke-width="0.6" stroke-opacity="0.3" />
        <text x="80" y="92" text-anchor="middle" fill="#3b82f6" font-family="Inter, sans-serif" font-size="9" font-weight="600">0% → 100%</text>

        <!-- Two environment boxes -->
        <rect x="38" y="108" width="66" height="30" rx="5" fill="#3b82f610" stroke="#3b82f6" stroke-width="0.6" stroke-opacity="0.25" />
        <text x="71" y="125" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-family="Inter, sans-serif" font-size="8">Blue (old)</text>
        <rect x="116" y="108" width="66" height="30" rx="5" fill="#3b82f618" stroke="#3b82f6" stroke-width="0.8" stroke-opacity="0.4" />
        <text x="149" y="125" text-anchor="middle" fill="rgba(255,255,255,0.6)" font-family="Inter, sans-serif" font-size="8">Green (new)</text>

        <text x="110" y="160" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-family="Inter, sans-serif" font-size="9">Two identical envs;</text>
        <text x="110" y="174" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-family="Inter, sans-serif" font-size="9">instant switch via LB</text>

        <!-- Risk label -->
        <rect x="42" y="192" width="76" height="16" rx="5" fill="#3b82f610" stroke="#3b82f6" stroke-width="0.5" stroke-opacity="0.2" />
        <text x="80" y="204" text-anchor="middle" fill="#3b82f6" font-family="Inter, sans-serif" font-size="7" font-weight="600" opacity="0.7">Lowest Risk</text>
      </g>

      <!-- Arrow: Blue → Canary -->
      <line x1="205" y1="130" x2="218" y2="130" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" marker-end="url(#dp-arrow)" />
      <text x="212" y="118" text-anchor="middle" fill="rgba(255,255,255,0.2)" font-family="Inter, sans-serif" font-size="7" font-style="italic" transform="rotate(-90, 212, 118)">
        validated
      </text>

      <!-- ── Stage 1: Canary ── -->
      <g
        class="dp-stage"
        @mouseenter="hoveredStage = 'canary'"
        @mouseleave="hoveredStage = null"
      >
        <rect
          v-if="hoveredStage === 'canary'"
          x="227" y="37" width="186" height="186" rx="14"
          fill="#14b8a608" class="dp-glow"
        />
        <rect
          x="230" y="40" width="180" height="180" rx="12"
          :fill="hoveredStage === 'canary' ? '#14b8a618' : 'url(#dp-canary-fill)'"
          class="dp-rect"
        />
        <rect
          x="230" y="40" width="180" height="180" rx="12"
          fill="none" stroke="#14b8a6"
          :stroke-width="hoveredStage === 'canary' ? 1.5 : 1"
          :stroke-opacity="hoveredStage === 'canary' ? 0.6 : 0.3"
          class="dp-rect"
        />

        <circle cx="252" cy="60" r="10" fill="#14b8a620" stroke="#14b8a6" stroke-width="0.8" stroke-opacity="0.4" />
        <text x="252" y="64" text-anchor="middle" fill="#14b8a6" font-family="Inter, sans-serif" font-size="10" font-weight="700">2</text>

        <text x="268" y="64" fill="white" font-family="Inter, sans-serif" font-size="13" font-weight="700">Canary</text>

        <rect x="250" y="78" width="60" height="20" rx="6" fill="#14b8a615" stroke="#14b8a6" stroke-width="0.6" stroke-opacity="0.3" />
        <text x="280" y="92" text-anchor="middle" fill="#14b8a6" font-family="Inter, sans-serif" font-size="9" font-weight="600">1-5%</text>

        <!-- Traffic split visualization -->
        <rect x="248" y="108" width="144" height="14" rx="3" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.08)" stroke-width="0.5" />
        <rect x="248" y="108" width="8" height="14" rx="3" fill="#14b8a640" />
        <text x="260" y="132" fill="#14b8a6" font-family="Inter, sans-serif" font-size="7" opacity="0.6">new</text>
        <text x="360" y="132" fill="rgba(255,255,255,0.25)" font-family="Inter, sans-serif" font-size="7">old (95-99%)</text>

        <text x="320" y="158" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-family="Inter, sans-serif" font-size="9">Small user subset</text>
        <text x="320" y="172" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-family="Inter, sans-serif" font-size="9">gets new version first</text>

        <rect x="252" y="192" width="56" height="16" rx="5" fill="#14b8a610" stroke="#14b8a6" stroke-width="0.5" stroke-opacity="0.2" />
        <text x="280" y="204" text-anchor="middle" fill="#14b8a6" font-family="Inter, sans-serif" font-size="7" font-weight="600" opacity="0.7">Low Risk</text>
      </g>

      <!-- Arrow: Canary → Shadow -->
      <line x1="415" y1="130" x2="428" y2="130" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" marker-end="url(#dp-arrow)" />
      <text x="422" y="118" text-anchor="middle" fill="rgba(255,255,255,0.2)" font-family="Inter, sans-serif" font-size="7" font-style="italic" transform="rotate(-90, 422, 118)">
        no anomalies
      </text>

      <!-- ── Stage 2: Shadow ── -->
      <g
        class="dp-stage"
        @mouseenter="hoveredStage = 'shadow'"
        @mouseleave="hoveredStage = null"
      >
        <rect
          v-if="hoveredStage === 'shadow'"
          x="437" y="37" width="186" height="186" rx="14"
          fill="#a855f708" class="dp-glow"
        />
        <rect
          x="440" y="40" width="180" height="180" rx="12"
          :fill="hoveredStage === 'shadow' ? '#a855f718' : 'url(#dp-shadow-fill)'"
          class="dp-rect"
        />
        <rect
          x="440" y="40" width="180" height="180" rx="12"
          fill="none" stroke="#a855f7"
          :stroke-width="hoveredStage === 'shadow' ? 1.5 : 1"
          :stroke-opacity="hoveredStage === 'shadow' ? 0.6 : 0.3"
          class="dp-rect"
        />

        <circle cx="462" cy="60" r="10" fill="#a855f720" stroke="#a855f7" stroke-width="0.8" stroke-opacity="0.4" />
        <text x="462" y="64" text-anchor="middle" fill="#a855f7" font-family="Inter, sans-serif" font-size="10" font-weight="700">3</text>

        <text x="478" y="64" fill="white" font-family="Inter, sans-serif" font-size="13" font-weight="700">Shadow</text>

        <rect x="460" y="78" width="80" height="20" rx="6" fill="#a855f715" stroke="#a855f7" stroke-width="0.6" stroke-opacity="0.3" />
        <text x="500" y="92" text-anchor="middle" fill="#a855f7" font-family="Inter, sans-serif" font-size="9" font-weight="600">0% (mirror)</text>

        <!-- Mirror illustration -->
        <rect x="458" y="108" width="66" height="30" rx="5" fill="#a855f710" stroke="#a855f7" stroke-width="0.6" stroke-opacity="0.25" />
        <text x="491" y="120" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-family="Inter, sans-serif" font-size="7">Production</text>
        <text x="491" y="132" text-anchor="middle" fill="rgba(255,255,255,0.35)" font-family="Inter, sans-serif" font-size="7">(serves users)</text>
        <rect x="536" y="108" width="66" height="30" rx="5" fill="#a855f710" stroke="#a855f7" stroke-width="0.6" stroke-opacity="0.25" stroke-dasharray="3 2" />
        <text x="569" y="120" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-family="Inter, sans-serif" font-size="7">Shadow</text>
        <text x="569" y="132" text-anchor="middle" fill="rgba(255,255,255,0.3)" font-family="Inter, sans-serif" font-size="7">(silent)</text>

        <text x="530" y="158" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-family="Inter, sans-serif" font-size="9">New version processes</text>
        <text x="530" y="172" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-family="Inter, sans-serif" font-size="9">traffic but results discarded</text>

        <rect x="450" y="192" width="100" height="16" rx="5" fill="#a855f710" stroke="#a855f7" stroke-width="0.5" stroke-opacity="0.2" />
        <text x="500" y="204" text-anchor="middle" fill="#a855f7" font-family="Inter, sans-serif" font-size="7" font-weight="600" opacity="0.7">Zero User Impact</text>
      </g>

      <!-- Arrow: Shadow → A/B Test -->
      <line x1="625" y1="130" x2="638" y2="130" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" marker-end="url(#dp-arrow)" />
      <text x="632" y="112" text-anchor="middle" fill="rgba(255,255,255,0.2)" font-family="Inter, sans-serif" font-size="7" font-style="italic" transform="rotate(-90, 632, 112)">
        results collected
      </text>

      <!-- ── Stage 3: A/B Test ── -->
      <g
        class="dp-stage"
        @mouseenter="hoveredStage = 'ab'"
        @mouseleave="hoveredStage = null"
      >
        <rect
          v-if="hoveredStage === 'ab'"
          x="647" y="37" width="186" height="186" rx="14"
          fill="#eab30808" class="dp-glow"
        />
        <rect
          x="650" y="40" width="180" height="180" rx="12"
          :fill="hoveredStage === 'ab' ? '#eab30818' : 'url(#dp-ab-fill)'"
          class="dp-rect"
        />
        <rect
          x="650" y="40" width="180" height="180" rx="12"
          fill="none" stroke="#eab308"
          :stroke-width="hoveredStage === 'ab' ? 1.5 : 1"
          :stroke-opacity="hoveredStage === 'ab' ? 0.6 : 0.3"
          class="dp-rect"
        />

        <circle cx="672" cy="60" r="10" fill="#eab30820" stroke="#eab308" stroke-width="0.8" stroke-opacity="0.4" />
        <text x="672" y="64" text-anchor="middle" fill="#eab308" font-family="Inter, sans-serif" font-size="10" font-weight="700">4</text>

        <text x="688" y="64" fill="white" font-family="Inter, sans-serif" font-size="13" font-weight="700">A/B Test</text>

        <rect x="668" y="78" width="66" height="20" rx="6" fill="#eab30815" stroke="#eab308" stroke-width="0.6" stroke-opacity="0.3" />
        <text x="701" y="92" text-anchor="middle" fill="#eab308" font-family="Inter, sans-serif" font-size="9" font-weight="600">50/50</text>

        <!-- A/B split visualization -->
        <rect x="668" y="108" width="144" height="14" rx="3" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.08)" stroke-width="0.5" />
        <rect x="668" y="108" width="72" height="14" rx="3" fill="#eab30825" />
        <rect x="740" y="108" width="72" height="14" rx="3" fill="rgba(255,255,255,0.06)" />
        <text x="704" y="132" text-anchor="middle" fill="#eab308" font-family="Inter, sans-serif" font-size="7" opacity="0.6">Group A</text>
        <text x="776" y="132" text-anchor="middle" fill="rgba(255,255,255,0.3)" font-family="Inter, sans-serif" font-size="7">Group B</text>

        <text x="740" y="158" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-family="Inter, sans-serif" font-size="9">Statistical comparison</text>
        <text x="740" y="172" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-family="Inter, sans-serif" font-size="9">of model versions</text>

        <rect x="660" y="192" width="86" height="16" rx="5" fill="#eab30810" stroke="#eab308" stroke-width="0.5" stroke-opacity="0.2" />
        <text x="703" y="204" text-anchor="middle" fill="#eab308" font-family="Inter, sans-serif" font-size="7" font-weight="600" opacity="0.7">Measured Risk</text>
      </g>

      <!-- Arrow: A/B → Full Rollout -->
      <line x1="835" y1="130" x2="848" y2="130" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" marker-end="url(#dp-arrow)" />
      <text x="842" y="112" text-anchor="middle" fill="rgba(255,255,255,0.2)" font-family="Inter, sans-serif" font-size="7" font-style="italic" transform="rotate(-90, 842, 112)">
        significance
      </text>

      <!-- ── Stage 4: Full Rollout ── -->
      <g
        class="dp-stage"
        @mouseenter="hoveredStage = 'full'"
        @mouseleave="hoveredStage = null"
      >
        <rect
          v-if="hoveredStage === 'full'"
          x="857" y="37" width="186" height="186" rx="14"
          fill="#22c55e08" class="dp-glow"
        />
        <rect
          x="860" y="40" width="180" height="180" rx="12"
          :fill="hoveredStage === 'full' ? '#22c55e18' : 'url(#dp-full-fill)'"
          class="dp-rect"
        />
        <rect
          x="860" y="40" width="180" height="180" rx="12"
          fill="none" stroke="#22c55e"
          :stroke-width="hoveredStage === 'full' ? 1.5 : 1"
          :stroke-opacity="hoveredStage === 'full' ? 0.6 : 0.3"
          class="dp-rect"
        />

        <circle cx="882" cy="60" r="10" fill="#22c55e20" stroke="#22c55e" stroke-width="0.8" stroke-opacity="0.4" />
        <text x="882" y="64" text-anchor="middle" fill="#22c55e" font-family="Inter, sans-serif" font-size="10" font-weight="700">5</text>

        <text x="898" y="64" fill="white" font-family="Inter, sans-serif" font-size="13" font-weight="700">Full Rollout</text>

        <rect x="878" y="78" width="56" height="20" rx="6" fill="#22c55e15" stroke="#22c55e" stroke-width="0.6" stroke-opacity="0.3" />
        <text x="906" y="92" text-anchor="middle" fill="#22c55e" font-family="Inter, sans-serif" font-size="9" font-weight="600">100%</text>

        <!-- Full bar visualization -->
        <rect x="878" y="108" width="144" height="14" rx="3" fill="#22c55e25" stroke="#22c55e" stroke-width="0.5" stroke-opacity="0.3" />
        <text x="950" y="132" text-anchor="middle" fill="#22c55e" font-family="Inter, sans-serif" font-size="7" opacity="0.6">all traffic → new version</text>

        <text x="950" y="158" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-family="Inter, sans-serif" font-size="9">New version serves</text>
        <text x="950" y="172" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-family="Inter, sans-serif" font-size="9">all production traffic</text>

        <rect x="878" y="192" width="60" height="16" rx="5" fill="#22c55e10" stroke="#22c55e" stroke-width="0.5" stroke-opacity="0.2" />
        <text x="908" y="204" text-anchor="middle" fill="#22c55e" font-family="Inter, sans-serif" font-size="7" font-weight="600" opacity="0.7">Validated</text>
      </g>

      <!-- ═══════════════════════════════════════ -->
      <!-- ROLLBACK ARROWS (bottom)                 -->
      <!-- ═══════════════════════════════════════ -->
      <path
        d="M 850 230 C 850 280 530 290 530 290 C 530 290 200 280 200 230"
        fill="none"
        stroke="#ef4444"
        stroke-width="1"
        stroke-dasharray="5 3"
        stroke-opacity="0.25"
      />
      <text x="530" y="305" text-anchor="middle" fill="#ef4444" font-family="Inter, sans-serif" font-size="9" font-style="italic" opacity="0.4">
        Automatic rollback on anomaly detection at any stage
      </text>

      <!-- Legend -->
      <g transform="translate(280, 325)">
        <rect x="0" y="0" width="8" height="8" rx="2" fill="#3b82f6" opacity="0.7" />
        <text x="14" y="8" fill="rgba(255,255,255,0.45)" font-family="Inter, sans-serif" font-size="9">Blue/Green</text>

        <rect x="100" y="0" width="8" height="8" rx="2" fill="#14b8a6" opacity="0.7" />
        <text x="114" y="8" fill="rgba(255,255,255,0.45)" font-family="Inter, sans-serif" font-size="9">Canary</text>

        <rect x="170" y="0" width="8" height="8" rx="2" fill="#a855f7" opacity="0.7" />
        <text x="184" y="8" fill="rgba(255,255,255,0.45)" font-family="Inter, sans-serif" font-size="9">Shadow</text>

        <rect x="245" y="0" width="8" height="8" rx="2" fill="#eab308" opacity="0.7" />
        <text x="259" y="8" fill="rgba(255,255,255,0.45)" font-family="Inter, sans-serif" font-size="9">A/B Test</text>

        <rect x="325" y="0" width="8" height="8" rx="2" fill="#22c55e" opacity="0.7" />
        <text x="339" y="8" fill="rgba(255,255,255,0.45)" font-family="Inter, sans-serif" font-size="9">Full Rollout</text>

        <line x1="420" y1="4" x2="450" y2="4" stroke="#ef4444" stroke-width="1" stroke-dasharray="4 2" stroke-opacity="0.4" />
        <text x="458" y="8" fill="rgba(255,255,255,0.35)" font-family="Inter, sans-serif" font-size="9">Rollback</text>
      </g>
    </svg>

    <!-- Mobile / narrow layout (vertical stacked) -->
    <svg
      class="deploy-patterns__svg deploy-patterns__svg--vertical"
      viewBox="0 0 300 920"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Deployment strategy flowchart showing progression from Blue/Green deployment through Canary, Shadow, A/B Testing to Full Rollout."
    >
      <defs>
        <marker id="dp-arrow-v" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="rgba(255,255,255,0.25)" />
        </marker>
      </defs>

      <!-- Stage cards stacked vertically -->
      <g
        v-for="(stage, i) in stages"
        :key="stage.id"
        class="dp-stage"
        @mouseenter="hoveredStage = stage.id"
        @mouseleave="hoveredStage = null"
      >
        <!-- Card -->
        <rect
          v-if="hoveredStage === stage.id"
          x="17" :y="i * 170 + 7" width="266" height="146" rx="14"
          :fill="`${stage.color}08`" class="dp-glow"
        />
        <rect
          x="20" :y="i * 170 + 10" width="260" height="140" rx="12"
          :fill="hoveredStage === stage.id ? `${stage.color}18` : `${stage.color}08`"
          class="dp-rect"
        />
        <rect
          x="20" :y="i * 170 + 10" width="260" height="140" rx="12"
          fill="none" :stroke="stage.color"
          :stroke-width="hoveredStage === stage.id ? 1.5 : 1"
          :stroke-opacity="hoveredStage === stage.id ? 0.6 : 0.3"
          class="dp-rect"
        />

        <!-- Step number -->
        <circle :cx="42" :cy="i * 170 + 32" r="10" :fill="`${stage.color}20`" :stroke="stage.color" stroke-width="0.8" stroke-opacity="0.4" />
        <text :x="42" :y="i * 170 + 36" text-anchor="middle" :fill="stage.color" font-family="Inter, sans-serif" font-size="10" font-weight="700">{{ i + 1 }}</text>

        <!-- Name -->
        <text :x="58" :y="i * 170 + 36" fill="white" font-family="Inter, sans-serif" font-size="13" font-weight="700">{{ stage.name }}</text>

        <!-- Traffic badge -->
        <rect :x="180" :y="i * 170 + 22" width="80" height="20" rx="6" :fill="`${stage.color}15`" :stroke="stage.color" stroke-width="0.6" stroke-opacity="0.3" />
        <text :x="220" :y="i * 170 + 36" text-anchor="middle" :fill="stage.color" font-family="Inter, sans-serif" font-size="9" font-weight="600">{{ stage.traffic }}</text>

        <!-- Description -->
        <text :x="40" :y="i * 170 + 68" fill="rgba(255,255,255,0.45)" font-family="Inter, sans-serif" font-size="10">{{ stage.desc }}</text>

        <!-- Risk label -->
        <rect :x="40" :y="i * 170 + 108" width="90" height="18" rx="5" :fill="`${stage.color}10`" :stroke="stage.color" stroke-width="0.5" stroke-opacity="0.2" />
        <text :x="85" :y="i * 170 + 121" text-anchor="middle" :fill="stage.color" font-family="Inter, sans-serif" font-size="8" font-weight="600" opacity="0.7">{{ stage.risk }}</text>

        <!-- Arrow to next stage (except last) -->
        <line
          v-if="i < stages.length - 1"
          x1="150" :y1="i * 170 + 155" x2="150" :y2="i * 170 + 175"
          stroke="rgba(255,255,255,0.15)" stroke-width="1.5" marker-end="url(#dp-arrow-v)"
        />
        <text
          v-if="i < stages.length - 1"
          x="170" :y="i * 170 + 168"
          fill="rgba(255,255,255,0.2)" font-family="Inter, sans-serif" font-size="7" font-style="italic"
        >
          {{ edgeLabels[i] }}
        </text>
      </g>

      <!-- Legend -->
      <g transform="translate(40, 870)">
        <line x1="0" y1="4" x2="30" y2="4" stroke="#ef4444" stroke-width="1" stroke-dasharray="4 2" stroke-opacity="0.4" />
        <text x="38" y="8" fill="rgba(255,255,255,0.35)" font-family="Inter, sans-serif" font-size="9">Automatic rollback on anomaly at any stage</text>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.deploy-patterns {
  width: 100%;
  max-width: 1060px;
  margin: 0 auto;
  font-family: 'Inter', sans-serif;
}

.dp-stage {
  cursor: pointer;
}

.dp-rect {
  transition: fill 0.2s ease, stroke 0.2s ease, stroke-width 0.2s ease, stroke-opacity 0.2s ease;
}

.dp-glow {
  transition: opacity 0.2s ease;
}

.deploy-patterns__caption {
  margin: 0 0 12px 0;
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.35);
  text-align: center;
}

.deploy-patterns__svg {
  width: 100%;
  height: auto;
  display: block;
}

.deploy-patterns__svg--vertical {
  display: none;
}

@media (max-width: 720px) {
  .deploy-patterns__svg--horizontal {
    display: none;
  }

  .deploy-patterns__svg--vertical {
    display: block;
    max-width: 340px;
    margin: 0 auto;
  }
}
</style>
