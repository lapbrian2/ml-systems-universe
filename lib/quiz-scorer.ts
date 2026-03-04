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

export function scoreQuiz(answers: Record<string, number>, questions: QuizQuestion[]): {
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  results: { questionId: string; correct: boolean; selectedIndex: number; correctIndex: number }[];
} {
  const results = questions.map(q => ({
    questionId: q.id,
    correct: answers[q.id] === q.correctIndex,
    selectedIndex: answers[q.id] ?? -1,
    correctIndex: q.correctIndex,
  }));
  const score = results.filter(r => r.correct).length;
  const total = questions.length;
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  return { score, total, percentage, passed: percentage >= 70, results };
}
