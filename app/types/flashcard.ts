export interface FlashcardState {
  termKey: string; // `${chapterId}::${term}`
  chapterId: string;
  term: string;
  definition: string;
  // SM-2 algorithm state
  interval: number; // days until next review
  repetition: number; // consecutive correct answers
  easeFactor: number; // >= 1.3
  nextReviewAt: string; // ISO date
  lastReviewedAt?: string;
}

export interface ReviewSession {
  cards: FlashcardState[];
  currentIndex: number;
  correct: number;
  incorrect: number;
}

// SM-2 quality ratings
export type ReviewQuality = 0 | 1 | 2 | 3 | 4 | 5;
// 0 = complete blackout, 1 = incorrect but recognized, 2 = incorrect but easy to recall
// 3 = correct with serious difficulty, 4 = correct with hesitation, 5 = perfect recall
