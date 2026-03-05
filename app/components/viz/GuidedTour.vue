<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { gsap } from 'gsap'
import { X, ChevronRight, ChevronLeft, Sparkles, Eye, SkipForward } from 'lucide-vue-next'

/* ── Types ── */
export interface TourStep {
  title: string
  instruction: string
  target?: string
  check?: () => boolean
  hint?: string
}

/* ── Props & Emits ── */
const props = defineProps<{
  steps: TourStep[]
  chapterId: string
  tourId: string
  color?: string
}>()

const emit = defineEmits<{
  complete: []
}>()

/* ── State ── */
const currentStep = ref(0)
const isActive = ref(false)
const showHint = ref(false)
const tourCompleted = ref(false)
const spotlightRect = ref<{ x: number; y: number; w: number; h: number } | null>(null)
const instructionEl = ref<HTMLElement | null>(null)
const overlayEl = ref<HTMLElement | null>(null)
const arrowEl = ref<HTMLElement | null>(null)

/* ── localStorage key ── */
const storageKey = computed(() => `guided-tour-${props.chapterId}-${props.tourId}`)
const hasCompletedBefore = ref(false)

/* ── Timers ── */
let hintTimer: ReturnType<typeof setTimeout> | null = null
let checkInterval: ReturnType<typeof setInterval> | null = null
let resizeObserver: ResizeObserver | null = null

/* ── Computed ── */
const accentColor = computed(() => props.color ?? '#14b8a6')
const step = computed(() => props.steps[currentStep.value])
const totalSteps = computed(() => props.steps.length)
const isLastStep = computed(() => currentStep.value >= totalSteps.value - 1)
const canAdvance = computed(() => {
  if (!step.value?.check) return true
  return step.value.check()
})
const stepLabel = computed(() => `${currentStep.value + 1}/${totalSteps.value}`)

/* ── Lifecycle ── */
onMounted(() => {
  const stored = localStorage.getItem(storageKey.value)
  if (stored === 'completed') {
    hasCompletedBefore.value = true
    tourCompleted.value = true
  } else {
    // Auto-start on first visit
    startTour()
  }
})

onUnmounted(() => {
  cleanup()
})

/* ── Tour control ── */
function startTour() {
  currentStep.value = 0
  isActive.value = true
  showHint.value = false
  tourCompleted.value = false
  nextTick(() => {
    highlightTarget()
    startHintTimer()
    startCheckWatcher()
    animateEntrance()
  })
}

function cleanup() {
  if (hintTimer) clearTimeout(hintTimer)
  if (checkInterval) clearInterval(checkInterval)
  if (resizeObserver) resizeObserver.disconnect()
  hintTimer = null
  checkInterval = null
  resizeObserver = null
}

function skipTour() {
  cleanup()
  isActive.value = false
  clearSpotlight()
  animateExit()
}

function completeTour() {
  cleanup()
  isActive.value = false
  tourCompleted.value = true
  hasCompletedBefore.value = true
  localStorage.setItem(storageKey.value, 'completed')
  clearSpotlight()
  animateExit()
  emit('complete')
}

function goToStep(index: number) {
  if (index < 0 || index >= totalSteps.value) return
  cleanup()
  showHint.value = false
  currentStep.value = index
  nextTick(() => {
    highlightTarget()
    startHintTimer()
    startCheckWatcher()
    animateStepTransition()
  })
}

function nextStep() {
  if (!canAdvance.value) return
  if (isLastStep.value) {
    completeTour()
  } else {
    goToStep(currentStep.value + 1)
  }
}

function prevStep() {
  if (currentStep.value > 0) {
    goToStep(currentStep.value - 1)
  }
}

/* ── Spotlight / highlight ── */
function highlightTarget() {
  if (!step.value?.target) {
    clearSpotlight()
    return
  }
  const el = document.querySelector(step.value.target) as HTMLElement | null
  if (!el) {
    clearSpotlight()
    return
  }

  updateSpotlightRect(el)

  // Watch for layout changes
  if (resizeObserver) resizeObserver.disconnect()
  resizeObserver = new ResizeObserver(() => updateSpotlightRect(el))
  resizeObserver.observe(el)
}

