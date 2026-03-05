<script setup lang="ts">
import { ref, computed } from 'vue'

defineProps<{ config: Record<string, unknown> }>()

const gradientId = `grad-flow-${Math.random().toString(36).slice(2, 8)}`
const depth = ref(5) // 1..10 layers deep
const mode = ref<'vanishing' | 'healthy' | 'exploding'>('vanishing')

const layers = 5

const gradientMagnitudes = computed(() => {
  const mags: number[] = []
  for (let i = 0; i < layers; i++) {
    const layerFromOutput = i // 0 = output layer, 4 = input layer
    let mag: number
    if (mode.value === 'vanishing') {
      // Gradients decay with factor 0.3^depth per layer
      mag = Math.pow(0.25, layerFromOutput * (depth.value / 5))
    } else if (mode.value === 'exploding') {
      // Gradients grow with factor 1.5^depth
      mag = Math.min(1, Math.pow(1.5, layerFromOutput * (depth.value / 5)) / Math.pow(1.5, layers))
    } else {
      // Healthy: gradients stay roughly equal
      mag = 0.7 + Math.sin(layerFromOutput * 0.5) * 0.15
    }
    mags.push(Math.max(0.02, Math.min(1, mag)))
  }
  return mags.reverse() // Display from input to output
})

function getBarColor(magnitude: number): string {
  if (magnitude > 0.7) return '#22c55e'
  if (magnitude > 0.3) return '#f59e0b'
  return '#ef4444'
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-2 border-b border-white/[0.04]">
      <span class="text-[10px] font-semibold uppercase tracking-wider text-white/40">Gradient Flow</span>
      <div class="flex gap-1">
        <button
          v-for="m in (['vanishing', 'healthy', 'exploding'] as const)"
          :key="m"
          class="text-[9px] px-2 py-0.5 rounded-full font-medium transition-colors capitalize"
          :class="mode === m ? 'bg-white/[0.08] text-white/80' : 'text-white/30 hover:text-white/50'"
          @click="mode = m"
        >
          {{ m }}
        </button>
      </div>
    </div>

    <!-- Bars -->
    <div class="px-4 py-3">
      <div class="flex items-end gap-2 h-16">
        <div
          v-for="(mag, idx) in gradientMagnitudes"
          :key="idx"
          class="flex-1 flex flex-col items-center gap-1"
        >
          <div
            class="w-full rounded-t transition-all duration-300"
            :style="{
              height: `${mag * 100}%`,
              backgroundColor: getBarColor(mag),
              opacity: 0.7 + mag * 0.3,
              minHeight: '2px',
            }"
          />
          <span class="text-[8px] text-white/25 font-mono">L{{ idx + 1 }}</span>
        </div>
      </div>

      <!-- Depth slider -->
      <div class="flex items-center gap-3 mt-3">
        <span class="text-[9px] text-white/30 w-12 shrink-0">Depth</span>
        <input
          v-model.number="depth"
          type="range"
          min="1"
          max="10"
          step="1"
          class="interactive-slider flex-1 h-1 appearance-none rounded-full bg-white/[0.08] cursor-pointer"
        >
        <span class="text-[10px] font-mono text-white/50 w-6 text-right tabular-nums">{{ depth }}</span>
      </div>
    </div>

    <!-- Legend -->
    <div class="flex items-center justify-center gap-4 px-4 py-2 border-t border-white/[0.04] bg-white/[0.01]">
      <span class="text-[8px] text-white/30">Input</span>
      <svg width="60" height="6">
        <defs>
          <linearGradient :id="gradientId" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stop-color="rgba(255,255,255,0.1)" />
            <stop offset="100%" stop-color="rgba(255,255,255,0.4)" />
          </linearGradient>
        </defs>
        <rect width="60" height="2" y="2" rx="1" :fill="`url(#${gradientId})`" />
        <polygon points="55,0 60,3 55,6" fill="rgba(255,255,255,0.4)" />
      </svg>
      <span class="text-[8px] text-white/30">Output</span>
    </div>
  </div>
</template>

<style scoped>
.interactive-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--color-primary, #14b8a6);
  cursor: pointer;
}
.interactive-slider::-moz-range-thumb {
  width: 12px;
  height: 12px;
  border: none;
  border-radius: 50%;
  background: var(--color-primary, #14b8a6);
  cursor: pointer;
}
</style>
