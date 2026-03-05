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
} from 'lucide-vue-next'
import { useFlashcardStore } from '~/stores/flashcards'
import { loadAllChapterContent, getChapterContent } from '~/data/content'
import { CHAPTERS, CHAPTER_MAP } from '~/data/chapters'
import { PART_MAP } from '~/data/chapters/parts'
import type { FlashcardState, ReviewQuality } from '~/types/flashcard'

useHead({ title: 'Review — ML Systems Universe' })
useSeoMeta({
  title: 'Review — ML Systems Universe',
  description: 'Spaced repetition flashcard review for ML Systems glossary terms.',
})

const store = useFlashcardStore()
const loaded = ref(false)
const reviewing = ref(false)
const showAnswer = ref(false)
const currentIndex = ref(0)
const sessionCards = ref<FlashcardState[]>([])
const sessionCorrect = ref(0)
const sessionIncorrect = ref(0)
const sessionDone = ref(false)

// Load all content and populate flashcard store with glossary terms
onMounted(async () => {
  await loadAllChapterContent()
  for (const ch of CHAPTERS) {
    const content = getChapterContent(ch.id)
    if (content?.glossary) {
      store.addChapterTerms(ch.id, content.glossary)
    }
  }
  loaded.value = true
})

const dueCards = computed(() => store.getDueCards)
const dueByChapter = computed(() => store.getDueCountByChapter)

const currentCard = computed(() =>
  sessionCards.value[currentIndex.value] ?? null
)

const currentChapter = computed(() =>
  currentCard.value ? CHAPTER_MAP[currentCard.value.chapterId] : null
)

const currentPartColor = computed(() => {
  if (!currentChapter.value) return '#14b8a6'
  return PART_MAP[currentChapter.value.partId]?.color ?? '#14b8a6'
})

function startReview(chapterId?: string) {
  let cards = dueCards.value
  if (chapterId) {
    cards = cards.filter(c => c.chapterId === chapterId)
  }
  // Shuffle
  sessionCards.value = [...cards].sort(() => Math.random() - 0.5).slice(0, 20)
  currentIndex.value = 0
  sessionCorrect.value = 0
  sessionIncorrect.value = 0
  sessionDone.value = false
  showAnswer.value = false
  reviewing.value = true
}

function reveal() {
  showAnswer.value = true
}

function rate(quality: ReviewQuality) {
  if (!currentCard.value) return
  store.reviewCard(currentCard.value.termKey, quality)

  if (quality >= 3) sessionCorrect.value++
  else sessionIncorrect.value++

  // Next card or finish
  if (currentIndex.value < sessionCards.value.length - 1) {
    currentIndex.value++
    showAnswer.value = false
  } else {
    sessionDone.value = true
  }
}

function endSession() {
  reviewing.value = false
  sessionDone.value = false
}

const progressPercentage = computed(() =>
  sessionCards.value.length > 0
    ? Math.round(((currentIndex.value + (sessionDone.value ? 1 : 0)) / sessionCards.value.length) * 100)
    : 0
)
</script>

