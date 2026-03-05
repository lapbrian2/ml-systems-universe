<script setup lang="ts">
/**
 * FrameworkEcosystem — Interactive textbook infographic (Ch 7)
 * A 2D scatter/positioning map of ML frameworks.
 * X-axis: Research Focus <-> Production Focus
 * Y-axis: Low-level <-> High-level
 * Bubble size = community adoption. Hover for details.
 */
import { ref } from 'vue'

const hoveredFramework = ref<string | null>(null)

interface Framework {
  id: string
  name: string
  x: number // 0-100 (research=0, production=100)
  y: number // 0-100 (low-level=0, high-level=100)
  radius: number
  color: string
  stars: string
  features: string[]
  users: string
}

const frameworks: Framework[] = [
  {
    id: 'pytorch',
    name: 'PyTorch',
    x: 25,
    y: 55,
    radius: 32,
    color: '#ef4444',
    stars: '82k+',
    features: ['Dynamic graphs', 'Pythonic API', 'TorchScript'],
    users: 'Researchers, academics, startups',
  },
  {
    id: 'tensorflow',
    name: 'TensorFlow',
    x: 72,
    y: 55,
    radius: 30,
    color: '#f59e0b',
    stars: '186k+',
    features: ['TF Serving', 'TF Lite', 'TPU support'],
    users: 'Enterprise, production ML teams',
  },
  {
    id: 'jax',
    name: 'JAX',
    x: 18,
    y: 25,
    radius: 20,
    color: '#a855f7',
    stars: '31k+',
    features: ['XLA compilation', 'Auto-diff', 'Functional API'],
    users: 'ML researchers, Google Brain',
  },
  {
    id: 'keras',
    name: 'Keras',
    x: 65,
    y: 85,
    radius: 22,
    color: '#ef4444',
    stars: '62k+',
    features: ['Sequential API', 'Multi-backend', 'Rapid prototyping'],
    users: 'Beginners, rapid prototypers',
  },
  {
    id: 'onnx',
    name: 'ONNX Runtime',
    x: 88,
    y: 20,
    radius: 15,
    color: '#14b8a6',
    stars: '14k+',
    features: ['Cross-framework', 'Optimized inference', 'Edge deploy'],
    users: 'MLOps engineers, edge deployment',
  },
  {
    id: 'huggingface',
    name: 'Hugging Face',
    x: 38,
    y: 88,
    radius: 24,
    color: '#f59e0b',
    stars: '135k+',
    features: ['Model hub', 'Transformers', 'Datasets library'],
    users: 'NLP/LLM researchers & practitioners',
  },
]

// Chart dimensions within SVG
const chartLeft = 100
const chartTop = 60
const chartWidth = 700
const chartHeight = 380

function fwX(pct: number): number {
  return chartLeft + (pct / 100) * chartWidth
}

function fwY(pct: number): number {
  return chartTop + chartHeight - (pct / 100) * chartHeight
}
</script>

