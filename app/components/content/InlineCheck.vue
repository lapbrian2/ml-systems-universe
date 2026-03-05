<script setup lang="ts">
import { ref, computed } from 'vue'
import { Lightbulb, Check, X, HelpCircle, ChevronDown, RefreshCw } from 'lucide-vue-next'

const props = defineProps<{
  question: string
  options: string[]
  correctIndex: number
  explanation: string
  hint?: string
}>()

const selectedIndex = ref<number | null>(null)
const showHint = ref(false)
const answered = computed(() => selectedIndex.value !== null)
const isCorrect = computed(() => selectedIndex.value === props.correctIndex)

function select(index: number) {
  if (answered.value) return
  selectedIndex.value = index
}

function reset() {
  selectedIndex.value = null
  showHint.value = false
}

function optionClass(index: number) {
  if (!answered.value) {
    return 'bg-white/[0.06] hover:bg-white/[0.12] border-white/10 hover:border-white/20 text-white/70 hover:text-white/90 cursor-pointer'
  }
  if (index === props.correctIndex) {
    return 'bg-emerald-500/15 border-emerald-400/40 text-emerald-300'
  }
  if (index === selectedIndex.value && index !== props.correctIndex) {
    return 'bg-red-500/15 border-red-400/40 text-red-300'
  }
  return 'bg-white/[0.03] border-white/5 text-white/30'
}
</script>

<template>
  <div class="inline-check my-6">
    <div
      class="rounded-lg border border-amber-400/15 bg-gradient-to-br from-amber-500/[0.04] to-transparent px-5 py-4"
      style="border-left: 3px solid rgba(251, 191, 36, 0.4)"
    >
      <!-- Header -->
      <div class="flex items-center gap-2 mb-3">
        <div class="w-6 h-6 rounded-md flex items-center justify-center shrink-0 bg-amber-400/10">
          <Lightbulb class="w-3.5 h-3.5 text-amber-400" />
        </div>
        <span class="text-[11px] font-bold uppercase tracking-wider text-amber-400">
          Quick Check
        </span>
      </div>

      <!-- Question -->
      <p class="text-[14px] leading-relaxed text-white/80 mb-3 pl-0.5">
        {{ question }}
      </p>

      <!-- Hint button -->
      <button
        v-if="hint && !answered"
        class="inline-flex items-center gap-1.5 text-[12px] text-white/40 hover:text-amber-400/80 mb-3 transition-colors duration-200"
        @click="showHint = !showHint"
      >
        <HelpCircle class="w-3.5 h-3.5" />
        {{ showHint ? 'Hide hint' : 'Show hint' }}
      </button>

      <!-- Hint text -->
      <div
        class="overflow-hidden transition-all duration-300"
        :class="showHint && !answered ? 'max-h-20 opacity-100 mb-3' : 'max-h-0 opacity-0'"
      >
        <p class="text-[13px] text-amber-300/60 italic pl-2 border-l-2 border-amber-400/20">
          {{ hint }}
        </p>
      </div>

      <!-- Options -->
      <div class="flex flex-col gap-2 mb-1" role="radiogroup" aria-label="Answer options">
        <button
          v-for="(option, idx) in options"
          :key="idx"
          role="radio"
          :aria-checked="selectedIndex === idx"
          class="flex items-center gap-2.5 text-left rounded-md border px-3 py-2 text-[13px] leading-snug transition-all duration-200"
          :class="optionClass(idx)"
          :disabled="answered"
          @click="select(idx)"
        >
          <!-- Status icon -->
          <span
            v-if="answered && idx === correctIndex"
            class="shrink-0 w-4 h-4 rounded-full bg-emerald-400/20 flex items-center justify-center"
          >
            <Check class="w-3 h-3 text-emerald-400" />
          </span>
          <span
            v-else-if="answered && idx === selectedIndex && idx !== correctIndex"
            class="shrink-0 w-4 h-4 rounded-full bg-red-400/20 flex items-center justify-center"
          >
            <X class="w-3 h-3 text-red-400" />
          </span>
          <span
            v-else
            class="shrink-0 w-4 h-4 rounded-full border border-current/30 flex items-center justify-center text-[10px] font-medium opacity-50"
          >
            {{ String.fromCharCode(65 + idx) }}
          </span>

          <span>{{ option }}</span>
        </button>
      </div>

      <!-- Explanation (revealed after answer) -->
      <div
        class="overflow-hidden transition-all duration-400"
        :class="answered ? 'max-h-40 opacity-100 mt-3' : 'max-h-0 opacity-0'"
      >
        <div class="rounded-md bg-white/[0.04] px-3 py-2.5 text-[13px] leading-relaxed">
          <span
            class="font-semibold mr-1"
            :class="isCorrect ? 'text-emerald-400' : 'text-red-400'"
          >
            {{ isCorrect ? 'Correct!' : 'Not quite.' }}
          </span>
          <span class="text-white/55">{{ explanation }}</span>
        </div>
      </div>

      <!-- Try again button (only shown on wrong answer) -->
      <div
        class="overflow-hidden transition-all duration-400"
        :class="answered && !isCorrect ? 'max-h-10 opacity-100 mt-2' : 'max-h-0 opacity-0'"
      >
        <button
          class="inline-flex items-center gap-1.5 text-[11px] text-white/35 hover:text-amber-400/70 transition-colors duration-200"
          @click="reset()"
        >
          <RefreshCw class="w-3 h-3" />
          Try again
        </button>
      </div>

      <!-- Continue indicator -->
      <div
        class="overflow-hidden transition-all duration-400"
        :class="answered && isCorrect ? 'max-h-8 opacity-100 mt-2' : 'max-h-0 opacity-0'"
      >
        <div class="flex items-center justify-center gap-1 text-[11px] text-white/25">
          <span>Continue reading</span>
          <ChevronDown class="w-3 h-3 animate-bounce" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media (prefers-reduced-motion: reduce) {
  .inline-check * {
    transition: none !important;
    animation: none !important;
  }
}
</style>
