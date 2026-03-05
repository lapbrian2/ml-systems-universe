<script setup lang="ts">
/**
 * DistributedTrainingPatterns — Interactive textbook infographic
 * Shows three side-by-side architecture diagrams:
 *   1. Data Parallelism — Multiple GPUs each with full model copy, gradient sync
 *   2. Model Parallelism — Single model split across GPUs, activation passing
 *   3. Pipeline Parallelism — Model split into stages with micro-batch flow
 */
import { ref } from 'vue'

const hoveredPattern = ref<string | null>(null)

const patterns = {
  data: { color: '#14b8a6', label: 'Data Parallelism' },
  model: { color: '#a855f7', label: 'Model Parallelism' },
  pipeline: { color: '#f97316', label: 'Pipeline Parallelism' },
}
</script>

<template>
  <div class="dist-training">
    <p class="dist-training__caption">
      Figure: Distributed Training Patterns
    </p>

    <svg
      class="dist-training__svg"
      viewBox="0 0 960 520"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Three distributed training patterns compared: data parallelism with replicated models, model parallelism with split layers, and pipeline parallelism with staged micro-batches."
    >
      <defs>
        <linearGradient id="dtp-data-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#14b8a6" stop-opacity="0.15" />
          <stop offset="100%" stop-color="#14b8a6" stop-opacity="0.05" />
        </linearGradient>
        <linearGradient id="dtp-model-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#a855f7" stop-opacity="0.15" />
          <stop offset="100%" stop-color="#a855f7" stop-opacity="0.05" />
        </linearGradient>
        <linearGradient id="dtp-pipe-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#f97316" stop-opacity="0.15" />
          <stop offset="100%" stop-color="#f97316" stop-opacity="0.05" />
        </linearGradient>

        <!-- Arrow markers -->
        <marker id="dtp-arrow-teal" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#14b8a6" opacity="0.6" />
        </marker>
        <marker id="dtp-arrow-purple" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#a855f7" opacity="0.6" />
        </marker>
        <marker id="dtp-arrow-orange" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#f97316" opacity="0.6" />
        </marker>
        <marker id="dtp-arrow-white" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="rgba(255,255,255,0.3)" />
        </marker>
      </defs>

      <!-- ═══════════════════════════════════════ -->
      <!-- COLUMN 1: DATA PARALLELISM              -->
      <!-- ═══════════════════════════════════════ -->
      <g
        class="dtp-pattern"
        @mouseenter="hoveredPattern = 'data'"
        @mouseleave="hoveredPattern = null"
      >
        <!-- Column background -->
        <rect
          x="10" y="10" width="300" height="500" rx="14"
          :fill="hoveredPattern === 'data' ? '#14b8a608' : 'transparent'"
          stroke="#14b8a6"
          :stroke-opacity="hoveredPattern === 'data' ? 0.2 : 0.08"
          stroke-width="1"
          stroke-dasharray="6 4"
          class="dtp-region"
        />

        <!-- Title -->
        <text x="160" y="38" text-anchor="middle" fill="#14b8a6" font-family="Inter, sans-serif" font-size="13" font-weight="700">
          Data Parallelism
        </text>

        <!-- Data split label -->
        <text x="160" y="68" text-anchor="middle" fill="rgba(255,255,255,0.35)" font-family="Inter, sans-serif" font-size="9" font-weight="500" letter-spacing="0.05em">
          DATA SPLIT ACROSS GPUs
        </text>

        <!-- Data shards at top -->
        <rect x="35" y="80" width="70" height="28" rx="6" fill="#14b8a610" stroke="#14b8a6" stroke-width="1" stroke-opacity="0.3" />
        <text x="70" y="99" text-anchor="middle" fill="#14b8a6" font-family="Inter, sans-serif" font-size="9" opacity="0.8">Shard 1</text>

        <rect x="125" y="80" width="70" height="28" rx="6" fill="#14b8a610" stroke="#14b8a6" stroke-width="1" stroke-opacity="0.3" />
        <text x="160" y="99" text-anchor="middle" fill="#14b8a6" font-family="Inter, sans-serif" font-size="9" opacity="0.8">Shard 2</text>

        <rect x="215" y="80" width="70" height="28" rx="6" fill="#14b8a610" stroke="#14b8a6" stroke-width="1" stroke-opacity="0.3" />
        <text x="250" y="99" text-anchor="middle" fill="#14b8a6" font-family="Inter, sans-serif" font-size="9" opacity="0.8">Shard 3</text>

        <!-- Arrows down to GPUs -->
        <line x1="70" y1="112" x2="70" y2="138" stroke="#14b8a6" stroke-width="1" stroke-opacity="0.3" marker-end="url(#dtp-arrow-teal)" />
        <line x1="160" y1="112" x2="160" y2="138" stroke="#14b8a6" stroke-width="1" stroke-opacity="0.3" marker-end="url(#dtp-arrow-teal)" />
        <line x1="250" y1="112" x2="250" y2="138" stroke="#14b8a6" stroke-width="1" stroke-opacity="0.3" marker-end="url(#dtp-arrow-teal)" />

        <!-- GPU 0 with full model -->
        <rect x="25" y="145" width="90" height="130" rx="10" fill="url(#dtp-data-fill)" stroke="#14b8a6" stroke-width="1" stroke-opacity="0.3" />
        <text x="70" y="165" text-anchor="middle" fill="white" font-family="Inter, sans-serif" font-size="11" font-weight="600">GPU 0</text>
        <rect x="38" y="175" width="64" height="18" rx="4" fill="#14b8a610" stroke="#14b8a6" stroke-width="0.8" stroke-opacity="0.25" />
        <text x="70" y="188" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-family="Inter, sans-serif" font-size="8">Full Model</text>
        <rect x="38" y="198" width="64" height="18" rx="4" fill="#14b8a610" stroke="#14b8a6" stroke-width="0.8" stroke-opacity="0.25" />
        <text x="70" y="211" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-family="Inter, sans-serif" font-size="8">Optimizer</text>
        <rect x="38" y="221" width="64" height="18" rx="4" fill="#14b8a610" stroke="#14b8a6" stroke-width="0.8" stroke-opacity="0.25" />
        <text x="70" y="234" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-family="Inter, sans-serif" font-size="8">Gradients</text>
        <text x="70" y="262" text-anchor="middle" fill="rgba(255,255,255,0.25)" font-family="Inter, sans-serif" font-size="7">Copy</text>

        <!-- GPU 1 with full model -->
        <rect x="115" y="145" width="90" height="130" rx="10" fill="url(#dtp-data-fill)" stroke="#14b8a6" stroke-width="1" stroke-opacity="0.3" />
        <text x="160" y="165" text-anchor="middle" fill="white" font-family="Inter, sans-serif" font-size="11" font-weight="600">GPU 1</text>
        <rect x="128" y="175" width="64" height="18" rx="4" fill="#14b8a610" stroke="#14b8a6" stroke-width="0.8" stroke-opacity="0.25" />
        <text x="160" y="188" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-family="Inter, sans-serif" font-size="8">Full Model</text>
        <rect x="128" y="198" width="64" height="18" rx="4" fill="#14b8a610" stroke="#14b8a6" stroke-width="0.8" stroke-opacity="0.25" />
        <text x="160" y="211" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-family="Inter, sans-serif" font-size="8">Optimizer</text>
        <rect x="128" y="221" width="64" height="18" rx="4" fill="#14b8a610" stroke="#14b8a6" stroke-width="0.8" stroke-opacity="0.25" />
        <text x="160" y="234" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-family="Inter, sans-serif" font-size="8">Gradients</text>
        <text x="160" y="262" text-anchor="middle" fill="rgba(255,255,255,0.25)" font-family="Inter, sans-serif" font-size="7">Copy</text>

        <!-- GPU 2 with full model -->
        <rect x="205" y="145" width="90" height="130" rx="10" fill="url(#dtp-data-fill)" stroke="#14b8a6" stroke-width="1" stroke-opacity="0.3" />
        <text x="250" y="165" text-anchor="middle" fill="white" font-family="Inter, sans-serif" font-size="11" font-weight="600">GPU 2</text>
        <rect x="218" y="175" width="64" height="18" rx="4" fill="#14b8a610" stroke="#14b8a6" stroke-width="0.8" stroke-opacity="0.25" />
        <text x="250" y="188" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-family="Inter, sans-serif" font-size="8">Full Model</text>
        <rect x="218" y="198" width="64" height="18" rx="4" fill="#14b8a610" stroke="#14b8a6" stroke-width="0.8" stroke-opacity="0.25" />
        <text x="250" y="211" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-family="Inter, sans-serif" font-size="8">Optimizer</text>
        <rect x="218" y="221" width="64" height="18" rx="4" fill="#14b8a610" stroke="#14b8a6" stroke-width="0.8" stroke-opacity="0.25" />
        <text x="250" y="234" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-family="Inter, sans-serif" font-size="8">Gradients</text>
        <text x="250" y="262" text-anchor="middle" fill="rgba(255,255,255,0.25)" font-family="Inter, sans-serif" font-size="7">Copy</text>

        <!-- AllReduce sync arrows -->
        <line x1="70" y1="280" x2="70" y2="310" stroke="#14b8a6" stroke-width="1" stroke-opacity="0.3" marker-end="url(#dtp-arrow-teal)" />
        <line x1="160" y1="280" x2="160" y2="310" stroke="#14b8a6" stroke-width="1" stroke-opacity="0.3" marker-end="url(#dtp-arrow-teal)" />
        <line x1="250" y1="280" x2="250" y2="310" stroke="#14b8a6" stroke-width="1" stroke-opacity="0.3" marker-end="url(#dtp-arrow-teal)" />

        <!-- AllReduce box -->
        <rect x="30" y="315" width="260" height="36" rx="8" fill="#14b8a610" stroke="#14b8a6" stroke-width="1.2" stroke-opacity="0.4" stroke-dasharray="4 3" />
        <text x="160" y="337" text-anchor="middle" fill="#14b8a6" font-family="Inter, sans-serif" font-size="11" font-weight="600">
          AllReduce Gradient Sync
        </text>

        <!-- Bidirectional sync arrows between GPUs -->
        <line x1="85" y1="330" x2="125" y2="330" stroke="#14b8a6" stroke-width="1" stroke-opacity="0.25" />
        <line x1="195" y1="330" x2="215" y2="330" stroke="#14b8a6" stroke-width="1" stroke-opacity="0.25" />

        <!-- Description -->
        <text x="160" y="380" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-family="Inter, sans-serif" font-size="9">
          Each GPU trains on a different
        </text>
        <text x="160" y="394" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-family="Inter, sans-serif" font-size="9">
          data shard with a full model copy.
        </text>
        <text x="160" y="408" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-family="Inter, sans-serif" font-size="9">
          Gradients are synchronized via AllReduce.
        </text>

        <!-- Pros/Cons -->
        <text x="160" y="440" text-anchor="middle" fill="#14b8a6" font-family="Inter, sans-serif" font-size="8" font-weight="600" opacity="0.7">
          Simple | High throughput | Memory per GPU = full model
        </text>
      </g>

      <!-- ═══════════════════════════════════════ -->
      <!-- COLUMN 2: MODEL PARALLELISM              -->
      <!-- ═══════════════════════════════════════ -->
      <g
        class="dtp-pattern"
        @mouseenter="hoveredPattern = 'model'"
        @mouseleave="hoveredPattern = null"
      >
        <rect
          x="330" y="10" width="300" height="500" rx="14"
          :fill="hoveredPattern === 'model' ? '#a855f708' : 'transparent'"
          stroke="#a855f7"
          :stroke-opacity="hoveredPattern === 'model' ? 0.2 : 0.08"
          stroke-width="1"
          stroke-dasharray="6 4"
          class="dtp-region"
        />

        <text x="480" y="38" text-anchor="middle" fill="#a855f7" font-family="Inter, sans-serif" font-size="13" font-weight="700">
          Model Parallelism
        </text>

        <text x="480" y="68" text-anchor="middle" fill="rgba(255,255,255,0.35)" font-family="Inter, sans-serif" font-size="9" font-weight="500" letter-spacing="0.05em">
          MODEL SPLIT ACROSS GPUs
        </text>

        <!-- Full data at top -->
        <rect x="415" y="80" width="130" height="28" rx="6" fill="#a855f710" stroke="#a855f7" stroke-width="1" stroke-opacity="0.3" />
        <text x="480" y="99" text-anchor="middle" fill="#a855f7" font-family="Inter, sans-serif" font-size="9" opacity="0.8">Full Dataset (all GPUs)</text>

        <!-- Arrow down -->
        <line x1="480" y1="112" x2="480" y2="138" stroke="#a855f7" stroke-width="1" stroke-opacity="0.3" marker-end="url(#dtp-arrow-purple)" />

        <!-- GPU 0 — Layers 1-4 -->
        <rect x="365" y="145" width="230" height="55" rx="10" fill="url(#dtp-model-fill)" stroke="#a855f7" stroke-width="1" stroke-opacity="0.3" />
        <text x="400" y="170" fill="white" font-family="Inter, sans-serif" font-size="11" font-weight="600">GPU 0</text>
        <rect x="450" y="156" width="55" height="22" rx="4" fill="#a855f715" stroke="#a855f7" stroke-width="0.8" stroke-opacity="0.3" />
        <text x="477" y="171" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-family="Inter, sans-serif" font-size="8">Layers 1-4</text>
        <rect x="515" y="156" width="68" height="22" rx="4" fill="#a855f715" stroke="#a855f7" stroke-width="0.8" stroke-opacity="0.3" />
        <text x="549" y="171" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-family="Inter, sans-serif" font-size="8">Embeddings</text>

        <!-- Activation arrow -->
        <line x1="480" y1="204" x2="480" y2="228" stroke="#a855f7" stroke-width="1.2" stroke-opacity="0.4" marker-end="url(#dtp-arrow-purple)" />
        <text x="500" y="220" fill="#a855f7" font-family="Inter, sans-serif" font-size="7" opacity="0.5">activations</text>

        <!-- GPU 1 — Layers 5-8 -->
        <rect x="365" y="235" width="230" height="55" rx="10" fill="url(#dtp-model-fill)" stroke="#a855f7" stroke-width="1" stroke-opacity="0.3" />
        <text x="400" y="260" fill="white" font-family="Inter, sans-serif" font-size="11" font-weight="600">GPU 1</text>
        <rect x="450" y="246" width="55" height="22" rx="4" fill="#a855f715" stroke="#a855f7" stroke-width="0.8" stroke-opacity="0.3" />
        <text x="477" y="261" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-family="Inter, sans-serif" font-size="8">Layers 5-8</text>
        <rect x="515" y="246" width="68" height="22" rx="4" fill="#a855f715" stroke="#a855f7" stroke-width="0.8" stroke-opacity="0.3" />
        <text x="549" y="261" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-family="Inter, sans-serif" font-size="8">Attention</text>

        <!-- Activation arrow -->
        <line x1="480" y1="294" x2="480" y2="318" stroke="#a855f7" stroke-width="1.2" stroke-opacity="0.4" marker-end="url(#dtp-arrow-purple)" />
        <text x="500" y="310" fill="#a855f7" font-family="Inter, sans-serif" font-size="7" opacity="0.5">activations</text>

        <!-- GPU 2 — Layers 9-12 -->
        <rect x="365" y="325" width="230" height="55" rx="10" fill="url(#dtp-model-fill)" stroke="#a855f7" stroke-width="1" stroke-opacity="0.3" />
        <text x="400" y="350" fill="white" font-family="Inter, sans-serif" font-size="11" font-weight="600">GPU 2</text>
        <rect x="450" y="336" width="55" height="22" rx="4" fill="#a855f715" stroke="#a855f7" stroke-width="0.8" stroke-opacity="0.3" />
        <text x="477" y="351" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-family="Inter, sans-serif" font-size="8">Layers 9-12</text>
        <rect x="515" y="336" width="68" height="22" rx="4" fill="#a855f715" stroke="#a855f7" stroke-width="0.8" stroke-opacity="0.3" />
        <text x="549" y="351" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-family="Inter, sans-serif" font-size="8">Output Head</text>

        <!-- Description -->
        <text x="480" y="410" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-family="Inter, sans-serif" font-size="9">
          Model layers are split across GPUs.
        </text>
        <text x="480" y="424" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-family="Inter, sans-serif" font-size="9">
          Activations are passed forward,
        </text>
        <text x="480" y="438" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-family="Inter, sans-serif" font-size="9">
          gradients flow backward between GPUs.
        </text>

        <text x="480" y="468" text-anchor="middle" fill="#a855f7" font-family="Inter, sans-serif" font-size="8" font-weight="600" opacity="0.7">
          Fits large models | Low GPU utilization (bubble)
        </text>
      </g>

      <!-- ═══════════════════════════════════════ -->
      <!-- COLUMN 3: PIPELINE PARALLELISM           -->
      <!-- ═══════════════════════════════════════ -->
      <g
        class="dtp-pattern"
        @mouseenter="hoveredPattern = 'pipeline'"
        @mouseleave="hoveredPattern = null"
      >
        <rect
          x="650" y="10" width="300" height="500" rx="14"
          :fill="hoveredPattern === 'pipeline' ? '#f9731608' : 'transparent'"
          stroke="#f97316"
          :stroke-opacity="hoveredPattern === 'pipeline' ? 0.2 : 0.08"
          stroke-width="1"
          stroke-dasharray="6 4"
          class="dtp-region"
        />

        <text x="800" y="38" text-anchor="middle" fill="#f97316" font-family="Inter, sans-serif" font-size="13" font-weight="700">
          Pipeline Parallelism
        </text>

        <text x="800" y="68" text-anchor="middle" fill="rgba(255,255,255,0.35)" font-family="Inter, sans-serif" font-size="9" font-weight="500" letter-spacing="0.05em">
          MICRO-BATCHES THROUGH STAGES
        </text>

        <!-- Micro-batches at top -->
        <rect x="685" y="80" width="45" height="22" rx="5" fill="#f9731610" stroke="#f97316" stroke-width="0.8" stroke-opacity="0.3" />
        <text x="707" y="95" text-anchor="middle" fill="#f97316" font-family="Inter, sans-serif" font-size="7" opacity="0.8">uB 1</text>
        <rect x="738" y="80" width="45" height="22" rx="5" fill="#f9731610" stroke="#f97316" stroke-width="0.8" stroke-opacity="0.3" />
        <text x="760" y="95" text-anchor="middle" fill="#f97316" font-family="Inter, sans-serif" font-size="7" opacity="0.8">uB 2</text>
        <rect x="791" y="80" width="45" height="22" rx="5" fill="#f9731610" stroke="#f97316" stroke-width="0.8" stroke-opacity="0.3" />
        <text x="813" y="95" text-anchor="middle" fill="#f97316" font-family="Inter, sans-serif" font-size="7" opacity="0.8">uB 3</text>
        <rect x="844" y="80" width="45" height="22" rx="5" fill="#f9731610" stroke="#f97316" stroke-width="0.8" stroke-opacity="0.3" />
        <text x="866" y="95" text-anchor="middle" fill="#f97316" font-family="Inter, sans-serif" font-size="7" opacity="0.8">uB 4</text>

        <!-- Arrows down -->
        <line x1="707" y1="106" x2="707" y2="138" stroke="#f97316" stroke-width="1" stroke-opacity="0.3" marker-end="url(#dtp-arrow-orange)" />

        <!-- Stage 1 (GPU 0) -->
        <rect x="670" y="145" width="260" height="50" rx="10" fill="url(#dtp-pipe-fill)" stroke="#f97316" stroke-width="1" stroke-opacity="0.3" />
        <text x="710" y="170" fill="white" font-family="Inter, sans-serif" font-size="11" font-weight="600">Stage 1</text>
        <text x="710" y="184" fill="rgba(255,255,255,0.35)" font-family="Inter, sans-serif" font-size="8">(GPU 0)</text>
        <!-- Micro-batch slots showing pipeline progress -->
        <rect x="775" y="155" width="35" height="18" rx="3" fill="#f9731625" stroke="#f97316" stroke-width="0.6" stroke-opacity="0.4" />
        <text x="792" y="167" text-anchor="middle" fill="#f97316" font-family="Inter, sans-serif" font-size="7" opacity="0.8">uB1</text>
        <rect x="818" y="155" width="35" height="18" rx="3" fill="#f9731615" stroke="#f97316" stroke-width="0.6" stroke-opacity="0.2" />
        <text x="835" y="167" text-anchor="middle" fill="#f97316" font-family="Inter, sans-serif" font-size="7" opacity="0.5">uB2</text>
        <rect x="861" y="155" width="35" height="18" rx="3" fill="#f9731608" stroke="#f97316" stroke-width="0.6" stroke-opacity="0.15" />
        <text x="878" y="167" text-anchor="middle" fill="#f97316" font-family="Inter, sans-serif" font-size="7" opacity="0.3">uB3</text>

        <!-- Arrow -->
        <line x1="800" y1="199" x2="800" y2="218" stroke="#f97316" stroke-width="1.2" stroke-opacity="0.4" marker-end="url(#dtp-arrow-orange)" />
        <text x="818" y="212" fill="#f97316" font-family="Inter, sans-serif" font-size="7" opacity="0.5">forward</text>

        <!-- Stage 2 (GPU 1) -->
        <rect x="670" y="225" width="260" height="50" rx="10" fill="url(#dtp-pipe-fill)" stroke="#f97316" stroke-width="1" stroke-opacity="0.3" />
        <text x="710" y="250" fill="white" font-family="Inter, sans-serif" font-size="11" font-weight="600">Stage 2</text>
        <text x="710" y="264" fill="rgba(255,255,255,0.35)" font-family="Inter, sans-serif" font-size="8">(GPU 1)</text>
        <rect x="775" y="235" width="35" height="18" rx="3" fill="#f9731620" stroke="#f97316" stroke-width="0.6" stroke-opacity="0.3" />
        <text x="792" y="247" text-anchor="middle" fill="#f97316" font-family="Inter, sans-serif" font-size="7" opacity="0.7">uB1</text>
        <rect x="818" y="235" width="35" height="18" rx="3" fill="#f9731612" stroke="#f97316" stroke-width="0.6" stroke-opacity="0.2" />
        <text x="835" y="247" text-anchor="middle" fill="#f97316" font-family="Inter, sans-serif" font-size="7" opacity="0.4">uB2</text>

        <!-- Arrow -->
        <line x1="800" y1="279" x2="800" y2="298" stroke="#f97316" stroke-width="1.2" stroke-opacity="0.4" marker-end="url(#dtp-arrow-orange)" />
        <text x="818" y="292" fill="#f97316" font-family="Inter, sans-serif" font-size="7" opacity="0.5">forward</text>

        <!-- Stage 3 (GPU 2) -->
        <rect x="670" y="305" width="260" height="50" rx="10" fill="url(#dtp-pipe-fill)" stroke="#f97316" stroke-width="1" stroke-opacity="0.3" />
        <text x="710" y="330" fill="white" font-family="Inter, sans-serif" font-size="11" font-weight="600">Stage 3</text>
        <text x="710" y="344" fill="rgba(255,255,255,0.35)" font-family="Inter, sans-serif" font-size="8">(GPU 2)</text>
        <rect x="775" y="315" width="35" height="18" rx="3" fill="#f9731618" stroke="#f97316" stroke-width="0.6" stroke-opacity="0.25" />
        <text x="792" y="327" text-anchor="middle" fill="#f97316" font-family="Inter, sans-serif" font-size="7" opacity="0.6">uB1</text>

        <!-- Description -->
        <text x="800" y="390" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-family="Inter, sans-serif" font-size="9">
          Model split into stages; micro-batches
        </text>
        <text x="800" y="404" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-family="Inter, sans-serif" font-size="9">
          are pipelined through stages to keep
        </text>
        <text x="800" y="418" text-anchor="middle" fill="rgba(255,255,255,0.4)" font-family="Inter, sans-serif" font-size="9">
          all GPUs busy and reduce bubble time.
        </text>

        <text x="800" y="448" text-anchor="middle" fill="#f97316" font-family="Inter, sans-serif" font-size="8" font-weight="600" opacity="0.7">
          Best utilization | Complex scheduling
        </text>
      </g>

      <!-- Hover instruction -->
      <text x="480" y="498" text-anchor="middle" fill="rgba(255,255,255,0.15)" font-family="Inter, sans-serif" font-size="8" font-style="italic">
        Hover each column to highlight
      </text>
    </svg>
  </div>
</template>

<style scoped>
.dist-training {
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
  font-family: 'Inter', sans-serif;
}

.dtp-pattern {
  cursor: pointer;
}

.dtp-region {
  transition: fill 0.2s ease, stroke-opacity 0.2s ease;
}

.dist-training__caption {
  margin: 0 0 12px 0;
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.35);
  text-align: center;
}

.dist-training__svg {
  width: 100%;
  height: auto;
  display: block;
}
</style>
