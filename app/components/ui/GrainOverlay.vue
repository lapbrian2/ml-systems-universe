<script setup lang="ts">
/**
 * GrainOverlay - Film grain texture overlay
 *
 * Adds subtle SVG noise texture across the viewport to create
 * an organic, less-digital feel on dark backgrounds.
 * Fixed position, pointer-events disabled, respects reduced motion.
 */
</script>

<template>
  <div class="grain-overlay" aria-hidden="true">
    <svg class="grain-overlay__svg">
      <filter id="grain-filter">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.65"
          numOctaves="3"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect
        width="100%"
        height="100%"
        filter="url(#grain-filter)"
      />
    </svg>
  </div>
</template>

<style scoped>
.grain-overlay {
  position: fixed;
  inset: 0;
  z-index: 30;
  pointer-events: none;
  overflow: hidden;
  opacity: 0.04;
  mix-blend-mode: overlay;
  animation: grain-flicker 8s steps(4) infinite;
}

.grain-overlay__svg {
  width: 100%;
  height: 100%;
}

@keyframes grain-flicker {
  0%, 100% {
    opacity: 0.04;
  }
  25% {
    opacity: 0.035;
  }
  50% {
    opacity: 0.045;
  }
  75% {
    opacity: 0.03;
  }
}

@media (prefers-reduced-motion: reduce) {
  .grain-overlay {
    animation: none;
    opacity: 0.04;
  }
}
</style>
