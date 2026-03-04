<script setup lang="ts">
import { ref, computed } from 'vue'
import { Brain, CheckCircle2, XCircle, ArrowRight, RotateCcw, Trophy } from 'lucide-vue-next'
import { getQuizForChapter } from '~/data/quizzes'
import { selectQuizQuestions } from '~/lib/quiz-scorer'
import { useProgressStore } from '~/stores/progress'
import type { QuizQuestion } from '~/types/quiz'

const props = defineProps<{
  chapterId: string
  partColor: string
}>()

const emit = defineEmits<{
  complete: [score: number]
}>()

const store = useProgressStore()

// Quiz state
const quizData = getQuizForChapter(props.chapterId)
const questions = ref<QuizQuestion[]>([])
const currentIndex = ref(0)
const selectedAnswer = ref<number | null>(null)
const revealed = ref(false)
const finished = ref(false)
const answers = ref<Record<string, number>>({})
const correctCount = ref(0)

// Derived
const currentQuestion = computed(() => questions.value[currentIndex.value])
const totalQuestions = computed(() => questions.value.length)
const isCorrect = computed(() =>
  selectedAnswer.value !== null && currentQuestion.value
    ? selectedAnswer.value === currentQuestion.value.correctIndex
    : false
)
const scorePercentage = computed(() =>
  totalQuestions.value > 0
    ? Math.round((correctCount.value / totalQuestions.value) * 100)
    : 0
)
const passed = computed(() =>
  quizData ? scorePercentage.value >= quizData.passingScore : false
)

// Initialize quiz
function startQuiz() {
  if (!quizData) return
  questions.value = selectQuizQuestions(quizData.pool, quizData.selectCount)
  currentIndex.value = 0
  selectedAnswer.value = null
  revealed.value = false
  finished.value = false
  answers.value = {}
  correctCount.value = 0
}

// Select an option
function selectOption(index: number) {
  if (revealed.value) return
  selectedAnswer.value = index
}

// Confirm answer and reveal
function confirmAnswer() {
  if (selectedAnswer.value === null || !currentQuestion.value) return
  revealed.value = true
  answers.value[currentQuestion.value.id] = selectedAnswer.value
  if (selectedAnswer.value === currentQuestion.value.correctIndex) {
    correctCount.value++
  }
}

// Advance to next question or finish
function advance() {
  if (currentIndex.value < totalQuestions.value - 1) {
    currentIndex.value++
    selectedAnswer.value = null
    revealed.value = false
  } else {
    finishQuiz()
  }
}

function finishQuiz() {
  finished.value = true
  store.submitQuizResult(props.chapterId, scorePercentage.value, passed.value)
  emit('complete', scorePercentage.value)
}

// Start on mount
startQuiz()

function getOptionClass(optionIndex: number): string {
  const base = 'quiz-option'
  if (!revealed.value) {
    return selectedAnswer.value === optionIndex
      ? `${base} quiz-option--selected`
      : base
  }
  // After reveal
  if (optionIndex === currentQuestion.value?.correctIndex) {
    return `${base} quiz-option--correct quiz-option--disabled`
  }
  if (optionIndex === selectedAnswer.value && optionIndex !== currentQuestion.value?.correctIndex) {
    return `${base} quiz-option--wrong quiz-option--disabled`
  }
  return `${base} quiz-option--disabled opacity-50`
}
</script>

