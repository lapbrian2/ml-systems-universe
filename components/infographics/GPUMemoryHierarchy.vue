<script setup lang="ts">
/**
 * GPUMemoryHierarchy — Interactive textbook infographic
 * Shows the GPU memory hierarchy as a pyramid/funnel diagram.
 * Each layer is a wider trapezoid, color-coded by speed
 * (hot red/orange for fast, cool blue for slow).
 * Hover each layer to see bandwidth and capacity details.
 */
import { ref } from 'vue'

const hoveredLayer = ref<number | null>(null)

interface MemoryLayer {
  id: number
  name: string
  capacity: string
  bandwidth: string
  latency: string
  color: string
  detail: string
}

const layers: MemoryLayer[] = [
  { id: 0, name: 'Registers', capacity: '~20 MB total', bandwidth: '~10 TB/s', latency: '~1 cycle', color: '#ef4444', detail: 'Per-thread, compiler-managed' },
  { id: 1, name: 'L1 / Shared Memory', capacity: '~128–228 KB/SM', bandwidth: '~19 TB/s', latency: '~20 cycles', color: '#f97316', detail: 'Per-SM, software-managed scratchpad' },
  { id: 2, name: 'L2 Cache', capacity: '~40–50 MB', bandwidth: '~4 TB/s', latency: '~200 cycles', color: '#eab308', detail: 'Shared across all SMs' },
  { id: 3, name: 'HBM / Global Memory', capacity: '80 GB (H100)', bandwidth: '~3.35 TB/s', latency: '~400 cycles', color: '#3b82f6', detail: 'Off-chip, highest capacity' },
]
</script>

