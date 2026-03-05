<script setup lang="ts">
/**
 * CarbonFootprintBreakdown — Interactive textbook infographic (Ch 18)
 * Donut/ring chart showing carbon breakdown of ML training.
 * Segments: Hardware, Training Compute, Cooling, Data Storage, Inference.
 * Center shows total CO2. Hover segments for details.
 */
import { ref, computed } from 'vue'

interface Segment {
  id: string
  label: string
  percent: number
  color: string
  detail: string
}

const hoveredSegment = ref<string | null>(null)

const segments: Segment[] = [
  { id: 'compute', label: 'Training Compute', percent: 45, color: '#a855f7', detail: '248 tonnes — GPU/TPU hours for model training' },
  { id: 'hardware', label: 'Hardware Manufacturing', percent: 20, color: '#5b78ff', detail: '110 tonnes — Chip fabrication & server assembly' },
  { id: 'cooling', label: 'Data Center Cooling', percent: 15, color: '#14b8a6', detail: '83 tonnes — HVAC & liquid cooling systems' },
  { id: 'storage', label: 'Data Storage & Transfer', percent: 10, color: '#f59e0b', detail: '55 tonnes — Dataset storage & network transfer' },
  { id: 'inference', label: 'Inference (Lifetime)', percent: 10, color: '#22c55e', detail: '55 tonnes — Serving predictions post-deployment' },
]

/** Convert percentage segments to SVG arc paths on a donut chart */
const cx = 300
const cy = 200
const outerR = 140
const innerR = 85
const gap = 0.008 // Small gap between segments in radians

const arcs = computed(() => {
  const result: Array<{
    id: string
    path: string
    color: string
    labelX: number
    labelY: number
    label: string
    percent: number
  }> = []

  let currentAngle = -Math.PI / 2 // Start at top

  for (const seg of segments) {
    const segAngle = (seg.percent / 100) * 2 * Math.PI
    const startAngle = currentAngle + gap
    const endAngle = currentAngle + segAngle - gap

    const r = hoveredSegment.value === seg.id ? outerR + 6 : outerR
    const ir = hoveredSegment.value === seg.id ? innerR - 3 : innerR

    const x1o = cx + r * Math.cos(startAngle)
    const y1o = cy + r * Math.sin(startAngle)
    const x2o = cx + r * Math.cos(endAngle)
    const y2o = cy + r * Math.sin(endAngle)
    const x1i = cx + ir * Math.cos(endAngle)
    const y1i = cy + ir * Math.sin(endAngle)
    const x2i = cx + ir * Math.cos(startAngle)
    const y2i = cy + ir * Math.sin(startAngle)

    const largeArc = segAngle > Math.PI ? 1 : 0

    const path = [
      `M ${x1o} ${y1o}`,
      `A ${r} ${r} 0 ${largeArc} 1 ${x2o} ${y2o}`,
      `L ${x1i} ${y1i}`,
      `A ${ir} ${ir} 0 ${largeArc} 0 ${x2i} ${y2i}`,
      'Z',
    ].join(' ')

    const midAngle = (startAngle + endAngle) / 2
    const labelR = outerR + 28
    const labelX = cx + labelR * Math.cos(midAngle)
    const labelY = cy + labelR * Math.sin(midAngle)

    result.push({
      id: seg.id,
      path,
      color: seg.color,
      labelX,
      labelY,
      label: seg.label,
      percent: seg.percent,
    })

    currentAngle += segAngle
  }

  return result
})

const hoveredDetail = computed(() => {
  if (!hoveredSegment.value) return null
  return segments.find((s) => s.id === hoveredSegment.value) ?? null
})
</script>

