<script setup lang="ts">
/**
 * Museum Installation — Main Gallery Page
 *
 * Fullscreen WebGL canvas with no browser chrome.
 * Designed for kiosk/museum display — no scroll, no navigation bar.
 * The entire viewport IS the installation.
 */

definePageMeta({
  layout: false, // No default layout — fullscreen takeover
})

useHead({
  title: 'Interactive Gallery',
  meta: [
    { name: 'description', content: 'Immersive generative art installation' },
  ],
})

const showDebug = ref(false)

function toggleDebug() {
  showDebug.value = !showDebug.value
}

// Hidden keyboard shortcut for museum staff
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'd' && e.ctrlKey && e.shiftKey) {
    toggleDebug()
  }
  // ESC to exit fullscreen overlay states
  if (e.key === 'Escape') {
    showDebug.value = false
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div class="gallery-root">
    <!-- WebGL Canvas — the entire experience -->
    <GalleryCanvas />

    <!-- UI Overlays (floating on top of the 3D scene) -->
    <GalleryLoadingScreen />
    <GalleryPromptOverlay />
    <GalleryDebugHUD v-if="showDebug" />

    <!-- Invisible interaction layer for touch/gesture input -->
    <GalleryInteractionLayer />
  </div>
</template>

<style scoped>
.gallery-root {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #000;
  cursor: none; /* Museum kiosk — hide cursor */
  user-select: none;
  -webkit-user-select: none;
}
</style>
