<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, type Component } from 'vue'
import { Trophy } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
  show: boolean
  title: string
  description?: string
  icon?: Component
  duration?: number
}>(), {
  duration: 4000,
})

const emit = defineEmits<{
  close: []
}>()

const visible = ref(false)
const toastEl = ref<HTMLElement | null>(null)
let dismissTimer: ReturnType<typeof setTimeout> | null = null
let gsapInstance: typeof import('gsap')['default'] | null = null

async function loadGsap() {
  if (gsapInstance) return gsapInstance
  try {
    const mod = await import('gsap')
    gsapInstance = mod.default
    return gsapInstance
  } catch {
    return null
  }
}

watch(() => props.show, async (newVal) => {
  if (newVal) {
    visible.value = true
    const gsap = await loadGsap()

    if (gsap && toastEl.value) {
      gsap.fromTo(toastEl.value,
        { x: 320, opacity: 0, scale: 0.9 },
        { x: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.4)' },
      )
    }

    // Auto-dismiss
    if (dismissTimer) clearTimeout(dismissTimer)
    dismissTimer = setTimeout(() => {
      dismiss()
    }, props.duration)
  }
})

async function dismiss() {
  const gsap = await loadGsap()
  if (gsap && toastEl.value) {
    gsap.to(toastEl.value, {
      x: 320,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        visible.value = false
        emit('close')
      },
    })
  } else {
    visible.value = false
    emit('close')
  }
}

onUnmounted(() => {
  if (dismissTimer) clearTimeout(dismissTimer)
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="visible"
      ref="toastEl"
      class="fixed bottom-6 right-6 z-[9999] max-w-xs"
      role="alert"
      aria-live="polite"
    >
      <div class="flex items-start gap-3 px-4 py-3.5 rounded-xl border border-white/[0.08] bg-[#0d1117]/95 backdrop-blur-xl shadow-2xl shadow-black/40">
        <!-- Icon -->
        <div class="w-9 h-9 rounded-lg flex items-center justify-center bg-primary/15 shrink-0 mt-0.5">
          <component :is="icon ?? Trophy" class="w-4 h-4 text-primary" />
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0">
          <p class="text-sm font-display font-semibold text-white leading-tight">
            {{ title }}
          </p>
          <p v-if="description" class="text-[11px] text-white/45 mt-0.5 leading-snug">
            {{ description }}
          </p>
        </div>

        <!-- Close -->
        <button
          class="text-white/20 hover:text-white/50 transition-colors mt-0.5 shrink-0"
          aria-label="Dismiss achievement notification"
          @click="dismiss"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none">
            <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
        </button>
      </div>

      <!-- Glow accent -->
      <div class="absolute -inset-px rounded-xl bg-gradient-to-r from-primary/20 to-purple-500/10 -z-10 blur-sm" />
    </div>
  </Teleport>
</template>
