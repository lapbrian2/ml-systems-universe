<script setup lang="ts">
import { ref, watch, computed, onUnmounted } from 'vue'
import { gsap } from 'gsap'

const props = defineProps<{
  visible: boolean
  x: number
  y: number
  title?: string
  content: string
  color?: string
  containerWidth?: number
  containerHeight?: number
}>()

const tooltipRef = ref<HTMLElement | null>(null)
const smoothX = ref(props.x)
const smoothY = ref(props.y)
const opacity = ref(0)
const scale = ref(0.9)

let lerpRaf: number | null = null
let targetX = props.x
let targetY = props.y

const TOOLTIP_W = 240
const TOOLTIP_H = 120
const OFFSET = 14

const prefersReducedMotion =
  import.meta.client && typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false

/* ── Smooth cursor follow via lerp ── */
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

function lerpTick() {
  const speed = prefersReducedMotion ? 1 : 0.18
  smoothX.value = lerp(smoothX.value, targetX, speed)
  smoothY.value = lerp(smoothY.value, targetY, speed)
  lerpRaf = requestAnimationFrame(lerpTick)
}

function startLerp() {
  if (lerpRaf === null && import.meta.client) {
    lerpRaf = requestAnimationFrame(lerpTick)
  }
}

function stopLerp() {
  if (lerpRaf !== null) {
    cancelAnimationFrame(lerpRaf)
    lerpRaf = null
  }
}

// Only run RAF loop when tooltip is visible
watch(() => props.visible, (vis) => {
  if (vis) {
    smoothX.value = targetX
    smoothY.value = targetY
    startLerp()
  } else {
    stopLerp()
  }
}, { immediate: true })

onUnmounted(() => {
  stopLerp()
})

/* ── Update target position when props change ── */
watch([() => props.x, () => props.y], ([newX, newY]) => {
  targetX = newX
  targetY = newY
})

/* ── Entrance/exit animations ── */
watch(() => props.visible, (vis) => {
  if (!import.meta.client) return

  if (vis) {
    // Snap smooth position to current cursor on show
    smoothX.value = props.x
    smoothY.value = props.y
    targetX = props.x
    targetY = props.y

    if (prefersReducedMotion) {
      opacity.value = 1
      scale.value = 1
    } else {
      gsap.to(opacity, { value: 1, duration: 0.15, ease: 'power2.out' })
      gsap.to(scale, { value: 1, duration: 0.15, ease: 'power2.out' })
    }
  } else {
    if (prefersReducedMotion) {
      opacity.value = 0
      scale.value = 0.9
    } else {
      gsap.to(opacity, { value: 0, duration: 0.1, ease: 'power2.in' })
      gsap.to(scale, { value: 0.9, duration: 0.1, ease: 'power2.in' })
    }
  }
})

/* ── Arrow side computed (no side-effects) ── */
const arrowSide = computed<'top' | 'bottom'>(() => {
  const ch = props.containerHeight || 500
  const ty = smoothY.value + OFFSET
  return (ty + TOOLTIP_H > ch - 10) ? 'bottom' : 'top'
})

/* ── Position with edge-flip logic ── */
const tooltipStyle = computed(() => {
  const cw = props.containerWidth || 800
  const ch = props.containerHeight || 500

  let tx = smoothX.value + OFFSET
  let ty = smoothY.value + OFFSET

  // Flip horizontal if near right edge
  if (tx + TOOLTIP_W > cw - 10) {
    tx = smoothX.value - TOOLTIP_W - OFFSET
  }

  // Flip vertical if near bottom edge
  if (ty + TOOLTIP_H > ch - 10) {
    ty = smoothY.value - TOOLTIP_H - OFFSET
  }

  // Clamp to container
  tx = Math.max(4, Math.min(tx, cw - TOOLTIP_W - 4))
  ty = Math.max(4, Math.min(ty, ch - TOOLTIP_H - 4))

  return {
    transform: `translate(${tx}px, ${ty}px) scale(${scale.value})`,
    opacity: opacity.value,
  }
})

const accentColor = computed(() => props.color || '#14b8a6')

/* ── Simple markdown-like content parsing ── */
function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
const parsedContent = computed(() => {
  return escapeHtml(props.content)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br />')
})
</script>

<template>
  <div
    v-show="visible"
    ref="tooltipRef"
    class="smart-tooltip"
    :style="tooltipStyle"
    role="tooltip"
    aria-live="polite"
  >
    <!-- Arrow -->
    <div
      class="smart-tooltip__arrow"
      :class="`smart-tooltip__arrow--${arrowSide}`"
      :style="{ borderBottomColor: arrowSide === 'top' ? 'rgba(10, 14, 26, 0.95)' : 'transparent', borderTopColor: arrowSide === 'bottom' ? 'rgba(10, 14, 26, 0.95)' : 'transparent' }"
    />

    <!-- Color accent bar -->
    <div class="smart-tooltip__accent" :style="{ background: accentColor }" />

    <!-- Title -->
    <div v-if="title" class="smart-tooltip__title" :style="{ color: accentColor }">
      {{ title }}
    </div>

    <!-- Content (supports bold, code, newlines) -->
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div class="smart-tooltip__content" v-html="parsedContent" />
  </div>
</template>

<style scoped>
.smart-tooltip {
  position: absolute;
  top: 0;
  left: 0;
  width: 240px;
  max-width: 260px;
  background: rgba(10, 14, 26, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 10px 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  pointer-events: none;
  z-index: 100;
  transform-origin: top left;
  will-change: transform, opacity;
}

.smart-tooltip__accent {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  border-radius: 10px 10px 0 0;
  opacity: 0.6;
}

.smart-tooltip__arrow {
  position: absolute;
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
}

.smart-tooltip__arrow--top {
  top: -6px;
  left: 16px;
  border-bottom: 6px solid rgba(10, 14, 26, 0.95);
}

.smart-tooltip__arrow--bottom {
  bottom: -6px;
  left: 16px;
  border-top: 6px solid rgba(10, 14, 26, 0.95);
}

.smart-tooltip__title {
  font-size: 12px;
  font-weight: 700;
  font-family: 'Syne', sans-serif;
  margin-bottom: 4px;
  letter-spacing: -0.01em;
}

.smart-tooltip__content {
  font-size: 11px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.65);
  font-family: 'Inter', sans-serif;
}

.smart-tooltip__content :deep(strong) {
  color: #e2e8f0;
  font-weight: 600;
}

.smart-tooltip__content :deep(code) {
  background: rgba(255, 255, 255, 0.06);
  padding: 1px 4px;
  border-radius: 3px;
  font-size: 10px;
  font-family: 'JetBrains Mono', monospace;
  color: #14b8a6;
}
</style>
