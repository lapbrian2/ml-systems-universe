<script setup lang="ts">
/**
 * Loading screen shown while Three.js initializes and assets load.
 * Fades out once the gallery scene is ready.
 */

import { useGalleryScene } from '~/composables/gallery/useGalleryScene'
import gsap from 'gsap'

const scene = useGalleryScene()
const containerRef = ref<HTMLElement | null>(null)
const visible = ref(true)

watch(
  () => scene.isReady.value,
  (ready) => {
    if (ready && containerRef.value) {
      gsap.to(containerRef.value, {
        opacity: 0,
        duration: 1.5,
        ease: 'power2.in',
        onComplete: () => {
          visible.value = false
        },
      })
    }
  },
)
</script>

<template>
  <div v-if="visible" ref="containerRef" class="loading-screen">
    <div class="loading-content">
      <div class="loading-ring" />
      <p class="loading-text">Preparing your experience</p>
    </div>
  </div>
</template>

<style scoped>
.loading-screen {
  position: absolute;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.loading-ring {
  width: 48px;
  height: 48px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-top-color: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: spin 1.2s linear infinite;
}

.loading-text {
  color: rgba(255, 255, 255, 0.4);
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