<template>
  <div class="min-h-screen bg-cosmic-bg">
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
          <p class="text-xs text-white/40">Master ML terminology with active recall</p>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="!loaded" class="flex items-center justify-center py-20">
        <div class="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>

      <!-- Review session -->
      <template v-else-if="reviewing && !sessionDone">
        <!-- Progress bar -->
        <div class="mb-6">
          <div class="flex justify-between items-center mb-1.5">
            <span class="text-[10px] text-white/30">
              Card {{ currentIndex + 1 }} of {{ sessionCards.length }}
            </span>
            <span class="text-[10px] font-semibold text-primary">{{ progressPercentage }}%</span>
          </div>
          <div class="h-1 rounded-full bg-white/[0.06] overflow-hidden">
            <div
              class="h-full rounded-full bg-primary transition-all duration-300"
              :style="{ width: `${progressPercentage}%` }"
            />
          </div>
        </div>

        <!-- Flashcard -->
        <div
          v-if="currentCard"
          class="glass-panel rounded-2xl p-8 relative overflow-hidden"
        >
          <!-- Part color accent -->
          <div
            class="absolute top-0 left-0 right-0 h-[2px]"
            :style="{ background: `linear-gradient(90deg, ${currentPartColor}, transparent)` }"
          />

          <!-- Chapter badge -->
          <div class="mb-4">
            <span
              class="text-[10px] px-2 py-0.5 rounded-full"
              :style="{
                backgroundColor: `${currentPartColor}15`,
                color: currentPartColor,
              }"
            >
              Ch.{{ currentChapter?.number }} — {{ currentChapter?.title }}
            </span>
          </div>

          <!-- Term -->
          <h2 class="text-lg font-display font-bold text-white mb-6">
            {{ currentCard.term }}
          </h2>

          <!-- Hidden answer -->
          <div v-if="!showAnswer" class="text-center py-6">
            <button
              class="px-6 py-2.5 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
              @click="reveal"
            >
              Show Definition
            </button>
          </div>

          <!-- Revealed answer -->
          <div v-else>
            <div class="border-t border-white/[0.06] pt-4 mb-6">
              <p class="text-sm text-white/70 leading-relaxed">
                {{ currentCard.definition }}
              </p>
            </div>

            <!-- Rating buttons -->
            <div class="flex flex-col gap-2">
              <p class="text-[10px] text-white/30 mb-1">How well did you know this?</p>
              <div class="grid grid-cols-3 gap-2">
                <button
                  class="flex flex-col items-center gap-1 py-2.5 rounded-lg bg-red-500/10 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-colors"
                  @click="rate(1)"
                >
                  <XCircle class="w-4 h-4" />
                  Forgot
                </button>
                <button
                  class="flex flex-col items-center gap-1 py-2.5 rounded-lg bg-amber-500/10 text-amber-400 text-xs font-medium hover:bg-amber-500/20 transition-colors"
                  @click="rate(3)"
                >
                  <Lightbulb class="w-4 h-4" />
                  Hard
                </button>
                <button
                  class="flex flex-col items-center gap-1 py-2.5 rounded-lg bg-green-500/10 text-green-400 text-xs font-medium hover:bg-green-500/20 transition-colors"
                  @click="rate(5)"
                >
                  <CheckCircle2 class="w-4 h-4" />
                  Easy
                </button>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- Session complete -->
      <template v-else-if="sessionDone">
        <div class="glass-panel rounded-2xl p-8 text-center">
          <Trophy class="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 class="text-lg font-display font-bold text-white mb-2">Session Complete!</h2>
          <p class="text-sm text-white/45 mb-6">
            {{ sessionCorrect }} correct · {{ sessionIncorrect }} to review again
          </p>

          <div class="flex items-center justify-center gap-6 mb-6 text-sm">
            <div class="text-center">
              <div class="text-2xl font-display font-bold text-primary">{{ store.streak }}</div>
              <div class="text-[10px] text-white/30 flex items-center gap-1">
                <Flame class="w-3 h-3 text-amber-400" /> Day streak
              </div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-display font-bold text-white">{{ store.getCardCount }}</div>
              <div class="text-[10px] text-white/30">Total terms</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-display font-bold text-green-400">{{ store.getMasteredCount }}</div>
              <div class="text-[10px] text-white/30">Mastered</div>
            </div>
          </div>

          <div class="flex gap-3 justify-center">
            <button
              class="px-4 py-2 rounded-lg bg-white/[0.04] text-white/60 text-xs hover:bg-white/[0.08] transition-colors"
              @click="endSession"
            >
              Back to Review
            </button>
            <button
              v-if="store.getTotalDue > 0"
              class="px-4 py-2 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
              @click="startReview()"
            >
              Review More ({{ store.getTotalDue }} due)
            </button>
          </div>
        </div>
      </template>

      <!-- Dashboard (not in session) -->
      <template v-else>
        <!-- Stats bar -->
        <div class="grid grid-cols-4 gap-3 mb-8">
          <div class="glass-panel rounded-xl p-4 text-center">
            <div class="text-xl font-display font-bold text-primary">{{ store.getTotalDue }}</div>
            <div class="text-[10px] text-white/30">Due Today</div>
          </div>
          <div class="glass-panel rounded-xl p-4 text-center">
            <div class="text-xl font-display font-bold text-white">{{ store.getCardCount }}</div>
            <div class="text-[10px] text-white/30">Total Terms</div>
          </div>
          <div class="glass-panel rounded-xl p-4 text-center">
            <div class="text-xl font-display font-bold text-green-400">{{ store.getMasteredCount }}</div>
            <div class="text-[10px] text-white/30">Mastered</div>
          </div>
          <div class="glass-panel rounded-xl p-4 text-center">
            <div class="text-xl font-display font-bold text-amber-400 flex items-center justify-center gap-1">
              {{ store.streak }} <Flame class="w-4 h-4" />
            </div>
            <div class="text-[10px] text-white/30">Streak</div>
          </div>
        </div>

        <!-- Start review button -->
        <div v-if="store.getTotalDue > 0" class="mb-8">
          <button
            class="w-full py-3.5 rounded-xl bg-primary/10 border border-primary/20 text-primary font-display font-bold text-sm hover:bg-primary/20 transition-all flex items-center justify-center gap-2"
            @click="startReview()"
          >
            <Brain class="w-4 h-4" />
            Review {{ store.getTotalDue }} Due Cards
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>
        <div v-else class="mb-8 glass-panel rounded-xl p-6 text-center">
          <CheckCircle2 class="w-8 h-8 text-green-400 mx-auto mb-2" />
          <p class="text-sm text-white/50">All caught up! No cards due for review.</p>
          <p class="text-xs text-white/30 mt-1">Come back tomorrow for your next review session.</p>
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
                v-if="(dueByChapter[ch.id] ?? 0) > 0"
                class="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium"
              >
                {{ dueByChapter[ch.id] }} due
              </span>
              <button
                v-if="(dueByChapter[ch.id] ?? 0) > 0"
                class="text-[10px] text-primary/60 hover:text-primary transition-colors"
                :aria-label="`Review chapter ${ch.number} terms`"
                @click="startReview(ch.id)"
              >
                <RotateCcw class="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
