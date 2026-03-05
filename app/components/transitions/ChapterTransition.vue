<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { gsap } from 'gsap'

const { isTransitioning, transitionData, completeTransition } = useChapterTransition()

const overlayRef = ref<HTMLElement | null>(null)
const numberRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const wipeRef = ref<HTMLElement | null>(null)

// Respect prefers-reduced-motion
const prefersReducedMotion = ref(false)

onMounted(() => {
  prefersReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
})

// Active timeline so we can kill it on unmount
let tl: gsap.core.Timeline | null = null

onUnmounted(() => {
  tl?.kill()
})

watch(isTransitioning, async (active) => {
  if (!active) return
  await nextTick()

  if (!overlayRef.value || !transitionData.value) return

  // Kill any existing timeline
  tl?.kill()

  const overlay = overlayRef.value
  const number = numberRef.value
  const title = titleRef.value
  const wipe = wipeRef.value
  const color = transitionData.value.color

  if (prefersReducedMotion.value) {
    // Instant cut: show overlay briefly, then remove
    gsap.set(overlay, { autoAlpha: 1 })
    gsap.set(wipe, { clipPath: 'inset(0 0% 0 0)' })
    if (number) gsap.set(number, { autoAlpha: 0.15 })
    if (title) gsap.set(title, { autoAlpha: 1 })

    // Hold briefly then complete
    setTimeout(() => {
      gsap.set(overlay, { autoAlpha: 0 })
      completeTransition()
    }, 150)
    return
  }

  tl = gsap.timeline({
    onComplete: () => {
      completeTransition()
    },
  })

  // ── Phase 1: Exit (~400ms) ──
  // Overlay fades in + gradient wipe sweeps left to right
  tl.set(overlay, { autoAlpha: 1 })
    .set(wipe, {
      clipPath: 'inset(0 100% 0 0)',
      background: `linear-gradient(135deg, ${color}18, ${color}30, ${color}18)`,
    })
    .set(number, { autoAlpha: 0, scale: 0.9 })
    .set(title, { autoAlpha: 0, y: 12 })
    .to(wipe, {
      clipPath: 'inset(0 0% 0 0)',
      duration: 0.4,
      ease: 'power2.inOut',
    })

  // ── Phase 2: Hold (~300ms) ──
  // Chapter number + title fade in
  tl.to(number, {
      autoAlpha: 0.15,
      scale: 1,
      duration: 0.2,
      ease: 'power2.out',
    }, '-=0.1')
    .to(title, {
      autoAlpha: 1,
      y: 0,
      duration: 0.25,
      ease: 'power2.out',
    }, '-=0.1')
    // Brief pause
    .to({}, { duration: 0.15 })

  // ── Phase 3: Enter (~400ms) ──
  // Overlay dissolves away revealing new content
  tl.to(number, {
      autoAlpha: 0,
      scale: 1.05,
      duration: 0.2,
      ease: 'power1.in',
    })
    .to(title, {
      autoAlpha: 0,
      y: -8,
      duration: 0.2,
      ease: 'power1.in',
    }, '<')
    .to(wipe, {
      clipPath: 'inset(0 0 0 100%)',
      duration: 0.35,
      ease: 'power2.inOut',
    }, '-=0.1')
    .to(overlay, {
      autoAlpha: 0,
      duration: 0.15,
    }, '-=0.1')
})
</script>

<template>
  <Teleport to="body">
    <div
      ref="overlayRef"
      class="fixed inset-0 z-[100] pointer-events-none"
      style="visibility: hidden; opacity: 0;"
      aria-hidden="true"
    >
      <!-- Background -->
      <div class="absolute inset-0 bg-[#05070f]" />

      <!-- Gradient wipe layer -->
      <div
        ref="wipeRef"
        class="absolute inset-0"
        style="clip-path: inset(0 100% 0 0);"
      />

      <!-- Chapter info (centered) -->
      <div class="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <span
          ref="numberRef"
          class="font-mono text-[4.5rem] sm:text-[6rem] font-bold leading-none select-none"
          style="visibility: hidden; opacity: 0;"
          :style="{ color: transitionData?.color ?? '#14b8a6' }"
        >
          {{ transitionData ? String(transitionData.number).padStart(2, '0') : '' }}
        </span>
        <span
          ref="titleRef"
          class="font-display text-lg sm:text-xl font-medium text-white/80 max-w-md text-center px-6 select-none"
          style="visibility: hidden; opacity: 0;"
        >
          {{ transitionData?.title ?? '' }}
        </span>
      </div>
    </div>
  </Teleport>
</template>
