<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { Maximize2, Minimize2 } from 'lucide-vue-next'

defineProps<{
  partColor: string
}>()

const isFullscreen = ref(false)

function toggle() {
  isFullscreen.value = !isFullscreen.value
  if (isFullscreen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

function close() {
  isFullscreen.value = false
  document.body.style.overflow = ''
}

onUnmounted(() => {
  if (isFullscreen.value) {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <!-- Toggle button -->
  <button
    class="lg:hidden absolute top-3 right-3 z-20 p-2 rounded-lg transition-colors"
    :style="{
      backgroundColor: `${partColor}15`,
      color: partColor,
    }"
    :aria-label="isFullscreen ? 'Exit fullscreen visualization' : 'Fullscreen visualization'"
    @click="toggle"
  >
    <Maximize2 v-if="!isFullscreen" class="w-3.5 h-3.5" />
    <Minimize2 v-else class="w-3.5 h-3.5" />
  </button>

  <!-- Fullscreen overlay -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isFullscreen"
        class="fixed inset-0 z-[200] bg-cosmic-bg flex flex-col"
        role="dialog"
        aria-label="Fullscreen visualization"
      >
        <!-- Close bar -->
        <div class="flex items-center justify-end px-4 py-3">
          <button
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/40 hover:text-white/60 bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
            @click="close"
          >
            <Minimize2 class="w-3 h-3" />
            Exit Fullscreen
          </button>
        </div>
        <!-- Viz content -->
        <div class="flex-1 min-h-0 p-4">
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
