<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Brain, CheckCircle2, XCircle, ArrowRight, RotateCcw, Trophy, Sparkles, Target, Zap } from 'lucide-vue-next'
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
const started = ref(false)

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

// Difficulty icon
function getDifficultyConfig(diff?: string) {
  switch (diff) {
    case 'easy': return { icon: Target, label: 'Easy', color: '#22c55e' }
    case 'hard': return { icon: Zap, label: 'Hard', color: '#ff6b6b' }
    default: return { icon: Sparkles, label: 'Medium', color: '#f0a500' }
  }
}

// SVG progress ring
const ringRadius = 18
const ringCircumference = 2 * Math.PI * ringRadius
const ringOffset = computed(() => {
  if (totalQuestions.value === 0) return ringCircumference
  return ringCircumference - ((currentIndex.value + 1) / totalQuestions.value) * ringCircumference
})

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
  started.value = true
}

function selectOption(index: number) {
  if (revealed.value) return
  selectedAnswer.value = index
}

function confirmAnswer() {
  if (selectedAnswer.value === null || !currentQuestion.value) return
  revealed.value = true
  answers.value[currentQuestion.value.id] = selectedAnswer.value
  if (selectedAnswer.value === currentQuestion.value.correctIndex) {
    correctCount.value++
  }
}

function advance() {
  if (currentIndex.value < totalQuestions.value - 1) {
    currentIndex.value++
    selectedAnswer.value = null
    revealed.value = false
  } else {
    finishQuiz()
  }
}

async function finishQuiz() {
  finished.value = true
  store.submitQuizResult(props.chapterId, scorePercentage.value, passed.value)
  emit('complete', scorePercentage.value)

  // Fire confetti on pass
  if (passed.value && import.meta.client) {
    try {
      const confetti = (await import('canvas-confetti')).default
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.65 },
        colors: [props.partColor, '#14b8a6', '#22c55e', '#f0a500', '#a855f7'],
      })
    } catch {}
  }
}

// Show intro screen instead of auto-starting
const showIntro = ref(true)

function beginQuiz() {
  showIntro.value = false
  startQuiz()
}

function getOptionClass(optionIndex: number): string {
  const base = 'quiz-option'
  if (!revealed.value) {
    return selectedAnswer.value === optionIndex
      ? `${base} quiz-option--selected`
      : base
  }
  if (optionIndex === currentQuestion.value?.correctIndex) {
    return `${base} quiz-option--correct quiz-option--disabled`
  }
  if (optionIndex === selectedAnswer.value && optionIndex !== currentQuestion.value?.correctIndex) {
    return `${base} quiz-option--wrong quiz-option--disabled`
  }
  return `${base} quiz-option--disabled opacity-40`
}
</script>

