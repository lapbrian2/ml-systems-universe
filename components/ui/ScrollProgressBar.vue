<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const progress = ref(0)
let rafId: number | null = null
let ticking = false

function onScroll() {
  if (ticking) return
  ticking = true
  rafId = requestAnimationFrame(() => {
    const scrollTop = window.scrollY
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    progress.value = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0
    ticking = false
  })
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  if (rafId !== null) cancelAnimationFrame(rafId)
})
</script>

<template>
  <div
    v-show="progress > 0"
    class="scroll-progress-bar"
    role="progressbar"
    :aria-valuenow="Math.round(progress * 100)"
    aria-valuemin="0"
    aria-valuemax="100"
    aria-label="Page scroll progress"
  >
    <div
      class="scroll-progress-bar__fill"
      :style="{ transform: `scaleX(${progress})` }"
    />
  </div>
</template>

<style scoped>
.scroll-progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  z-index: 50;
  pointer-events: none;
  transition: height 0.2s ease;
}

.scroll-progress-bar:hover {
  height: 3px;
  pointer-events: auto;
}

.scroll-progress-bar__fill {
  width: 100%;
  height: 100%;
  transform-origin: left;
  background: linear-gradient(90deg, #14b8a6, #22c55e, #a855f7, #f0a500);
  box-shadow: 0 0 4px rgba(20, 184, 166, 0.3);
  transition: transform 0.15s linear;
}

@media (prefers-reduced-motion: reduce) {
  .scroll-progress-bar__fill {
    background: #14b8a6;
    box-shadow: none;
    transition: none;
  }
}
</style>
