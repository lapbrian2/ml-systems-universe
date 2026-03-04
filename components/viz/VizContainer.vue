<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const container = ref<HTMLElement | null>(null)
const width = ref(800)
const height = ref(500)
let observer: ResizeObserver | null = null

onMounted(() => {
  if (!container.value) return
  observer = new ResizeObserver((entries) => {
    const entry = entries[0]
    if (entry) {
      width.value = Math.round(entry.contentRect.width)
      height.value = Math.round(entry.contentRect.height)
    }
  })
  observer.observe(container.value)
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<template>
  <div ref="container" class="w-full h-full flex items-center justify-center overflow-hidden" style="touch-action: manipulation;">
    <slot :width="width" :height="height" />
  </div>
</template>