<template>
  <div class="gpu-memory-hierarchy">
    <p class="gpu-memory-hierarchy__caption">
      Figure: GPU Memory Hierarchy
    </p>

    <svg
      class="gpu-memory-hierarchy__svg"
      viewBox="0 0 700 460"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="GPU memory hierarchy pyramid showing registers at the top (fastest, smallest) down to HBM global memory at the bottom (slowest, largest), with bandwidth and capacity for each level."
    >
      <defs>
        <linearGradient id="gmh-layer-0" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#ef4444" stop-opacity="0.18" />
          <stop offset="100%" stop-color="#ef4444" stop-opacity="0.06" />
        </linearGradient>
        <linearGradient id="gmh-layer-1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#f97316" stop-opacity="0.18" />
          <stop offset="100%" stop-color="#f97316" stop-opacity="0.06" />
        </linearGradient>
        <linearGradient id="gmh-layer-2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#eab308" stop-opacity="0.18" />
          <stop offset="100%" stop-color="#eab308" stop-opacity="0.06" />
        </linearGradient>
        <linearGradient id="gmh-layer-3" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.18" />
          <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.06" />
        </linearGradient>

        <!-- Speed arrow marker -->
        <marker id="gmh-arrow-up" markerWidth="8" markerHeight="6" refX="4" refY="6" orient="auto">
          <polygon points="0 6, 4 0, 8 6" fill="#ef4444" opacity="0.5" />
        </marker>
        <marker id="gmh-arrow-down" markerWidth="8" markerHeight="6" refX="4" refY="0" orient="auto">
          <polygon points="0 0, 4 6, 8 0" fill="#3b82f6" opacity="0.5" />
        </marker>
      </defs>

      <!-- Title area -->
      <text x="350" y="28" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-family="Inter, sans-serif" font-size="11" font-weight="600" letter-spacing="0.06em">
        FASTER &amp; SMALLER
      </text>

      <!-- Speed arrow (left side) -->
      <line x1="42" y1="60" x2="42" y2="380" stroke="rgba(255,255,255,0.08)" stroke-width="1.5" />
      <line x1="42" y1="60" x2="42" y2="55" stroke="#ef4444" stroke-width="1.5" marker-end="url(#gmh-arrow-up)" />
      <text x="40" y="220" text-anchor="middle" fill="rgba(255,255,255,0.2)" font-family="Inter, sans-serif" font-size="9" font-weight="500" transform="rotate(-90, 40, 220)">
        SPEED
      </text>

      <!-- Capacity arrow (right side) -->
      <line x1="658" y1="60" x2="658" y2="380" stroke="rgba(255,255,255,0.08)" stroke-width="1.5" />
      <line x1="658" y1="380" x2="658" y2="385" stroke="#3b82f6" stroke-width="1.5" marker-end="url(#gmh-arrow-down)" />
      <text x="660" y="220" text-anchor="middle" fill="rgba(255,255,255,0.2)" font-family="Inter, sans-serif" font-size="9" font-weight="500" transform="rotate(90, 660, 220)">
        CAPACITY
      </text>

      <!-- Layer 0: Registers (narrowest trapezoid at top) -->
      <g
        class="gmh-layer"
        @mouseenter="hoveredLayer = 0"
        @mouseleave="hoveredLayer = null"
      >
        <polygon
          v-if="hoveredLayer === 0"
          points="260,48 440,48 470,120 230,120"
          :fill="`${layers[0].color}08`"
          class="gmh-glow"
        />
        <polygon
          points="265,52 435,52 462,115 238,115"
          :fill="hoveredLayer === 0 ? `${layers[0].color}18` : 'url(#gmh-layer-0)'"
          class="gmh-shape"
        />
        <polygon
          points="265,52 435,52 462,115 238,115"
          fill="none"
          :stroke="layers[0].color"
          :stroke-width="hoveredLayer === 0 ? 1.5 : 1"
          :stroke-opacity="hoveredLayer === 0 ? 0.6 : 0.3"
          class="gmh-shape"
        />
        <text x="350" y="76" text-anchor="middle" fill="white" font-family="Inter, sans-serif" font-size="13" font-weight="600">
          Registers
        </text>
        <text x="350" y="93" text-anchor="middle" :fill="layers[0].color" font-family="Inter, sans-serif" font-size="10" opacity="0.8">
          ~20 MB | ~10 TB/s
        </text>
        <!-- Hover detail -->
        <text
          v-if="hoveredLayer === 0"
          x="350" y="109"
          text-anchor="middle" fill="rgba(255,255,255,0.5)" font-family="Inter, sans-serif" font-size="9" font-style="italic"
        >
          Per-thread, compiler-managed (~1 cycle latency)
        </text>
      </g>

      <!-- Layer 1: L1 / Shared Memory -->
      <g
        class="gmh-layer"
        @mouseenter="hoveredLayer = 1"
        @mouseleave="hoveredLayer = null"
      >
        <polygon
          v-if="hoveredLayer === 1"
          points="225,118 475,118 520,200 180,200"
          :fill="`${layers[1].color}08`"
          class="gmh-glow"
        />
        <polygon
          points="230,122 470,122 512,195 188,195"
          :fill="hoveredLayer === 1 ? `${layers[1].color}18` : 'url(#gmh-layer-1)'"
          class="gmh-shape"
        />
        <polygon
          points="230,122 470,122 512,195 188,195"
          fill="none"
          :stroke="layers[1].color"
          :stroke-width="hoveredLayer === 1 ? 1.5 : 1"
          :stroke-opacity="hoveredLayer === 1 ? 0.6 : 0.3"
          class="gmh-shape"
        />
        <text x="350" y="150" text-anchor="middle" fill="white" font-family="Inter, sans-serif" font-size="13" font-weight="600">
          L1 / Shared Memory
        </text>
        <text x="350" y="168" text-anchor="middle" :fill="layers[1].color" font-family="Inter, sans-serif" font-size="10" opacity="0.8">
          ~128-228 KB/SM | ~19 TB/s
        </text>
        <text
          v-if="hoveredLayer === 1"
          x="350" y="186"
          text-anchor="middle" fill="rgba(255,255,255,0.5)" font-family="Inter, sans-serif" font-size="9" font-style="italic"
        >
          Per-SM software-managed scratchpad (~20 cycle latency)
        </text>
      </g>

      <!-- Layer 2: L2 Cache -->
      <g
        class="gmh-layer"
        @mouseenter="hoveredLayer = 2"
        @mouseleave="hoveredLayer = null"
      >
        <polygon
          v-if="hoveredLayer === 2"
          points="175,198 525,198 580,282 120,282"
          :fill="`${layers[2].color}08`"
          class="gmh-glow"
        />
        <polygon
          points="180,202 520,202 572,278 128,278"
          :fill="hoveredLayer === 2 ? `${layers[2].color}18` : 'url(#gmh-layer-2)'"
          class="gmh-shape"
        />
        <polygon
          points="180,202 520,202 572,278 128,278"
          fill="none"
          :stroke="layers[2].color"
          :stroke-width="hoveredLayer === 2 ? 1.5 : 1"
          :stroke-opacity="hoveredLayer === 2 ? 0.6 : 0.3"
          class="gmh-shape"
        />
        <text x="350" y="232" text-anchor="middle" fill="white" font-family="Inter, sans-serif" font-size="13" font-weight="600">
          L2 Cache
        </text>
        <text x="350" y="250" text-anchor="middle" :fill="layers[2].color" font-family="Inter, sans-serif" font-size="10" opacity="0.8">
          ~40-50 MB | ~4 TB/s
        </text>
        <text
          v-if="hoveredLayer === 2"
          x="350" y="268"
          text-anchor="middle" fill="rgba(255,255,255,0.5)" font-family="Inter, sans-serif" font-size="9" font-style="italic"
        >
          Shared across all SMs (~200 cycle latency)
        </text>
      </g>

      <!-- Layer 3: HBM / Global Memory (widest at bottom) -->
      <g
        class="gmh-layer"
        @mouseenter="hoveredLayer = 3"
        @mouseleave="hoveredLayer = null"
      >
        <polygon
          v-if="hoveredLayer === 3"
          points="112,280 588,280 632,370 68,370"
          :fill="`${layers[3].color}08`"
          class="gmh-glow"
        />
        <polygon
          points="118,285 582,285 626,365 74,365"
          :fill="hoveredLayer === 3 ? `${layers[3].color}18` : 'url(#gmh-layer-3)'"
          class="gmh-shape"
        />
        <polygon
          points="118,285 582,285 626,365 74,365"
          fill="none"
          :stroke="layers[3].color"
          :stroke-width="hoveredLayer === 3 ? 1.5 : 1"
          :stroke-opacity="hoveredLayer === 3 ? 0.6 : 0.3"
          class="gmh-shape"
        />
        <text x="350" y="316" text-anchor="middle" fill="white" font-family="Inter, sans-serif" font-size="13" font-weight="600">
          HBM / Global Memory
        </text>
        <text x="350" y="334" text-anchor="middle" :fill="layers[3].color" font-family="Inter, sans-serif" font-size="10" opacity="0.8">
          80 GB (H100) | ~3.35 TB/s
        </text>
        <text
          v-if="hoveredLayer === 3"
          x="350" y="354"
          text-anchor="middle" fill="rgba(255,255,255,0.5)" font-family="Inter, sans-serif" font-size="9" font-style="italic"
        >
          Off-chip HBM3, highest capacity (~400 cycle latency)
        </text>
      </g>

      <!-- Bottom label -->
      <text x="350" y="400" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-family="Inter, sans-serif" font-size="11" font-weight="600" letter-spacing="0.06em">
        SLOWER &amp; LARGER
      </text>

      <!-- Legend -->
      <g transform="translate(170, 425)">
        <rect x="0" y="0" width="8" height="8" rx="2" fill="#ef4444" opacity="0.7" />
        <text x="14" y="8" fill="rgba(255,255,255,0.45)" font-family="Inter, sans-serif" font-size="9">Fastest</text>

        <rect x="80" y="0" width="8" height="8" rx="2" fill="#f97316" opacity="0.7" />
        <text x="94" y="8" fill="rgba(255,255,255,0.45)" font-family="Inter, sans-serif" font-size="9">Fast</text>

        <rect x="140" y="0" width="8" height="8" rx="2" fill="#eab308" opacity="0.7" />
        <text x="154" y="8" fill="rgba(255,255,255,0.45)" font-family="Inter, sans-serif" font-size="9">Moderate</text>

        <rect x="230" y="0" width="8" height="8" rx="2" fill="#3b82f6" opacity="0.7" />
        <text x="244" y="8" fill="rgba(255,255,255,0.45)" font-family="Inter, sans-serif" font-size="9">Off-chip</text>
      </g>

      <!-- Hover instruction -->
      <text x="350" y="452" text-anchor="middle" fill="rgba(255,255,255,0.15)" font-family="Inter, sans-serif" font-size="8" font-style="italic">
        Hover each layer for details (NVIDIA H100 reference)
      </text>
    </svg>
  </div>
</template>

<style scoped>
.gpu-memory-hierarchy {
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  font-family: 'Inter', sans-serif;
}

.gmh-layer {
  cursor: pointer;
}

.gmh-shape {
  transition: fill 0.2s ease, stroke 0.2s ease, stroke-width 0.2s ease, stroke-opacity 0.2s ease;
}

.gmh-glow {
  transition: opacity 0.2s ease;
}

.gpu-memory-hierarchy__caption {
  margin: 0 0 12px 0;
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.35);
  text-align: center;
}

.gpu-memory-hierarchy__svg {
  width: 100%;
  height: auto;
  display: block;
}
</style>
