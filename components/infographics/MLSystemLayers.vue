<script setup lang="ts">
/**
 * MLSystemLayers -- Interactive textbook infographic (Ch. 2)
 * Layered architecture diagram showing ML system layers from bottom to top:
 *   Hardware -> Infrastructure -> ML Platform -> Application
 * Each layer is a rounded rectangle, stacked vertically with slight overlap.
 * Hover a layer to highlight it and show detail text.
 * Animated data flow arrows between layers.
 */
import { ref } from 'vue'

const hoveredLayer = ref<string | null>(null)

interface SystemLayer {
  id: string
  name: string
  subtitle: string
  detail: string
  items: string[]
  color: string
  y: number
}

const layers: SystemLayer[] = [
  {
    id: 'application',
    name: 'Application Layer',
    subtitle: 'User-facing services',
    detail: 'Model serving endpoints, A/B testing, monitoring dashboards, shadow deployments',
    items: ['Serving', 'Monitoring', 'A/B Testing', 'Shadow Deploy'],
    color: '#22c55e',
    y: 60,
  },
  {
    id: 'platform',
    name: 'ML Platform',
    subtitle: 'Development & experimentation',
    detail: 'Feature store for reusable features, model registry for versioning, experiment tracking',
    items: ['Feature Store', 'Model Registry', 'Experiment Tracking', 'AutoML'],
    color: '#a855f7',
    y: 170,
  },
  {
    id: 'infrastructure',
    name: 'Infrastructure',
    subtitle: 'Orchestration & compute',
    detail: 'Container orchestration (K8s), distributed storage, networking, job scheduling',
    items: ['Orchestration', 'Storage', 'Networking', 'Scheduling'],
    color: '#14b8a6',
    y: 280,
  },
  {
    id: 'hardware',
    name: 'Hardware',
    subtitle: 'Physical compute resources',
    detail: 'GPU clusters for training, TPU pods for scale, edge devices for inference',
    items: ['GPUs', 'TPUs', 'Edge Devices', 'FPGAs'],
    color: '#f0a500',
    y: 390,
  },
]
</script>

