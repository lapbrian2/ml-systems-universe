<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'

const props = defineProps<{
  value: number
  suffix?: string
  prefix?: string
  label: string
  color?: string
}>()

const displayValue = ref(0)
const hasAnimated = ref(false)
const glowing = ref(false)
const statEl = ref<HTMLElement | null>(null)

let observer: IntersectionObserver | null = null
let tween: gsap.core.Tween | null = null

const prefersReducedMotion =
  import.meta.client && typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false

// Determine how many decimals the target value has
const decimals = Number.isInteger(props.value) ? 0 : String(props.value).split('.')[1]?.length ?? 1

function formatValue(v: number): string {
  return v.toFixed(decimals)
}

function animate() {
  if (hasAnimated.value) return
  hasAnimated.value = true

  if (prefersReducedMotion) {
    displayValue.value = props.value
    glowing.value = true
    return
  }

  const obj = { val: 0 }
  tween = gsap.to(obj, {
    val: props.value,
    duration: 1.2,
    ease: 'power2.out',
    onUpdate() {
      displayValue.value = obj.val
    },
    onComplete() {
      displayValue.value = props.value
      glowing.value = true
      tween = null
    },
  })
}

onMounted(() => {
  if (!import.meta.client || !statEl.value) return

  if (prefersReducedMotion) {
    displayValue.value = props.value
    glowing.value = true
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate()
          observer?.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.3 },
  )

  observer.observe(statEl.value)
})

onUnmounted(() => {
  observer?.disconnect()
  observer = null
  if (tween) tween.kill()
})

const accentColor = props.color || 'rgba(20, 184, 166, 1)'
const glowColor = props.color
  ? props.color.replace(/[\d.]+\)$/, '0.25)')
  : 'rgba(20, 184, 166, 0.25)'
</script>

<template>
  <div
    ref="statEl"
    class="animated-stat"
    :style="{
      '--stat-accent': accentColor,
      '--stat-glow': glowColor,
    }"
  >
    <div class="animated-stat__value" :class="{ 'animated-stat__value--glow': glowing }">
      <span v-if="prefix" class="animated-stat__affix">{{ prefix }}</span>
      <span class="animated-stat__number">{{ formatValue(displayValue) }}</span>
      <span v-if="suffix" class="animated-stat__affix">{{ suffix }}</span>
    </div>
    <div class="animated-stat__label">{{ label }}</div>
  </div>
</template>

<style scoped>
.animated-stat {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 16px 24px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(15, 19, 37, 0.6) 0%, rgba(10, 14, 26, 0.4) 100%);
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: border-color 0.4s ease, box-shadow 0.4s ease;
}

.animated-stat__value {
  font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
  font-size: 28px;
  font-weight: 700;
  color: var(--stat-accent, #14b8a6);
  letter-spacing: -0.02em;
  line-height: 1.2;
  transition: text-shadow 0.6s ease;
}

.animated-stat__value--glow {
  text-shadow: 0 0 16px var(--stat-glow, rgba(20, 184, 166, 0.25));
}

.animated-stat__affix {
  font-size: 20px;
  font-weight: 600;
  opacity: 0.85;
}

.animated-stat__number {
  /* inherits from __value */
}

.animated-stat__label {
  font-size: 12px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.45);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  text-align: center;
  max-width: 200px;
}

@media (prefers-reduced-motion: reduce) {
  .animated-stat,
  .animated-stat__value {
    transition-duration: 0.01s !important;
  }
}
</style>
