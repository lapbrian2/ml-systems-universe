<script setup lang="ts">
/**
 * EfficientAISpectrum — Interactive textbook infographic (Ch 9)
 * A horizontal spectrum/scale showing the efficiency-accuracy trade-off.
 * Left: Maximum Efficiency (tiny models, edge devices)
 * Right: Maximum Accuracy (large models, cloud)
 * Plots 8 model families along the spectrum as circles sized by param count.
 * Y-axis: accuracy, X-axis: compute cost (GFLOPs).
 * Hover a model to show stats. Pareto frontier line connecting optimal models.
 */
import { ref, computed } from 'vue'

const hoveredModel = ref<string | null>(null)

interface ModelFamily {
  id: string
  name: string
  params: string
  paramsBillions: number
  flops: number
  accuracy: number
  device: string
  color: string
  detail: string
}

const models: ModelFamily[] = [
  { id: 'mobilenet', name: 'MobileNet', params: '3.4M', paramsBillions: 0.0034, flops: 0.3, accuracy: 71.8, device: 'Mobile / Edge', color: '#22c55e', detail: 'Depthwise separable convolutions for mobile inference' },
  { id: 'efficientnet-b0', name: 'EfficientNet-B0', params: '5.3M', paramsBillions: 0.0053, flops: 0.4, accuracy: 77.1, device: 'Mobile / Edge', color: '#14b8a6', detail: 'Compound scaling with neural architecture search' },
  { id: 'resnet50', name: 'ResNet-50', params: '25M', paramsBillions: 0.025, flops: 4.1, accuracy: 76.1, device: 'Server GPU', color: '#3b82f6', detail: 'Skip connections enabling deep residual learning' },
  { id: 'efficientnet-b7', name: 'EfficientNet-B7', params: '66M', paramsBillions: 0.066, flops: 37, accuracy: 84.3, device: 'Server GPU', color: '#14b8a6', detail: 'Scaled-up EfficientNet with top ImageNet accuracy' },
  { id: 'bert', name: 'BERT-base', params: '110M', paramsBillions: 0.11, flops: 22, accuracy: 80.5, device: 'Server GPU', color: '#a855f7', detail: 'Bidirectional transformer for NLP understanding' },
  { id: 'vit', name: 'ViT-Large', params: '307M', paramsBillions: 0.307, flops: 190, accuracy: 87.8, device: 'Multi-GPU', color: '#ec4899', detail: 'Vision Transformer with attention-based image patches' },
  { id: 'llama', name: 'LLaMA-7B', params: '7B', paramsBillions: 7, flops: 1800, accuracy: 89.2, device: 'Multi-GPU / Cloud', color: '#f0a500', detail: 'Open-weight LLM with strong few-shot performance' },
  { id: 'gpt', name: 'GPT-4 class', params: '~1.8T', paramsBillions: 1800, flops: 50000, accuracy: 96.5, device: 'Cloud cluster', color: '#ef4444', detail: 'Frontier model requiring massive distributed compute' },
]

// Chart mapping
// X-axis: log10(GFLOPs) from -1 to 5 → SVG 120..700
// Y-axis: accuracy 65 to 100 → SVG 380..60
const xMin = -1
const xMax = 5.0
const yMin = 65
const yMax = 100

function xPos(flops: number): number {
  const logVal = Math.log10(Math.max(flops, 0.1))
  return 120 + ((logVal - xMin) / (xMax - xMin)) * 580
}

function yPos(accuracy: number): number {
  return 380 - ((accuracy - yMin) / (yMax - yMin)) * 320
}

function circleR(paramsBillions: number): number {
  const logP = Math.log10(Math.max(paramsBillions, 0.001))
  return Math.max(5, Math.min(22, 8 + logP * 3))
}

// Pareto frontier: models that are not dominated
const paretoModels = computed(() => {
  const sorted = [...models].sort((a, b) => a.flops - b.flops)
  const frontier: ModelFamily[] = []
  let maxAcc = 0
  for (const m of sorted) {
    if (m.accuracy > maxAcc) {
      frontier.push(m)
      maxAcc = m.accuracy
    }
  }
  return frontier
})