<template>
  <div class="mt-12">
    <div class="section-divider mb-10" />

    <div class="glass-panel rounded-xl overflow-hidden">
      <!-- Header -->
      <div
        class="px-6 py-5 flex items-center gap-3"
        :style="{ background: `linear-gradient(135deg, ${partColor}08 0%, transparent 100%)` }"
      >
        <div
          class="w-9 h-9 rounded-lg flex items-center justify-center"
          :style="{ backgroundColor: `${partColor}15` }"
        >
          <Brain class="w-4 h-4" :style="{ color: partColor }" />
        </div>
        <div class="flex-1">
          <h3 class="font-display text-base font-semibold text-white">
            {{ quizData?.title ?? 'Chapter Quiz' }}
          </h3>
          <p v-if="quizData?.description && !finished" class="text-[11px] text-white/35 mt-0.5">
            {{ quizData.description }}
          </p>
        </div>
        <!-- Previous best score -->
        <div
          v-if="store.getProgress(chapterId).phases.quiz.attempts > 0 && !finished"
          class="text-right"
        >
          <p class="text-[9px] text-white/25 uppercase tracking-wider">Best</p>
          <p class="text-sm font-mono font-semibold tabular-nums" :style="{ color: partColor }">
            {{ store.getProgress(chapterId).phases.quiz.bestScore }}%
          </p>
        </div>
      </div>

      <div class="px-6 pb-6">
        <!-- No quiz data -->
        <div v-if="!quizData" class="py-10 text-center text-sm text-white/30">
          No quiz available for this chapter.
        </div>

        <!-- Quiz intro screen -->
        <div v-else-if="showIntro" class="py-8 text-center space-y-4">
          <p class="text-sm text-white/50">Ready to test your knowledge?</p>
          <div class="flex items-center justify-center gap-4 text-xs text-white/30">
            <span>{{ quizData.selectCount }} questions</span>
            <span class="w-1 h-1 rounded-full bg-white/15" />
            <span>Randomized from pool</span>
            <span class="w-1 h-1 rounded-full bg-white/15" />
            <span>{{ quizData.passingScore }}% to pass</span>
          </div>
          <button
            class="mt-2 px-8 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:brightness-110"
            :style="{ backgroundColor: `${partColor}20`, color: partColor, boxShadow: `0 2px 12px ${partColor}15` }"
            @click="beginQuiz"
          >
            Start Quiz
          </button>
        </div>

        <!-- Quiz in progress -->
        <template v-else-if="!finished">
          <!-- Progress ring + question counter -->
          <div class="flex items-center gap-4 py-5">
            <!-- SVG progress ring -->
            <div class="relative shrink-0">
              <svg width="44" height="44" class="-rotate-90">
                <circle
                  cx="22" cy="22" :r="ringRadius"
                  fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="3"
                />
                <circle
                  cx="22" cy="22" :r="ringRadius"
                  fill="none" :stroke="partColor" stroke-width="3"
                  stroke-linecap="round"
                  :stroke-dasharray="ringCircumference"
                  :stroke-dashoffset="ringOffset"
                  class="transition-all duration-500 ease-out"
                />
              </svg>
              <span class="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-semibold text-white/50 tabular-nums">
                {{ currentIndex + 1 }}
              </span>
            </div>

            <div class="flex-1">
              <p class="text-xs text-white/40">
                Question {{ currentIndex + 1 }} of {{ totalQuestions }}
              </p>
              <!-- Step dots -->
              <div class="flex items-center gap-1 mt-1.5">
                <div
                  v-for="i in totalQuestions"
                  :key="i"
                  class="h-1 rounded-full transition-all duration-300"
                  :style="{
                    width: i - 1 === currentIndex ? '16px' : '6px',
                    backgroundColor: i - 1 < currentIndex
                      ? (answers[questions[i-1]?.id] === questions[i-1]?.correctIndex ? '#22c55e' : '#ff6b6b')
                      : i - 1 === currentIndex
                        ? partColor
                        : 'rgba(255,255,255,0.08)',
                  }"
                />
              </div>
            </div>

            <!-- Difficulty badge -->
            <div
              v-if="currentQuestion?.difficulty"
              class="flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-semibold uppercase tracking-wider"
              :style="{
                color: getDifficultyConfig(currentQuestion.difficulty).color,
                backgroundColor: `${getDifficultyConfig(currentQuestion.difficulty).color}12`,
              }"
            >
              <component :is="getDifficultyConfig(currentQuestion.difficulty).icon" class="w-2.5 h-2.5" />
              {{ getDifficultyConfig(currentQuestion.difficulty).label }}
            </div>
          </div>

          <!-- Question -->
          <div v-if="currentQuestion" class="space-y-4">
            <p class="text-[15px] font-medium text-white/90 leading-relaxed">
              {{ currentQuestion.question }}
            </p>

            <!-- Options -->
            <div class="space-y-2">
              <button
                v-for="(option, oIdx) in currentQuestion.options"
                :key="oIdx"
                :class="getOptionClass(oIdx)"
                :disabled="revealed"
                :aria-label="`Option ${String.fromCharCode(65 + oIdx)}: ${option}`"
                @click="selectOption(oIdx)"
              >
                <span class="flex items-start gap-3">
                  <span
                    class="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold mt-0.5 transition-all duration-200"
                    :class="{
                      'border border-white/10': !revealed && selectedAnswer !== oIdx,
                      'border-2 shadow-sm': !revealed && selectedAnswer === oIdx,
                      'border-2': revealed,
                    }"
                    :style="{
                      borderColor: !revealed && selectedAnswer === oIdx ? partColor : revealed && oIdx === currentQuestion.correctIndex ? '#22c55e' : revealed && oIdx === selectedAnswer && oIdx !== currentQuestion.correctIndex ? '#ff6b6b' : undefined,
                      backgroundColor: !revealed && selectedAnswer === oIdx ? `${partColor}20` : revealed && oIdx === currentQuestion.correctIndex ? 'rgba(34,197,94,0.15)' : revealed && oIdx === selectedAnswer && oIdx !== currentQuestion.correctIndex ? 'rgba(255,107,107,0.15)' : undefined,
                      color: !revealed && selectedAnswer === oIdx ? partColor : revealed && oIdx === currentQuestion.correctIndex ? '#22c55e' : revealed && oIdx === selectedAnswer && oIdx !== currentQuestion.correctIndex ? '#ff6b6b' : undefined,
                    }"
                  >
                    <CheckCircle2 v-if="revealed && oIdx === currentQuestion.correctIndex" class="w-3.5 h-3.5" />
                    <XCircle v-else-if="revealed && oIdx === selectedAnswer && oIdx !== currentQuestion.correctIndex" class="w-3.5 h-3.5" />
                    <template v-else>{{ String.fromCharCode(65 + oIdx) }}</template>
                  </span>
                  <span class="pt-0.5">{{ option }}</span>
                </span>
              </button>
            </div>

            <!-- Explanation -->
            <Transition
              enter-active-class="transition-all duration-300 ease-out"
              enter-from-class="opacity-0 translate-y-2 scale-[0.98]"
              enter-to-class="opacity-100 translate-y-0 scale-100"
            >
              <div
                v-if="revealed"
                class="rounded-xl p-5 text-sm leading-relaxed"
                :class="isCorrect ? 'bg-accent-green/[0.06] border border-accent-green/10' : 'bg-accent-red/[0.06] border border-accent-red/10'"
              >
                <div class="flex items-center gap-2 mb-2 font-semibold text-xs uppercase tracking-wider">
                  <CheckCircle2 v-if="isCorrect" class="w-4 h-4 text-accent-green" />
                  <XCircle v-else class="w-4 h-4 text-accent-red" />
                  <span :class="isCorrect ? 'text-accent-green' : 'text-accent-red'">
                    {{ isCorrect ? 'Correct!' : 'Not quite' }}
                  </span>
                </div>
                <p :class="isCorrect ? 'text-accent-green/70' : 'text-accent-red/70'">
                  {{ currentQuestion.explanation }}
                </p>
              </div>
            </Transition>

            <!-- Action buttons -->
            <div class="flex justify-end pt-2">
              <button
                v-if="!revealed"
                class="px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:brightness-105 active:scale-[0.98] disabled:opacity-25 disabled:cursor-not-allowed"
                :style="{
                  backgroundColor: selectedAnswer !== null ? `${partColor}20` : 'rgba(255,255,255,0.05)',
                  color: selectedAnswer !== null ? partColor : 'rgba(255,255,255,0.3)',
                  boxShadow: selectedAnswer !== null ? `0 2px 12px ${partColor}15` : 'none',
                }"
                :disabled="selectedAnswer === null"
                @click="confirmAnswer"
              >
                Check Answer
              </button>
              <button
                v-else
                class="px-6 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all duration-200 hover:brightness-110"
                :style="{ backgroundColor: `${partColor}20`, color: partColor, boxShadow: `0 2px 12px ${partColor}15` }"
                @click="advance"
              >
                {{ currentIndex < totalQuestions - 1 ? 'Next Question' : 'See Results' }}
                <ArrowRight class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </template>

        <!-- Results -->
        <template v-else>
          <div class="py-8 text-center space-y-5">
            <!-- Score ring -->
            <div class="relative inline-block">
              <svg width="120" height="120" class="-rotate-90">
                <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="6" />
                <circle
                  cx="60" cy="60" r="50"
                  fill="none"
                  :stroke="passed ? partColor : '#ff6b6b'"
                  stroke-width="6"
                  stroke-linecap="round"
                  :stroke-dasharray="314"
                  :stroke-dashoffset="314 - (scorePercentage / 100) * 314"
                  class="transition-all duration-1000 ease-out"
                />
              </svg>
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <Trophy class="w-5 h-5 mb-1" :style="{ color: passed ? partColor : '#ff6b6b' }" />
                <span class="text-2xl font-display font-bold text-white tabular-nums">
                  {{ scorePercentage }}%
                </span>
              </div>
            </div>

            <div>
              <p
                class="text-base font-display font-semibold"
                :style="{ color: passed ? partColor : '#ff6b6b' }"
              >
                {{ passed ? 'Excellent work!' : 'Keep learning!' }}
              </p>
              <p class="text-sm text-white/35 mt-1">
                {{ correctCount }} of {{ totalQuestions }} correct
                <span v-if="!passed" class="text-white/25"> · Need {{ quizData?.passingScore ?? 70 }}% to pass</span>
              </p>
            </div>

            <!-- Answer summary dots -->
            <div class="flex items-center justify-center gap-2">
              <div
                v-for="(q, qIdx) in questions"
                :key="q.id"
                class="w-3 h-3 rounded-full"
                :style="{
                  backgroundColor: answers[q.id] === q.correctIndex ? '#22c55e' : '#ff6b6b',
                }"
                :title="`Q${qIdx + 1}: ${answers[q.id] === q.correctIndex ? 'Correct' : 'Incorrect'}`"
              />
            </div>

            <!-- Retry button -->
            <button
              class="mt-2 px-6 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 mx-auto transition-all duration-200 hover:bg-white/[0.08]"
              style="background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.6);"
              @click="beginQuiz"
            >
              <RotateCcw class="w-3.5 h-3.5" />
              {{ passed ? 'Retake Quiz' : 'Try Again' }}
            </button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
