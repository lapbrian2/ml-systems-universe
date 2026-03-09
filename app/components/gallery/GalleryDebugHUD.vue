<script setup lang="ts">
/**
 * Debug HUD — Museum staff diagnostic overlay.
 * Toggle with Ctrl+Shift+D.
 * Shows FPS, input source, tracking state, GPU status, generation count.
 */

import { useGalleryScene } from '~/composables/gallery/useGalleryScene'
import { useGalleryAnimations } from '~/composables/gallery/useGalleryAnimations'
import { useInputManager } from '~/composables/gallery/useInputManager'
import { useGalleryInference } from '~/composables/gallery/useGalleryInference'
import { useLocalGeneration } from '~/composables/gallery/useLocalGeneration'
import { useInstallationConfig } from '~/composables/gallery/useInstallationConfig'

const scene = useGalleryScene()
const animations = useGalleryAnimations()
const input = useInputManager()
const cloudInference = useGalleryInference()
const localGen = useLocalGeneration()
const { settings, toUrl } = useInstallationConfig()
</script>

<template>
  <div class="debug-hud">
    <div class="debug-header">STAFF DEBUG</div>

    <div class="debug-section">
      <span class="debug-label">FPS</span>
      <span class="debug-value">{{ scene.fps.value }}</span>
    </div>
    <div class="debug-section">
      <span class="debug-label">State</span>
      <span class="debug-value">{{ animations.state.value }}</span>
    </div>

    <div class="debug-divider" />

    <div class="debug-section">
      <span class="debug-label">Input</span>
      <span class="debug-value" :class="input.input.source">{{ input.input.source }}</span>
    </div>
    <div class="debug-section">
      <span class="debug-label">Body</span>
      <span class="debug-value">{{ input.input.bodyPresent ? `YES (${input.input.bodyDistance.toFixed(1)}m)` : 'NO' }}</span>
    </div>
    <div class="debug-section">
      <span class="debug-label">Hand</span>
      <span class="debug-value">{{ input.input.handPosition ? 'TRACKED' : '—' }}</span>
    </div>
    <div class="debug-section">
      <span class="debug-label">Gesture</span>
      <span class="debug-value">{{ input.input.gesture ?? '—' }}</span>
    </div>
    <div class="debug-section">
      <span class="debug-label">Confidence</span>
      <span class="debug-value">{{ (input.input.confidence * 100).toFixed(0) }}%</span>
    </div>

    <div class="debug-divider" />

    <div class="debug-section">
      <span class="debug-label">Backend</span>
      <span class="debug-value">{{ settings.generation.backend }}</span>
    </div>
    <div class="debug-section">
      <span class="debug-label">GPU</span>
      <span class="debug-value" :class="{ active: cloudInference.isGenerating.value }">
        {{ cloudInference.isGenerating.value ? 'BUSY' : 'IDLE' }}
      </span>
    </div>
    <div v-if="settings.generation.backend === 'local'" class="debug-section">
      <span class="debug-label">ComfyUI</span>
      <span class="debug-value" :class="{ connected: localGen.isConnected.value }">
        {{ localGen.isConnected.value ? 'CONNECTED' : 'OFFLINE' }}
      </span>
    </div>
    <div v-if="localGen.isGenerating.value" class="debug-section">
      <span class="debug-label">Progress</span>
      <span class="debug-value">{{ (localGen.progress.value * 100).toFixed(0) }}%</span>
    </div>
    <div class="debug-section">
      <span class="debug-label">Generations</span>
      <span class="debug-value">{{ cloudInference.generationCount.value }}</span>
    </div>

    <div v-if="cloudInference.error.value || localGen.error.value" class="debug-section error">
      <span class="debug-label">Error</span>
      <span class="debug-value">{{ cloudInference.error.value || localGen.error.value }}</span>
    </div>

    <div class="debug-divider" />

    <div class="debug-section">
      <span class="debug-label">Display</span>
      <span class="debug-value">{{ settings.display.mode }}</span>
    </div>

    <div class="debug-shortcuts">
      Ctrl+Shift+D: Debug | F: Fullscreen | R: Restart
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
  gap: 0.2rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6875rem;
  pointer-events: none;
  background: rgba(0, 0, 0, 0.7);
  padding: 0.75rem 1rem;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  max-width: 280px;
}

.debug-header {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.5625rem;
  letter-spacing: 0.15em;
  margin-bottom: 0.25rem;
}

.debug-section {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
}

.debug-label {
  color: rgba(255, 255, 255, 0.3);
}

.debug-value {
  color: rgba(255, 255, 255, 0.7);
  text-align: right;
}

.debug-value.hardware { color: #34d399; }
.debug-value.mediapipe { color: #60a5fa; }
.debug-value.mouse { color: rgba(255, 255, 255, 0.4); }
.debug-value.active { color: #f59e0b; }
.debug-value.connected { color: #34d399; }

.error .debug-value { color: #ef4444; }

.debug-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
  margin: 0.25rem 0;
}

.debug-shortcuts {
  color: rgba(255, 255, 255, 0.2);
  font-size: 0.5rem;
  margin-top: 0.25rem;
}
</style>
