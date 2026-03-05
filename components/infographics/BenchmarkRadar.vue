<script setup lang="ts">
/**
 * BenchmarkRadar -- Interactive textbook infographic (Ch. 12)
 * Radar/spider chart comparing ML benchmark dimensions:
 *   Throughput, Latency, Accuracy, Power Efficiency, Memory, Cost
 * Shows 3 overlapping polygons for GPU, TPU, Edge hardware targets.
 * Hover a vertex to show the metric value.
 * Legend at bottom with hardware labels.
 */
import { ref, computed } from 'vue'

const hoveredVertex = ref<string | null>(null)
const hoveredHardware = ref<string | null>(null)

interface Metric {
  id: string
  name: string
  unit: string
}

const metrics: Metric[] = [
  { id: 'throughput', name: 'Throughput', unit: 'tokens/sec' },
  { id: 'latency', name: 'Latency', unit: 'ms (lower=better)' },
  { id: 'accuracy', name: 'Accuracy', unit: '% top-1' },
  { id: 'power', name: 'Power Efficiency', unit: 'perf/watt' },
  { id: 'memory', name: 'Memory', unit: 'GB available' },
  { id: 'cost', name: 'Cost', unit: '$/hr (lower=better)' },
]

interface HardwareProfile {
  id: string
  name: string
  color: string
  values: number[]  // 0-1 normalized
  rawValues: string[]
}

const hardware: HardwareProfile[] = [
  {
    id: 'gpu',
    name: 'GPU (A100)',
    color: '#14b8a6',
    values: [0.85, 0.70, 0.92, 0.65, 0.90, 0.50],
    rawValues: ['312K tok/s', '12ms', '92.1%', '145 perf/W', '80 GB', '$3.10/hr'],
  },
  {
    id: 'tpu',
    name: 'TPU (v5e)',
    color: '#a855f7',
    values: [0.95, 0.80, 0.90, 0.85, 0.75, 0.65],
    rawValues: ['420K tok/s', '8ms', '91.8%', '210 perf/W', '64 GB', '$2.40/hr'],
  },
  {
    id: 'edge',
    name: 'Edge (Jetson)',
    color: '#f0a500',
    values: [0.30, 0.50, 0.78, 0.90, 0.20, 0.95],
    rawValues: ['8K tok/s', '45ms', '78.5%', '280 perf/W', '8 GB', '$0.15/hr'],
  },
]

const cx = 400
const cy = 230
const maxRadius = 160
const numAxes = metrics.length

function axisAngle(index: number): number {
  return (2 * Math.PI * index) / numAxes - Math.PI / 2
}

function axisX(index: number, r: number = maxRadius): number {
  return cx + r * Math.cos(axisAngle(index))
}

function axisY(index: number, r: number = maxRadius): number {
  return cy + r * Math.sin(axisAngle(index))
}

function polygonPoints(values: number[]): string {
  return values
    .map((v, i) => {
      const r = v * maxRadius
      return `${axisX(i, r)},${axisY(i, r)}`
    })
    .join(' ')
}

const gridLevels = [0.25, 0.5, 0.75, 1.0]
</script>