<template>
  <div class="mt-12">
    <div class="section-divider mb-10" />

    <div class="glass-panel rounded-xl p-6">
      <!-- Header -->
      <div class="flex items-center gap-2.5 mb-2">
        <div
          class="w-8 h-8 rounded-lg flex items-center justify-center"
          :style="{ backgroundColor: `${partColor}15` }"
        >
          <Brain class="w-4 h-4" :style="{ color: partColor }" />
        </div>
        <h3 class="font-display text-base font-semibold text-white">
          {{ quizData?.title ?? 'Chapter Quiz' }}
        </h3>
      </div>

      <p v-if="quizData?.description && !finished" class="text-xs text-white/40 mb-6 ml-[42px]">
        {{ quizData.description }}
      </p>

      <!-- No quiz data -->
      <div v-if="!quizData || questions.length === 0" class="py-8 text-center text-sm text-white/30">
        No quiz available for this chapter.
      </div>

      <!-- Quiz in progress -->
      <template v-else-if="!finished">
        <!-- Progress indicator -->
        <div class="flex items-center gap-2 mb-6">
          <div class="flex-1 h-1 rounded-full bg-white/[0.06] overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-500 ease-out"
              :style="{
                width: `${((currentIndex + 1) / totalQuestions) * 100}%`,
                backgroundColor: partColor,
              }"
            />
          </div>
          <span class="text-xs text-white/30 font-mono tabular-nums shrink-0">
            {{ currentIndex + 1 }}/{{ totalQuestions }}
          </span>
        </div>

        <!-- Question -->
        <div v-if="currentQuestion" class="space-y-4">
          <p class="text-sm font-medium text-white/90 leading-relaxed">
            {{ currentQuestion.question }}
          </p>

          <!-- Options -->
          <div class="space-y-2">
            <button
              v-for="(option, oIdx) in currentQuestion.options"
              :key="oIdx"
              :class="getOptionClass(oIdx)"
              :disabled="revealed"
              @click="selectOption(oIdx)"
            >
              <span class="flex items-start gap-3">
                <span
                  class="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold mt-0.5 border border-white/10"
                  :class="{
                    'border-primary bg-primary/20 text-primary': !revealed && selectedAnswer === oIdx,
                    'border-accent-green bg-accent-green/20 text-accent-green': revealed && oIdx === currentQuestion.correctIndex,
                    'border-accent-red bg-accent-red/20 text-accent-red': revealed && oIdx === selectedAnswer && oIdx !== currentQuestion.correctIndex,
                  }"
                >
                  {{ String.fromCharCode(65 + oIdx) }}
                </span>
                <span>{{ option }}</span>
              </span>
            </button>
          </div>

          <!-- Explanation (shown after reveal) -->
          <Transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
          >
            <div
              v-if="revealed"
              class="rounded-lg p-4 text-sm leading-relaxed"
              :class="isCorrect ? 'bg-accent-green/5 text-accent-green/80' : 'bg-accent-red/5 text-accent-red/80'"
            >
              <div class="flex items-center gap-1.5 mb-1 font-semibold text-xs uppercase tracking-wider">
                <CheckCircle2 v-if="isCorrect" class="w-3.5 h-3.5" />
                <XCircle v-else class="w-3.5 h-3.5" />
                {{ isCorrect ? 'Correct' : 'Incorrect' }}
              </div>
              {{ currentQuestion.explanation }}
            </div>
          </Transition>

          <!-- Action buttons -->
          <div class="flex justify-end pt-2">
            <button
              v-if="!revealed"
              class="px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
              :style="{
                backgroundColor: selectedAnswer !== null ? `${partColor}20` : 'rgba(255,255,255,0.05)',
                color: selectedAnswer !== null ? partColor : 'rgba(255,255,255,0.3)',
              }"
              :disabled="selectedAnswer === null"
              @click="confirmAnswer"
            >
              Confirm
            </button>
            <button
              v-else
              class="px-5 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors duration-200"
              :style="{ backgroundColor: `${partColor}20`, color: partColor }"
              @click="advance"
            >
              {{ currentIndex < totalQuestions - 1 ? 'Next' : 'See Results' }}
              <ArrowRight class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </template>

      <!-- Results -->
      <template v-else>
        <div class="py-6 text-center space-y-4">
          <div
            class="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
            :style="{
              backgroundColor: passed ? `${partColor}20` : 'rgba(255, 107, 107, 0.15)',
            }"
          >
            <Trophy
              class="w-7 h-7"
              :style="{ color: passed ? partColor : '#ff6b6b' }"
            />
          </div>

          <div>
            <p class="text-2xl font-display font-bold text-white">
              {{ scorePercentage }}%
            </p>
            <p class="text-sm text-white/40 mt-1">
              {{ correctCount }} of {{ totalQuestions }} correct
            </p>
          </div>

          <p
            class="text-sm font-semibold"
            :style="{ color: passed ? partColor : '#ff6b6b' }"
          >
            {{ passed ? 'Passed! Great work.' : `Need ${quizData?.passingScore ?? 70}% to pass. Try again!` }}
          </p>

          <!-- Retry button -->
          <button
            class="mt-2 px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 mx-auto transition-colors duration-200 hover:bg-white/[0.06]"
            :style="{ backgroundColor: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.6)' }"
            @click="startQuiz"
          >
            <RotateCcw class="w-3.5 h-3.5" />
            Retake Quiz
          </button>
        </div>
      </template>
    </div>
  </div>
</template>
