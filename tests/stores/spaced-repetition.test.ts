import { describe, it, expect, beforeEach } from 'vitest'
import { useSpacedRepetitionStore } from '~/stores/spaced-repetition'

describe('useSpacedRepetitionStore', () => {
  let store: ReturnType<typeof useSpacedRepetitionStore>

  beforeEach(() => {
    store = useSpacedRepetitionStore()
  })

  describe('initial state', () => {
    it('starts with empty cards', () => {
      expect(Object.keys(store.cards)).toHaveLength(0)
    })

    it('starts with daily target of 10', () => {
      expect(store.dailyTarget).toBe(10)
    })
  })

  describe('addQuizCard', () => {
    it('creates a new card with default SM-2 values', () => {
      store.addQuizCard('ch01', 'q1')
      const card = store.cards['quiz:ch01:q1']
      expect(card).toBeDefined()
      expect(card.type).toBe('quiz')
      expect(card.chapterId).toBe('ch01')
      expect(card.questionId).toBe('q1')
      expect(card.easeFactor).toBe(2.5)
      expect(card.interval).toBe(0)
      expect(card.repetitions).toBe(0)
      expect(card.totalReviews).toBe(0)
      expect(card.correctCount).toBe(0)
    })

    it('does not duplicate existing cards', () => {
      store.addQuizCard('ch01', 'q1')
      const firstCard = { ...store.cards['quiz:ch01:q1'] }
      store.addQuizCard('ch01', 'q1')
      expect(store.cards['quiz:ch01:q1'].easeFactor).toBe(firstCard.easeFactor)
    })

    it('resets mastered cards for re-review', () => {
      store.addQuizCard('ch01', 'q1')
      // Simulate mastery
      store.cards['quiz:ch01:q1'].repetitions = 3
      store.cards['quiz:ch01:q1'].interval = 30
      store.addQuizCard('ch01', 'q1')
      expect(store.cards['quiz:ch01:q1'].repetitions).toBe(0)
      expect(store.cards['quiz:ch01:q1'].interval).toBe(1)
    })
  })

  describe('addFlashcard', () => {
    it('creates a flashcard card', () => {
      store.addFlashcard('ch01', 0)
      const card = store.cards['flashcard:ch01:0']
      expect(card).toBeDefined()
      expect(card.type).toBe('flashcard')
      expect(card.flashcardIndex).toBe(0)
    })

    it('does not duplicate', () => {
      store.addFlashcard('ch01', 0)
      store.addFlashcard('ch01', 0)
      expect(Object.keys(store.cards)).toHaveLength(1)
    })
  })

  describe('recordReview', () => {
    it('updates card after successful review (quality >= 3)', () => {
      store.addQuizCard('ch01', 'q1')
      store.recordReview('quiz:ch01:q1', 4)
      const card = store.cards['quiz:ch01:q1']
      expect(card.repetitions).toBe(1)
      expect(card.interval).toBe(1) // first successful review => interval 1
      expect(card.totalReviews).toBe(1)
      expect(card.correctCount).toBe(1)
    })

    it('resets repetitions on failed review (quality < 3)', () => {
      store.addQuizCard('ch01', 'q1')
      // Build up some repetitions
      store.recordReview('quiz:ch01:q1', 5)
      store.recordReview('quiz:ch01:q1', 5)
      // Now fail
      store.recordReview('quiz:ch01:q1', 1)
      const card = store.cards['quiz:ch01:q1']
      expect(card.repetitions).toBe(0)
      expect(card.interval).toBe(1)
      expect(card.totalReviews).toBe(3)
      expect(card.correctCount).toBe(2) // only the two successes
    })

    it('does nothing for non-existent card', () => {
      store.recordReview('nonexistent', 5)
      expect(Object.keys(store.cards)).toHaveLength(0)
    })

    it('increases interval with repetitions', () => {
      store.addQuizCard('ch01', 'q1')
      store.recordReview('quiz:ch01:q1', 5) // rep 0 -> interval 1
      store.recordReview('quiz:ch01:q1', 5) // rep 1 -> interval 6
      expect(store.cards['quiz:ch01:q1'].interval).toBe(6)
      store.recordReview('quiz:ch01:q1', 5) // rep 2 -> interval * EF
      expect(store.cards['quiz:ch01:q1'].interval).toBeGreaterThan(6)
    })
  })

  describe('removeCard', () => {
    it('removes the card', () => {
      store.addQuizCard('ch01', 'q1')
      store.removeCard('quiz:ch01:q1')
      expect(store.cards['quiz:ch01:q1']).toBeUndefined()
    })
  })

  describe('getDueCards', () => {
    it('returns cards due today', () => {
      store.addQuizCard('ch01', 'q1')
      store.addQuizCard('ch01', 'q2')
      expect(store.getDueCards).toHaveLength(2)
    })
  })

  describe('getDueCardsForChapter', () => {
    it('filters by chapter', () => {
      store.addQuizCard('ch01', 'q1')
      store.addQuizCard('ch02', 'q1')
      expect(store.getDueCardsForChapter('ch01')).toHaveLength(1)
    })
  })

  describe('getStats', () => {
    it('computes stats correctly', () => {
      store.addQuizCard('ch01', 'q1')
      store.addQuizCard('ch01', 'q2')
      const stats = store.getStats
      expect(stats.totalCards).toBe(2)
      expect(stats.dueToday).toBe(2)
      expect(stats.mastered).toBe(0)
      expect(stats.learning).toBe(2)
    })
  })

  describe('setDailyTarget', () => {
    it('sets target within bounds', () => {
      store.setDailyTarget(20)
      expect(store.dailyTarget).toBe(20)
    })

    it('clamps to minimum of 1', () => {
      store.setDailyTarget(0)
      expect(store.dailyTarget).toBe(1)
    })

    it('clamps to maximum of 50', () => {
      store.setDailyTarget(100)
      expect(store.dailyTarget).toBe(50)
    })

    it('clamps negative values to 1', () => {
      store.setDailyTarget(-5)
      expect(store.dailyTarget).toBe(1)
    })
  })

  describe('getDueCountForChapter', () => {
    it('returns count of due cards for a specific chapter', () => {
      store.addQuizCard('ch01', 'q1')
      store.addQuizCard('ch01', 'q2')
      store.addQuizCard('ch02', 'q1')
      expect(store.getDueCountForChapter('ch01')).toBe(2)
      expect(store.getDueCountForChapter('ch02')).toBe(1)
    })

    it('returns 0 for chapter with no cards', () => {
      expect(store.getDueCountForChapter('ch99')).toBe(0)
    })
  })

  describe('SM-2 algorithm edge cases', () => {
    it('clamps quality to 0-5 range', () => {
      store.addQuizCard('ch01', 'q1')
      // Quality > 5 should be clamped to 5
      store.recordReview('quiz:ch01:q1', 10)
      expect(store.cards['quiz:ch01:q1'].repetitions).toBe(1)
    })

    it('ease factor never drops below 1.3', () => {
      store.addQuizCard('ch01', 'q1')
      // Multiple failures should not drop ease factor below 1.3
      for (let i = 0; i < 10; i++) {
        store.recordReview('quiz:ch01:q1', 0)
      }
      expect(store.cards['quiz:ch01:q1'].easeFactor).toBeGreaterThanOrEqual(1.3)
    })

    it('mastered cards have 5+ repetitions', () => {
      store.addQuizCard('ch01', 'q1')
      for (let i = 0; i < 5; i++) {
        store.recordReview('quiz:ch01:q1', 5)
      }
      expect(store.cards['quiz:ch01:q1'].repetitions).toBe(5)
      expect(store.getStats.mastered).toBe(1)
    })
  })

  describe('mixed card types', () => {
    it('quiz and flashcard cards coexist', () => {
      store.addQuizCard('ch01', 'q1')
      store.addFlashcard('ch01', 0)
      expect(Object.keys(store.cards)).toHaveLength(2)
      expect(store.cards['quiz:ch01:q1'].type).toBe('quiz')
      expect(store.cards['flashcard:ch01:0'].type).toBe('flashcard')
    })
  })
})
