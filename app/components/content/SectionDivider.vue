<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  partColor: string
  progress?: number // 0-1, how far through the chapter
}>()

const normalizedProgress = computed(() =>
  Math.max(0, Math.min(1, props.progress ?? 1))
)

const lineOpacity = computed(() => 0.15 + normalizedProgress.value * 0.85)
const glowOpacity = computed(() => 0.3 + normalizedProgress.value * 0.7)
const glowScale = computed(() => 0.6 + normalizedProgress.value * 0.4)
</script>

<template>
  <div
    class="section-divider"
    role="separator"
    aria-hidden="true"
  >
    <!-- Gradient line -->
    <div class="section-divider__line">
      <div
        class="section-divider__line-fill"
        :style="{
          background: `linear-gradient(90deg, transparent 0%, ${partColor} 50%, transparent 100%)`,
          opacity: lineOpacity,
        }"
      />
      <!-- Animated sweep overlay -->
      <div
        class="section-divider__sweep"
        :style="{
          background: `linear-gradient(90deg, transparent 0%, ${partColor} 40%, transparent 60%, transparent 100%)`,
        }"
      />
    </div>

    <!-- Center diamond -->
    <div
      class="section-divider__diamond"
      :style="{
        backgroundColor: partColor,
        boxShadow: `0 0 8px ${partColor}, 0 0 16px ${partColor}50`,
        opacity: glowOpacity,
        transform: `rotate(45deg) scale(${glowScale})`,
      }"
    />
  </div>
</template>

<style scoped>
.section-divider {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  margin: 1rem 0;
  user-select: none;
}

.section-divider__line {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.section-divider__line-fill {
  width: 100%;
  height: 1px;
  transition: opacity 0.6s ease;
}

.section-divider__sweep {
  position: absolute;
  top: 50%;
  left: 0;
  width: 40%;
  height: 1px;
  transform: translateY(-50%);
  opacity: 0.4;
  animation: sweep 6s ease-in-out infinite;
}

.section-divider__diamond {
  position: relative;
  z-index: 1;
  width: 6px;
  height: 6px;
  border-radius: 1px;
  transition: opacity 0.6s ease, transform 0.6s ease;
}

@keyframes sweep {
  0% {
    left: -40%;
    opacity: 0;
  }
  10% {
    opacity: 0.4;
  }
  90% {
    opacity: 0.4;
  }
  100% {
    left: 100%;
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .section-divider__sweep {
    animation: none;
    display: none;
  }

  .section-divider__diamond {
    transition: none;
  }
}
</style>