<template>
  <div class="benchmark-radar">
    <p class="benchmark-radar__caption">
      Figure: ML Hardware Benchmark Comparison
    </p>

    <svg
      class="benchmark-radar__svg"
      viewBox="0 0 800 500"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Radar chart comparing GPU, TPU, and Edge hardware across six benchmark dimensions: Throughput, Latency, Accuracy, Power Efficiency, Memory, and Cost."
    >
      <defs>
        <linearGradient id="br-teal-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#14b8a6" stop-opacity="0.15" />
          <stop offset="100%" stop-color="#14b8a6" stop-opacity="0.05" />
        </linearGradient>
        <linearGradient id="br-purple-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#a855f7" stop-opacity="0.15" />
          <stop offset="100%" stop-color="#a855f7" stop-opacity="0.05" />
        </linearGradient>
        <linearGradient id="br-amber-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#f0a500" stop-opacity="0.15" />
          <stop offset="100%" stop-color="#f0a500" stop-opacity="0.05" />
        </linearGradient>
      </defs>

      <!-- Grid rings -->
      <polygon
        v-for="level in gridLevels"
        :key="'grid-' + level"
        :points="metrics.map((_, i) => `${axisX(i, maxRadius * level)},${axisY(i, maxRadius * level)}`).join(' ')"
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        stroke-width="0.8"
      />

      <!-- Grid level labels -->
      <text
        v-for="level in gridLevels"
        :key="'label-' + level"
        :x="cx + 4"
        :y="cy - maxRadius * level + 12"
        fill="rgba(255,255,255,0.15)"
        font-family="Inter, sans-serif"
        font-size="7"
      >
        {{ Math.round(level * 100) }}%
      </text>

      <!-- Axis lines -->
      <line
        v-for="(metric, i) in metrics"
        :key="'axis-' + i"
        :x1="cx" :y1="cy"
        :x2="axisX(i)" :y2="axisY(i)"
        stroke="rgba(255,255,255,0.06)"
        stroke-width="0.8"
      />

      <!-- Axis labels -->
      <text
        v-for="(metric, i) in metrics"
        :key="'metric-label-' + i"
        :x="axisX(i, maxRadius + 30)"
        :y="axisY(i, maxRadius + 30) + 4"
        text-anchor="middle"
        :fill="hoveredVertex === metric.id ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.45)'"
        font-family="Inter, sans-serif"
        font-size="10"
        font-weight="600"
        class="br-label"
      >
        {{ metric.name }}
      </text>

      <!-- Hardware polygons -->
      <g v-for="hw in hardware" :key="hw.id">
        <polygon
          :points="polygonPoints(hw.values)"
          :fill="hoveredHardware === hw.id ? `${hw.color}20` : `${hw.color}10`"
          :stroke="hw.color"
          :stroke-width="hoveredHardware === hw.id ? 2 : 1.2"
          :stroke-opacity="hoveredHardware === hw.id ? 0.8 : 0.4"
          class="br-polygon"
        />
      </g>

      <!-- Vertex dots and hover zones -->
      <g
        v-for="(metric, i) in metrics"
        :key="'vertex-group-' + i"
        class="br-vertex"
        @mouseenter="hoveredVertex = metric.id"
        @mouseleave="hoveredVertex = null"
      >
        <!-- Invisible larger hit area -->
        <circle :cx="axisX(i)" :cy="axisY(i)" r="20" fill="transparent" />

        <!-- Dots for each hardware at this axis -->
        <circle
          v-for="hw in hardware"
          :key="hw.id + '-' + metric.id"
          :cx="axisX(i, hw.values[i] * maxRadius)"
          :cy="axisY(i, hw.values[i] * maxRadius)"
          :r="hoveredVertex === metric.id ? 4 : 2.5"
          :fill="hw.color"
          :opacity="hoveredVertex === metric.id ? 0.9 : 0.6"
          class="br-dot"
        />

        <!-- Hover tooltip -->
        <g v-if="hoveredVertex === metric.id">
          <!-- Tooltip background -->
          <rect
            :x="axisX(i, maxRadius + 50) - 65"
            :y="axisY(i, maxRadius + 50) - 4"
            width="130" height="62" rx="8"
            fill="rgba(5,7,15,0.9)"
            stroke="rgba(255,255,255,0.1)"
            stroke-width="0.8"
          />
          <!-- Metric name -->
          <text
            :x="axisX(i, maxRadius + 50)"
            :y="axisY(i, maxRadius + 50) + 10"
            text-anchor="middle"
            fill="rgba(255,255,255,0.7)" font-family="Inter, sans-serif" font-size="9" font-weight="600"
          >
            {{ metric.name }} ({{ metric.unit }})
          </text>
          <!-- Values per hardware -->
          <text
            v-for="(hw, hi) in hardware"
            :key="hw.id + '-tip'"
            :x="axisX(i, maxRadius + 50)"
            :y="axisY(i, maxRadius + 50) + 26 + hi * 14"
            text-anchor="middle"
            :fill="hw.color" font-family="Inter, sans-serif" font-size="8"
            opacity="0.8"
          >
            {{ hw.name }}: {{ hw.rawValues[i] }}
          </text>
        </g>
      </g>

      <!-- Legend -->
      <g transform="translate(240, 460)">
        <g
          v-for="(hw, idx) in hardware"
          :key="hw.id + '-legend'"
          :transform="`translate(${idx * 120}, 0)`"
          class="br-legend-item"
          @mouseenter="hoveredHardware = hw.id"
          @mouseleave="hoveredHardware = null"
        >
          <rect x="0" y="0" width="10" height="10" rx="2" :fill="hw.color" :opacity="hoveredHardware === hw.id ? 0.9 : 0.6" class="br-dot" />
          <text
            x="16" y="9"
            :fill="hoveredHardware === hw.id ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.45)'"
            font-family="Inter, sans-serif" font-size="10" font-weight="500"
            class="br-label"
          >
            {{ hw.name }}
          </text>
        </g>
      </g>

      <!-- Hover instruction -->
      <text x="400" y="30" text-anchor="middle" fill="rgba(255,255,255,0.15)" font-family="Inter, sans-serif" font-size="8" font-style="italic">
        Hover vertices for metric values, hover legend to highlight hardware
      </text>
    </svg>
  </div>
</template>

<style scoped>
.benchmark-radar {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  font-family: 'Inter', sans-serif;
}

.br-vertex {
  cursor: pointer;
}

.br-legend-item {
  cursor: pointer;
}

.br-polygon {
  transition: fill 0.2s ease, stroke 0.2s ease, stroke-width 0.2s ease, stroke-opacity 0.2s ease;
}

.br-dot {
  transition: r 0.2s ease, opacity 0.2s ease;
}

.br-label {
  transition: fill 0.2s ease;
}

.benchmark-radar__caption {
  margin: 0 0 12px 0;
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.35);
  text-align: center;
}

.benchmark-radar__svg {
  width: 100%;
  height: auto;
  display: block;
}
</style>
