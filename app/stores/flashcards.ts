import { defineStore } from 'pinia'
import type { FlashcardState, ReviewQuality } from '~/types/flashcard'

function today(): string {
  return new Date().toISOString().split('T')[0]
}

function addDays(date: string, days: number): string {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

/**
 * SM-2 algorithm: compute next interval, repetition count, and ease factor.
 */
function sm2(
  quality: ReviewQuality,
  repetition: number,
  interval: number,
  easeFactor: number,
): { interval: number; repetition: number; easeFactor: number } {
  let newEF = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  if (newEF < 1.3) newEF = 1.3

  if (quality < 3) {
    // Failed — reset
    return { interval: 1, repetition: 0, easeFactor: newEF }
  }

  let newInterval: number
  if (repetition === 0) {
    newInterval = 1
  } else if (repetition === 1) {
    newInterval = 6
  } else {
    newInterval = Math.round(interval * newEF)
  }

  return {
    interval: newInterval,
    repetition: repetition + 1,
    easeFactor: newEF,
  }
}

export const useFlashcardStore = defineStore('flashcards', {
  state: () => ({
    cards: {} as Record<string, FlashcardState>,
    totalReviews: 0,
    streak: 0,
    lastReviewDate: '',
  }),

  getters: {
    getDueCards: (state): FlashcardState[] => {
      const now = today()
      return Object.values(state.cards).filter(c => c.nextReviewAt <= now)
    },

    getDueCountByChapter: (state): Record<string, number> => {
      const now = today()
      const map: Record<string, number> = {}
      for (const card of Object.values(state.cards)) {
        if (card.nextReviewAt <= now) {
          map[card.chapterId] = (map[card.chapterId] ?? 0) + 1
        }
      }
      return map
    },

    getTotalDue: (state): number => {
      const now = today()
      return Object.values(state.cards).filter(c => c.nextReviewAt <= now).length
    },

    getCardCount: (state): number => {
      return Object.keys(state.cards).length
    },

    getMasteredCount: (state): number => {
      return Object.values(state.cards).filter(c => c.repetition >= 5).length
    },
  },

  actions: {
    addCard(chapterId: string, term: string, definition: string) {
      const key = `${chapterId}::${term}`
      if (this.cards[key]) return // already exists

      this.cards[key] = {
        termKey: key,
        chapterId,
        term,
        definition,
        interval: 0,
        repetition: 0,
        easeFactor: 2.5,
        nextReviewAt: today(),
      }
    },

    addChapterTerms(chapterId: string, terms: Array<{ term: string; definition: string }>) {
      for (const t of terms) {
        this.addCard(chapterId, t.term, t.definition)
      }
    },

    reviewCard(termKey: string, quality: ReviewQuality) {
      const card = this.cards[termKey]
      if (!card) return

      const result = sm2(quality, card.repetition, card.interval, card.easeFactor)
      card.interval = result.interval
      card.repetition = result.repetition
      card.easeFactor = result.easeFactor
      card.nextReviewAt = addDays(today(), result.interval)
      card.lastReviewedAt = new Date().toISOString()

      this.totalReviews++

      // Update streak
      const currentDate = today()
      if (this.lastReviewDate === currentDate) {
        // same day, streak continues
      } else {
        const yesterday = addDays(currentDate, -1)
        if (this.lastReviewDate === yesterday) {
          this.streak++
        } else if (this.lastReviewDate !== currentDate) {
          this.streak = 1
        }
      }
      this.lastReviewDate = currentDate
    },

    removeChapterCards(chapterId: string) {
      for (const key of Object.keys(this.cards)) {
        if (key.startsWith(`${chapterId}::`)) {
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
          delete this.cards[key]
        }
      }
    },
  },

  persist: true,
})