<template>
  <div class="framework-ecosystem">
    <p class="framework-ecosystem__caption">
      Figure: ML Framework Ecosystem Positioning Map
    </p>

    <svg
      class="framework-ecosystem__svg"
      viewBox="0 0 900 520"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="2D positioning map of ML frameworks: PyTorch, TensorFlow, JAX, Keras, ONNX Runtime, and Hugging Face, plotted by research vs production focus and API level. Bubble size represents community adoption."
    >
      <defs>
        <linearGradient v-for="fw in frameworks" :id="`fe-fill-${fw.id}`" :key="`grad-${fw.id}`" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" :stop-color="fw.color" stop-opacity="0.25" />
          <stop offset="100%" :stop-color="fw.color" stop-opacity="0.08" />
        </linearGradient>
      </defs>

      <!-- Title -->
      <text x="450" y="30" text-anchor="middle" fill="white" font-family="Inter, sans-serif" font-size="16" font-weight="700" opacity="0.9">
        ML Framework Ecosystem
      </text>
      <text x="450" y="48" text-anchor="middle" fill="rgba(255,255,255,0.35)" font-family="Inter, sans-serif" font-size="10" font-style="italic">
        Bubble size reflects relative community adoption
      </text>

      <!-- Chart area background -->
      <rect
        :x="chartLeft" :y="chartTop"
        :width="chartWidth" :height="chartHeight"
        rx="8" fill="rgba(255,255,255,0.02)"
        stroke="rgba(255,255,255,0.06)" stroke-width="0.5"
      />

      <!-- Grid lines -->
      <line v-for="i in 4" :key="`hgrid-${i}`"
        :x1="chartLeft"
        :y1="chartTop + (i * chartHeight / 5)"
        :x2="chartLeft + chartWidth"
        :y2="chartTop + (i * chartHeight / 5)"
        stroke="rgba(255,255,255,0.04)" stroke-width="0.5"
      />
      <line v-for="i in 4" :key="`vgrid-${i}`"
        :x1="chartLeft + (i * chartWidth / 5)"
        :y1="chartTop"
        :x2="chartLeft + (i * chartWidth / 5)"
        :y2="chartTop + chartHeight"
        stroke="rgba(255,255,255,0.04)" stroke-width="0.5"
      />

      <!-- X-axis -->
      <line
        :x1="chartLeft" :y1="chartTop + chartHeight"
        :x2="chartLeft + chartWidth" :y2="chartTop + chartHeight"
        stroke="rgba(255,255,255,0.12)" stroke-width="1"
      />
      <text :x="chartLeft" :y="chartTop + chartHeight + 24" fill="rgba(255,255,255,0.4)" font-family="Inter, sans-serif" font-size="10" font-weight="600">
        Research Focus
      </text>
      <text :x="chartLeft + chartWidth" :y="chartTop + chartHeight + 24" text-anchor="end" fill="rgba(255,255,255,0.4)" font-family="Inter, sans-serif" font-size="10" font-weight="600">
        Production Focus
      </text>
      <!-- X-axis arrow hints -->
      <text :x="chartLeft + chartWidth / 2" :y="chartTop + chartHeight + 24" text-anchor="middle" fill="rgba(255,255,255,0.2)" font-family="Inter, sans-serif" font-size="9">
        &#x2190; &#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500;&#x2500; &#x2192;
      </text>

      <!-- Y-axis -->
      <line
        :x1="chartLeft" :y1="chartTop"
        :x2="chartLeft" :y2="chartTop + chartHeight"
        stroke="rgba(255,255,255,0.12)" stroke-width="1"
      />
      <text :x="chartLeft - 14" :y="chartTop + 8" text-anchor="end" fill="rgba(255,255,255,0.4)" font-family="Inter, sans-serif" font-size="10" font-weight="600">
        High-level
      </text>
      <text :x="chartLeft - 14" :y="chartTop + chartHeight" text-anchor="end" fill="rgba(255,255,255,0.4)" font-family="Inter, sans-serif" font-size="10" font-weight="600">
        Low-level
      </text>

      <!-- Framework bubbles -->
      <g v-for="fw in frameworks" :key="fw.id"
        class="fe-bubble"
        @mouseenter="hoveredFramework = fw.id"
        @mouseleave="hoveredFramework = null"
      >
        <!-- Glow on hover -->
        <circle
          v-if="hoveredFramework === fw.id"
          :cx="fwX(fw.x)"
          :cy="fwY(fw.y)"
          :r="fw.radius + 8"
          :fill="fw.color"
          fill-opacity="0.06"
          class="fe-glow"
        />

        <!-- Bubble -->
        <circle
          :cx="fwX(fw.x)"
          :cy="fwY(fw.y)"
          :r="hoveredFramework === fw.id ? fw.radius + 3 : fw.radius"
          :fill="`url(#fe-fill-${fw.id})`"
          :stroke="fw.color"
          :stroke-width="hoveredFramework === fw.id ? 2 : 1.2"
          :stroke-opacity="hoveredFramework === fw.id ? 0.7 : 0.4"
          class="fe-circle"
        />

        <!-- Framework name -->
        <text
          :x="fwX(fw.x)"
          :y="fwY(fw.y) + 1"
          text-anchor="middle"
          dominant-baseline="middle"
          fill="white"
          font-family="Inter, sans-serif"
          :font-size="fw.radius > 20 ? 11 : 9"
          font-weight="700"
          :opacity="hoveredFramework === fw.id ? 1 : 0.85"
        >
          {{ fw.name }}
        </text>
      </g>

      <!-- Hover detail panel -->
      <g v-if="hoveredFramework">
        <rect x="20" y="470" width="860" height="40" rx="10" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" stroke-width="0.5" />

        <g v-for="fw in frameworks" :key="`detail-${fw.id}`">
          <g v-if="hoveredFramework === fw.id">
            <circle cx="40" cy="490" r="5" :fill="fw.color" opacity="0.6" />
            <text x="54" y="487" fill="white" font-family="Inter, sans-serif" font-size="11" font-weight="700" opacity="0.9">
              {{ fw.name }}
            </text>
            <text x="54" y="502" fill="rgba(255,255,255,0.5)" font-family="Inter, sans-serif" font-size="9">
              {{ fw.users }}
            </text>

            <!-- Stars badge -->
            <rect x="250" y="478" width="70" height="22" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" stroke-width="0.5" />
            <text x="258" y="492" fill="rgba(255,255,255,0.35)" font-family="Inter, sans-serif" font-size="7">&#x2605;</text>
            <text x="270" y="493" :fill="fw.color" font-family="Inter, sans-serif" font-size="10" font-weight="600">
              {{ fw.stars }}
            </text>

            <!-- Features -->
            <text x="340" y="493" fill="rgba(255,255,255,0.45)" font-family="Inter, sans-serif" font-size="9">
              {{ fw.features.join(' / ') }}
            </text>
          </g>
        </g>
      </g>
      <g v-else>
        <text x="450" y="495" text-anchor="middle" fill="rgba(255,255,255,0.2)" font-family="Inter, sans-serif" font-size="9" font-style="italic">
          Hover a framework bubble for details
        </text>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.framework-ecosystem {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  font-family: 'Inter', sans-serif;
}

.fe-bubble {
  cursor: pointer;
}

.fe-circle {
  transition: r 0.2s ease, stroke-width 0.2s ease, stroke-opacity 0.2s ease;
}

.fe-glow {
  transition: opacity 0.2s ease;
}

.framework-ecosystem__caption {
  margin: 0 0 12px 0;
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.35);
  text-align: center;
}

.framework-ecosystem__svg {
  width: 100%;
  height: auto;
  display: block;
}
</style>
