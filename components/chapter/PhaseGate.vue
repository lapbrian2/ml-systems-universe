<script setup lang="ts">
import { computed, watch } from 'vue'
import { BookCheck, FlaskConical, Brain, PartyPopper } from 'lucide-vue-next'
import { useProgressStore } from '~/stores/progress'
import { useCelebration } from '~/composables/useCelebration'

const props = defineProps<{
  chapterId: string
  partColor: string
}>()

const store = useProgressStore()
const { celebrateChapterComplete } = useCelebration()
const progress = computed(() => store.getProgress(props.chapterId))

const phases = computed(() => [
  {
    id: 'read',
    label: 'Reading',
    icon: BookCheck,
    done: progress.value.phases.read,
  },
  {
    id: 'exercise',
    label: 'Exercise',
    icon: FlaskConical,
    done: progress.value.phases.exercise,
  },
  {
    id: 'quiz',
    label: 'Quiz',
    icon: Brain,
    done: progress.value.phases.quiz.passed,
  },
])

const allComplete = computed(() => phases.value.every(p => p.done))

// Fire confetti once when all phases complete (not on re-mount)
let confettiFired = false
watch(allComplete, (isComplete, wasComplete) => {
  if (!isComplete || wasComplete || confettiFired) return
  if (import.meta.server) return
  confettiFired = true
  celebrateChapterComplete()
})
</script>

<template>
  <div class="mt-12">
    <div class="section-divider mb-10" />

    <div class="glass-panel rounded-xl p-6">
      <h3 class="font-display text-base font-semibold text-white mb-5">
        Chapter Progress
      </h3>

      <!-- Phase indicators -->
      <div class="grid grid-cols-3 gap-3">
        <div
          v-for="phase in phases"
          :key="phase.id"
          class="relative flex flex-col items-center gap-2 py-3 rounded-lg transition-colors duration-300"
          :class="phase.done ? 'bg-white/[0.04]' : 'bg-white/[0.02]'"
        >
          <!-- Icon circle -->
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
            :style="{
              backgroundColor: phase.done ? `${partColor}20` : 'rgba(255,255,255,0.05)',
              boxShadow: phase.done ? `0 0 16px ${partColor}20` : 'none',
            }"
          >
            <component
              :is="phase.icon"
              class="w-4 h-4 transition-colors duration-300"
              :style="{ color: phase.done ? partColor : 'rgba(255,255,255,0.25)' }"
            />
          </div>

          <!-- Label -->
          <span
            class="text-xs font-medium transition-colors duration-300"
            :class="phase.done ? 'text-white/80' : 'text-white/50'"
          >
            {{ phase.label }}
          </span>

          <!-- Status dot -->
          <span
            class="absolute top-2 right-2 w-2 h-2 rounded-full transition-colors duration-300"
            :style="{
              backgroundColor: phase.done ? partColor : 'rgba(255,255,255,0.1)',
            }"
          />

          <!-- Exercise hint -->
          <p
            v-if="phase.id === 'exercise' && !phase.done"
            class="text-[9px] text-white/50 text-center px-1 leading-tight"
          >
            Interact with the visualization
          </p>
        </div>
      </div>

      <!-- Complete banner -->
      <Transition
        enter-active-class="transition-all duration-500 ease-out"
        enter-from-class="opacity-0 translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
      >
        <div
          v-if="allComplete"
          class="mt-4 flex items-center justify-center gap-2 py-3 rounded-lg"
          :style="{ backgroundColor: `${partColor}15` }"
        >
          <PartyPopper class="w-4 h-4" :style="{ color: partColor }" />
          <span class="text-sm font-semibold" :style="{ color: partColor }">
            Chapter Complete!
          </span>
        </div>
      </Transition>
    </div>
  </div>
</template>
