<script setup lang="ts">
/**
 * Interaction Layer — Invisible touch/mouse fallback.
 *
 * For installations without a webcam, or for browser testing,
 * this provides mouse/touch input that maps to the same coordinate
 * system as MediaPipe hand tracking.
 */

import { useMotionTracking } from '~/composables/gallery/useMotionTracking'

const motion = useMotionTracking()

const layerRef = ref<HTMLElement | null>(null)

function onPointerMove(e: PointerEvent) {
  const rect = (e.target as HTMLElement).getBoundingClientRect()
  const x = e.clientX / rect.width
  const y = e.clientY / rect.height
  motion.injectMouseInput({ x, y, z: 0 }, null, 1)
}

function onPointerDown() {
  motion.injectMouseInput(null, 'pinch', 1)
}

function onPointerUp() {
  motion.injectMouseInput(null, 'open', 1)
}

function onPointerLeave() {
  motion.injectMouseInput(null, null, 0)
}
</script>

<template>
  <div
    ref="layerRef"
    class="interaction-layer"
    @pointermove="onPointerMove"
    @pointerdown="onPointerDown"
    @pointerup="onPointerUp"
    @pointerleave="onPointerLeave"
  />
</template>

<style scoped>
.interaction-layer {
  position: absolute;
  inset: 0;
  z-index: 5;
}
</style>
