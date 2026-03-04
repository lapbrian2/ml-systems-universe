<script setup lang="ts">
const nuxtApp = useNuxtApp()
const isLoading = ref(false)

nuxtApp.hook('page:start', () => { isLoading.value = true })
nuxtApp.hook('page:finish', () => { isLoading.value = false })
</script>

<template>
  <div class="grain-overlay">
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

    <NuxtPage />
    <CommandPalette />
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