function updateSpotlightRect(el: HTMLElement) {
  const rect = el.getBoundingClientRect()
  const padding = 6
  spotlightRect.value = {
    x: rect.left - padding,
    y: rect.top - padding,
    w: rect.width + padding * 2,
    h: rect.height + padding * 2,
  }

  // Animate spotlight glow with GSAP
  nextTick(() => {
    const spotlight = document.querySelector('.guided-tour__spotlight') as HTMLElement | null
    if (spotlight) {
      gsap.fromTo(spotlight,
        { boxShadow: `0 0 0 4px ${accentColor.value}40, 0 0 20px ${accentColor.value}20` },
        {
          boxShadow: `0 0 0 4px ${accentColor.value}80, 0 0 30px ${accentColor.value}40`,
          duration: 1.2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        }
      )
    }
  })

  // Position the arrow
  positionArrow(el)
}

function clearSpotlight() {
  spotlightRect.value = null
  if (resizeObserver) resizeObserver.disconnect()
}

function positionArrow(targetEl: HTMLElement) {
  nextTick(() => {
    if (!arrowEl.value || !instructionEl.value) return
    const targetRect = targetEl.getBoundingClientRect()
    const instrRect = instructionEl.value.getBoundingClientRect()

    // Calculate arrow position: from instruction box toward target
    const instrCenterX = instrRect.left + instrRect.width / 2
    const instrTop = instrRect.top
    const targetCenterX = targetRect.left + targetRect.width / 2
    const targetBottom = targetRect.bottom

    // Simple directional arrow using CSS transform
    const dx = targetCenterX - instrCenterX
    const dy = targetBottom - instrTop
    const angle = Math.atan2(-dy, dx) * (180 / Math.PI) + 90

    arrowEl.value.style.left = `${instrCenterX}px`
    arrowEl.value.style.top = `${instrTop - 10}px`
    arrowEl.value.style.transform = `rotate(${angle}deg)`
    arrowEl.value.style.opacity = '1'
  })
}

/* ── Hint timer ── */
function startHintTimer() {
  if (!step.value?.hint) return
  showHint.value = false
  hintTimer = setTimeout(() => {
    showHint.value = true
  }, 10000)
}

/* ── Check watcher for gated steps ── */
function startCheckWatcher() {
  if (!step.value?.check) return
  checkInterval = setInterval(() => {
    if (step.value?.check?.()) {
      if (checkInterval) clearInterval(checkInterval)
      checkInterval = null
      // Visual feedback: pulse the Next button
      nextTick(() => {
        const nextBtn = document.querySelector('.guided-tour__next-btn') as HTMLElement | null
        if (nextBtn) {
          gsap.fromTo(nextBtn,
            { scale: 1 },
            { scale: 1.1, duration: 0.3, yoyo: true, repeat: 2, ease: 'power2.out' }
          )
        }
      })
    }
  }, 500)
}

/* ── GSAP Animations ── */
function animateEntrance() {
  nextTick(() => {
    const panel = document.querySelector('.guided-tour__panel') as HTMLElement | null
    if (panel) {
      gsap.fromTo(panel,
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }
      )
    }
    if (overlayEl.value) {
      gsap.fromTo(overlayEl.value,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: 'power2.out' }
      )
    }
  })
}

function animateStepTransition() {
  const panel = document.querySelector('.guided-tour__panel') as HTMLElement | null
  if (panel) {
    gsap.fromTo(panel,
      { opacity: 0.5, x: 10 },
      { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out' }
    )
  }
}

function animateExit() {
  const panel = document.querySelector('.guided-tour__panel') as HTMLElement | null
  if (panel) {
    gsap.to(panel, {
      opacity: 0, y: 10, scale: 0.95, duration: 0.3, ease: 'power2.in',
    })
  }
}

/* ── Scroll handler to reposition spotlight ── */
function handleScroll() {
  if (isActive.value && step.value?.target) {
    highlightTarget()
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleScroll)
})
</script>

