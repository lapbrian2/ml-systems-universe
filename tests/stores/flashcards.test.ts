import { describe, it, expect, beforeEach } from 'vitest'
import { useFlashcardStore } from '~/stores/flashcards'

describe('useFlashcardStore', () => {
  let store: ReturnType<typeof useFlashcardStore>

  beforeEach(() => {
    store = useFlashcardStore()
  })

  describe('initial state', () => {
    it('starts with empty cards', () => {
      expect(Object.keys(store.cards)).toHaveLength(0)
    })

    it('starts with zero total reviews', () => {
      expect(store.totalReviews).toBe(0)
    })

    it('starts with zero streak', () => {
      expect(store.streak).toBe(0)
    })
  })

  describe('addCard', () => {
    it('adds a new flashcard', () => {
      store.addCard('ch01', 'Neural Network', 'A computing system inspired by biological neural networks')
      const card = store.cards['ch01::Neural Network']
      expect(card).toBeDefined()
      expect(card.term).toBe('Neural Network')
      expect(card.definition).toBe('A computing system inspired by biological neural networks')
      expect(card.chapterId).toBe('ch01')
      expect(card.easeFactor).toBe(2.5)
      expect(card.interval).toBe(0)
      expect(card.repetition).toBe(0)
    })

    it('does not overwrite existing cards', () => {
      store.addCard('ch01', 'NN', 'Definition 1')
      store.addCard('ch01', 'NN', 'Definition 2')
      expect(store.cards['ch01::NN'].definition).toBe('Definition 1')
    })
  })

  describe('addChapterTerms', () => {
    it('adds multiple terms at once', () => {
      store.addChapterTerms('ch01', [
        { term: 'A', definition: 'Def A' },
        { term: 'B', definition: 'Def B' },
        { term: 'C', definition: 'Def C' },
      ])
      expect(store.getCardCount).toBe(3)
    })
  })

  describe('reviewCard', () => {
    it('updates card state after successful review', () => {
      store.addCard('ch01', 'Term', 'Definition')
      store.reviewCard('ch01::Term', 4)
      const card = store.cards['ch01::Term']
      expect(card.repetition).toBe(1)
      expect(card.interval).toBe(1)
      expect(card.totalReviews).toBeUndefined() // flashcard store doesn't track per-card totalReviews
    })

    it('resets repetition on quality < 3', () => {
      store.addCard('ch01', 'Term', 'Definition')
      store.reviewCard('ch01::Term', 5)
      store.reviewCard('ch01::Term', 5)
      store.reviewCard('ch01::Term', 1) // fail
      expect(store.cards['ch01::Term'].repetition).toBe(0)
      expect(store.cards['ch01::Term'].interval).toBe(1)
    })

    it('increments global totalReviews', () => {
      store.addCard('ch01', 'Term', 'Definition')
      store.reviewCard('ch01::Term', 5)
      store.reviewCard('ch01::Term', 5)
      expect(store.totalReviews).toBe(2)
    })

    it('does nothing for non-existent card', () => {
      store.reviewCard('fake::key', 5)
      expect(store.totalReviews).toBe(0)
    })
  })

  describe('removeChapterCards', () => {
    it('removes all cards for a chapter', () => {
      store.addCard('ch01', 'A', 'def')
      store.addCard('ch01', 'B', 'def')
      store.addCard('ch02', 'C', 'def')
      store.removeChapterCards('ch01')
      expect(store.getCardCount).toBe(1)
      expect(store.cards['ch02::C']).toBeDefined()
    })
  })

  describe('getters', () => {
    it('getDueCards returns all cards due today', () => {
      store.addCard('ch01', 'A', 'def')
      store.addCard('ch01', 'B', 'def')
      expect(store.getDueCards).toHaveLength(2)
    })

    it('getDueCountByChapter groups by chapter', () => {
      store.addCard('ch01', 'A', 'def')
      store.addCard('ch01', 'B', 'def')
      store.addCard('ch02', 'C', 'def')
      const counts = store.getDueCountByChapter
      expect(counts['ch01']).toBe(2)
      expect(counts['ch02']).toBe(1)
    })

    it('getTotalDue counts all due cards', () => {
      store.addCard('ch01', 'A', 'def')
      expect(store.getTotalDue).toBe(1)
    })

    it('getMasteredCount counts cards with 5+ repetitions', () => {
      store.addCard('ch01', 'A', 'def')
      store.cards['ch01::A'].repetition = 5
      expect(store.getMasteredCount).toBe(1)
    })
  })
})
