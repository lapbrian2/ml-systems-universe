<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  scrollProgress: number
  partColor: string
}>()

// Parallax transforms driven by scroll progress (CSS transforms only, GPU-accelerated)
const bgStyle = computed(() => ({
  transform: `translate3d(0, ${props.scrollProgress * 15}px, 0)`,
  background: `radial-gradient(ellipse 70% 60% at ${40 + props.scrollProgress * 20}% ${30 + props.scrollProgress * 40}%, ${props.partColor}12 0%, transparent 70%)`,
}))

const midStyle = computed(() => ({
  transform: `translate3d(0, ${props.scrollProgress * -8}px, 0)`,
}))

const vignetteStyle = computed(() => ({
  transform: `translate3d(0, ${props.scrollProgress * 5}px, 0)`,
}))
</script>

<template>
  <div class="viz-parallax absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
    <!-- Background layer: radial gradient that shifts with scroll -->
    <div
      class="viz-parallax__bg absolute inset-[-20px] will-change-transform"
      :style="bgStyle"
    />

    <!-- Mid layer: concentric rings for depth -->
    <div
      class="viz-parallax__mid absolute inset-0 will-change-transform"
      :style="midStyle"
    >
      <svg
        class="w-full h-full"
        viewBox="0 0 400 400"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <circle
          cx="200" cy="200" r="60"
          :stroke="partColor"
          stroke-width="0.5"
          opacity="0.05"
        />
        <circle
          cx="200" cy="200" r="110"
          :stroke="partColor"
          stroke-width="0.5"
          opacity="0.04"
        />
        <circle
          cx="200" cy="200" r="170"
          :stroke="partColor"
          stroke-width="0.5"
          opacity="0.03"
        />
        <circle
          cx="200" cy="200" r="240"
          :stroke="partColor"
          stroke-width="0.4"
          opacity="0.03"
        />
      </svg>
    </div>

    <!-- Foreground frame: vignette border that shifts opposite to background -->
    <div
      class="viz-parallax__vignette absolute inset-0 will-change-transform"
      :style="vignetteStyle"
    >
      <div class="absolute inset-0 viz-parallax__vignette-inner" />
    </div>

    <!-- Ambient gradient pulse (CSS animation, no JS loop) -->
    <div
      class="viz-parallax__pulse absolute inset-0"
      :style="{
        background: `radial-gradient(ellipse 50% 50% at 50% 50%, ${partColor}0a 0%, transparent 70%)`,
      }"
    />
  </div>
</template>

<style scoped>
/* Ambient breathing pulse: opacity 0.04 → 0.08 → 0.04 over 8s */
.viz-parallax__pulse {
  animation: viz-parallax-breathe 8s ease-in-out infinite;
}

@keyframes viz-parallax-breathe {
  0%, 100% {
    opacity: 0.4;
  }
  50% {
    opacity: 0.8;
  }
}

/* Vignette: inset shadow to create depth frame */
.viz-parallax__vignette-inner {
  box-shadow: inset 0 0 80px 30px rgba(10, 14, 26, 0.6);
}

/* Respect prefers-reduced-motion: disable all parallax transforms and animation */
@media (prefers-reduced-motion: reduce) {
  .viz-parallax__bg,
  .viz-parallax__mid,
  .viz-parallax__vignette {
    transform: none !important;
  }

  .viz-parallax__pulse {
    animation: none;
    opacity: 0.5;
  }
}
</style>