<template>
  <div class="carbon-breakdown">
    <p class="carbon-breakdown__caption">
      Figure: Carbon Footprint of Large-Scale ML Training
    </p>

    <svg
      class="carbon-breakdown__svg"
      viewBox="0 0 700 440"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Donut chart showing carbon footprint breakdown of ML model training: Training Compute 45%, Hardware Manufacturing 20%, Data Center Cooling 15%, Data Storage 10%, Inference 10%. Total 552 tonnes CO2 for GPT-3."
    >
      <defs>
        <filter id="cfb-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <!-- Title -->
      <text x="350" y="28" text-anchor="middle" fill="white" font-family="Inter, sans-serif" font-size="15" font-weight="700" opacity="0.9">
        ML Training Carbon Footprint
      </text>
      <text x="350" y="46" text-anchor="middle" fill="rgba(255,255,255,0.35)" font-family="Inter, sans-serif" font-size="10" font-style="italic">
        Estimated breakdown for GPT-3 scale training
      </text>

      <!-- Donut segments -->
      <g v-for="arc in arcs" :key="arc.id">
        <path
          :d="arc.path"
          :fill="arc.color"
          :fill-opacity="hoveredSegment === arc.id ? 0.5 : 0.3"
          :stroke="arc.color"
          :stroke-width="hoveredSegment === arc.id ? 2 : 1"
          :stroke-opacity="hoveredSegment === arc.id ? 0.8 : 0.4"
          class="cfb-segment"
          @mouseenter="hoveredSegment = arc.id"
          @mouseleave="hoveredSegment = null"
        />
      </g>

      <!-- Center content -->
      <circle :cx="cx" :cy="cy" r="80" fill="rgba(0,0,0,0.3)" />
      <circle :cx="cx" :cy="cy" r="80" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1" />

      <!-- Center text: total or hovered detail -->
      <g v-if="!hoveredDetail">
        <text :x="cx" :y="cy - 18" text-anchor="middle" fill="white" font-family="Inter, sans-serif" font-size="22" font-weight="700" opacity="0.9">
          552
        </text>
        <text :x="cx" :y="cy + 2" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-family="Inter, sans-serif" font-size="11" font-weight="500">
          tonnes CO&#x2082;
        </text>
        <text :x="cx" :y="cy + 20" text-anchor="middle" fill="rgba(255,255,255,0.3)" font-family="Inter, sans-serif" font-size="9" font-style="italic">
          GPT-3 estimated
        </text>
      </g>
      <g v-else>
        <text :x="cx" :y="cy - 14" text-anchor="middle" :fill="hoveredDetail.color" font-family="Inter, sans-serif" font-size="20" font-weight="700">
          {{ hoveredDetail.percent }}%
        </text>
        <text :x="cx" :y="cy + 6" text-anchor="middle" fill="rgba(255,255,255,0.6)" font-family="Inter, sans-serif" font-size="10" font-weight="600">
          {{ hoveredDetail.label }}
        </text>
      </g>

      <!-- Outer labels with leader lines -->
      <g v-for="arc in arcs" :key="`label-${arc.id}`">
        <!-- Label text -->
        <text
          :x="arc.labelX"
          :y="arc.labelY - 4"
          :text-anchor="arc.labelX > cx ? 'start' : 'end'"
          :fill="hoveredSegment === arc.id ? arc.color : 'rgba(255,255,255,0.55)'"
          font-family="Inter, sans-serif"
          font-size="10"
          font-weight="600"
          class="cfb-label"
        >
          {{ arc.label }}
        </text>
        <text
          :x="arc.labelX"
          :y="arc.labelY + 10"
          :text-anchor="arc.labelX > cx ? 'start' : 'end'"
          :fill="hoveredSegment === arc.id ? arc.color : 'rgba(255,255,255,0.35)'"
          font-family="Inter, sans-serif"
          font-size="9"
          class="cfb-label"
        >
          {{ arc.percent }}%
        </text>
      </g>

      <!-- Detail tooltip area (bottom) -->
      <g v-if="hoveredDetail" transform="translate(100, 390)">
        <rect x="0" y="0" width="500" height="36" rx="8" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" stroke-width="0.5" />
        <circle cx="18" cy="18" r="5" :fill="hoveredDetail.color" opacity="0.6" />
        <text x="32" y="22" fill="rgba(255,255,255,0.6)" font-family="Inter, sans-serif" font-size="10">
          {{ hoveredDetail.detail }}
        </text>
      </g>
      <g v-else transform="translate(175, 390)">
        <text x="0" y="20" fill="rgba(255,255,255,0.25)" font-family="Inter, sans-serif" font-size="9" font-style="italic">
          Hover a segment for details
        </text>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.carbon-breakdown {
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  font-family: 'Inter', sans-serif;
}

.cfb-segment {
  cursor: pointer;
  transition: fill-opacity 0.2s ease, stroke-width 0.2s ease, stroke-opacity 0.2s ease;
}

.cfb-label {
  transition: fill 0.2s ease;
}

.carbon-breakdown__caption {
  margin: 0 0 12px 0;
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.35);
  text-align: center;
}

.carbon-breakdown__svg {
  width: 100%;
  height: auto;
  display: block;
}
</style>