<template>
  <!-- "Take Tour" button for repeat visits -->
  <button
    v-if="!isActive && hasCompletedBefore"
    class="guided-tour__retake-btn"
    :style="{
      '--tour-color': accentColor,
      borderColor: `${accentColor}30`,
      color: accentColor,
    }"
    aria-label="Take guided tour"
    @click="startTour"
  >
    <Eye class="w-3 h-3" />
    <span>Take Tour</span>
  </button>

  <!-- Tour overlay (portal to body would be ideal, but works in-place) -->
  <Teleport to="body">
    <div
      v-if="isActive"
      ref="overlayEl"
      class="guided-tour__overlay"
      @click.self="skipTour"
    >
      <!-- Spotlight cutout -->
      <svg
        v-if="spotlightRect"
        class="guided-tour__backdrop-svg"
        preserveAspectRatio="none"
      >
        <defs>
          <mask id="guided-tour-mask">
            <rect width="100%" height="100%" fill="white" />
            <rect
              :x="spotlightRect.x"
              :y="spotlightRect.y"
              :width="spotlightRect.w"
              :height="spotlightRect.h"
              rx="8"
              fill="black"
            />
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="rgba(2, 4, 12, 0.7)"
          mask="url(#guided-tour-mask)"
        />
      </svg>

      <!-- Dim overlay when no spotlight target -->
      <div
        v-if="!spotlightRect"
        class="guided-tour__backdrop-dim"
      />

      <!-- Spotlight highlight border -->
      <div
        v-if="spotlightRect"
        class="guided-tour__spotlight"
        :style="{
          left: `${spotlightRect.x}px`,
          top: `${spotlightRect.y}px`,
          width: `${spotlightRect.w}px`,
          height: `${spotlightRect.h}px`,
        }"
      />

      <!-- Arrow pointing to target -->
      <div
        v-if="spotlightRect"
        ref="arrowEl"
        class="guided-tour__arrow"
        :style="{ color: accentColor }"
      >
        <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
          <path
            d="M8 0 L16 20 L8 16 L0 20 Z"
            :fill="accentColor"
            opacity="0.8"
          />
        </svg>
      </div>

      <!-- Instruction panel -->
      <div
        ref="instructionEl"
        class="guided-tour__panel"
        :style="{ '--tour-color': accentColor }"
      >
        <!-- Header -->
        <div class="guided-tour__panel-header">
          <div class="guided-tour__step-badge" :style="{ backgroundColor: `${accentColor}15`, color: accentColor, borderColor: `${accentColor}30` }">
            <Sparkles class="w-3 h-3" />
            <span>Step {{ stepLabel }}</span>
          </div>
          <button
            class="guided-tour__skip-btn"
            aria-label="Skip tour"
            @click="skipTour"
          >
            <X class="w-3.5 h-3.5" />
          </button>
        </div>

        <!-- Step progress bar -->
        <div class="guided-tour__progress-track">
          <div
            v-for="i in totalSteps"
            :key="i"
            class="guided-tour__progress-segment"
            :class="{
              'guided-tour__progress-segment--done': i - 1 < currentStep,
              'guided-tour__progress-segment--active': i - 1 === currentStep,
            }"
            :style="{
              backgroundColor: i - 1 < currentStep ? accentColor : i - 1 === currentStep ? `${accentColor}60` : 'rgba(255,255,255,0.08)',
            }"
          />
        </div>

        <!-- Title -->
        <h4 class="guided-tour__title">{{ step.title }}</h4>

        <!-- Instruction -->
        <p class="guided-tour__instruction">{{ step.instruction }}</p>

        <!-- Hint (shown after delay) -->
        <Transition
          enter-active-class="transition-all duration-400 ease-out"
          enter-from-class="opacity-0 translate-y-1"
          enter-to-class="opacity-100 translate-y-0"
        >
          <p v-if="showHint && step.hint" class="guided-tour__hint">
            {{ step.hint }}
          </p>
        </Transition>

        <!-- Gated indicator -->
        <div
          v-if="step.check && !canAdvance"
          class="guided-tour__gate-indicator"
        >
          <div class="guided-tour__gate-dot" :style="{ backgroundColor: `${accentColor}60` }" />
          <span>Complete the action above to continue</span>
        </div>

        <div
          v-if="step.check && canAdvance"
          class="guided-tour__gate-indicator guided-tour__gate-indicator--pass"
        >
          <div class="guided-tour__gate-dot guided-tour__gate-dot--pass" />
          <span>Done! Click Next to continue</span>
        </div>

        <!-- Navigation -->
        <div class="guided-tour__nav">
          <button
            v-if="currentStep > 0"
            class="guided-tour__back-btn"
            aria-label="Previous step"
            @click="prevStep"
          >
            <ChevronLeft class="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <div class="guided-tour__nav-spacer" />

          <button
            class="guided-tour__skip-link"
            aria-label="Skip tour"
            @click="skipTour"
          >
            <SkipForward class="w-3 h-3" />
            <span>Skip Tour</span>
          </button>

          <button
            class="guided-tour__next-btn"
            :class="{ 'guided-tour__next-btn--disabled': !canAdvance }"
            :disabled="!canAdvance"
            :style="{
              backgroundColor: canAdvance ? accentColor : 'rgba(255,255,255,0.06)',
              color: canAdvance ? '#020410' : 'rgba(255,255,255,0.25)',
            }"
            :aria-label="isLastStep ? 'Finish tour' : 'Next step'"
            @click="nextStep"
          >
            <span>{{ isLastStep ? 'Finish' : 'Next' }}</span>
            <ChevronRight class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
