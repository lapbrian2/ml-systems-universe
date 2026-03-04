import type { ChapterQuiz } from '@/types/quiz';
import { ch01Quiz } from './ch01-quiz';

// Registry of all chapter quizzes
// Chapters without dedicated quiz files get auto-generated placeholder quizzes
const QUIZ_REGISTRY: Record<string, ChapterQuiz> = {
  ch01: ch01Quiz,
};

// Generate a placeholder quiz for chapters that don't have one yet
function generatePlaceholderQuiz(chapterId: string, title: string): ChapterQuiz {
  return {
    chapterId,
    title: `${title} Quiz`,
    description: `Test your understanding of ${title.toLowerCase()}.`,
    passingScore: 70,
    selectCount: 3,
    pool: [
      {
        id: `${chapterId}-placeholder-q1`,
        question: `What is the primary focus of the "${title}" chapter?`,
        options: [
          'Understanding theoretical foundations',
          'Building practical ML systems',
          'Both theoretical and practical aspects of this topic',
          'None of the above',
        ],
        correctIndex: 2,
        explanation: `This chapter covers both the theory and practice of ${title.toLowerCase()} in the context of ML systems engineering.`,
        difficulty: 'easy',
      },
      {
        id: `${chapterId}-placeholder-q2`,
        question: 'Why is systems thinking important in this context?',
        options: [
          'It is not important',
          'It helps understand how components interact across the ML stack',
          'It only matters for large companies',
          'It is only relevant for research',
        ],
        correctIndex: 1,
        explanation:
          'Systems thinking reveals how decisions in one area affect the entire ML pipeline, from data to deployment.',
        difficulty: 'easy',
      },
      {
        id: `${chapterId}-placeholder-q3`,
        question: 'What is a key engineering trade-off discussed in this chapter?',
        options: [
          'There are no trade-offs',
          'Speed vs. accuracy',
          'Performance vs. resource constraints vs. reliability',
          'Cost is the only consideration',
        ],
        correctIndex: 2,
        explanation:
          'ML systems engineering always involves balancing multiple competing requirements including performance, cost, reliability, and maintainability.',
        difficulty: 'medium',
      },
    ],
  };
}

// Import CHAPTERS for auto-generating placeholder quizzes
import { CHAPTERS } from '@/data/chapters';

export function getQuizForChapter(chapterId: string): ChapterQuiz {
  if (QUIZ_REGISTRY[chapterId]) return QUIZ_REGISTRY[chapterId];

  const chapter = CHAPTERS.find(ch => ch.id === chapterId);
  return generatePlaceholderQuiz(chapterId, chapter?.title || 'Unknown');
}

export { QUIZ_REGISTRY };
