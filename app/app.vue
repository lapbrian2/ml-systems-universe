<script setup lang="ts">
const nuxtApp = useNuxtApp()
const isLoading = ref(false)
const route = useRoute()
const { isTransitioning, completeTransition } = useChapterTransition()

// Track whether we're in a chapter-to-chapter navigation
const wasChapterRoute = ref(false)

nuxtApp.hook('page:start', () => {
  isLoading.value = true
  // Record that we started from a chapter page
  wasChapterRoute.value = route.path.startsWith('/chapter/')
})

nuxtApp.hook('page:finish', () => {
  isLoading.value = false
  // If the cinematic transition was triggered, complete it now that
  // the new page content has mounted
  if (isTransitioning.value) {
    // Small delay so the new page DOM is ready before we reveal it
    setTimeout(() => completeTransition(), 50)
  }
})
</script>

<template>
  <div class="grain-overlay">
    <!-- Skip to content (accessibility) -->
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[999] focus:px-4 focus:py-2 focus:bg-teal-500 focus:text-white focus:rounded-lg"
    >
      Skip to content
    </a>

    <!-- Page loading indicator -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-active-class="transition-opacity duration-300"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isLoading"
        class="fixed top-0 left-0 right-0 z-[200] h-0.5 overflow-hidden"
        style="background: rgba(20, 184, 166, 0.1);"
      >
        <div class="h-full animate-loading-bar" style="background: linear-gradient(90deg, #14b8a6, #22c55e, #a855f7, #14b8a6);" />
      </div>
    </Transition>

    <ClientOnly>
      <ScrollProgressBar />
    </ClientOnly>
    <NuxtPage />
    <ClientOnly>
      <ChapterTransition />
    </ClientOnly>
    <CommandPalette />
    <ClientOnly>
      <AmbientAudioToggle />
    </ClientOnly>
    <ClientOnly>
      <GrainOverlay />
    </ClientOnly>
  </div>
</template>

<style>
@keyframes loading-bar {
  0% { transform: translateX(-100%); width: 40%; }
  50% { transform: translateX(60%); width: 60%; }
  100% { transform: translateX(200%); width: 30%; }
}
.animate-loading-bar {
  animation: loading-bar 1.2s ease-in-out infinite;
}
</style>
