<script setup lang="ts">
/**
 * Prompt overlay — subtle instruction text for museum visitors.
 * Shows contextual guidance based on gallery state and input source.
 */

import { useGalleryAnimations } from '~/composables/gallery/useGalleryAnimations'
import { useInputManager } from '~/composables/gallery/useInputManager'
import { useGalleryInference } from '~/composables/gallery/useGalleryInference'
import { useLocalGeneration } from '~/composables/gallery/useLocalGeneration'
import { useInstallationConfig } from '~/composables/gallery/useInstallationConfig'

const animations = useGalleryAnimations()
const input = useInputManager()
const cloudInference = useGalleryInference()
const localGen = useLocalGeneration()
const { settings } = useInstallationConfig()

const message = computed(() => {
  switch (animations.state.value) {
    case 'loading':
      return ''
    case 'idle':
      if (input.input.source === 'hardware') {
        return input.input.bodyPresent ? 'Raise your hand' : 'Step closer'
      }
      return input.input.handPosition ? 'Pinch to create' : 'Raise your hand to begin'
    case 'tracking':
      return 'Pinch to create'
    case 'generating':
      if (settings.generation.backend === 'local' && localGen.isGenerating.value) {
        return `Creating... ${(localGen.progress.value * 100).toFixed(0)}%`
      }
      return 'Creating...'
    case 'reveal':
      return ''
    case 'cooldown':
      return ''
    default:
      return ''
  }
})

const showStats = computed(() => {
  return animations.state.value === 'reveal' && cloudInference.lastResult.value
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
        Generated in {{ cloudInference.lastResult.value?.elapsed_seconds }}s
        <span v-if="input.input.source !== 'mouse'" class="stats-source">
          via {{ settings.generation.backend === 'local' ? 'local GPU' : 'cloud' }}
        </span>
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

.stats-source {
  color: rgba(255, 255, 255, 0.15);
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
