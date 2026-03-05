<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  Brain,
  RotateCcw,
  ChevronRight,
  Flame,
  Trophy,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Lightbulb,
  BookOpen,
  AlertCircle,
} from 'lucide-vue-next'
import { useFlashcardStore } from '~/stores/flashcards'
import { useSpacedRepetitionStore } from '~/stores/spaced-repetition'
import { useCelebration } from '~/composables/useCelebration'
import { loadAllChapterContent, getChapterContent } from '~/data/content'
import { CHAPTERS, CHAPTER_MAP } from '~/data/chapters'
import { PART_MAP } from '~/data/chapters/parts'
import { getQuizForChapter } from '~/data/quizzes'
import type { FlashcardState, ReviewQuality } from '~/types/flashcard'
import type { ReviewCard } from '~/stores/spaced-repetition'

useHead({ title: 'Review — ML Systems Universe' })
useSeoMeta({
  title: 'Review — ML Systems Universe',
  description: 'Spaced repetition review for ML Systems glossary terms and quiz questions.',
})

// ── Stores ────────────────────────────────────────────────────────────
const flashcardStore = useFlashcardStore()
const spacedRepStore = useSpacedRepetitionStore()
const { celebrateStreak } = useCelebration()

// ── Tab system ────────────────────────────────────────────────────────
const activeTab = ref<'flashcards' | 'spaced'>('spaced')

// ── Loading ───────────────────────────────────────────────────────────
const loaded = ref(false)

onMounted(async () => {
  await loadAllChapterContent()
  for (const ch of CHAPTERS) {
    const content = getChapterContent(ch.id)
    if (content?.glossary) {
      flashcardStore.addChapterTerms(ch.id, content.glossary)
    }
  }
  loaded.value = true
})

// ═══════════════════════════════════════════════════════════════════════
// FLASHCARD TAB (original logic, unchanged)
// ═══════════════════════════════════════════════════════════════════════
const fcReviewing = ref(false)
const fcShowAnswer = ref(false)
const fcCurrentIndex = ref(0)
const fcSessionCards = ref<FlashcardState[]>([])
const fcSessionCorrect = ref(0)
const fcSessionIncorrect = ref(0)
const fcSessionDone = ref(false)

const fcDueCards = computed(() => flashcardStore.getDueCards)
const fcDueByChapter = computed(() => flashcardStore.getDueCountByChapter)

const fcCurrentCard = computed(() =>
  fcSessionCards.value[fcCurrentIndex.value] ?? null
)
const fcCurrentChapter = computed(() =>
  fcCurrentCard.value ? CHAPTER_MAP[fcCurrentCard.value.chapterId] : null
)
const fcCurrentPartColor = computed(() => {
  if (!fcCurrentChapter.value) return '#14b8a6'
  return PART_MAP[fcCurrentChapter.value.partId]?.color ?? '#14b8a6'
})

function fcStartReview(chapterId?: string) {
  let cards = fcDueCards.value
  if (chapterId) {
    cards = cards.filter(c => c.chapterId === chapterId)
  }
  fcSessionCards.value = [...cards].sort(() => Math.random() - 0.5).slice(0, 20)
  fcCurrentIndex.value = 0
  fcSessionCorrect.value = 0
  fcSessionIncorrect.value = 0
  fcSessionDone.value = false
  fcShowAnswer.value = false
  fcReviewing.value = true
}

function fcReveal() {
  fcShowAnswer.value = true
}

function fcRate(quality: ReviewQuality) {
  if (!fcCurrentCard.value) return
  flashcardStore.reviewCard(fcCurrentCard.value.termKey, quality)
  if (quality >= 3) fcSessionCorrect.value++
  else fcSessionIncorrect.value++
  if (fcCurrentIndex.value < fcSessionCards.value.length - 1) {
    fcCurrentIndex.value++
    fcShowAnswer.value = false
  } else {
    fcSessionDone.value = true
    if (flashcardStore.streak > 3) {
      celebrateStreak(flashcardStore.streak)
    }
  }
}

