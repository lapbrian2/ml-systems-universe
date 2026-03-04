import { defineStore } from 'pinia'
import { CHAPTERS } from '~/data/chapters'
import type { ChapterProgress, ChapterState, PhaseState } from '~/types/progress'

function defaultPhases(): PhaseState {
  return {
    read: false,
    exercise: false,
    quiz: { passed: false, bestScore: 0, attempts: 0 },
  }
}

function defaultProgress(chapterId: string): ChapterProgress {
  return {
    chapterId,
    phases: defaultPhases(),
    timeSpentSeconds: 0,
    sectionsRead: [],
  }
}

export const useProgressStore = defineStore('progress', {
  state: () => ({
    chapters: {} as Record<string, ChapterProgress>,
    badges: [] as string[],
  }),

  getters: {
    getProgress: (state) => (chapterId: string): ChapterProgress => {
      return state.chapters[chapterId] ?? defaultProgress(chapterId)
    },

    getChapterState: (state) => (chapterId: string): ChapterState => {
      const chapter = CHAPTERS.find(c => c.id === chapterId)
      if (!chapter) return 'available'

      const p = state.chapters[chapterId]
      if (!p) return 'available'
      if (p.phases.read && p.phases.exercise && p.phases.quiz.passed) return 'completed'
      if (p.phases.read || p.phases.exercise || p.phases.quiz.attempts > 0) return 'in-progress'
      return 'available'
    },

    getOverallCompletion: (state): number => {
      const total = CHAPTERS.length
      const completed = CHAPTERS.filter(ch => {
        const p = state.chapters[ch.id]
        return p?.phases.read && p?.phases.exercise && p?.phases.quiz.passed
      }).length
      return total > 0 ? Math.round((completed / total) * 100) : 0
    },
  },

  actions: {
    ensureProgress(chapterId: string) {
      if (!this.chapters[chapterId]) {
        this.chapters[chapterId] = defaultProgress(chapterId)
      }
    },

    markSectionRead(chapterId: string, sectionIndex: number) {
      this.ensureProgress(chapterId)
      const p = this.chapters[chapterId]
      if (!p.sectionsRead.includes(sectionIndex)) {
        p.sectionsRead.push(sectionIndex)
      }
    },

    markChapterRead(chapterId: string) {
      this.ensureProgress(chapterId)
      this.chapters[chapterId].phases.read = true
      this.chapters[chapterId].phases.readAt = new Date().toISOString()
    },

    markExerciseComplete(chapterId: string) {
      this.ensureProgress(chapterId)
      this.chapters[chapterId].phases.exercise = true
      this.chapters[chapterId].phases.exerciseAt = new Date().toISOString()
    },

    submitQuizResult(chapterId: string, score: number, passed: boolean) {
      this.ensureProgress(chapterId)
      const quiz = this.chapters[chapterId].phases.quiz
      quiz.attempts++
      quiz.lastAttemptAt = new Date().toISOString()
      if (score > quiz.bestScore) {
        quiz.bestScore = score
      }
      if (passed) {
        quiz.passed = true
      }
    },

    addTimeSpent(chapterId: string, seconds: number) {
      this.ensureProgress(chapterId)
      this.chapters[chapterId].timeSpentSeconds += seconds
      this.chapters[chapterId].lastVisitedAt = new Date().toISOString()
    },

    unlockBadge(badgeId: string) {
      if (!this.badges.includes(badgeId)) {
        this.badges.push(badgeId)
      }
    },

    resetProgress() {
      this.chapters = {}
      this.badges = []
    },
  },

  persist: true,
})
