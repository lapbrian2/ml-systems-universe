<script setup lang="ts">
/**
 * Interaction Layer — Invisible touch/mouse fallback.
 *
 * For installations without a webcam, or for browser testing,
 * this provides mouse/touch input that maps to the same coordinate
 * system as MediaPipe hand tracking.
 */

import { useMotionTracking } from '~/composables/gallery/useMotionTracking'
import type { TrackingState } from '~/composables/gallery/useMotionTracking'

const motion = useMotionTracking()

const layerRef = ref<HTMLElement | null>(null)

// Cast to mutable for mouse injection
type MutableTracking = { -readonly [K in keyof TrackingState]: TrackingState[K] }

function getTracking(): MutableTracking {
  return motion.tracking as unknown as MutableTracking
}

function onPointerMove(e: PointerEvent) {
  if (motion.tracking.isActive) return

  const rect = (e.target as HTMLElement).getBoundingClientRect()
  const x = e.clientX / rect.width
  const y = e.clientY / rect.height

  const t = getTracking()
  t.palmCenter = { x, y, z: 0 }
  t.handsDetected = 1
}

function onPointerDown() {
  if (motion.tracking.isActive) return
  getTracking().gesture = 'pinch'
}

function onPointerUp() {
  if (motion.tracking.isActive) return
  getTracking().gesture = 'open'
}

function onPointerLeave() {
  if (motion.tracking.isActive) return
  const t = getTracking()
  t.handsDetected = 0
  t.palmCenter = null
  t.gesture = null
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