function fcEndSession() {
  fcReviewing.value = false
  fcSessionDone.value = false
}

const fcProgressPercentage = computed(() =>
  fcSessionCards.value.length > 0
    ? Math.round(((fcCurrentIndex.value + (fcSessionDone.value ? 1 : 0)) / fcSessionCards.value.length) * 100)
    : 0
)

// ═══════════════════════════════════════════════════════════════════════
// SPACED REPETITION TAB (quiz wrong answers)
// ═══════════════════════════════════════════════════════════════════════
const srReviewing = ref(false)
const srShowAnswer = ref(false)
const srSelectedAnswer = ref<number | null>(null)
const srAnswerRevealed = ref(false)
const srCurrentIndex = ref(0)
const srSessionCards = ref<ReviewCard[]>([])
const srSessionCorrect = ref(0)
const srSessionIncorrect = ref(0)
const srSessionDone = ref(false)

const srStats = computed(() => spacedRepStore.getStats)
const srDueCards = computed(() => spacedRepStore.getDueCards)

const srCurrentCard = computed(() =>
  srSessionCards.value[srCurrentIndex.value] ?? null
)

const srCurrentChapter = computed(() =>
  srCurrentCard.value ? CHAPTER_MAP[srCurrentCard.value.chapterId] : null
)

const srCurrentPartColor = computed(() => {
  if (!srCurrentChapter.value) return '#14b8a6'
  return PART_MAP[srCurrentChapter.value.partId]?.color ?? '#14b8a6'
})

// Resolve quiz question data for current spaced rep card
const srCurrentQuestion = computed(() => {
  const card = srCurrentCard.value
  if (!card || card.type !== 'quiz' || !card.questionId) return null
  const quiz = getQuizForChapter(card.chapterId)
  if (!quiz) return null
  return quiz.pool.find(q => q.id === card.questionId) ?? null
})

// Resolve flashcard data for current spaced rep card
const srCurrentFlashcard = computed(() => {
  const card = srCurrentCard.value
  if (!card || card.type !== 'flashcard' || card.flashcardIndex === undefined) return null
  const content = getChapterContent(card.chapterId)
  if (!content?.glossary) return null
  return content.glossary[card.flashcardIndex] ?? null
})

function srStartReview(chapterId?: string) {
  let cards = srDueCards.value
  if (chapterId) {
    cards = cards.filter(c => c.chapterId === chapterId)
  }
  const target = spacedRepStore.dailyTarget
  srSessionCards.value = [...cards].sort(() => Math.random() - 0.5).slice(0, target)
  srCurrentIndex.value = 0
  srSessionCorrect.value = 0
  srSessionIncorrect.value = 0
  srSessionDone.value = false
  srShowAnswer.value = false
  srSelectedAnswer.value = null
  srAnswerRevealed.value = false
  srReviewing.value = true
}

function srSelectOption(index: number) {
  if (srAnswerRevealed.value) return
  srSelectedAnswer.value = index
}

function srCheckAnswer() {
  if (srSelectedAnswer.value === null || !srCurrentQuestion.value) return
  srAnswerRevealed.value = true
}

function srRevealFlashcard() {
  srShowAnswer.value = true
}

function srRateAndAdvance(quality: number) {
  if (!srCurrentCard.value) return
  spacedRepStore.recordReview(srCurrentCard.value.id, quality)

  if (quality >= 3) srSessionCorrect.value++
  else srSessionIncorrect.value++

  if (srCurrentIndex.value < srSessionCards.value.length - 1) {
    srCurrentIndex.value++
    srShowAnswer.value = false
    srSelectedAnswer.value = null
    srAnswerRevealed.value = false
  } else {
    srSessionDone.value = true
  }
}

function srEndSession() {
  srReviewing.value = false
  srSessionDone.value = false
}

const srProgressPercentage = computed(() =>
  srSessionCards.value.length > 0
    ? Math.round(((srCurrentIndex.value + (srSessionDone.value ? 1 : 0)) / srSessionCards.value.length) * 100)
    : 0
)

