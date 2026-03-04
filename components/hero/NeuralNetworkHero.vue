<script setup lang="ts">
/**
 * NeuralNetworkHero.vue
 *
 * A 3D particle neural-network animation rendered with TresJS.
 * Displayed as a subtle background behind the homepage hero text.
 *
 * Architecture:
 *   NeuralNetworkHero (outer) -- owns the <TresCanvas>, sizes it, handles mouse.
 *   NeuralNetworkScene (inner) -- rendered inside <TresCanvas> so it can call useLoop().
 *     All Three.js objects are created imperatively and added to the scene via template refs.
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'
import NeuralNetworkScene from './NeuralNetworkScene.vue'

// ── Mouse state (passed to scene for parallax) ──
const mouseX = ref(0)
const mouseY = ref(0)

function onMouseMove(e: MouseEvent) {
  mouseX.value = (e.clientX / window.innerWidth - 0.5) * 2
  mouseY.value = (e.clientY / window.innerHeight - 0.5) * 2
}

onMounted(() => {
  window.addEventListener('mousemove', onMouseMove, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onMouseMove)
})
</script>

<template>
  <div class="neural-network-hero">
    <TresCanvas
      :alpha="true"
      :antialias="true"
      power-preference="high-performance"
      clear-color="#00000000"
      window-size
    >
      <NeuralNetworkScene :mouse-x="mouseX" :mouse-y="mouseY" />
    </TresCanvas>
  </div>
</template>

<style scoped>
.neural-network-hero {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.neural-network-hero :deep(canvas) {
  width: 100% !important;
  height: 100% !important;
}
</style>
