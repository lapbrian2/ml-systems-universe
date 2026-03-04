import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ChapterProgress, PhaseState, Badge } from '@/types/progress';
import type { ChapterState } from '@/types/progress';
import { CHAPTER_DEPENDENCIES } from '@/data/chapters/dependencies';
import { CHAPTERS } from '@/data/chapters';

const DEFAULT_PHASE: PhaseState = {
  read: false,
  exercise: false,
  quiz: { passed: false, bestScore: 0, attempts: 0 },
};

interface ProgressStore {
  chapters: Record<string, ChapterProgress>;
  badges: Badge[];
  totalTimeSpentSeconds: number;

  // Actions
  getChapterState: (chapterId: string) => ChapterState;
  markSectionRead: (chapterId: string, sectionOrder: number) => void;
  markChapterRead: (chapterId: string) => void;
  markExerciseComplete: (chapterId: string) => void;
  submitQuizResult: (chapterId: string, score: number, total: number) => void;
  addTimeSpent: (chapterId: string, seconds: number) => void;
  unlockBadge: (badgeId: string) => void;
  getProgress: (chapterId: string) => ChapterProgress;
  getOverallCompletion: () => number;
  resetProgress: () => void;
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      chapters: {},
      badges: [],
      totalTimeSpentSeconds: 0,

      getChapterState: (chapterId: string): ChapterState => {
        const deps = CHAPTER_DEPENDENCIES[chapterId] || [];
        const state = get();

        // ch01 and ch21 always available
        if (chapterId === 'ch01' || chapterId === 'ch21') {
          const progress = state.chapters[chapterId];
          if (progress?.phases.quiz.passed) return 'completed';
          if (progress?.phases.read || progress?.phases.exercise) return 'in-progress';
          return 'available';
        }

        const allDepsCompleted = deps.every(dep => {
          const depProgress = state.chapters[dep];
          return depProgress?.phases.quiz.passed;
        });

        if (!allDepsCompleted) return 'locked';

        const progress = state.chapters[chapterId];
        if (progress?.phases.quiz.passed) return 'completed';
        if (progress?.phases.read || progress?.phases.exercise) return 'in-progress';
        return 'available';
      },

      markSectionRead: (chapterId, sectionOrder) =>
        set(state => {
          const existing = state.chapters[chapterId] || createDefaultProgress(chapterId);
          const sectionsRead = existing.sectionsRead.includes(sectionOrder)
            ? existing.sectionsRead
            : [...existing.sectionsRead, sectionOrder];
          return {
            chapters: {
              ...state.chapters,
              [chapterId]: { ...existing, sectionsRead, lastVisitedAt: new Date().toISOString() },
            },
          };
        }),

      markChapterRead: (chapterId) =>
        set(state => {
          const existing = state.chapters[chapterId] || createDefaultProgress(chapterId);
          return {
            chapters: {
              ...state.chapters,
              [chapterId]: {
                ...existing,
                phases: { ...existing.phases, read: true, readAt: new Date().toISOString() },
                lastVisitedAt: new Date().toISOString(),
              },
            },
          };
        }),

      markExerciseComplete: (chapterId) =>
        set(state => {
          const existing = state.chapters[chapterId] || createDefaultProgress(chapterId);
          return {
            chapters: {
              ...state.chapters,
              [chapterId]: {
                ...existing,
                phases: { ...existing.phases, exercise: true, exerciseAt: new Date().toISOString() },
                lastVisitedAt: new Date().toISOString(),
              },
            },
          };
        }),

      submitQuizResult: (chapterId, score, total) =>
        set(state => {
          const existing = state.chapters[chapterId] || createDefaultProgress(chapterId);
          const pct = Math.round((score / total) * 100);
          const passed = pct >= 70;
          return {
            chapters: {
              ...state.chapters,
              [chapterId]: {
                ...existing,
                phases: {
                  ...existing.phases,
                  quiz: {
                    passed: existing.phases.quiz.passed || passed,
                    bestScore: Math.max(existing.phases.quiz.bestScore, pct),
                    attempts: existing.phases.quiz.attempts + 1,
                    lastAttemptAt: new Date().toISOString(),
                  },
                },
                lastVisitedAt: new Date().toISOString(),
              },
            },
          };
        }),

      addTimeSpent: (chapterId, seconds) =>
        set(state => {
          const existing = state.chapters[chapterId] || createDefaultProgress(chapterId);
          return {
            chapters: {
              ...state.chapters,
              [chapterId]: { ...existing, timeSpentSeconds: existing.timeSpentSeconds + seconds },
            },
            totalTimeSpentSeconds: state.totalTimeSpentSeconds + seconds,
          };
        }),

      unlockBadge: (badgeId) =>
        set(state => {
          if (state.badges.some(b => b.id === badgeId)) return state;
          return {
            badges: [
              ...state.badges,
              { id: badgeId, name: '', description: '', icon: '', unlockedAt: new Date().toISOString() },
            ],
          };
        }),

      getProgress: (chapterId) => {
        return get().chapters[chapterId] || createDefaultProgress(chapterId);
      },

      getOverallCompletion: () => {
        const state = get();
        const total = CHAPTERS.length;
        const completed = Object.values(state.chapters).filter(p => p.phases.quiz.passed).length;
        return Math.round((completed / total) * 100);
      },

      resetProgress: () => set({ chapters: {}, badges: [], totalTimeSpentSeconds: 0 }),
    }),
    {
      name: 'ml-systems-progress',
    }
  )
);

function createDefaultProgress(chapterId: string): ChapterProgress {
  return {
    chapterId,
    phases: { ...DEFAULT_PHASE, quiz: { ...DEFAULT_PHASE.quiz } },
    timeSpentSeconds: 0,
    sectionsRead: [],
  };
}