// Due count per chapter for spaced rep
const srDueByChapter = computed(() => {
  const map: Record<string, number> = {}
  for (const card of srDueCards.value) {
    map[card.chapterId] = (map[card.chapterId] ?? 0) + 1
  }
  return map
})
</script>

<template>
  <div id="main-content" class="min-h-screen bg-cosmic-bg">
    <!-- Back link -->
    <div class="fixed top-3 left-4 z-50">
      <NuxtLink
        to="/"
        class="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors"
        aria-label="Back to home"
      >
        <ArrowLeft class="w-3.5 h-3.5" />
        <span class="hidden sm:inline">Home</span>
      </NuxtLink>
    </div>

    <div class="max-w-2xl mx-auto px-6 py-16">
      <!-- Header -->
      <div class="flex items-center gap-3 mb-8">
        <div class="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/10">
          <Brain class="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 class="text-xl font-display font-bold text-white">Spaced Repetition Review</h1>
          <p class="text-xs text-white/40">Master ML concepts through active recall</p>
        </div>
      </div>

      <!-- Tab switcher -->
      <div class="flex gap-1 p-1 rounded-xl bg-white/[0.04] mb-8">
        <button
          class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-medium transition-all"
          :class="activeTab === 'spaced'
            ? 'bg-primary/15 text-primary'
            : 'text-white/40 hover:text-white/60 hover:bg-white/[0.04]'"
          @click="activeTab = 'spaced'; srEndSession()"
        >
          <AlertCircle class="w-3.5 h-3.5" />
          Spaced Review
          <span
            v-if="srStats.dueToday > 0"
            class="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-primary/20 text-primary"
          >
            {{ srStats.dueToday }}
          </span>
        </button>
        <button
          class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-medium transition-all"
          :class="activeTab === 'flashcards'
            ? 'bg-primary/15 text-primary'
            : 'text-white/40 hover:text-white/60 hover:bg-white/[0.04]'"
          @click="activeTab = 'flashcards'; fcEndSession()"
        >
          <BookOpen class="w-3.5 h-3.5" />
          Flashcards
          <span
            v-if="flashcardStore.getTotalDue > 0"
            class="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-primary/20 text-primary"
          >
            {{ flashcardStore.getTotalDue }}
          </span>
        </button>
      </div>

      <!-- Loading state -->
      <div v-if="!loaded" class="flex items-center justify-center py-20">
        <div class="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>

      <!-- ════════════════════════════════════════════════════════════════ -->
      <!-- SPACED REPETITION TAB                                          -->
      <!-- ════════════════════════════════════════════════════════════════ -->
      <template v-else-if="activeTab === 'spaced'">

        <!-- SR: Review session in progress -->
        <template v-if="srReviewing && !srSessionDone">
          <!-- Progress bar -->
          <div class="mb-6">
            <div class="flex justify-between items-center mb-1.5">
              <span class="text-[10px] text-white/30">
                {{ srCurrentIndex + 1 }} of {{ srSessionCards.length }} reviewed
              </span>
              <span class="text-[10px] font-semibold text-primary">{{ srProgressPercentage }}%</span>
            </div>
            <div class="h-1 rounded-full bg-white/[0.06] overflow-hidden">
              <div
                class="h-full rounded-full bg-primary transition-all duration-300"
                :style="{ width: `${srProgressPercentage}%` }"
              />
            </div>
          </div>

          <!-- Quiz question card -->
          <div
            v-if="srCurrentCard && srCurrentCard.type === 'quiz' && srCurrentQuestion"
            class="glass-panel rounded-2xl p-8 relative overflow-hidden"
          >
            <!-- Part color accent -->
            <div
              class="absolute top-0 left-0 right-0 h-[2px]"
              :style="{ background: `linear-gradient(90deg, ${srCurrentPartColor}, transparent)` }"
            />

            <!-- Chapter badge -->
            <div class="mb-4 flex items-center gap-2">
              <span
                class="text-[10px] px-2 py-0.5 rounded-full"
                :style="{ backgroundColor: `${srCurrentPartColor}15`, color: srCurrentPartColor }"
              >
                Ch.{{ srCurrentChapter?.number }} — {{ srCurrentChapter?.title }}
              </span>
              <span class="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400">
                Quiz Review
              </span>
            </div>

            <!-- Question text -->
            <p class="text-[15px] font-medium text-white/90 leading-relaxed mb-5">
              {{ srCurrentQuestion.question }}
            </p>

            <!-- Options -->
            <div class="space-y-2 mb-4">
              <button
                v-for="(option, oIdx) in srCurrentQuestion.options"
                :key="oIdx"
                class="w-full text-left px-4 py-3 rounded-xl text-sm transition-all duration-200 flex items-start gap-3"
                :class="{
                  'bg-white/[0.04] hover:bg-white/[0.08] text-white/70': !srAnswerRevealed && srSelectedAnswer !== oIdx,
                  'bg-primary/10 text-white border border-primary/30': !srAnswerRevealed && srSelectedAnswer === oIdx,
                  'bg-green-500/10 text-green-400 border border-green-500/20': srAnswerRevealed && oIdx === srCurrentQuestion.correctIndex,
                  'bg-red-500/10 text-red-400 border border-red-500/20': srAnswerRevealed && oIdx === srSelectedAnswer && oIdx !== srCurrentQuestion.correctIndex,
                  'opacity-40': srAnswerRevealed && oIdx !== srCurrentQuestion.correctIndex && oIdx !== srSelectedAnswer,
                }"
                :disabled="srAnswerRevealed"
                @click="srSelectOption(oIdx)"
              >
                <span
                  class="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold border border-white/10"
                >
                  <CheckCircle2 v-if="srAnswerRevealed && oIdx === srCurrentQuestion.correctIndex" class="w-3.5 h-3.5 text-green-400" />
                  <XCircle v-else-if="srAnswerRevealed && oIdx === srSelectedAnswer && oIdx !== srCurrentQuestion.correctIndex" class="w-3.5 h-3.5 text-red-400" />
                  <template v-else>{{ String.fromCharCode(65 + oIdx) }}</template>
                </span>
                <span class="pt-0.5">{{ option }}</span>
              </button>
            </div>

            <!-- Check answer button -->
            <div v-if="!srAnswerRevealed" class="flex justify-end">
              <button
                class="px-6 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-25 disabled:cursor-not-allowed"
                :style="{
                  backgroundColor: srSelectedAnswer !== null ? `${srCurrentPartColor}20` : 'rgba(255,255,255,0.05)',
                  color: srSelectedAnswer !== null ? srCurrentPartColor : 'rgba(255,255,255,0.3)',
                }"
                :disabled="srSelectedAnswer === null"
                @click="srCheckAnswer"
              >
                Check Answer
              </button>
            </div>

            <!-- Explanation + rating -->
            <div v-if="srAnswerRevealed">
              <div
                class="rounded-xl p-4 text-sm leading-relaxed mb-5"
                :class="srSelectedAnswer === srCurrentQuestion.correctIndex
                  ? 'bg-green-500/[0.06] border border-green-500/10'
                  : 'bg-red-500/[0.06] border border-red-500/10'"
              >
                <p :class="srSelectedAnswer === srCurrentQuestion.correctIndex ? 'text-green-400/70' : 'text-red-400/70'">
                  {{ srCurrentQuestion.explanation }}
                </p>
              </div>

              <!-- SM-2 rating buttons -->
              <p class="text-[10px] text-white/30 mb-2">How difficult was this?</p>
              <div class="grid grid-cols-4 gap-2">
                <button
                  class="flex flex-col items-center gap-1 py-2.5 rounded-lg bg-red-500/10 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-colors"
                  @click="srRateAndAdvance(0)"
                >
                  <XCircle class="w-4 h-4" />
                  Again
                </button>
                <button
                  class="flex flex-col items-center gap-1 py-2.5 rounded-lg bg-amber-500/10 text-amber-400 text-xs font-medium hover:bg-amber-500/20 transition-colors"
                  @click="srRateAndAdvance(3)"
                >
                  <Lightbulb class="w-4 h-4" />
                  Hard
                </button>
                <button
                  class="flex flex-col items-center gap-1 py-2.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
                  @click="srRateAndAdvance(4)"
                >
                  <CheckCircle2 class="w-4 h-4" />
                  Good
                </button>
                <button
                  class="flex flex-col items-center gap-1 py-2.5 rounded-lg bg-green-500/10 text-green-400 text-xs font-medium hover:bg-green-500/20 transition-colors"
                  @click="srRateAndAdvance(5)"
                >
                  <Trophy class="w-4 h-4" />
                  Easy
                </button>
              </div>
            </div>
          </div>

          <!-- Flashcard review card -->
          <div
            v-else-if="srCurrentCard && srCurrentCard.type === 'flashcard' && srCurrentFlashcard"
            class="glass-panel rounded-2xl p-8 relative overflow-hidden"
          >
            <div
              class="absolute top-0 left-0 right-0 h-[2px]"
              :style="{ background: `linear-gradient(90deg, ${srCurrentPartColor}, transparent)` }"
            />

            <div class="mb-4 flex items-center gap-2">
              <span
                class="text-[10px] px-2 py-0.5 rounded-full"
                :style="{ backgroundColor: `${srCurrentPartColor}15`, color: srCurrentPartColor }"
              >
                Ch.{{ srCurrentChapter?.number }} — {{ srCurrentChapter?.title }}
              </span>
              <span class="text-[9px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400">
                Flashcard
              </span>
            </div>

            <h2 class="text-lg font-display font-bold text-white mb-6">
              {{ srCurrentFlashcard.term }}
            </h2>

            <div v-if="!srShowAnswer" class="text-center py-6">
              <button
                class="px-6 py-2.5 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
                @click="srRevealFlashcard"
              >
                Show Definition
              </button>
            </div>

            <div v-else>
              <div class="border-t border-white/[0.06] pt-4 mb-6">
                <p class="text-sm text-white/70 leading-relaxed">
                  {{ srCurrentFlashcard.definition }}
                </p>
              </div>

              <p class="text-[10px] text-white/30 mb-2">How well did you know this?</p>
              <div class="grid grid-cols-4 gap-2">
                <button
                  class="flex flex-col items-center gap-1 py-2.5 rounded-lg bg-red-500/10 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-colors"
                  @click="srRateAndAdvance(0)"
                >
                  <XCircle class="w-4 h-4" />
                  Again
                </button>
                <button
                  class="flex flex-col items-center gap-1 py-2.5 rounded-lg bg-amber-500/10 text-amber-400 text-xs font-medium hover:bg-amber-500/20 transition-colors"
                  @click="srRateAndAdvance(3)"
                >
                  <Lightbulb class="w-4 h-4" />
                  Hard
                </button>
                <button
                  class="flex flex-col items-center gap-1 py-2.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
                  @click="srRateAndAdvance(4)"
                >
                  <CheckCircle2 class="w-4 h-4" />
                  Good
                </button>
                <button
                  class="flex flex-col items-center gap-1 py-2.5 rounded-lg bg-green-500/10 text-green-400 text-xs font-medium hover:bg-green-500/20 transition-colors"
                  @click="srRateAndAdvance(5)"
                >
                  <Trophy class="w-4 h-4" />
                  Easy
                </button>
              </div>
            </div>
          </div>
        </template>

        <!-- SR: Session complete -->
        <template v-else-if="srSessionDone">
          <div class="glass-panel rounded-2xl p-8 text-center">
            <Trophy class="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 class="text-lg font-display font-bold text-white mb-2">All caught up!</h2>
            <p class="text-sm text-white/45 mb-6">
              {{ srSessionCorrect }} correct, {{ srSessionIncorrect }} to review again
            </p>

            <div class="flex items-center justify-center gap-6 mb-6 text-sm">
              <div class="text-center">
                <div class="text-2xl font-display font-bold text-primary">{{ srStats.totalCards }}</div>
                <div class="text-[10px] text-white/30">Total Cards</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-display font-bold text-green-400">{{ srStats.mastered }}</div>
                <div class="text-[10px] text-white/30">Mastered</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-display font-bold text-amber-400">{{ srStats.learning }}</div>
                <div class="text-[10px] text-white/30">Learning</div>
              </div>
            </div>

            <div class="flex gap-3 justify-center">
              <button
                class="px-4 py-2 rounded-lg bg-white/[0.04] text-white/60 text-xs hover:bg-white/[0.08] transition-colors"
                @click="srEndSession"
              >
                Back to Dashboard
              </button>
              <button
                v-if="srStats.dueToday > 0"
                class="px-4 py-2 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
                @click="srStartReview()"
              >
                Review More ({{ srStats.dueToday }} due)
              </button>
            </div>
          </div>
        </template>

        <!-- SR: Dashboard (not in session) -->
        <template v-else>
          <!-- Stats bar -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            <div class="glass-panel rounded-xl p-4 text-center">
              <div class="text-xl font-display font-bold text-primary">{{ srStats.dueToday }}</div>
              <div class="text-[10px] text-white/30">Due Today</div>
            </div>
            <div class="glass-panel rounded-xl p-4 text-center">
              <div class="text-xl font-display font-bold text-white">{{ srStats.totalCards }}</div>
              <div class="text-[10px] text-white/30">Total Cards</div>
            </div>
            <div class="glass-panel rounded-xl p-4 text-center">
              <div class="text-xl font-display font-bold text-green-400">{{ srStats.mastered }}</div>
              <div class="text-[10px] text-white/30">Mastered</div>
            </div>
            <div class="glass-panel rounded-xl p-4 text-center">
              <div class="text-xl font-display font-bold text-amber-400">{{ srStats.learning }}</div>
              <div class="text-[10px] text-white/30">Learning</div>
            </div>
          </div>

          <!-- Start review button -->
          <div v-if="srStats.dueToday > 0" class="mb-8">
            <button
              class="w-full py-3.5 rounded-xl bg-primary/10 border border-primary/20 text-primary font-display font-bold text-sm hover:bg-primary/20 transition-all flex items-center justify-center gap-2"
              @click="srStartReview()"
            >
              <Brain class="w-4 h-4" />
              Review {{ srStats.dueToday }} Due Cards
              <ChevronRight class="w-4 h-4" />
            </button>
          </div>
          <div v-else class="mb-8 glass-panel rounded-xl p-6 text-center">
            <CheckCircle2 class="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p class="text-sm text-white/50">All caught up! No cards due for review.</p>
            <p class="text-xs text-white/30 mt-1">
              Wrong quiz answers will appear here automatically. Come back after completing a quiz.
            </p>
          </div>

          <!-- Per-chapter breakdown -->
          <h3 class="text-sm font-display font-bold text-white/60 mb-3">By Chapter</h3>
          <div class="space-y-2">
            <div
              v-for="ch in CHAPTERS"
              :key="ch.id"
              class="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white/[0.02] transition-colors"
            >
              <div class="flex items-center gap-2 min-w-0">
                <span class="text-[10px] text-white/25 font-mono w-5">{{ String(ch.number).padStart(2, '0') }}</span>
                <span class="text-xs text-white/50 truncate">{{ ch.title }}</span>
              </div>
              <div class="flex items-center gap-2 flex-shrink-0">
                <span
                  v-if="(srDueByChapter[ch.id] ?? 0) > 0"
                  class="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium"
                >
                  {{ srDueByChapter[ch.id] }} due
                </span>
                <button
                  v-if="(srDueByChapter[ch.id] ?? 0) > 0"
                  class="text-[10px] text-primary/60 hover:text-primary transition-colors"
                  :aria-label="`Review chapter ${ch.number} spaced cards`"
                  @click="srStartReview(ch.id)"
                >
                  <RotateCcw class="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </template>
      </template>

      <!-- ════════════════════════════════════════════════════════════════ -->
      <!-- FLASHCARDS TAB (original, preserved)                           -->
      <!-- ════════════════════════════════════════════════════════════════ -->
      <template v-else-if="activeTab === 'flashcards'">

        <!-- FC: Review session -->
        <template v-if="fcReviewing && !fcSessionDone">
          <div class="mb-6">
            <div class="flex justify-between items-center mb-1.5">
              <span class="text-[10px] text-white/30">
                Card {{ fcCurrentIndex + 1 }} of {{ fcSessionCards.length }}
              </span>
              <span class="text-[10px] font-semibold text-primary">{{ fcProgressPercentage }}%</span>
            </div>
            <div class="h-1 rounded-full bg-white/[0.06] overflow-hidden">
              <div
                class="h-full rounded-full bg-primary transition-all duration-300"
                :style="{ width: `${fcProgressPercentage}%` }"
              />
            </div>
          </div>

          <div
            v-if="fcCurrentCard"
            class="glass-panel rounded-2xl p-8 relative overflow-hidden"
          >
            <div
              class="absolute top-0 left-0 right-0 h-[2px]"
              :style="{ background: `linear-gradient(90deg, ${fcCurrentPartColor}, transparent)` }"
            />
            <div class="mb-4">
              <span
                class="text-[10px] px-2 py-0.5 rounded-full"
                :style="{ backgroundColor: `${fcCurrentPartColor}15`, color: fcCurrentPartColor }"
              >
                Ch.{{ fcCurrentChapter?.number }} — {{ fcCurrentChapter?.title }}
              </span>
            </div>

            <h2 class="text-lg font-display font-bold text-white mb-6">
              {{ fcCurrentCard.term }}
            </h2>

            <div v-if="!fcShowAnswer" class="text-center py-6">
              <button
                class="px-6 py-2.5 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
                @click="fcReveal"
              >
                Show Definition
              </button>
            </div>

            <div v-else>
              <div class="border-t border-white/[0.06] pt-4 mb-6">
                <p class="text-sm text-white/70 leading-relaxed">
                  {{ fcCurrentCard.definition }}
                </p>
              </div>

              <div class="flex flex-col gap-2">
                <p class="text-[10px] text-white/30 mb-1">How well did you know this?</p>
                <div class="grid grid-cols-3 gap-2">
                  <button
                    class="flex flex-col items-center gap-1 py-2.5 rounded-lg bg-red-500/10 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-colors"
                    @click="fcRate(1)"
                  >
                    <XCircle class="w-4 h-4" />
                    Forgot
                  </button>
                  <button
                    class="flex flex-col items-center gap-1 py-2.5 rounded-lg bg-amber-500/10 text-amber-400 text-xs font-medium hover:bg-amber-500/20 transition-colors"
                    @click="fcRate(3)"
                  >
                    <Lightbulb class="w-4 h-4" />
                    Hard
                  </button>
                  <button
                    class="flex flex-col items-center gap-1 py-2.5 rounded-lg bg-green-500/10 text-green-400 text-xs font-medium hover:bg-green-500/20 transition-colors"
                    @click="fcRate(5)"
                  >
                    <CheckCircle2 class="w-4 h-4" />
                    Easy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- FC: Session complete -->
        <template v-else-if="fcSessionDone">
          <div class="glass-panel rounded-2xl p-8 text-center">
            <Trophy class="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 class="text-lg font-display font-bold text-white mb-2">Session Complete!</h2>
            <p class="text-sm text-white/45 mb-6">
              {{ fcSessionCorrect }} correct, {{ fcSessionIncorrect }} to review again
            </p>

            <div class="flex items-center justify-center gap-6 mb-6 text-sm">
              <div class="text-center">
                <div class="text-2xl font-display font-bold text-primary">{{ flashcardStore.streak }}</div>
                <div class="text-[10px] text-white/30 flex items-center gap-1">
                  <Flame class="w-3 h-3 text-amber-400" /> Day streak
                </div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-display font-bold text-white">{{ flashcardStore.getCardCount }}</div>
                <div class="text-[10px] text-white/30">Total terms</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-display font-bold text-green-400">{{ flashcardStore.getMasteredCount }}</div>
                <div class="text-[10px] text-white/30">Mastered</div>
              </div>
            </div>

            <div class="flex gap-3 justify-center">
              <button
                class="px-4 py-2 rounded-lg bg-white/[0.04] text-white/60 text-xs hover:bg-white/[0.08] transition-colors"
                @click="fcEndSession"
              >
                Back to Review
              </button>
              <button
                v-if="flashcardStore.getTotalDue > 0"
                class="px-4 py-2 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
                @click="fcStartReview()"
              >
                Review More ({{ flashcardStore.getTotalDue }} due)
              </button>
            </div>
          </div>
        </template>

        <!-- FC: Dashboard -->
        <template v-else>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            <div class="glass-panel rounded-xl p-4 text-center">
              <div class="text-xl font-display font-bold text-primary">{{ flashcardStore.getTotalDue }}</div>
              <div class="text-[10px] text-white/30">Due Today</div>
            </div>
            <div class="glass-panel rounded-xl p-4 text-center">
              <div class="text-xl font-display font-bold text-white">{{ flashcardStore.getCardCount }}</div>
              <div class="text-[10px] text-white/30">Total Terms</div>
            </div>
            <div class="glass-panel rounded-xl p-4 text-center">
              <div class="text-xl font-display font-bold text-green-400">{{ flashcardStore.getMasteredCount }}</div>
              <div class="text-[10px] text-white/30">Mastered</div>
            </div>
            <div class="glass-panel rounded-xl p-4 text-center">
              <div class="text-xl font-display font-bold text-amber-400 flex items-center justify-center gap-1">
                {{ flashcardStore.streak }} <Flame class="w-4 h-4" />
              </div>
              <div class="text-[10px] text-white/30">Streak</div>
            </div>
          </div>

          <div v-if="flashcardStore.getTotalDue > 0" class="mb-8">
            <button
              class="w-full py-3.5 rounded-xl bg-primary/10 border border-primary/20 text-primary font-display font-bold text-sm hover:bg-primary/20 transition-all flex items-center justify-center gap-2"
              @click="fcStartReview()"
            >
              <Brain class="w-4 h-4" />
              Review {{ flashcardStore.getTotalDue }} Due Cards
              <ChevronRight class="w-4 h-4" />
            </button>
          </div>
          <div v-else class="mb-8 glass-panel rounded-xl p-6 text-center">
            <CheckCircle2 class="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p class="text-sm text-white/50">All caught up! No cards due for review.</p>
            <p class="text-xs text-white/30 mt-1">Come back tomorrow for your next review session.</p>
          </div>

          <h3 class="text-sm font-display font-bold text-white/60 mb-3">By Chapter</h3>
          <div class="space-y-2">
            <div
              v-for="ch in CHAPTERS"
              :key="ch.id"
              class="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white/[0.02] transition-colors"
            >
              <div class="flex items-center gap-2 min-w-0">
                <span class="text-[10px] text-white/25 font-mono w-5">{{ String(ch.number).padStart(2, '0') }}</span>
                <span class="text-xs text-white/50 truncate">{{ ch.title }}</span>
              </div>
              <div class="flex items-center gap-2 flex-shrink-0">
                <span
                  v-if="(fcDueByChapter[ch.id] ?? 0) > 0"
                  class="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium"
                >
                  {{ fcDueByChapter[ch.id] }} due
                </span>
                <button
                  v-if="(fcDueByChapter[ch.id] ?? 0) > 0"
                  class="text-[10px] text-primary/60 hover:text-primary transition-colors"
                  :aria-label="`Review chapter ${ch.number} terms`"
                  @click="fcStartReview(ch.id)"
                >
                  <RotateCcw class="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>
