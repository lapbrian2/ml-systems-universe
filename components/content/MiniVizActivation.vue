<script setup lang="ts">
import { ref, computed } from 'vue'

defineProps<{ config: Record<string, unknown> }>()

const xPos = ref(0.5) // 0..1 normalized, maps to -4..4
const dragging = ref(false)

const xValue = computed(() => -4 + xPos.value * 8)

// Activation functions
function relu(x: number) { return Math.max(0, x) }
function sigmoid(x: number) { return 1 / (1 + Math.exp(-x)) }
function tanh_(x: number) { return Math.tanh(x) }

const activeFunc = ref<'relu' | 'sigmoid' | 'tanh'>('relu')

const activations = {
  relu: { fn: relu, label: 'ReLU', color: '#14b8a6', range: [-2, 4] },
  sigmoid: { fn: sigmoid, label: 'Sigmoid', color: '#a855f7', range: [0, 1] },
  tanh: { fn: tanh_, label: 'Tanh', color: '#f59e0b', range: [-1, 1] },
}

const currentActivation = computed(() => activations[activeFunc.value])
const outputValue = computed(() => currentActivation.value.fn(xValue.value))

// Generate SVG path data for a function over -4..4
function generatePath(fn: (x: number) => number): string {
  const points: string[] = []
  const steps = 100
  for (let i = 0; i <= steps; i++) {
    const x = -4 + (i / steps) * 8
    const y = fn(x)
    const svgX = 30 + (i / steps) * 240
    // Map y range to SVG: yMin at bottom (130), yMax at top (10)
    const yMin = activeFunc.value === 'relu' ? -2 : activeFunc.value === 'sigmoid' ? -0.2 : -1.3
    const yMax = activeFunc.value === 'relu' ? 4 : activeFunc.value === 'sigmoid' ? 1.2 : 1.3
    const svgY = 130 - ((y - yMin) / (yMax - yMin)) * 120
    points.push(`${i === 0 ? 'M' : 'L'}${svgX.toFixed(1)},${Math.max(5, Math.min(135, svgY)).toFixed(1)}`)
  }
  return points.join(' ')
}

// Cursor position in SVG coords
const cursorSvgX = computed(() => 30 + xPos.value * 240)
const cursorSvgY = computed(() => {
  const y = outputValue.value
  const yMin = activeFunc.value === 'relu' ? -2 : activeFunc.value === 'sigmoid' ? -0.2 : -1.3
  const yMax = activeFunc.value === 'relu' ? 4 : activeFunc.value === 'sigmoid' ? 1.2 : 1.3
  return Math.max(5, Math.min(135, 130 - ((y - yMin) / (yMax - yMin)) * 120))
})

function handlePointerMove(e: PointerEvent) {
  if (!dragging.value) return
  const svg = (e.currentTarget as SVGElement)
  const rect = svg.getBoundingClientRect()
  const relX = (e.clientX - rect.left - 30) / 240
  xPos.value = Math.max(0, Math.min(1, relX))
}

function handlePointerDown(e: PointerEvent) {
  dragging.value = true
  const svg = (e.currentTarget as SVGElement)
  const rect = svg.getBoundingClientRect()
  const relX = (e.clientX - rect.left - 30) / 240
  xPos.value = Math.max(0, Math.min(1, relX))
  ;(e.currentTarget as SVGElement).setPointerCapture(e.pointerId)
}

function handlePointerUp() {
  dragging.value = false
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-2 border-b border-white/[0.04]">
      <span class="text-[10px] font-semibold uppercase tracking-wider text-white/40">Activation Functions</span>
      <div class="flex gap-1">
        <button
          v-for="key in (['relu', 'sigmoid', 'tanh'] as const)"
          :key="key"
          class="text-[9px] px-2 py-0.5 rounded-full font-medium transition-colors"
          :class="activeFunc === key
            ? 'text-white/90'
            : 'text-white/30 hover:text-white/50'"
          :style="activeFunc === key ? { backgroundColor: activations[key].color + '25', color: activations[key].color } : {}"
          @click="activeFunc = key"
        >
          {{ activations[key].label }}
        </button>
      </div>
    </div>

    <!-- SVG Chart -->
    <svg
      viewBox="0 0 300 150"
      class="w-full cursor-crosshair select-none"
      style="max-height: 150px"
      @pointerdown="handlePointerDown"
      @pointermove="handlePointerMove"
      @pointerup="handlePointerUp"
    >
      <!-- Grid lines -->
      <line x1="30" y1="70" x2="270" y2="70" stroke="rgba(255,255,255,0.06)" stroke-width="0.5" />
      <line x1="150" y1="5" x2="150" y2="135" stroke="rgba(255,255,255,0.06)" stroke-width="0.5" />

      <!-- Axis labels -->
      <text x="150" y="147" fill="rgba(255,255,255,0.2)" text-anchor="middle" font-size="8">x = 0</text>

      <!-- Function curve -->
      <path
        :d="generatePath(currentActivation.fn)"
        fill="none"
        :stroke="currentActivation.color"
        stroke-width="2"
        stroke-linecap="round"
      />

      <!-- Vertical cursor line -->
      <line
        :x1="cursorSvgX" y1="5" :x2="cursorSvgX" y2="135"
        stroke="rgba(255,255,255,0.15)"
        stroke-width="1"
        stroke-dasharray="3,3"
      />

      <!-- Dot on curve -->
      <circle
        :cx="cursorSvgX" :cy="cursorSvgY" r="4"
        :fill="currentActivation.color"
        :stroke="currentActivation.color"
        stroke-width="1"
        opacity="0.9"
      />
      <circle
        :cx="cursorSvgX" :cy="cursorSvgY" r="8"
        :fill="currentActivation.color"
        opacity="0.15"
      />
    </svg>

    <!-- Values -->
    <div class="flex items-center justify-center gap-6 px-4 py-2 border-t border-white/[0.04] bg-white/[0.01]">
      <div class="text-center">
        <span class="text-[9px] text-white/30 block">Input (x)</span>
        <span class="text-xs font-mono font-semibold text-white/70 tabular-nums">{{ xValue.toFixed(2) }}</span>
      </div>
      <div class="text-center">
        <span class="text-[9px] text-white/30 block">{{ currentActivation.label }}(x)</span>
        <span class="text-xs font-mono font-semibold tabular-nums" :style="{ color: currentActivation.color }">
          {{ outputValue.toFixed(4) }}
        </span>
      </div>
    </div>
  </div>
</template>