/* ── Retake button ── */
.guided-tour__retake-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 0.02em;
}

.guided-tour__retake-btn:hover {
  background: rgba(255, 255, 255, 0.06);
  filter: brightness(1.2);
}

/* ── Overlay ── */
.guided-tour__overlay {
  position: fixed;
  inset: 0;
  z-index: 9990;
  pointer-events: auto;
}

.guided-tour__backdrop-svg {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 9991;
  pointer-events: none;
}

.guided-tour__backdrop-dim {
  position: fixed;
  inset: 0;
  background: rgba(2, 4, 12, 0.65);
  z-index: 9991;
  pointer-events: none;
}

/* ── Spotlight ── */
.guided-tour__spotlight {
  position: fixed;
  z-index: 9992;
  border-radius: 8px;
  pointer-events: none;
  transition: left 0.4s ease, top 0.4s ease, width 0.4s ease, height 0.4s ease;
}

/* ── Arrow ── */
.guided-tour__arrow {
  position: fixed;
  z-index: 9995;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
  transform-origin: center bottom;
}

/* ── Instruction panel ── */
.guided-tour__panel {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  width: min(420px, calc(100vw - 32px));
  padding: 16px 20px;
  border-radius: 16px;
  background: rgba(10, 14, 26, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    0 0 40px rgba(0, 0, 0, 0.6),
    0 0 80px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
  font-family: 'Inter', sans-serif;
  pointer-events: auto;
}

.guided-tour__panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.guided-tour__step-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px;
  border-radius: 9999px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  border: 1px solid;
}

.guided-tour__skip-btn {
  appearance: none;
  border: none;
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.3);
  padding: 4px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.guided-tour__skip-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.6);
}

/* ── Progress track ── */
.guided-tour__progress-track {
  display: flex;
  gap: 3px;
  margin-bottom: 12px;
}

.guided-tour__progress-segment {
  flex: 1;
  height: 3px;
  border-radius: 2px;
  transition: background-color 0.4s ease;
}

/* ── Content ── */
.guided-tour__title {
  margin: 0 0 6px;
  font-family: 'Syne', sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #e2e8f0;
  letter-spacing: -0.01em;
}

.guided-tour__instruction {
  margin: 0 0 4px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.6;
}

.guided-tour__hint {
  margin: 6px 0 0;
  padding: 8px 12px;
  border-radius: 8px;
  background: rgba(245, 158, 11, 0.08);
  border: 1px solid rgba(245, 158, 11, 0.15);
  font-size: 11px;
  color: rgba(245, 158, 11, 0.8);
  font-style: italic;
  line-height: 1.5;
}

/* ── Gate indicator ── */
.guided-tour__gate-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  padding: 6px 10px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 10px;
  color: rgba(255, 255, 255, 0.4);
}

.guided-tour__gate-indicator--pass {
  background: rgba(34, 197, 94, 0.06);
  border-color: rgba(34, 197, 94, 0.15);
  color: rgba(34, 197, 94, 0.8);
}

.guided-tour__gate-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
  animation: guidedTourPulse 1.5s ease-in-out infinite;
}

.guided-tour__gate-dot--pass {
  background-color: #22c55e !important;
  animation: none;
}

@keyframes guidedTourPulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}

/* ── Navigation ── */
.guided-tour__nav {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 14px;
}

.guided-tour__nav-spacer {
  flex: 1;
}

.guided-tour__back-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 5px 12px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Inter', sans-serif;
}

.guided-tour__back-btn:hover {
  color: rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.06);
}

.guided-tour__skip-link {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 5px 8px;
  border: none;
  background: none;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.25);
  cursor: pointer;
  transition: color 0.2s ease;
  font-family: 'Inter', sans-serif;
}

.guided-tour__skip-link:hover {
  color: rgba(255, 255, 255, 0.45);
}

.guided-tour__next-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 16px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Inter', sans-serif;
}

.guided-tour__next-btn:hover:not(:disabled) {
  filter: brightness(1.15);
  transform: translateY(-1px);
}

.guided-tour__next-btn--disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

/* ── Responsive ── */
@media (max-width: 640px) {
  .guided-tour__panel {
    bottom: 12px;
    padding: 12px 16px;
  }

  .guided-tour__title {
    font-size: 13px;
  }

  .guided-tour__instruction {
    font-size: 11px;
  }
}
</style>
