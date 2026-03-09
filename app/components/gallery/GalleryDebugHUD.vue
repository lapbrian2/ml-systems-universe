<script setup lang="ts">
/**
 * Debug HUD — Museum staff diagnostic overlay.
 * Toggle with Ctrl+Shift+D.
 * Shows FPS, tracking state, GPU status, generation count.
 */

import { useGalleryScene } from '~/composables/gallery/useGalleryScene'
import { useGalleryAnimations } from '~/composables/gallery/useGalleryAnimations'
import { useMotionTracking } from '~/composables/gallery/useMotionTracking'
import { useGalleryInference } from '~/composables/gallery/useGalleryInference'

const scene = useGalleryScene()
const animations = useGalleryAnimations()
const motion = useMotionTracking()
const inference = useGalleryInference()
</script>

<template>
  <div class="debug-hud">
    <div class="debug-section">
      <span class="debug-label">FPS</span>
      <span class="debug-value">{{ scene.fps.value }}</span>
    </div>
    <div class="debug-section">
      <span class="debug-label">State</span>
      <span class="debug-value">{{ animations.state.value }}</span>
    </div>
    <div class="debug-section">
      <span class="debug-label">Tracking</span>
      <span class="debug-value">{{ motion.tracking.isActive ? 'ON' : 'OFF' }}</span>
    </div>
    <div class="debug-section">
      <span class="debug-label">Hands</span>
      <span class="debug-value">{{ motion.tracking.handsDetected }}</span>
    </div>
    <div class="debug-section">
      <span class="debug-label">Gesture</span>
      <span class="debug-value">{{ motion.tracking.gesture ?? '—' }}</span>
    </div>
    <div class="debug-section">
      <span class="debug-label">GPU</span>
      <span class="debug-value" :class="{ active: inference.isGenerating.value }">
        {{ inference.isGenerating.value ? 'BUSY' : 'IDLE' }}
      </span>
    </div>
    <div class="debug-section">
      <span class="debug-label">Generations</span>
      <span class="debug-value">{{ inference.generationCount.value }}</span>
    </div>
    <div v-if="inference.error.value" class="debug-section error">
      <span class="debug-label">Error</span>
      <span class="debug-value">{{ inference.error.value }}</span>
    </div>
  </div>
</template>

<style scoped>
.debug-hud {
  position: absolute;
  top: 2vh;
  left: 2vw;
  z-index: 200;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6875rem;
  pointer-events: none;
}

.debug-section {
  display: flex;
  gap: 0.75rem;
}

.debug-label {
  color: rgba(255, 255, 255, 0.3);
  min-width: 5rem;
}

.debug-value {
  color: rgba(255, 255, 255, 0.6);
}

.debug-value.active {
  color: #f59e0b;
}

.error .debug-value {
  color: #ef4444;
}
</style>
