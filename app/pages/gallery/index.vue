<script setup lang="ts">
/**
 * Museum Installation — Main Gallery Page
 *
 * Fullscreen WebGL canvas with no browser chrome.
 * Designed for kiosk/museum display — no scroll, no navigation bar.
 * The entire viewport IS the installation.
 *
 * Configuration via URL params for museum staff:
 *   /gallery?input=hardware&backend=local&mode=dual&debug=true&cursor=true
 */

import { useInstallationConfig } from '~/composables/gallery/useInstallationConfig'

definePageMeta({
  layout: false,
})

useHead({
  title: 'Interactive Gallery',
  meta: [
    { name: 'description', content: 'Immersive generative art installation' },
  ],
})

const { settings, loadFromUrl } = useInstallationConfig()

// Load configuration from URL params on mount
const showDebug = ref(false)

function onKeydown(e: KeyboardEvent) {
  // Ctrl+Shift+D → Toggle debug HUD
  if (e.key === 'd' && e.ctrlKey && e.shiftKey) {
    showDebug.value = !showDebug.value
  }
  // Ctrl+Shift+F → Toggle fullscreen
  if (e.key === 'f' && e.ctrlKey && e.shiftKey) {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    }
    else {
      document.documentElement.requestFullscreen()
    }
  }
  // Ctrl+Shift+R → Force reload (museum staff emergency reset)
  if (e.key === 'r' && e.ctrlKey && e.shiftKey) {
    window.location.reload()
  }
  // ESC → Close overlays
  if (e.key === 'Escape') {
    showDebug.value = false
  }
}

// Auto-restart watchdog for long-running installations
let restartTimer: ReturnType<typeof setTimeout> | null = null

onMounted(() => {
  loadFromUrl()

  // Apply kiosk settings
  showDebug.value = settings.kiosk.showDebugHud

  window.addEventListener('keydown', onKeydown)

  // Auto-restart watchdog
  if (settings.kiosk.autoRestartHours > 0) {
    const ms = settings.kiosk.autoRestartHours * 60 * 60 * 1000
    restartTimer = setTimeout(() => {
      console.log('[Gallery] Auto-restart triggered')
      window.location.reload()
    }, ms)
  }

  // Prevent screen sleep on kiosk
  requestWakeLock()
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  if (restartTimer) clearTimeout(restartTimer)
})

// Keep screen awake for museum displays
async function requestWakeLock() {
  try {
    if ('wakeLock' in navigator) {
      await (navigator as unknown as { wakeLock: { request: (type: string) => Promise<unknown> } }).wakeLock.request('screen')
    }
  }
  catch {
    // Wake lock not supported or denied — fine for dev
  }
}
</script>

<template>
  <div
    class="gallery-root"
    :class="{
      'cursor-visible': settings.kiosk.cursorVisible,
    }"
  >
    <!-- WebGL Canvas — the entire experience -->
    <GalleryCanvas />

    <!-- UI Overlays -->
    <GalleryLoadingScreen />
    <GalleryPromptOverlay />
    <GalleryDebugHUD v-if="showDebug" />

    <!-- Invisible interaction layer (mouse/touch fallback) -->
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
  cursor: none;
  user-select: none;
  -webkit-user-select: none;
}

.gallery-root.cursor-visible {
  cursor: default;
}
</style>
