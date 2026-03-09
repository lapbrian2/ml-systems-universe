<script setup lang="ts">
/**
 * Prompt overlay — subtle instruction text for museum visitors.
 * Shows contextual guidance based on the current gallery state.
 * Fades in/out with state changes.
 */

import { useGalleryAnimations } from '~/composables/gallery/useGalleryAnimations'
import { useMotionTracking } from '~/composables/gallery/useMotionTracking'
import { useGalleryInference } from '~/composables/gallery/useGalleryInference'

const animations = useGalleryAnimations()
const motion = useMotionTracking()
const inference = useGalleryInference()

const message = computed(() => {
  switch (animations.state.value) {
    case 'loading':
      return ''
    case 'idle':
      return motion.tracking.isActive
        ? 'Raise your hand to begin'
        : 'Step closer to interact'
    case 'tracking':
      return 'Pinch to create'
    case 'generating':
      return 'Generating...'
    case 'reveal':
      return ''
    case 'cooldown':
      return ''
    default:
      return ''
  }
})

const showStats = computed(() => {
  return animations.state.value === 'reveal' && inference.lastResult.value
})
</script>

<template>
  <Transition name="fade">
    <div v-if="message" class="prompt-overlay">
      <p class="prompt-text">{{ message }}</p>
    </div>
  </Transition>

  <Transition name="fade">
    <div v-if="showStats" class="stats-overlay">
      <p class="stats-text">
        Generated in {{ inference.lastResult.value?.elapsed_seconds }}s
      </p>
    </div>
  </Transition>
</template>

<style scoped>
.prompt-overlay {
  position: absolute;
  bottom: 8vh;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  z-index: 10;
  pointer-events: none;
}

.prompt-text {
  color: rgba(255, 255, 255, 0.5);
  font-family: 'Inter', sans-serif;
  font-size: 1.125rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.stats-overlay {
  position: absolute;
  bottom: 3vh;
  right: 4vw;
  z-index: 10;
  pointer-events: none;
}

.stats-text {
  color: rgba(255, 255, 255, 0.25);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