const paretoPath = computed(() => {
  const pts = paretoModels.value.map(m => ({ x: xPos(m.flops), y: yPos(m.accuracy) }))
  if (pts.length < 2) return ''
  let d = `M ${pts[0].x} ${pts[0].y}`
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1]
    const curr = pts[i]
    const cx1 = prev.x + (curr.x - prev.x) * 0.4
    const cx2 = curr.x - (curr.x - prev.x) * 0.4
    d += ` C ${cx1} ${prev.y}, ${cx2} ${curr.y}, ${curr.x} ${curr.y}`
  }
  return d
})

// X-axis ticks
const xTicks = [
  { flops: 0.1, label: '0.1' },
  { flops: 1, label: '1' },
  { flops: 10, label: '10' },
  { flops: 100, label: '100' },
  { flops: 1000, label: '1K' },
  { flops: 10000, label: '10K' },
  { flops: 100000, label: '100K' },
]

// Y-axis ticks
const yTicks = [70, 75, 80, 85, 90, 95, 100]
</script>

<template>
  <div class="efficient-spectrum">
    <p class="efficient-spectrum__caption">
      Figure: Efficiency vs. Accuracy Spectrum Across Model Families
    </p>

    <svg
      class="efficient-spectrum__svg"
      viewBox="0 0 800 500"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Scatter plot showing the efficiency-accuracy trade-off across 8 model families from MobileNet to GPT-4, with circle sizes representing parameter counts and a Pareto frontier line connecting optimal models."
    >
      <defs>
        <linearGradient id="es-pareto-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#22c55e" stop-opacity="0.5" />
          <stop offset="50%" stop-color="#14b8a6" stop-opacity="0.5" />
          <stop offset="100%" stop-color="#ef4444" stop-opacity="0.5" />
        </linearGradient>
        <linearGradient id="es-zone-eff" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#22c55e" stop-opacity="0.06" />
          <stop offset="100%" stop-color="#22c55e" stop-opacity="0" />
        </linearGradient>
        <linearGradient id="es-zone-acc" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#ef4444" stop-opacity="0" />
          <stop offset="100%" stop-color="#ef4444" stop-opacity="0.06" />
        </linearGradient>
      </defs>

      <!-- Spectrum zone backgrounds -->
      <rect x="120" y="55" width="200" height="330" fill="url(#es-zone-eff)" />
      <rect x="500" y="55" width="200" height="330" fill="url(#es-zone-acc)" />

      <!-- Zone labels -->
      <text x="180" y="48" text-anchor="middle" fill="#22c55e" font-family="Inter, sans-serif" font-size="8" font-weight="600" opacity="0.4" letter-spacing="0.06em">MAXIMUM EFFICIENCY</text>
      <text x="180" y="400" text-anchor="middle" fill="#22c55e" font-family="Inter, sans-serif" font-size="7" opacity="0.25" font-style="italic">Tiny models, edge devices</text>
      <text x="650" y="48" text-anchor="middle" fill="#ef4444" font-family="Inter, sans-serif" font-size="8" font-weight="600" opacity="0.4" letter-spacing="0.06em">MAXIMUM ACCURACY</text>
      <text x="650" y="400" text-anchor="middle" fill="#ef4444" font-family="Inter, sans-serif" font-size="7" opacity="0.25" font-style="italic">Large models, cloud clusters</text>

      <!-- Y-axis -->
      <line x1="120" y1="55" x2="120" y2="385" stroke="rgba(255,255,255,0.12)" stroke-width="1" />
      <text x="60" y="220" text-anchor="middle" fill="rgba(255,255,255,0.35)" font-family="Inter, sans-serif" font-size="10" font-weight="600" transform="rotate(-90, 60, 220)">
        Accuracy (benchmark %)
      </text>

      <!-- Y-axis ticks -->
      <g v-for="yt in yTicks" :key="'yt-' + yt">
        <text x="112" :y="yPos(yt) + 4" text-anchor="end" fill="rgba(255,255,255,0.3)" font-family="Inter, sans-serif" font-size="9">{{ yt }}</text>
        <line x1="117" :y1="yPos(yt)" x2="120" :y2="yPos(yt)" stroke="rgba(255,255,255,0.1)" stroke-width="1" />
        <line x1="120" :y1="yPos(yt)" x2="705" :y2="yPos(yt)" stroke="rgba(255,255,255,0.03)" stroke-width="1" stroke-dasharray="4 4" />
      </g>

      <!-- X-axis -->
      <line x1="120" y1="385" x2="710" y2="385" stroke="rgba(255,255,255,0.12)" stroke-width="1" />
      <text x="415" y="430" text-anchor="middle" fill="rgba(255,255,255,0.35)" font-family="Inter, sans-serif" font-size="10" font-weight="600">
        Compute Cost (GFLOPs) — log scale
      </text>

      <!-- X-axis ticks -->
      <g v-for="xt in xTicks" :key="'xt-' + xt.flops">
        <text v-if="xPos(xt.flops) >= 120 && xPos(xt.flops) <= 710" :x="xPos(xt.flops)" y="402" text-anchor="middle" fill="rgba(255,255,255,0.3)" font-family="Inter, sans-serif" font-size="9">{{ xt.label }}</text>
        <line v-if="xPos(xt.flops) >= 120 && xPos(xt.flops) <= 710" :x1="xPos(xt.flops)" y1="385" :x2="xPos(xt.flops)" y2="388" stroke="rgba(255,255,255,0.1)" stroke-width="1" />
      </g>

      <!-- Pareto frontier -->
      <path
        v-if="paretoPath"
        :d="paretoPath"
        fill="none"
        stroke="url(#es-pareto-grad)"
        stroke-width="2"
        stroke-linecap="round"
        stroke-dasharray="6 3"
      />

      <!-- Model data points -->
      <g
        v-for="model in models"
        :key="model.id"
        class="es-model"
        @mouseenter="hoveredModel = model.id"
        @mouseleave="hoveredModel = null"
      >
        <!-- Glow ring on hover -->
        <circle
          v-if="hoveredModel === model.id"
          :cx="xPos(model.flops)" :cy="yPos(model.accuracy)"
          :r="circleR(model.paramsBillions) + 8"
          :fill="`${model.color}08`"
          :stroke="model.color"
          stroke-width="1"
          stroke-opacity="0.2"
          class="es-glow"
        />

        <!-- Model circle -->
        <circle
          :cx="xPos(model.flops)" :cy="yPos(model.accuracy)"
          :r="hoveredModel === model.id ? circleR(model.paramsBillions) + 2 : circleR(model.paramsBillions)"
          :fill="model.color"
          :fill-opacity="hoveredModel === model.id ? 0.35 : 0.2"
          :stroke="model.color"
          stroke-width="1.5"
          :stroke-opacity="hoveredModel === model.id ? 0.7 : 0.4"
          class="es-dot"
        />

        <!-- Label -->
        <text
          :x="xPos(model.flops)"
          :y="yPos(model.accuracy) - circleR(model.paramsBillions) - 6"
          text-anchor="middle"
          :fill="model.color"
          font-family="Inter, sans-serif"
          font-size="9"
          font-weight="700"
        >{{ model.name }}</text>

        <!-- Param count below circle -->
        <text
          :x="xPos(model.flops)"
          :y="yPos(model.accuracy) + circleR(model.paramsBillions) + 12"
          text-anchor="middle"
          fill="rgba(255,255,255,0.3)"
          font-family="Inter, sans-serif"
          font-size="7"
        >{{ model.params }}</text>

        <!-- Hover tooltip -->
        <g v-if="hoveredModel === model.id">
          <rect
            :x="Math.min(Math.max(xPos(model.flops) - 120, 20), 560)"
            :y="yPos(model.accuracy) + circleR(model.paramsBillions) + 20"
            width="240" height="60" rx="8"
            fill="#0a0e1f" stroke="rgba(255,255,255,0.1)" stroke-width="1"
          />
          <text
            :x="Math.min(Math.max(xPos(model.flops), 140), 680)"
            :y="yPos(model.accuracy) + circleR(model.paramsBillions) + 36"
            text-anchor="middle" fill="rgba(255,255,255,0.55)" font-family="Inter, sans-serif" font-size="8"
          >{{ model.detail }}</text>
          <line
            :x1="Math.min(Math.max(xPos(model.flops) - 110, 30), 570)"
            :y1="yPos(model.accuracy) + circleR(model.paramsBillions) + 43"
            :x2="Math.min(Math.max(xPos(model.flops) + 110, 150), 790)"
            :y2="yPos(model.accuracy) + circleR(model.paramsBillions) + 43"
            stroke="rgba(255,255,255,0.06)" stroke-width="0.5"
          />
          <text
            :x="Math.min(Math.max(xPos(model.flops) - 100, 40), 580)"
            :y="yPos(model.accuracy) + circleR(model.paramsBillions) + 56"
            fill="rgba(255,255,255,0.4)" font-family="Inter, sans-serif" font-size="7"
          >Params: {{ model.params }}</text>
          <text
            :x="Math.min(Math.max(xPos(model.flops) - 10, 130), 670)"
            :y="yPos(model.accuracy) + circleR(model.paramsBillions) + 56"
            fill="rgba(255,255,255,0.4)" font-family="Inter, sans-serif" font-size="7"
          >FLOPs: {{ model.flops >= 1000 ? (model.flops / 1000).toFixed(0) + 'T' : model.flops + 'G' }}</text>
          <text
            :x="Math.min(Math.max(xPos(model.flops) - 100, 40), 580)"
            :y="yPos(model.accuracy) + circleR(model.paramsBillions) + 70"
            :fill="model.color" font-family="Inter, sans-serif" font-size="7" font-weight="600"
          >Target: {{ model.device }}</text>
          <text
            :x="Math.min(Math.max(xPos(model.flops) - 10, 130), 670)"
            :y="yPos(model.accuracy) + circleR(model.paramsBillions) + 70"
            fill="rgba(255,255,255,0.4)" font-family="Inter, sans-serif" font-size="7"
          >Accuracy: {{ model.accuracy }}%</text>
        </g>
      </g>

      <!-- Legend -->
      <g transform="translate(120, 450)">
        <text x="0" y="10" fill="rgba(255,255,255,0.25)" font-family="Inter, sans-serif" font-size="8" font-weight="600" letter-spacing="0.05em">CIRCLE SIZE = PARAMETER COUNT</text>
        <circle cx="220" cy="6" r="4" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="1" />
        <text x="230" y="10" fill="rgba(255,255,255,0.3)" font-family="Inter, sans-serif" font-size="7">Small</text>
        <circle cx="270" cy="6" r="8" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="1" />
        <text x="284" y="10" fill="rgba(255,255,255,0.3)" font-family="Inter, sans-serif" font-size="7">Medium</text>
        <circle cx="335" cy="6" r="14" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="1" />
        <text x="355" y="10" fill="rgba(255,255,255,0.3)" font-family="Inter, sans-serif" font-size="7">Large</text>

        <line x1="400" y1="6" x2="440" y2="6" stroke="url(#es-pareto-grad)" stroke-width="2" stroke-dasharray="6 3" />
        <text x="448" y="10" fill="rgba(255,255,255,0.35)" font-family="Inter, sans-serif" font-size="8">Pareto Frontier</text>
      </g>

      <text x="400" y="486" text-anchor="middle" fill="rgba(255,255,255,0.15)" font-family="Inter, sans-serif" font-size="8" font-style="italic">
        Hover each model for detailed specs and deployment target
      </text>
    </svg>
  </div>
</template>

<style scoped>
.efficient-spectrum {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  font-family: 'Inter', sans-serif;
}

.es-model {
  cursor: pointer;
}

.es-dot {
  transition: r 0.2s ease, fill-opacity 0.2s ease, stroke-opacity 0.2s ease;
}

.es-glow {
  transition: opacity 0.2s ease;
}

.efficient-spectrum__caption {
  margin: 0 0 12px 0;
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.35);
  text-align: center;
}

.efficient-spectrum__svg {
  width: 100%;
  height: auto;
  display: block;
}
</style>
