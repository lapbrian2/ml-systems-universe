<script setup lang="ts">
/**
 * DataFlowDiagram — Static textbook infographic
 * Shows the split between Training and Inference pipelines,
 * with shared components (Preprocessing, Feature Store) highlighted.
 *
 * Training path (purple):  Raw Data → Preprocessing → Feature Store → Training → Model Registry
 * Inference path (green):  New Data → Preprocessing → Feature Store → Model Serving → Predictions
 * Shared components (blue): Preprocessing, Feature Store
 */
</script>

<template>
  <div class="data-flow-diagram">
    <!-- Caption -->
    <p class="data-flow-diagram__caption">
      Figure: Training vs. Inference Data Flow
    </p>

    <!-- Desktop / wide layout -->
    <svg
      class="data-flow-diagram__svg data-flow-diagram__svg--horizontal"
      viewBox="0 0 980 400"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Data flow diagram comparing training and inference pipelines, showing shared preprocessing and feature store components."
    >
      <defs>
        <!-- Training path fill -->
        <linearGradient id="dfd-train-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#a855f7" stop-opacity="0.15" />
          <stop offset="100%" stop-color="#a855f7" stop-opacity="0.05" />
        </linearGradient>
        <!-- Inference path fill -->
        <linearGradient id="dfd-infer-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#22c55e" stop-opacity="0.15" />
          <stop offset="100%" stop-color="#22c55e" stop-opacity="0.05" />
        </linearGradient>
        <!-- Shared component fill -->
        <linearGradient id="dfd-shared-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#14b8a6" stop-opacity="0.18" />
          <stop offset="100%" stop-color="#14b8a6" stop-opacity="0.06" />
        </linearGradient>
        <!-- Input fill -->
        <linearGradient id="dfd-input-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="rgba(255,255,255,0.08)" />
          <stop offset="100%" stop-color="rgba(255,255,255,0.02)" />
        </linearGradient>

        <!-- Arrow markers -->
        <marker id="dfd-arrow-train" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#a855f7" opacity="0.5" />
        </marker>
        <marker id="dfd-arrow-infer" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#22c55e" opacity="0.5" />
        </marker>
        <marker id="dfd-arrow-shared" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#14b8a6" opacity="0.5" />
        </marker>
        <marker id="dfd-arrow-neutral" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="rgba(255,255,255,0.3)" />
        </marker>
      </defs>

      <!-- ════════════════════════════════════════════ -->
      <!-- PATH REGION BACKGROUNDS                      -->
      <!-- ════════════════════════════════════════════ -->

      <!-- Training region backdrop -->
      <rect x="278" y="18" width="680" height="150" rx="16" fill="#a855f7" fill-opacity="0.03" stroke="#a855f7" stroke-width="1" stroke-opacity="0.1" stroke-dasharray="4 3" />
      <text x="298" y="42" fill="#a855f7" font-family="Inter, sans-serif" font-size="10" font-weight="600" letter-spacing="0.06em" opacity="0.6">TRAINING PIPELINE</text>

      <!-- Inference region backdrop -->
      <rect x="278" y="230" width="680" height="150" rx="16" fill="#22c55e" fill-opacity="0.03" stroke="#22c55e" stroke-width="1" stroke-opacity="0.1" stroke-dasharray="4 3" />
      <text x="298" y="254" fill="#22c55e" font-family="Inter, sans-serif" font-size="10" font-weight="600" letter-spacing="0.06em" opacity="0.6">INFERENCE PIPELINE</text>

      <!-- ════════════════════════════════════════════ -->
      <!-- INPUT NODES (left side)                      -->
      <!-- ════════════════════════════════════════════ -->

      <!-- Raw Data (training input) -->
      <g transform="translate(20, 65)">
        <rect x="0" y="0" width="130" height="68" rx="12" fill="url(#dfd-input-fill)" />
        <rect x="0" y="0" width="130" height="68" rx="12" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1" />
        <g transform="translate(12, 14)" opacity="0.7">
          <ellipse cx="10" cy="5" rx="8" ry="3.5" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="1.2" />
          <path d="M 2 5 v 7 c 0 1.9 3.6 3.5 8 3.5 s 8 -1.6 8 -3.5 V 5" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="1.2" />
        </g>
        <text x="38" y="28" fill="white" font-family="Inter, sans-serif" font-size="12" font-weight="600">Raw Data</text>
        <text x="12" y="50" fill="rgba(255,255,255,0.4)" font-family="Inter, sans-serif" font-size="9">Historical training data</text>
      </g>

      <!-- New Data (inference input) -->
      <g transform="translate(20, 275)">
        <rect x="0" y="0" width="130" height="68" rx="12" fill="url(#dfd-input-fill)" />
        <rect x="0" y="0" width="130" height="68" rx="12" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1" />
        <g transform="translate(12, 14)" opacity="0.7">
          <path d="M 2 3 L 12 3 L 16 7 L 16 17 L 2 17 Z" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="1.2" stroke-linejoin="round" />
          <path d="M 12 3 L 12 7 L 16 7" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="1.2" stroke-linejoin="round" />
        </g>
        <text x="38" y="28" fill="white" font-family="Inter, sans-serif" font-size="12" font-weight="600">New Data</text>
        <text x="12" y="50" fill="rgba(255,255,255,0.4)" font-family="Inter, sans-serif" font-size="9">Live input for predictions</text>
      </g>

      <!-- ════════════════════════════════════════════ -->
      <!-- SHARED COMPONENTS (center column)            -->
      <!-- ════════════════════════════════════════════ -->

      <!-- Arrows: inputs → Preprocessing -->
      <line x1="155" y1="99" x2="175" y2="99" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" />
      <line x1="175" y1="99" x2="195" y2="190" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" />
      <line x1="155" y1="309" x2="175" y2="309" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" />
      <line x1="175" y1="309" x2="195" y2="210" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" />

      <!-- Arrow into Preprocessing box -->
      <line x1="195" y1="190" x2="209" y2="190" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" marker-end="url(#dfd-arrow-shared)" />
      <line x1="195" y1="210" x2="209" y2="210" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" marker-end="url(#dfd-arrow-shared)" />

      <!-- Preprocessing (shared) -->
      <g transform="translate(220, 168)">
        <rect x="0" y="0" width="150" height="68" rx="12" fill="url(#dfd-shared-fill)" />
        <rect x="0" y="0" width="150" height="68" rx="12" fill="none" stroke="#14b8a6" stroke-width="1.2" stroke-opacity="0.4" />
        <!-- Shared badge -->
        <rect x="88" y="-8" width="56" height="16" rx="8" fill="#14b8a6" fill-opacity="0.15" stroke="#14b8a6" stroke-width="0.8" stroke-opacity="0.3" />
        <text x="116" y="3" text-anchor="middle" fill="#14b8a6" font-family="Inter, sans-serif" font-size="8" font-weight="600" opacity="0.8">SHARED</text>
        <!-- Filter icon -->
        <g transform="translate(12, 14)" opacity="0.85">
          <path d="M 2 3 h 16 l -5.5 7 v 4 l -5 2.5 v -6.5 Z" fill="none" stroke="#14b8a6" stroke-width="1.2" stroke-linejoin="round" />
        </g>
        <text x="38" y="28" fill="white" font-family="Inter, sans-serif" font-size="12" font-weight="600">Preprocessing</text>
        <text x="12" y="50" fill="rgba(255,255,255,0.4)" font-family="Inter, sans-serif" font-size="9">Clean, validate, transform</text>
      </g>

      <!-- Arrow: Preprocessing → Feature Store -->
      <line x1="375" y1="200" x2="409" y2="200" stroke="#14b8a6" stroke-width="1.5" stroke-opacity="0.3" marker-end="url(#dfd-arrow-shared)" />

      <!-- Feature Store (shared) -->
      <g transform="translate(420, 168)">
        <rect x="0" y="0" width="150" height="68" rx="12" fill="url(#dfd-shared-fill)" />
        <rect x="0" y="0" width="150" height="68" rx="12" fill="none" stroke="#14b8a6" stroke-width="1.2" stroke-opacity="0.4" />
        <!-- Shared badge -->
        <rect x="88" y="-8" width="56" height="16" rx="8" fill="#14b8a6" fill-opacity="0.15" stroke="#14b8a6" stroke-width="0.8" stroke-opacity="0.3" />
        <text x="116" y="3" text-anchor="middle" fill="#14b8a6" font-family="Inter, sans-serif" font-size="8" font-weight="600" opacity="0.8">SHARED</text>
        <!-- Layers icon -->
        <g transform="translate(12, 14)" opacity="0.85">
          <path d="M 10 3 L 1 8 L 10 13 L 19 8 Z" fill="none" stroke="#14b8a6" stroke-width="1.2" stroke-linejoin="round" />
          <path d="M 1 11.5 L 10 16.5 L 19 11.5" fill="none" stroke="#14b8a6" stroke-width="1.2" stroke-linejoin="round" opacity="0.6" />
        </g>
        <text x="38" y="28" fill="white" font-family="Inter, sans-serif" font-size="12" font-weight="600">Feature Store</text>
        <text x="12" y="50" fill="rgba(255,255,255,0.4)" font-family="Inter, sans-serif" font-size="9">Versioned feature vectors</text>
      </g>

      <!-- ════════════════════════════════════════════ -->
      <!-- TRAINING PATH (top)                          -->
      <!-- ════════════════════════════════════════════ -->

      <!-- Arrow: Feature Store → Training (curve up) -->
      <path
        d="M 575 190 C 600 190 600 110 625 110"
        fill="none"
        stroke="#a855f7"
        stroke-width="1.5"
        stroke-opacity="0.35"
        marker-end="url(#dfd-arrow-train)"
      />

      <!-- Training -->
      <g transform="translate(636, 72)">
        <rect x="0" y="0" width="140" height="68" rx="12" fill="url(#dfd-train-fill)" />
        <rect x="0" y="0" width="140" height="68" rx="12" fill="none" stroke="#a855f7" stroke-width="1" stroke-opacity="0.35" />
        <!-- Brain icon -->
        <g transform="translate(12, 14)" opacity="0.85">
          <circle cx="10" cy="10" r="8" fill="none" stroke="#a855f7" stroke-width="1.2" />
          <circle cx="7" cy="7.5" r="1" fill="#a855f7" opacity="0.6" />
          <circle cx="13" cy="7.5" r="1" fill="#a855f7" opacity="0.6" />
          <circle cx="7" cy="12.5" r="1" fill="#a855f7" opacity="0.6" />
          <circle cx="13" cy="12.5" r="1" fill="#a855f7" opacity="0.6" />
        </g>
        <text x="38" y="28" fill="white" font-family="Inter, sans-serif" font-size="12" font-weight="600">Training</text>
        <text x="12" y="50" fill="rgba(255,255,255,0.4)" font-family="Inter, sans-serif" font-size="9">Fit model on features</text>
      </g>

      <!-- Arrow: Training → Model Registry -->
      <line x1="781" y1="106" x2="809" y2="106" stroke="#a855f7" stroke-width="1.5" stroke-opacity="0.35" marker-end="url(#dfd-arrow-train)" />

      <!-- Model Registry -->
      <g transform="translate(820, 72)">
        <rect x="0" y="0" width="140" height="68" rx="12" fill="url(#dfd-train-fill)" />
        <rect x="0" y="0" width="140" height="68" rx="12" fill="none" stroke="#a855f7" stroke-width="1" stroke-opacity="0.35" />
        <!-- Archive/registry icon -->
        <g transform="translate(12, 14)" opacity="0.85">
          <rect x="2" y="2" width="16" height="4" rx="1.5" fill="none" stroke="#a855f7" stroke-width="1.2" />
          <rect x="4" y="6" width="12" height="12" rx="1.5" fill="none" stroke="#a855f7" stroke-width="1.2" />
          <line x1="7" y1="10" x2="13" y2="10" stroke="#a855f7" stroke-width="1" opacity="0.5" />
          <line x1="7" y1="13" x2="13" y2="13" stroke="#a855f7" stroke-width="1" opacity="0.3" />
        </g>
        <text x="38" y="28" fill="white" font-family="Inter, sans-serif" font-size="12" font-weight="600">Model Registry</text>
        <text x="12" y="50" fill="rgba(255,255,255,0.4)" font-family="Inter, sans-serif" font-size="9">Version &amp; store models</text>
      </g>

      <!-- ════════════════════════════════════════════ -->
      <!-- INFERENCE PATH (bottom)                      -->
      <!-- ════════════════════════════════════════════ -->

      <!-- Arrow: Feature Store → Model Serving (curve down) -->
      <path
        d="M 575 210 C 600 210 600 300 625 300"
        fill="none"
        stroke="#22c55e"
        stroke-width="1.5"
        stroke-opacity="0.35"
        marker-end="url(#dfd-arrow-infer)"
      />

      <!-- Model Serving -->
      <g transform="translate(636, 272)">
        <rect x="0" y="0" width="140" height="68" rx="12" fill="url(#dfd-infer-fill)" />
        <rect x="0" y="0" width="140" height="68" rx="12" fill="none" stroke="#22c55e" stroke-width="1" stroke-opacity="0.35" />
        <!-- Server icon -->
        <g transform="translate(12, 14)" opacity="0.85">
          <rect x="2" y="2" width="16" height="6" rx="1.5" fill="none" stroke="#22c55e" stroke-width="1.2" />
          <rect x="2" y="11" width="16" height="6" rx="1.5" fill="none" stroke="#22c55e" stroke-width="1.2" />
          <circle cx="15" cy="5" r="1" fill="#22c55e" opacity="0.6" />
          <circle cx="15" cy="14" r="1" fill="#22c55e" opacity="0.6" />
        </g>
        <text x="38" y="28" fill="white" font-family="Inter, sans-serif" font-size="12" font-weight="600">Model Serving</text>
        <text x="12" y="50" fill="rgba(255,255,255,0.4)" font-family="Inter, sans-serif" font-size="9">Low-latency inference</text>
      </g>

      <!-- Arrow: Model Serving → Predictions -->
      <line x1="781" y1="306" x2="809" y2="306" stroke="#22c55e" stroke-width="1.5" stroke-opacity="0.35" marker-end="url(#dfd-arrow-infer)" />

      <!-- Predictions -->
      <g transform="translate(820, 272)">
        <rect x="0" y="0" width="140" height="68" rx="12" fill="url(#dfd-infer-fill)" />
        <rect x="0" y="0" width="140" height="68" rx="12" fill="none" stroke="#22c55e" stroke-width="1" stroke-opacity="0.35" />
        <!-- Output/check icon -->
        <g transform="translate(12, 14)" opacity="0.85">
          <circle cx="10" cy="10" r="8" fill="none" stroke="#22c55e" stroke-width="1.2" />
          <polyline points="6,10 9,13 14,7" fill="none" stroke="#22c55e" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
        </g>
        <text x="38" y="28" fill="white" font-family="Inter, sans-serif" font-size="12" font-weight="600">Predictions</text>
        <text x="12" y="50" fill="rgba(255,255,255,0.4)" font-family="Inter, sans-serif" font-size="9">Served to application</text>
      </g>

      <!-- ════════════════════════════════════════════ -->
      <!-- CROSS-PATH CONNECTION: Registry → Serving     -->
      <!-- ════════════════════════════════════════════ -->
      <path
        d="M 890 145 C 890 200 890 200 890 267"
        fill="none"
        stroke="rgba(255,255,255,0.12)"
        stroke-width="1.5"
        stroke-dasharray="5 4"
        marker-end="url(#dfd-arrow-neutral)"
      />
      <text
        x="904"
        y="205"
        fill="rgba(255,255,255,0.3)"
        font-family="Inter, sans-serif"
        font-size="8"
        font-style="italic"
      >
        deploy
      </text>

      <!-- ════════════════════════════════════════════ -->
      <!-- LEGEND                                       -->
      <!-- ════════════════════════════════════════════ -->
      <g transform="translate(20, 370)">
        <rect x="0" y="0" width="8" height="8" rx="2" fill="#a855f7" opacity="0.6" />
        <text x="14" y="8" fill="rgba(255,255,255,0.5)" font-family="Inter, sans-serif" font-size="9">Training</text>

        <rect x="80" y="0" width="8" height="8" rx="2" fill="#22c55e" opacity="0.6" />
        <text x="94" y="8" fill="rgba(255,255,255,0.5)" font-family="Inter, sans-serif" font-size="9">Inference</text>

        <rect x="160" y="0" width="8" height="8" rx="2" fill="#14b8a6" opacity="0.6" />
        <text x="174" y="8" fill="rgba(255,255,255,0.5)" font-family="Inter, sans-serif" font-size="9">Shared</text>
      </g>
    </svg>

    <!-- Mobile / narrow layout (vertical stacked) -->
    <svg
      class="data-flow-diagram__svg data-flow-diagram__svg--vertical"
      viewBox="0 0 300 860"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Data flow diagram comparing training and inference pipelines, showing shared preprocessing and feature store components."
    >
      <defs>
        <marker id="dfd-arrow-train-v" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#a855f7" opacity="0.5" />
        </marker>
        <marker id="dfd-arrow-infer-v" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#22c55e" opacity="0.5" />
        </marker>
        <marker id="dfd-arrow-shared-v" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#14b8a6" opacity="0.5" />
        </marker>
        <marker id="dfd-arrow-neutral-v" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="rgba(255,255,255,0.3)" />
        </marker>
      </defs>

      <!-- ── INPUT NODES ── -->

      <!-- Raw Data -->
      <g transform="translate(15, 10)">
        <rect x="0" y="0" width="120" height="58" rx="10" fill="url(#dfd-input-fill)" />
        <rect x="0" y="0" width="120" height="58" rx="10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1" />
        <text x="12" y="26" fill="white" font-family="Inter, sans-serif" font-size="11" font-weight="600">Raw Data</text>
        <text x="12" y="44" fill="rgba(255,255,255,0.4)" font-family="Inter, sans-serif" font-size="8">Training data</text>
      </g>

      <!-- New Data -->
      <g transform="translate(165, 10)">
        <rect x="0" y="0" width="120" height="58" rx="10" fill="url(#dfd-input-fill)" />
        <rect x="0" y="0" width="120" height="58" rx="10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1" />
        <text x="12" y="26" fill="white" font-family="Inter, sans-serif" font-size="11" font-weight="600">New Data</text>
        <text x="12" y="44" fill="rgba(255,255,255,0.4)" font-family="Inter, sans-serif" font-size="8">Live input</text>
      </g>

      <!-- Arrows down from inputs to Preprocessing -->
      <line x1="75" y1="72" x2="115" y2="105" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" marker-end="url(#dfd-arrow-shared-v)" />
      <line x1="225" y1="72" x2="185" y2="105" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" marker-end="url(#dfd-arrow-shared-v)" />

      <!-- ── SHARED: Preprocessing ── -->
      <g transform="translate(50, 110)">
        <rect x="0" y="0" width="200" height="62" rx="10" fill="url(#dfd-shared-fill)" />
        <rect x="0" y="0" width="200" height="62" rx="10" fill="none" stroke="#14b8a6" stroke-width="1.2" stroke-opacity="0.4" />
        <rect x="138" y="-8" width="56" height="16" rx="8" fill="#14b8a6" fill-opacity="0.15" stroke="#14b8a6" stroke-width="0.8" stroke-opacity="0.3" />
        <text x="166" y="3" text-anchor="middle" fill="#14b8a6" font-family="Inter, sans-serif" font-size="8" font-weight="600" opacity="0.8">SHARED</text>
        <text x="14" y="28" fill="white" font-family="Inter, sans-serif" font-size="12" font-weight="600">Preprocessing</text>
        <text x="14" y="48" fill="rgba(255,255,255,0.4)" font-family="Inter, sans-serif" font-size="9">Clean, validate, transform</text>
      </g>

      <!-- Arrow: Preprocessing → Feature Store -->
      <line x1="150" y1="176" x2="150" y2="205" stroke="#14b8a6" stroke-width="1.5" stroke-opacity="0.3" marker-end="url(#dfd-arrow-shared-v)" />

      <!-- ── SHARED: Feature Store ── -->
      <g transform="translate(50, 210)">
        <rect x="0" y="0" width="200" height="62" rx="10" fill="url(#dfd-shared-fill)" />
        <rect x="0" y="0" width="200" height="62" rx="10" fill="none" stroke="#14b8a6" stroke-width="1.2" stroke-opacity="0.4" />
        <rect x="138" y="-8" width="56" height="16" rx="8" fill="#14b8a6" fill-opacity="0.15" stroke="#14b8a6" stroke-width="0.8" stroke-opacity="0.3" />
        <text x="166" y="3" text-anchor="middle" fill="#14b8a6" font-family="Inter, sans-serif" font-size="8" font-weight="600" opacity="0.8">SHARED</text>
        <text x="14" y="28" fill="white" font-family="Inter, sans-serif" font-size="12" font-weight="600">Feature Store</text>
        <text x="14" y="48" fill="rgba(255,255,255,0.4)" font-family="Inter, sans-serif" font-size="9">Versioned feature vectors</text>
      </g>

      <!-- ── SPLIT INTO TWO PATHS ── -->

      <!-- Diverging arrows -->
      <path d="M 110 276 L 75 310" fill="none" stroke="#a855f7" stroke-width="1.5" stroke-opacity="0.35" marker-end="url(#dfd-arrow-train-v)" />
      <path d="M 190 276 L 225 310" fill="none" stroke="#22c55e" stroke-width="1.5" stroke-opacity="0.35" marker-end="url(#dfd-arrow-infer-v)" />

      <!-- ── TRAINING PATH (left) ── -->

      <!-- Training region backdrop -->
      <rect x="5" y="300" width="140" height="300" rx="14" fill="#a855f7" fill-opacity="0.03" stroke="#a855f7" stroke-width="1" stroke-opacity="0.08" stroke-dasharray="4 3" />
      <text x="22" y="322" fill="#a855f7" font-family="Inter, sans-serif" font-size="8" font-weight="600" letter-spacing="0.06em" opacity="0.55">TRAINING</text>

      <!-- Training -->
      <g transform="translate(12, 335)">
        <rect x="0" y="0" width="126" height="58" rx="10" fill="url(#dfd-train-fill)" />
        <rect x="0" y="0" width="126" height="58" rx="10" fill="none" stroke="#a855f7" stroke-width="1" stroke-opacity="0.3" />
        <text x="12" y="26" fill="white" font-family="Inter, sans-serif" font-size="11" font-weight="600">Training</text>
        <text x="12" y="44" fill="rgba(255,255,255,0.4)" font-family="Inter, sans-serif" font-size="8">Fit model on features</text>
      </g>

      <!-- Arrow -->
      <line x1="75" y1="397" x2="75" y2="425" stroke="#a855f7" stroke-width="1.5" stroke-opacity="0.3" marker-end="url(#dfd-arrow-train-v)" />

      <!-- Model Registry -->
      <g transform="translate(12, 430)">
        <rect x="0" y="0" width="126" height="58" rx="10" fill="url(#dfd-train-fill)" />
        <rect x="0" y="0" width="126" height="58" rx="10" fill="none" stroke="#a855f7" stroke-width="1" stroke-opacity="0.3" />
        <text x="12" y="26" fill="white" font-family="Inter, sans-serif" font-size="11" font-weight="600">Model Registry</text>
        <text x="12" y="44" fill="rgba(255,255,255,0.4)" font-family="Inter, sans-serif" font-size="8">Version &amp; store</text>
      </g>

      <!-- ── INFERENCE PATH (right) ── -->

      <!-- Inference region backdrop -->
      <rect x="155" y="300" width="140" height="300" rx="14" fill="#22c55e" fill-opacity="0.03" stroke="#22c55e" stroke-width="1" stroke-opacity="0.08" stroke-dasharray="4 3" />
      <text x="172" y="322" fill="#22c55e" font-family="Inter, sans-serif" font-size="8" font-weight="600" letter-spacing="0.06em" opacity="0.55">INFERENCE</text>

      <!-- Model Serving -->
      <g transform="translate(162, 335)">
        <rect x="0" y="0" width="126" height="58" rx="10" fill="url(#dfd-infer-fill)" />
        <rect x="0" y="0" width="126" height="58" rx="10" fill="none" stroke="#22c55e" stroke-width="1" stroke-opacity="0.3" />
        <text x="12" y="26" fill="white" font-family="Inter, sans-serif" font-size="11" font-weight="600">Model Serving</text>
        <text x="12" y="44" fill="rgba(255,255,255,0.4)" font-family="Inter, sans-serif" font-size="8">Low-latency inference</text>
      </g>

      <!-- Arrow -->
      <line x1="225" y1="397" x2="225" y2="425" stroke="#22c55e" stroke-width="1.5" stroke-opacity="0.3" marker-end="url(#dfd-arrow-infer-v)" />

      <!-- Predictions -->
      <g transform="translate(162, 430)">
        <rect x="0" y="0" width="126" height="58" rx="10" fill="url(#dfd-infer-fill)" />
        <rect x="0" y="0" width="126" height="58" rx="10" fill="none" stroke="#22c55e" stroke-width="1" stroke-opacity="0.3" />
        <text x="12" y="26" fill="white" font-family="Inter, sans-serif" font-size="11" font-weight="600">Predictions</text>
        <text x="12" y="44" fill="rgba(255,255,255,0.4)" font-family="Inter, sans-serif" font-size="8">Served to application</text>
      </g>

      <!-- ── Cross-path: Registry → Serving ── -->
      <path
        d="M 140 459 C 150 459 150 364 162 364"
        fill="none"
        stroke="rgba(255,255,255,0.12)"
        stroke-width="1.5"
        stroke-dasharray="5 4"
        marker-end="url(#dfd-arrow-neutral-v)"
      />
      <text
        x="152"
        y="412"
        fill="rgba(255,255,255,0.3)"
        font-family="Inter, sans-serif"
        font-size="7"
        font-style="italic"
        text-anchor="middle"
      >
        deploy
      </text>

      <!-- ── LEGEND ── -->
      <g transform="translate(15, 630)">
        <rect x="0" y="0" width="8" height="8" rx="2" fill="#a855f7" opacity="0.6" />
        <text x="14" y="8" fill="rgba(255,255,255,0.5)" font-family="Inter, sans-serif" font-size="9">Training</text>

        <rect x="80" y="0" width="8" height="8" rx="2" fill="#22c55e" opacity="0.6" />
        <text x="94" y="8" fill="rgba(255,255,255,0.5)" font-family="Inter, sans-serif" font-size="9">Inference</text>

        <rect x="160" y="0" width="8" height="8" rx="2" fill="#14b8a6" opacity="0.6" />
        <text x="174" y="8" fill="rgba(255,255,255,0.5)" font-family="Inter, sans-serif" font-size="9">Shared</text>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.data-flow-diagram {
  width: 100%;
  max-width: 980px;
  margin: 0 auto;
  font-family: 'Inter', sans-serif;
}

.data-flow-diagram__caption {
  margin: 0 0 12px 0;
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.35);
  text-align: center;
}

.data-flow-diagram__svg {
  width: 100%;
  height: auto;
  display: block;
}

.data-flow-diagram__svg--vertical {
  display: none;
}

@media (max-width: 720px) {
  .data-flow-diagram__svg--horizontal {
    display: none;
  }

  .data-flow-diagram__svg--vertical {
    display: block;
    max-width: 340px;
    margin: 0 auto;
  }
}
</style>
