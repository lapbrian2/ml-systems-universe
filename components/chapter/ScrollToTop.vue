<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ArrowUp } from 'lucide-vue-next'

defineProps<{
  partColor: string
}>()

const visible = ref(false)
let rafId: number | null = null

function checkScroll() {
  visible.value = window.scrollY > 600
  rafId = null
}

function onScroll() {
  if (rafId === null) {
    rafId = requestAnimationFrame(checkScroll)
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 scale-75 translate-y-4"
    enter-to-class="opacity-100 scale-100 translate-y-0"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-75 translate-y-4"
  >
    <button
      v-if="visible"
      class="fixed bottom-20 xl:bottom-6 right-6 z-50 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg"
      :style="{
        backgroundColor: partColor,
        boxShadow: `0 4px 20px ${partColor}40`,
      }"
      aria-label="Scroll to top"
      @click="scrollToTop"
    >
      <ArrowUp class="w-4 h-4 text-white" />
    </button>
  </Transition>
</template>
