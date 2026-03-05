<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  variant?: 'tip' | 'warning' | 'note' | 'info'
  accentColor?: string
}>()

const variantColors: Record<string, string> = {
  tip: '#14b8a6',
  warning: '#f59e0b',
  note: '#a855f7',
  info: '#3b82f6',
}

const color = computed(() =>
  props.accentColor ?? variantColors[props.variant ?? 'info'] ?? variantColors.info
)
</script>

<template>
  <div
    class="glowing-card"
    :style="{
      '--glow-color': color,
      '--glow-color-dim': `${color}15`,
      '--glow-color-mid': `${color}30`,
      '--glow-color-bright': `${color}50`,
    } as any"
  >
    <slot />
  </div>
</template>

<style scoped>
.glowing-card {
  position: relative;
  border-radius: 8px;
  border: 1px solid var(--glow-color-dim);
  background: linear-gradient(
    135deg,
    transparent 0%,
    var(--glow-color-dim) 100%
  );
  background-size: 200% 200%;
  background-position: 0% 0%;
  transition:
    border-color 0.4s ease,
    box-shadow 0.4s ease,
    background-position 0.6s ease;
}

.glowing-card:hover {
  border-color: var(--glow-color-mid);
  box-shadow:
    0 0 20px var(--glow-color-dim),
    0 0 40px var(--glow-color-dim),
    inset 0 0 30px var(--glow-color-dim);
  background-position: 100% 100%;
}

@media (prefers-reduced-motion: reduce) {
  .glowing-card {
    transition: none;
  }
}
</style>
