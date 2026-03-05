<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { Volume2, VolumeX } from 'lucide-vue-next'
import { useAmbientAudio } from '~/composables/useAmbientAudio'

const { isPlaying, volume, toggle, setVolume, cleanup } = useAmbientAudio()

const route = useRoute()
const isChapterPage = computed(() => route.path.startsWith('/chapter/'))

// Volume popup
const showVolumePopup = ref(false)
let longPressTimer: ReturnType<typeof setTimeout> | null = null
let hideTimer: ReturnType<typeof setTimeout> | null = null

const volumePercent = computed(() => Math.round(volume.value * 100))

function onPointerDown() {
  longPressTimer = setTimeout(() => {
    showVolumePopup.value = true
  }, 500)
}

function onPointerUp() {
  if (longPressTimer) {
    clearTimeout(longPressTimer)
    longPressTimer = null
  }
}

function onContextMenu(e: MouseEvent) {
  e.preventDefault()
  showVolumePopup.value = !showVolumePopup.value
}

function onVolumeInput(e: Event) {
  const target = e.target as HTMLInputElement
  setVolume(Number(target.value) / 100)
}

function scheduleHide() {
  hideTimer = setTimeout(() => {
    showVolumePopup.value = false
  }, 1500)
}

function cancelHide() {
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
}

onUnmounted(() => {
  if (longPressTimer) clearTimeout(longPressTimer)
  if (hideTimer) clearTimeout(hideTimer)
  cleanup()
})
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 scale-75"
    leave-active-class="transition-all duration-200 ease-in"
    leave-to-class="opacity-0 scale-75"
  >
    <div v-if="isChapterPage" class="fixed bottom-32 xl:bottom-28 right-6 z-30">
      <!-- Volume slider popup -->
      <Transition
        enter-active-class="transition-all duration-200 ease-out"
        enter-from-class="opacity-0 translate-y-2 scale-95"
        leave-active-class="transition-all duration-150 ease-in"
        leave-to-class="opacity-0 translate-y-2 scale-95"
      >
        <div
          v-if="showVolumePopup"
          class="absolute bottom-full right-0 mb-2 glass-panel--floating rounded-xl px-4 py-3 min-w-[160px]"
          @mouseenter="cancelHide"
          @mouseleave="scheduleHide"
        >
          <label class="flex items-center justify-between text-[10px] text-white/50 mb-2">
            <span>Volume</span>
            <span class="font-mono tabular-nums">{{ volumePercent }}%</span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            :value="volumePercent"
            class="ambient-volume-slider w-full"
            aria-label="Ambient audio volume"
            @input="onVolumeInput"
          />
        </div>
      </Transition>

      <!-- Toggle button -->
      <button
        class="w-10 h-10 rounded-full glass-panel--floating flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg"
        :class="{ 'ring-1 ring-teal-500/30': isPlaying }"
        :aria-label="isPlaying ? 'Mute ambient audio' : 'Enable ambient audio'"
        :title="'Ambient audio'"
        @click="toggle"
        @pointerdown="onPointerDown"
        @pointerup="onPointerUp"
        @pointerleave="onPointerUp"
        @contextmenu="onContextMenu"
      >
        <Volume2 v-if="isPlaying" class="w-4 h-4 text-teal-400" />
        <VolumeX v-else class="w-4 h-4 text-white/40" />
      </button>
    </div>
  </Transition>
</template>

<style scoped>
.ambient-volume-slider {
  -webkit-appearance: none;
  appearance: none;
  height: 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.08);
  outline: none;
  cursor: pointer;
}

.ambient-volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #14b8a6;
  box-shadow: 0 0 6px rgba(20, 184, 166, 0.4);
  cursor: pointer;
}

.ambient-volume-slider::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #14b8a6;
  box-shadow: 0 0 6px rgba(20, 184, 166, 0.4);
  border: none;
  cursor: pointer;
}

.ambient-volume-slider::-webkit-slider-runnable-track {
  height: 4px;
  border-radius: 2px;
}

.ambient-volume-slider::-moz-range-track {
  height: 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.08);
}
</style>
