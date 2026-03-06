import { describe, it, expect, beforeEach } from 'vitest'
import { useProgressStore } from '~/stores/progress'

describe('useProgressStore', () => {
  let store: ReturnType<typeof useProgressStore>

  beforeEach(() => {
    store = useProgressStore()
  })

  describe('initial state', () => {
    it('starts with empty chapters', () => {
      expect(store.chapters).toEqual({})
    })

    it('starts with empty badges', () => {
      expect(store.badges).toEqual([])
    })

    it('reports 0% overall completion', () => {
      expect(store.getOverallCompletion).toBe(0)
    })
  })

  describe('getProgress', () => {
    it('returns default progress for unknown chapter', () => {
      const progress = store.getProgress('ch01')
      expect(progress.chapterId).toBe('ch01')
      expect(progress.phases.read).toBe(false)
      expect(progress.phases.exercise).toBe(false)
      expect(progress.phases.quiz.passed).toBe(false)
      expect(progress.phases.quiz.bestScore).toBe(0)
      expect(progress.phases.quiz.attempts).toBe(0)
      expect(progress.timeSpentSeconds).toBe(0)
      expect(progress.sectionsRead).toEqual([])
    })

    it('returns stored progress for known chapter', () => {
      store.markChapterRead('ch01')
      const progress = store.getProgress('ch01')
      expect(progress.phases.read).toBe(true)
    })
  })

  describe('getChapterState', () => {
    it('returns "available" for chapter with no progress', () => {
      expect(store.getChapterState('ch01')).toBe('available')
    })

    it('returns "locked" when prerequisites are not met', () => {
      // ch02 requires ch01
      expect(store.getChapterState('ch02')).toBe('locked')
    })

    it('returns "in-progress" when chapter is partially done', () => {
      store.markChapterRead('ch01')
      expect(store.getChapterState('ch01')).toBe('in-progress')
    })

    it('returns "completed" when all phases are done', () => {
      store.markChapterRead('ch01')
      store.markExerciseComplete('ch01')
      store.submitQuizResult('ch01', 80, true)
      expect(store.getChapterState('ch01')).toBe('completed')
    })

    it('unlocks ch02 after ch01 is completed', () => {
      store.markChapterRead('ch01')
      store.markExerciseComplete('ch01')
      store.submitQuizResult('ch01', 80, true)
      expect(store.getChapterState('ch02')).toBe('available')
    })
  })

  describe('markSectionRead', () => {
    it('adds section to sectionsRead', () => {
      store.markSectionRead('ch01', 0)
      store.markSectionRead('ch01', 2)
      expect(store.chapters.ch01.sectionsRead).toEqual([0, 2])
    })

    it('does not duplicate sections', () => {
      store.markSectionRead('ch01', 0)
      store.markSectionRead('ch01', 0)
      expect(store.chapters.ch01.sectionsRead).toEqual([0])
    })
  })

  describe('markChapterRead', () => {
    it('sets read phase to true', () => {
      store.markChapterRead('ch01')
      expect(store.chapters.ch01.phases.read).toBe(true)
      expect(store.chapters.ch01.phases.readAt).toBeDefined()
    })
  })

  describe('markExerciseComplete', () => {
    it('sets exercise phase to true', () => {
      store.markExerciseComplete('ch01')
      expect(store.chapters.ch01.phases.exercise).toBe(true)
      expect(store.chapters.ch01.phases.exerciseAt).toBeDefined()
    })
  })

  describe('submitQuizResult', () => {
    it('increments attempts', () => {
      store.submitQuizResult('ch01', 50, false)
      store.submitQuizResult('ch01', 60, false)
      expect(store.chapters.ch01.phases.quiz.attempts).toBe(2)
    })

    it('tracks best score', () => {
      store.submitQuizResult('ch01', 50, false)
      store.submitQuizResult('ch01', 80, true)
      store.submitQuizResult('ch01', 70, true)
      expect(store.chapters.ch01.phases.quiz.bestScore).toBe(80)
    })

    it('marks passed on passing score', () => {
      store.submitQuizResult('ch01', 80, true)
      expect(store.chapters.ch01.phases.quiz.passed).toBe(true)
    })

    it('does not un-pass on subsequent failure', () => {
      store.submitQuizResult('ch01', 80, true)
      store.submitQuizResult('ch01', 40, false)
      expect(store.chapters.ch01.phases.quiz.passed).toBe(true)
    })

    it('unlocks perfect_quiz badge on score 100', () => {
      store.submitQuizResult('ch01', 100, true)
      expect(store.badges).toContain('perfect_quiz')
    })

    it('unlocks first_chapter badge when first chapter completed', () => {
      store.markChapterRead('ch01')
      store.markExerciseComplete('ch01')
      store.submitQuizResult('ch01', 80, true)
      expect(store.badges).toContain('first_chapter')
    })
  })

  describe('addTimeSpent', () => {
    it('accumulates time', () => {
      store.addTimeSpent('ch01', 30)
      store.addTimeSpent('ch01', 45)
      expect(store.chapters.ch01.timeSpentSeconds).toBe(75)
    })

    it('sets lastVisitedAt', () => {
      store.addTimeSpent('ch01', 10)
      expect(store.chapters.ch01.lastVisitedAt).toBeDefined()
    })
  })

  describe('unlockBadge', () => {
    it('adds badge', () => {
      store.unlockBadge('test_badge')
      expect(store.badges).toContain('test_badge')
    })

    it('does not duplicate badges', () => {
      store.unlockBadge('test_badge')
      store.unlockBadge('test_badge')
      expect(store.badges.filter(b => b === 'test_badge')).toHaveLength(1)
    })
  })

  describe('resetProgress', () => {
    it('clears all data', () => {
      store.markChapterRead('ch01')
      store.unlockBadge('test')
      store.resetProgress()
      expect(store.chapters).toEqual({})
      expect(store.badges).toEqual([])
    })
  })

  describe('completionist badge', () => {
    function completeChapter(chapterId: string) {
      store.markChapterRead(chapterId)
      store.markExerciseComplete(chapterId)
      store.submitQuizResult(chapterId, 80, true)
    }

    it('does not unlock completionist with partial completion', () => {
      completeChapter('ch01')
      completeChapter('ch02')
      completeChapter('ch03')
      expect(store.badges).not.toContain('completionist')
    })

    it('unlocks completionist when all 21 chapters are completed', () => {
      const chapterIds = Array.from({ length: 21 }, (_, i) =>
        `ch${String(i + 1).padStart(2, '0')}`,
      )
      for (const id of chapterIds) {
        completeChapter(id)
      }
      expect(store.badges).toContain('completionist')
      expect(store.badges).toContain('first_chapter')
    })
  })

  describe('getChapterState edge cases', () => {
    it('returns "available" for unknown chapter not in CHAPTERS', () => {
      expect(store.getChapterState('nonexistent')).toBe('available')
    })

    it('returns "in-progress" when only quiz attempted but not passed', () => {
      store.submitQuizResult('ch01', 40, false)
      expect(store.getChapterState('ch01')).toBe('in-progress')
    })

    it('returns "in-progress" when only exercise done', () => {
      store.markExerciseComplete('ch01')
      expect(store.getChapterState('ch01')).toBe('in-progress')
    })
  })

  describe('getOverallCompletion edge cases', () => {
    it('computes correct percentage for partial completion', () => {
      store.markChapterRead('ch01')
      store.markExerciseComplete('ch01')
      store.submitQuizResult('ch01', 80, true)
      expect(store.getOverallCompletion).toBe(Math.round((1 / 21) * 100))
    })
  })

  describe('ensureProgress', () => {
    it('creates progress entry if missing', () => {
      store.ensureProgress('ch05')
      expect(store.chapters.ch05).toBeDefined()
      expect(store.chapters.ch05.phases.read).toBe(false)
    })

    it('does not overwrite existing progress', () => {
      store.markChapterRead('ch05')
      store.ensureProgress('ch05')
      expect(store.chapters.ch05.phases.read).toBe(true)
    })
  })
})