<template>
  <div class="ml-system-layers">
    <p class="ml-system-layers__caption">
      Figure: ML System Architecture Layers
    </p>

    <svg
      class="ml-system-layers__svg"
      viewBox="0 0 800 520"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="ML system architecture showing four stacked layers: Hardware at the bottom, Infrastructure, ML Platform, and Application layer at the top, with data flow arrows between them."
    >
      <defs>
        <linearGradient id="msl-green-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#22c55e" stop-opacity="0.18" />
          <stop offset="100%" stop-color="#22c55e" stop-opacity="0.06" />
        </linearGradient>
        <linearGradient id="msl-purple-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#a855f7" stop-opacity="0.18" />
          <stop offset="100%" stop-color="#a855f7" stop-opacity="0.06" />
        </linearGradient>
        <linearGradient id="msl-teal-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#14b8a6" stop-opacity="0.18" />
          <stop offset="100%" stop-color="#14b8a6" stop-opacity="0.06" />
        </linearGradient>
        <linearGradient id="msl-amber-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#f0a500" stop-opacity="0.18" />
          <stop offset="100%" stop-color="#f0a500" stop-opacity="0.06" />
        </linearGradient>

        <marker id="msl-arrow-up" markerWidth="8" markerHeight="6" refX="4" refY="0" orient="auto">
          <polygon points="0 6, 4 0, 8 6" fill="rgba(255,255,255,0.3)" />
        </marker>
      </defs>

      <!-- Data flow arrows between layers (animated) -->
      <g v-for="i in 3" :key="'arrow-' + i">
        <line
          :x1="400" :y1="layers[i].y - 6"
          :x2="400" :y2="layers[i - 1].y + 90 + 6"
          stroke="rgba(255,255,255,0.1)" stroke-width="1.5"
          marker-start="url(#msl-arrow-up)"
        />
        <!-- Animated data packet -->
        <circle r="3" :fill="layers[i - 1].color" opacity="0.6">
          <animate
            attributeName="cy"
            :from="layers[i].y"
            :to="layers[i - 1].y + 90"
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="cx"
            :values="`${395};${405};${395}`"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
      </g>

      <!-- Layers -->
      <g
        v-for="layer in layers"
        :key="layer.id"
        class="msl-layer"
        @mouseenter="hoveredLayer = layer.id"
        @mouseleave="hoveredLayer = null"
      >
        <!-- Glow -->
        <rect
          v-if="hoveredLayer === layer.id"
          :x="97" :y="layer.y - 3"
          width="606" height="96" rx="16"
          :fill="`${layer.color}08`"
          class="msl-glow"
        />
        <!-- Main rect -->
        <rect
          :x="100" :y="layer.y"
          width="600" height="90" rx="14"
          :fill="hoveredLayer === layer.id ? `${layer.color}18` : `url(#msl-${layer.id === 'application' ? 'green' : layer.id === 'platform' ? 'purple' : layer.id === 'infrastructure' ? 'teal' : 'amber'}-fill)`"
          class="msl-rect"
        />
        <rect
          :x="100" :y="layer.y"
          width="600" height="90" rx="14"
          fill="none" :stroke="layer.color"
          :stroke-width="hoveredLayer === layer.id ? 1.5 : 1"
          :stroke-opacity="hoveredLayer === layer.id ? 0.6 : 0.3"
          class="msl-rect"
        />

        <!-- Layer name -->
        <text
          :x="140" :y="layer.y + 30"
          fill="white" font-family="Inter, sans-serif" font-size="14" font-weight="700"
        >
          {{ layer.name }}
        </text>

        <!-- Subtitle -->
        <text
          :x="140" :y="layer.y + 48"
          fill="rgba(255,255,255,0.4)" font-family="Inter, sans-serif" font-size="10"
        >
          {{ layer.subtitle }}
        </text>

        <!-- Item badges -->
        <g v-for="(item, idx) in layer.items" :key="item">
          <rect
            :x="140 + idx * 120" :y="layer.y + 58"
            width="108" height="22" rx="6"
            :fill="`${layer.color}12`"
            :stroke="layer.color" stroke-width="0.6" :stroke-opacity="hoveredLayer === layer.id ? 0.5 : 0.2"
          />
          <text
            :x="140 + idx * 120 + 54" :y="layer.y + 73"
            text-anchor="middle" :fill="layer.color" font-family="Inter, sans-serif" font-size="9" font-weight="600"
            :opacity="hoveredLayer === layer.id ? 0.9 : 0.6"
          >
            {{ item }}
          </text>
        </g>

        <!-- Hover detail -->
        <text
          v-if="hoveredLayer === layer.id"
          :x="620" :y="layer.y + 30"
          text-anchor="end" fill="rgba(255,255,255,0.5)" font-family="Inter, sans-serif" font-size="9" font-style="italic"
        >
          {{ layer.detail }}
        </text>
      </g>

      <!-- Side label -->
      <text x="60" y="260" text-anchor="middle" fill="rgba(255,255,255,0.15)" font-family="Inter, sans-serif" font-size="9" font-weight="500" transform="rotate(-90, 60, 260)">
        ABSTRACTION LEVEL
      </text>

      <!-- Legend -->
      <g transform="translate(140, 500)">
        <rect x="0" y="0" width="8" height="8" rx="2" fill="#22c55e" opacity="0.6" />
        <text x="14" y="8" fill="rgba(255,255,255,0.45)" font-family="Inter, sans-serif" font-size="9">Application</text>

        <rect x="100" y="0" width="8" height="8" rx="2" fill="#a855f7" opacity="0.6" />
        <text x="114" y="8" fill="rgba(255,255,255,0.45)" font-family="Inter, sans-serif" font-size="9">Platform</text>

        <rect x="190" y="0" width="8" height="8" rx="2" fill="#14b8a6" opacity="0.6" />
        <text x="204" y="8" fill="rgba(255,255,255,0.45)" font-family="Inter, sans-serif" font-size="9">Infrastructure</text>

        <rect x="305" y="0" width="8" height="8" rx="2" fill="#f0a500" opacity="0.6" />
        <text x="319" y="8" fill="rgba(255,255,255,0.45)" font-family="Inter, sans-serif" font-size="9">Hardware</text>
      </g>

      <!-- Hover instruction -->
      <text x="400" y="40" text-anchor="middle" fill="rgba(255,255,255,0.15)" font-family="Inter, sans-serif" font-size="8" font-style="italic">
        Hover each layer for architecture details
      </text>
    </svg>
  </div>
</template>

<style scoped>
.ml-system-layers {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  font-family: 'Inter', sans-serif;
}

.msl-layer {
  cursor: pointer;
}

.msl-rect {
  transition: fill 0.2s ease, stroke 0.2s ease, stroke-width 0.2s ease, stroke-opacity 0.2s ease;
}

.msl-glow {
  transition: opacity 0.2s ease;
}

.ml-system-layers__caption {
  margin: 0 0 12px 0;
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.35);
  text-align: center;
}

.ml-system-layers__svg {
  width: 100%;
  height: auto;
  display: block;
}
</style>
