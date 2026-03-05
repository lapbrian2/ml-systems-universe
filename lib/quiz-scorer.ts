import type { QuizQuestion } from '~/types/quiz';

export function selectQuizQuestions(pool: QuizQuestion[], count: number): QuizQuestion[] {
  // Fisher-Yates shuffle for unbiased randomization
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}
