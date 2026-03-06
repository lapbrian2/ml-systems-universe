import { defineStore } from 'pinia'

// ── SM-2 algorithm helpers ────────────────────────────────────────────

function todayISO(): string {
  return new Date().toISOString().split('T')[0]!
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]!
}

function isDueOnOrBefore(nextReviewDate: string, referenceDate: string): boolean {
  return nextReviewDate <= referenceDate
}

function computeSM2(
  quality: number,
  repetitions: number,
  interval: number,
  easeFactor: number,
): { interval: number; repetitions: number; easeFactor: number } {
  // Clamp quality to 0-5
  const q = Math.max(0, Math.min(5, quality))

  // New ease factor (never below 1.3)
  let newEF = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  if (newEF < 1.3) newEF = 1.3

  if (q < 3) {
    // Failed review: reset repetitions, show again in 1 day
    return { interval: 1, repetitions: 0, easeFactor: newEF }
  }

  let newInterval: number
  if (repetitions === 0) {
    newInterval = 1
  } else if (repetitions === 1) {
    newInterval = 6
  } else {
    newInterval = Math.round(interval * newEF)
  }

  return {
    interval: newInterval,
    repetitions: repetitions + 1,
    easeFactor: newEF,
  }
}

// ── Types ─────────────────────────────────────────────────────────────

export interface ReviewCard {
  id: string               // "quiz:{chapterId}:{questionId}" or "flashcard:{chapterId}:{index}"
  type: 'quiz' | 'flashcard'
  chapterId: string
  questionId?: string      // quiz questions
  flashcardIndex?: number  // flashcards

  // SM-2 scheduling
  easeFactor: number
  interval: number         // days until next review
  repetitions: number      // consecutive correct reviews
  nextReviewDate: string   // ISO date string (YYYY-MM-DD)
  lastReviewDate: string

  // Lifetime stats
  totalReviews: number
  correctCount: number
}

// ── Store ─────────────────────────────────────────────────────────────

export const useSpacedRepetitionStore = defineStore('spaced-repetition', {
  state: () => ({
    cards: {} as Record<string, ReviewCard>,
    dailyTarget: 10,
  }),

  getters: {
    getDueCards: (state): ReviewCard[] => {
      const now = todayISO()
      return Object.values(state.cards).filter(c => isDueOnOrBefore(c.nextReviewDate, now))
    },

    getDueCardsForChapter: (state) => (chapterId: string): ReviewCard[] => {
      const now = todayISO()
      return Object.values(state.cards).filter(
        c => c.chapterId === chapterId && isDueOnOrBefore(c.nextReviewDate, now),
      )
    },

    getStats: (state): { totalCards: number; dueToday: number; mastered: number; learning: number } => {
      const now = todayISO()
      const all = Object.values(state.cards)
      const dueToday = all.filter(c => isDueOnOrBefore(c.nextReviewDate, now)).length
      const mastered = all.filter(c => c.repetitions >= 5).length
      const learning = all.length - mastered
      return { totalCards: all.length, dueToday, mastered, learning }
    },

    getDueCountForChapter: (state) => (chapterId: string): number => {
      const now = todayISO()
      return Object.values(state.cards).filter(
        c => c.chapterId === chapterId && isDueOnOrBefore(c.nextReviewDate, now),
      ).length
    },
  },

  actions: {
    recordReview(cardId: string, quality: number): void {
      const card = this.cards[cardId]
      if (!card) return

      const result = computeSM2(quality, card.repetitions, card.interval, card.easeFactor)

      card.easeFactor = result.easeFactor
      card.interval = result.interval
      card.repetitions = result.repetitions
      card.nextReviewDate = addDays(todayISO(), result.interval)
      card.lastReviewDate = todayISO()
      card.totalReviews++
      if (quality >= 3) {
        card.correctCount++
      }
    },

    addQuizCard(chapterId: string, questionId: string): void {
      const id = `quiz:${chapterId}:${questionId}`
      if (this.cards[id]) {
        // Card exists already. If it was previously mastered, reset scheduling
        // so it comes back for review soon.
        if (this.cards[id].repetitions >= 3) {
          this.cards[id].interval = 1
          this.cards[id].repetitions = 0
          this.cards[id].nextReviewDate = todayISO()
        }
        return
      }

      this.cards[id] = {
        id,
        type: 'quiz',
        chapterId,
        questionId,
        easeFactor: 2.5,
        interval: 0,
        repetitions: 0,
        nextReviewDate: todayISO(),
        lastReviewDate: '',
        totalReviews: 0,
        correctCount: 0,
      }
    },

    addFlashcard(chapterId: string, index: number): void {
      const id = `flashcard:${chapterId}:${index}`
      if (this.cards[id]) return

      this.cards[id] = {
        id,
        type: 'flashcard',
        chapterId,
        flashcardIndex: index,
        easeFactor: 2.5,
        interval: 0,
        repetitions: 0,
        nextReviewDate: todayISO(),
        lastReviewDate: '',
        totalReviews: 0,
        correctCount: 0,
      }
    },

    removeCard(cardId: string): void {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete this.cards[cardId]
    },

    setDailyTarget(target: number): void {
      this.dailyTarget = Math.max(1, Math.min(50, target))
    },
  },

  persist: true,
})
