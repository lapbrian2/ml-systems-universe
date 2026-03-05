export type ChapterState = 'locked' | 'available' | 'in-progress' | 'completed';

export interface PhaseState {
  read: boolean;
  readAt?: string;
  exercise: boolean;
  exerciseAt?: string;
  quiz: {
    passed: boolean;
    bestScore: number;
    attempts: number;
    lastAttemptAt?: string;
  };
}

export interface ChapterProgress {
  chapterId: string;
  phases: PhaseState;
  timeSpentSeconds: number;
  lastVisitedAt?: string;
  sectionsRead: number[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}
