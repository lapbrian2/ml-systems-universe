<script setup lang="ts">
/**
 * Interaction Layer — Invisible touch/mouse fallback.
 *
 * For installations without a webcam, or for browser testing,
 * this provides mouse/touch input that maps to the same coordinate
 * system as MediaPipe hand tracking.
 */

import { useGalleryAnimations } from '~/composables/gallery/useGalleryAnimations'
import { useMotionTracking } from '~/composables/gallery/useMotionTracking'

const animations = useGalleryAnimations()
const motion = useMotionTracking()

const layerRef = ref<HTMLElement | null>(null)

function onPointerMove(e: PointerEvent) {
  // Only use mouse fallback when tracking is not active
  if (motion.tracking.isActive) return

  const rect = (e.target as HTMLElement).getBoundingClientRect()
  const x = e.clientX / rect.width
  const y = e.clientY / rect.height

  // Inject into tracking state as if it were a hand
  ;(motion.tracking as any).palmCenter = { x, y, z: 0 }
  ;(motion.tracking as any).handsDetected = 1
}

function onPointerDown() {
  if (motion.tracking.isActive) return
  ;(motion.tracking as any).gesture = 'pinch'
}

function onPointerUp() {
  if (motion.tracking.isActive) return
  ;(motion.tracking as any).gesture = 'open'
}

function onPointerLeave() {
  if (motion.tracking.isActive) return
  ;(motion.tracking as any).handsDetected = 0
  ;(motion.tracking as any).palmCenter = null
  ;(motion.tracking as any).gesture = null
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
  /* Invisible but captures pointer events */
}
</style>
