<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    partColor: string
    count?: number
  }>(),
  { count: 18 },
)

// Deterministic pseudo-random from index (no Math.random for SSR consistency)
function seeded(index: number, offset: number = 0): number {
  const x = Math.sin((index + 1) * 9301 + offset * 4973) * 49297
  return x - Math.floor(x)
}

interface Particle {
  id: number
  left: string
  top: string
  size: number
  opacity: number
  duration: string
  delay: string
  floatY: number
  swayX: number
  useWhite: boolean
}

const particles = computed<Particle[]>(() => {
  const items: Particle[] = []
  for (let i = 0; i < props.count; i++) {
    items.push({
      id: i,
      left: `${seeded(i, 0) * 100}%`,
      top: `${seeded(i, 1) * 100}%`,
      size: 2 + seeded(i, 2) * 4, // 2px to 6px
      opacity: 0.1 + seeded(i, 3) * 0.2, // 0.1 to 0.3
      duration: `${8 + seeded(i, 4) * 7}s`, // 8s to 15s
      delay: `${seeded(i, 5) * -15}s`, // stagger via negative delay
      floatY: 10 + seeded(i, 6) * 10, // +-10px to +-20px
      swayX: 4 + seeded(i, 7) * 6, // +-4px to +-10px
      useWhite: seeded(i, 8) > 0.6, // ~40% white, ~60% partColor
    })
  }
  return items
})
</script>

<template>
  <div class="ambient-particles" aria-hidden="true">
    <div
      v-for="p in particles"
      :key="p.id"
      class="ambient-particle"
      :style="{
        left: p.left,
        top: p.top,
        width: `${p.size}px`,
        height: `${p.size}px`,
        opacity: p.opacity,
        backgroundColor: p.useWhite ? 'rgba(255,255,255,0.8)' : partColor,
        boxShadow: `0 0 ${p.size * 2}px ${p.useWhite ? 'rgba(255,255,255,0.3)' : partColor}`,
        '--float-y': `${p.floatY}px`,
        '--sway-x': `${p.swayX}px`,
        '--base-opacity': p.opacity,
        animationDuration: p.duration,
        animationDelay: p.delay,
      } as any"
    />
  </div>
</template>

<style scoped>
.ambient-particles {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.ambient-particle {
  position: absolute;
  border-radius: 50%;
  will-change: transform, opacity;
  animation: ambient-drift linear infinite;
}

@keyframes ambient-drift {
  0% {
    transform: translateY(0) translateX(0);
    opacity: var(--base-opacity);
  }
  25% {
    transform: translateY(calc(var(--float-y) * -1)) translateX(var(--sway-x));
    opacity: calc(var(--base-opacity) * 0.6);
  }
  50% {
    transform: translateY(0) translateX(0);
    opacity: var(--base-opacity);
  }
  75% {
    transform: translateY(var(--float-y)) translateX(calc(var(--sway-x) * -1));
    opacity: calc(var(--base-opacity) * 0.5);
  }
  100% {
    transform: translateY(0) translateX(0);
    opacity: var(--base-opacity);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ambient-particle {
    animation: none;
  }
}
</style>
