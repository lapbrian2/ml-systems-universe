<script setup lang="ts">
import { ref, computed } from 'vue'

defineProps<{ config: Record<string, unknown> }>()

const threshold = ref(0.5) // 0..1 normalized position
const dragging = ref(false)

// Generate a normal distribution with some noise
const bins = 40
const data = computed(() => {
  const values: number[] = []
  const mean = 0.5
  const std = 0.15
  for (let i = 0; i < bins; i++) {
    const x = i / bins
    const z = (x - mean) / std
    const density = Math.exp(-0.5 * z * z) / (std * Math.sqrt(2 * Math.PI))
    values.push(density)
  }
  return values
})

const maxVal = computed(() => Math.max(...data.value))

// Percentage above threshold
const percentAbove = computed(() => {
  const threshIdx = Math.floor(threshold.value * bins)
  const total = data.value.reduce((s, v) => s + v, 0)
  const above = data.value.slice(threshIdx).reduce((s, v) => s + v, 0)
  return total > 0 ? Math.round((above / total) * 100) : 0
})

function handlePointerMove(e: PointerEvent) {
  if (!dragging.value) return
  const svg = e.currentTarget as SVGElement
  const rect = svg.getBoundingClientRect()
  const relX = (e.clientX - rect.left - 25) / 250
  threshold.value = Math.max(0, Math.min(1, relX))
}

function handlePointerDown(e: PointerEvent) {
  dragging.value = true
  const svg = e.currentTarget as SVGElement
  const rect = svg.getBoundingClientRect()
  const relX = (e.clientX - rect.left - 25) / 250
  threshold.value = Math.max(0, Math.min(1, relX))
  svg.setPointerCapture(e.pointerId)
}

function handlePointerUp() {
  dragging.value = false
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-2 border-b border-white/[0.04]">
      <span class="text-[10px] font-semibold uppercase tracking-wider text-white/40">Distribution</span>
      <span class="text-[9px] text-white/30">Drag threshold line</span>
    </div>

    <!-- SVG Histogram -->
    <svg
      viewBox="0 0 300 120"
      class="w-full cursor-crosshair select-none"
      style="max-height: 120px"
      @pointerdown="handlePointerDown"
      @pointermove="handlePointerMove"
      @pointerup="handlePointerUp"
    >
      <!-- Histogram bars -->
      <rect
        v-for="(val, i) in data"
        :key="i"
        :x="25 + (i / bins) * 250"
        :y="100 - (val / maxVal) * 85"
        :width="250 / bins - 1"
        :height="(val / maxVal) * 85"
        :fill="(i / bins) >= threshold ? '#a855f7' : '#14b8a6'"
        :opacity="0.6"
        rx="1"
      />

      <!-- Threshold line -->
      <line
        :x1="25 + threshold * 250" y1="5"
        :x2="25 + threshold * 250" y2="105"
        stroke="#f59e0b"
        stroke-width="1.5"
        stroke-dasharray="4,3"
      />

      <!-- Threshold handle -->
      <circle
        :cx="25 + threshold * 250"
        cy="10"
        r="5"
        fill="#f59e0b"
        stroke="rgba(0,0,0,0.3)"
        stroke-width="1"
        class="cursor-grab"
      />

      <!-- X axis -->
      <line x1="25" y1="100" x2="275" y2="100" stroke="rgba(255,255,255,0.08)" stroke-width="0.5" />
    </svg>

    <!-- Values -->
    <div class="flex items-center justify-center gap-6 px-4 py-2 border-t border-white/[0.04] bg-white/[0.01]">
      <div class="text-center">
        <span class="text-[9px] text-white/30 block">Below</span>
        <span class="text-xs font-mono font-semibold text-teal-400 tabular-nums">{{ 100 - percentAbove }}%</span>
      </div>
      <div class="text-center">
        <span class="text-[9px] text-white/30 block">Threshold</span>
        <span class="text-xs font-mono font-semibold text-amber-400 tabular-nums">{{ (threshold * 100).toFixed(0) }}%</span>
      </div>
      <div class="text-center">
        <span class="text-[9px] text-white/30 block">Above</span>
        <span class="text-xs font-mono font-semibold text-purple-400 tabular-nums">{{ percentAbove }}%</span>
      </div>
    </div>
  </div>
</template>
